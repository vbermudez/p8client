'use strict';

import { SearchResults, ResultRow, RowProperty } from './p8types';
import { ICustomObject, IDocument, Document } from './objects';
import { P8DownloadRequest, P8SearchRequest } from './requests';

export interface IP8Client {
	ws: any;
	port: any;

	createDocument(): Document;

	download(downloadRequest: P8DownloadRequest): Promise<Array<any>>;
	save(object: ICustomObject): Promise<ICustomObject>;
	search(searchRequest: P8SearchRequest): Promise<any>;
}

export class P8SOAPClient implements IP8Client {
	private _ws: any;
	private _port: any;

	constructor(client: any) {
		this._ws = client;
		this._port = client.FNCEWS40Service.FNCEWS40MTOMPort;
	}

	public get ws(): any { return this._ws; }
	public set ws(value: any) { this._ws = value; }

	public get port(): any { return this._port; }
	public set port(value: any) { this._port = value; }

	public createDocument() :Document {
		return new Document(this);
	}

	public async download(downloadRequest: P8DownloadRequest): Promise<Array<any>> {
		return new Promise<Array<any>>((resolve: Function, reject: Function) => {
			this.port.GetContent( downloadRequest.build(), (err: any, result: any) => {
				if (err) return reject(err);
				console.log(`download result: ${result}`);
				console.log(`download binaries: ${JSON.stringify(this._ws.binaries)}`);
				let binaries: Array<any> = [];

				for (let binId in this._ws.binaries) {
					binaries.push(this._ws.binaries[binId]);
				}

				resolve(binaries);
			});
		});
	}

	public async save(object: ICustomObject): Promise<ICustomObject> {
		return await object;
	}

	public async search(searchRequest: P8SearchRequest): Promise<SearchResults> {
		this.ws.addSoapHeader({
			'ctyp:Localization': {
				'ctyp:Locale': searchRequest.locale
			}
		});

		return new Promise<SearchResults>((resolve: Function, reject: Function) => {
			this.port.ExecuteSearch( searchRequest.build(), (err: any, result: any, resp: any, headers: any, req: any) => {
				if (err) return reject(err);
				
				resolve( this._parseSearchResults(result, searchRequest.objectStore, searchRequest.searchRows) );
			});
		});
	}

	private _parseSearchResults(result: any, objectStore: string, rowsOnly: boolean): SearchResults {
		let res: SearchResults = { rows: [] };
		
		for (let i = 0, len = result.Object.length; i < len; ++i) {
			let item: any = result.Object[i];
			let row: ResultRow = this._parseRowSearchResultsItem(item.Property);
			
			row['ObjectStore'] = {
				name: 'objectStore',
				type: 'ObjectReference',
				settable: false,
				value: objectStore
			};
			
			if (!rowsOnly && row.This) {
				let doc: IDocument = new Document(this);
				
				doc.id = row.This.value.objectId;
				doc.objectClass = row.This.value.classId;
				doc.objectStore = row.ObjectStore.value;
				doc.properties = this._copyRow2Properties(row);
				row.This = doc;
			}
			
			res.rows.push(row);
		}
		
		return res;
	}

	private _parseRowSearchResultsItem(item: any): ResultRow {
		let row: ResultRow = {};
			
		for (let l = 0, len = item.length; l < len; ++l) {
			let prop: RowProperty = {
				name: item[l]['$attributes'].propertyId,
				type: item[l]['$attributes']['i:type'].split(':')[1],
				value: item[l].Value || null
			};
			
			if (prop.type == 'SingletonObject' && prop.value && typeof prop.value === 'object' && prop.value['$attributes']) {
				let val: any = prop.value['$attributes'];
				
				prop.type = val['i:type'].split(':')[1];
				prop.value = {
					classId: val.classId,
					objectId: val.objectId
				};
			}
			
			row[name] = prop;
		}
		
		return row;
	}

	private _copyRow2Properties(row: ResultRow): RowProperty {
		let props: any = {};
		
		for (let prop in row) {
			if (prop == 'This') {
				continue;
			}
			
			props[prop] = row[prop];
		}
		
		return props;
	}
}

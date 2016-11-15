'use strict';

import './utils/extend';
import * as soap  from 'soap';
import { ICustomObject } from './objects/p8custom';
import { P8DownloadRequest } from './requests/p8download';
import { P8SearchRequest } from './requests/p8search';

export interface IP8Client {
	ws: any;
	port: any;
	
	download(downloadRequest: P8DownloadRequest, callback: Function): void
	save(object: ICustomObject, callback: Function): void;
	search(searchRequest: P8SearchRequest, callback: Function): void;
}

export class P8SOAPClient implements IP8Client {
	private _ws: any;
	private _port: any;

	constructor(client: any) {
		this._ws = client;
		this._port = client.FNCEWS40Service.FNCEWS40MTOMPort
	}

	public get ws(): any { return this._ws; }
	public set ws(value: any) { this._ws = value; }

	public get port(): any { return this._port; }
	public set port(value: any) { this._port = value; }

	public download(downloadRequest: P8DownloadRequest, callback: Function): void {
		let p8sc = this;

		this.port.GetContent(downloadRequest.build(), function(err, result) {
			if (err) {
				console.log('download callback error', err.root.Envelope.Body.Fault);
				
				return callback.call(p8sc, err.root.Envelope.Body.Fault);
			}

			let binaries = [];

			for (let binId in p8sc._ws.binaries) {
				binaries.push(p8sc._ws.binaries[binId]);
			}
			
			return callback.call(p8sc, null, binaries);
		});
	}

	public save(object: ICustomObject, callback: Function): void {
		let p8sc: P8SOAPClient = this;
		
		callback.call(p8sc, null, object);
	}

	public search(searchRequest: P8SearchRequest, callback: Function): void {
		let p8sc: P8SOAPClient = this;
		
		this.ws.addSoapHeader({
			'ctyp:Localization': {
				'ctyp:Locale': searchRequest.locale
			}
		});
		
		this.port.ExecuteSearch(searchRequest.build(), function(err, result) {
			if (err) {
				console.log('search callback error', err.root.Envelope.Body.Fault);

				return callback.call(p8sc, err.root.Envelope.Body.Fault);
			}
			
			return callback.call(p8sc, null, this._parseSearchResults.call(p8sc, result, searchRequest.objectStore, searchRequest.searchRows));
		})
	}

	private _parseSearchResults(result: any, objectStore: string, rowsonly: boolean): any {
		let rows: Array<any> = [];
		
		for (let i = 0, len = result.Object.length; i < len; i++) {
			let item: any = result.Object[i];
			let row: any = this._parseRowSearchResultsItem(item.Property);
			
			row['ObjectStore'] = {
				type: 'ObjectReference',
				settable: false,
				value: objectStore
			};
			
			if (!rowsonly && row.This) {
				let doc: any = new Document(this);
				
				doc.id = row.This.value.objectId;
				doc.objectClass = row.This.value.classId;
				doc.objectStore = row.ObjectStore.value;
				doc.properties = this._copyRow2Properties(row);
				row.This = doc;
			}
			
			rows.push(row);
		}
		
		return { rows: rows };
	}

	private _parseRowSearchResultsItem(item: any): any {
		let row: any = {};
			
		for (let l = 0, llen = item.length; l < llen; l++) {
			let name: any = item[l]['$attributes'].propertyId;
			let type: any = item[l]['$attributes']['i:type'].split(':')[1];
			let value: any = item[l].Value || null;
			
			if (type == 'SingletonObject' && value && typeof value === 'object' && value['$attributes']) {
				let val: any = value['$attributes'];
				
				type = val['i:type'].split(':')[1];
				value = {
					classId: val.classId,
					objectId: val.objectId
				};
			}
			
			row[name] = {
				type: type,
				settable: item[l]['$attributes'].settable == '1',
				value: value
			};
		}
		
		return row;
	}

	private _copyRow2Properties(row: any): any {
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

export class P8Client {
	private _baseUrl: string;
	private _basicAuth: soap.WSSecurity;
	private _client: IP8Client;

	constructor(baseUrl: string) {
		 this._baseUrl = baseUrl + '/wsi/FNCEWS40MTOM?wsdl';
		 this._basicAuth = null;
		 this._client = null;
	}

	public get url(): string { return this._baseUrl; }
	public set url(value: string) { this._baseUrl = value; }

	public get wsSecurity(): soap.WSSecurity { return this._basicAuth; }
	public set wsSecurity(value: soap.WSSecurity) { this._basicAuth = value; }

	public get client(): IP8Client { return this._client; }
	public set client(value: IP8Client) { this._client = value; }

	public connect(user: string, password: string, callback: Function): void {
		if (this.client) {
			return callback.call(this, null, this.client);
		}
		
		var p8 = this;
		
		soap.createClient(this.url, {
			attributesKey: '$attributes'
		}, function(err, client) {
			if (err) {
				return callback.call(p8, err);
			}
			
			p8.wsSecurity = new soap.WSSecurity(user, password); //soap.WSSecurity //soap.BasicAuthSecurity
			p8.client = new P8SOAPClient(client);
			
			p8.client.ws.setSecurity(p8.wsSecurity);
			
			return callback.call(p8, null, p8.client);
		})
	}
}

// (function() { 
// 	'use strict';
	
// 	require('./utils/extend');
// 	var soap = require('soap');
// 	var Document = require('./objects/p8document');
	
// 	var P8SOAPClient = function(client) {
// 		this.ws = client;
// 		this.port = client.FNCEWS40Service.FNCEWS40MTOMPort;
// 	}
	
// 	P8SOAPClient.prototype.download = function(downloadRequest, callback) {
// 		var p8sc = this;
		
// 		this.port.GetContent(downloadRequest.build(), function(err, result) {
// 			if (err) {
// 				console.log('download callback error', err.root.Envelope.Body.Fault);
// 				return callback.call(p8sc, err.root.Envelope.Body.Fault);
// 			}
			
// 			var binaries = [];
			
// 			for (var binId in p8sc.ws.binaries) {
// 				binaries.push(p8sc.ws.binaries[binId]);
// 			}
			
// 			return callback.call(p8sc, null, binaries);
// 		})
// 	}
	
// 	P8SOAPClient.prototype.save = function(object, callback) {
// 		var p8sc = this;
		
// 		callback.call(p8sc, null, object);
// 	}
	
// 	P8SOAPClient.prototype.search = function(searchRequest, callback) {
// 		var p8sc = this;
		
// 		this.ws.addSoapHeader({
// 			'ctyp:Localization': {
// 				'ctyp:Locale': searchRequest.locale
// 			}
// 		});
		
// 		this.port.ExecuteSearch(searchRequest.build(), function(err, result) {
// 			if (err) {
// 				console.log('search callback error', err.root.Envelope.Body.Fault);
// 				return callback.call(p8sc, err.root.Envelope.Body.Fault);
// 			}
			
// 			return callback.call(p8sc, null, parseSearchResults.call(p8sc, result, searchRequest.objectStore, searchRequest.searchRows));
// 		})
// 	}
	
// 	var P8Client = function(baseUrl) {
// 		this.baseUrl = baseUrl + '/wsi/FNCEWS40MTOM?wsdl';
// 		this.basicAuth = null;
// 		this.client = null;
// 	}
	
// 	P8Client.prototype.connect = function(user, password, callback) {
// 		if (this.client) {
// 			return callback.call(this, null, this.client);
// 		}
		
// 		var p8 = this;
		
// 		soap.createClient(this.baseUrl, {
// 			attributesKey: '$attributes'
// 		}, function(err, client) {
// 			if (err) {
// 				return callback.call(p8, err);
// 			}
			
// 			p8.basicAuth = new soap.WSSecurity(user, password); //soap.WSSecurity //soap.BasicAuthSecurity
// 			p8.client = new P8SOAPClient(client);
			
// 			p8.client.ws.setSecurity(p8.basicAuth);
			
// 			return callback.call(p8, null, p8.client);
// 		})
// 	}
	
// 	function parseSearchResults(result, objectStore, rowsonly) {
// 		var rows = [];
		
// 		for (var i = 0, len = result.Object.length; i < len; i++) {
// 			var item = result.Object[i];
// 			var row = parseRowSearchResultsItem(item.Property);
			
// 			row['ObjectStore'] = {
// 				type: 'ObjectReference',
// 				settable: false,
// 				value: objectStore
// 			};
			
// 			if (!rowsonly && row.This) {
// 				var doc = new Document(this);
				
// 				doc.id = row.This.value.objectId;
// 				doc.objectClass = row.This.value.classId;
// 				doc.objectStore = row.ObjectStore.value;
// 				doc.properties = copyRow2Properties(row);
// 				row.This = doc;
// 			}
			
// 			rows.push(row);
// 		}
		
// 		return { rows: rows };
// 	}
	
// 	function parseRowSearchResultsItem(item) {
// 		var row = {};
			
// 		for (var l = 0, llen = item.length; l < llen; l++) {
// 			var name = item[l]['$attributes'].propertyId;
// 			var type = item[l]['$attributes']['i:type'].split(':')[1];
// 			var value = item[l].Value || null;
			
// 			if (type == 'SingletonObject' && value && typeof value === 'object' && value['$attributes']) {
// 				var val = value['$attributes'];
				
// 				type = val['i:type'].split(':')[1];
// 				value = {
// 					classId: val.classId,
// 					objectId: val.objectId
// 				};
// 			}
			
// 			row[name] = {
// 				type: type,
// 				settable: item[l]['$attributes'].settable == '1',
// 				value: value
// 			};
// 		}
		
// 		return row;
// 	}
	
// 	function copyRow2Properties(row) {
// 		var props = {};
		
// 		for (var prop in row) {
// 			if (prop == 'This') {
// 				continue;
// 			}
			
// 			props[prop] = row[prop];
// 		}
		
// 		return props;
// 	}
	
// 	module.exports = P8Client;
// }).call(this);
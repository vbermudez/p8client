'use strict';

import { IP8Client } from '../p8client';
import { ICustomObject, CustomObject } from './p8custom';
import { P8DownloadRequest } from '../requests/p8download';

export interface IDocument extends ICustomObject {
	version: number;
	
	download(): Promise<Array<any>>
}

export class Document extends CustomObject implements IDocument {
	private _version: number;

	constructor(p8c: IP8Client) {
		super(p8c);
	}

	public get version(): number { return this._version; }
	public set version(value: number) { this._version = value; }

	public async download(): Promise<Array<any>> {
		let download = new P8DownloadRequest();

		download.classId = this.objectClass;
		download.objectId = this.id;
		download.objectStore = this.objectStore;

		return await this.client.download(download);
	}
}

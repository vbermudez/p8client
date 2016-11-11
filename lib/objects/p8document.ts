'use strict';

import { IP8Client } from '../p8client';
import { ICustomObject, CustomObject } from './p8custom';
import { P8DownloadRequest } from '../requests/p8download';

export interface IDocument extends ICustomObject {
	version: number;
	
	download(callback: Function): void
}

export class Document extends CustomObject implements IDocument {
	private _version: number;

	constructor(p8c: IP8Client) {
		super(p8c);
	}

	public get version(): number { return this._version; }
	public set version(value: number) { this._version = value; }

	public download(callback: Function): void {
		let download = new P8DownloadRequest();

		download.classId = this.objectClass;
		download.objectId = this.id;
		download.objectStore = this.objectStore;
		this.client.download(download, callback);
	}
}

// (function() {
// 	'use strict';
	
// 	var CustomObject = require('./p8custom');
// 	var P8DownloadRequest = require('../requests/p8download');
	
// 	var Document = function(p8c) {
// 		this.extends( new CustomObject() );
// 		this._client = p8c;
// 	}
	
// 	Document.prototype = CustomObject.prototype;
	
// 	Document.prototype.download = function(callback) {
// 		var download = new P8DownloadRequest();
		
// 		download.classId = this.objectClass;
// 		download.objectId = this.id;
// 		download.objectStore = this.objectStore;
		
// 		this._client.download(download, callback);
// 	}
	
// 	module.exports = Document;
// }).call(this);
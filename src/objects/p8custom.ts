'use strict';

import { IP8Client } from '../p8client';

export interface ICustomObject {
	id: string;
	objectClass: string;
	objectStore: string;
	properties: any;
	acl: Array<any>;
	
	save(callback: Function): void;
}

export class CustomObject implements ICustomObject {
	private _client: IP8Client;
	private _id: string;
	private _objectClass: string;
	private _objectStore: string;
	private _properties: any;
	private _acl: Array<any>;

	constructor(p8c: IP8Client) {
		this._client = p8c;
		this._id = null;
		this._objectClass = null;
		this._objectStore = null;
		this._properties = {};
		this._acl = [];
	}

	public get id() { return this._id; }
	public set id(value: string) { this._id = value; }

	public get objectClass() { return this._objectClass; }
	public set objectClass(value: string) { this._objectClass = value; }

	public get objectStore() { return this._objectStore; }
	public set objectStore(value: string) { this._objectStore = value; }

	public get properties() { return this._properties; }
	public set properties(value: any) { this._properties = value; }

	public get acl() { return this._acl; }
	public set acl(value: Array<any>) { this._acl = value; }

	protected get client(): IP8Client { return this._client; }
	protected set client(value: IP8Client) { this._client = value; }

	public save(callback: Function): void {
		this.client.save(this, callback);
	}
}

// (function() {
// 	'use strict';
	
// 	var CustomObject = function(p8c) {
// 		this._client = p8c;
// 		this.id = null;
// 		this.objectClass = null;
// 		this.objectStore = null;
// 		this.properties = {};
// 		this.acl = [];
// 	}
	
// 	CustomObject.prototype.save = function(callback) {
// 		this._client.save(this);
// 	}
	
// 	module.exports = CustomObject;
// }).call(this);
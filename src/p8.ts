'use strict';

import * as soap from 'soap';
import { IP8Client, P8SOAPClient } from './p8client';

export class P8 {
	protected static FNCEWS40MTOM_WSDL: string = '/wsi/FNCEWS40MTOM?wsdl';

	private _baseUrl: string;
	private _basicAuth: soap.WSSecurity;
	private _client: IP8Client;

	constructor(baseUrl: string) {
		 this._baseUrl = baseUrl + P8.FNCEWS40MTOM_WSDL;
		 this._basicAuth = null;
		 this._client = null;
	}

	public get url(): string { return this._baseUrl; }
	public set url(value: string) { this._baseUrl = value; }

	public get wsSecurity(): soap.WSSecurity { return this._basicAuth; }
	public set wsSecurity(value: soap.WSSecurity) { this._basicAuth = value; }

	public get client(): IP8Client { return this._client; }
	public set client(value: IP8Client) { this._client = value; }

	public async connect(user: string, password: string): Promise<IP8Client> {
		let soapClient = await soap.createClientAsync(this.url, {
			attributesKey: '$attributes',
			wsdl_headers: {
				connection: 'keep-alive'
			}
		});

		this.wsSecurity = new soap.WSSecurity(user, password);
		this.client = new P8SOAPClient(soapClient);

		this.client.ws.setSecurity(this.wsSecurity);

		return this.client;
	}
}
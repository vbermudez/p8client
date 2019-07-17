require('dotenv').config();

console.log(`Environment variables: ${process.env.FN_URL}, ${process.env.FN_OBJECT_STORE_ID}, ${process.env.FN_USERNAME}, ${process.env.FN_PASSWORD}`);

import { P8, P8SearchRequest, Document, IP8Client, SearchResults } from '../src';

const ObjectStoreId = process.env.FN_OBJECT_STORE_ID;
const p8 = new P8(process.env.FN_URL);

describe('P8Client', () => {
	it('should exists', () => {
		expect(p8).not.toBe(null);
		expect(p8.connect).not.toBe(null);
	});
	
	it('should connect', async (done: Function) => {
		const client: IP8Client = await p8.connect(process.env.FN_USERNAME, process.env.FN_PASSWORD);
		
		expect(client).not.toBe(null);
		expect(client.ws).not.toBe(null);
		expect(client.search).not.toBe(null);
		expect(client.ws.FNCEWS40Service).not.toBe(null);
		expect(client.ws.FNCEWS40Service.FNCEWS40MTOMPort).not.toBe(null);
		expect(client.ws.FNCEWS40Service.FNCEWS40MTOMPort.ExecuteSearch).not.toBe(null);

		// console.log( JSON.stringify( client.ws.describe() ) );

		done();
	});
	
	it('should return results', async (done: Function) => {
		let search: P8SearchRequest = new P8SearchRequest();
		
		search.objectStore = ObjectStoreId;
		search.query = "select This, * from Document where DocumentTitle like '%test%'";
		search.searchRows = false;
		
		let result: SearchResults = await p8.client.search(search);
		
		expect(result).not.toBe(null);
		expect(result.rows).not.toBe(null);
		expect(result.rows.length).toBeGreaterThan(0);
		done();
	});
	
	it('should download content', async (done: Function) => {
		let search: P8SearchRequest = new P8SearchRequest();
		
		search.objectStore = ObjectStoreId;
		search.query = "select This, DocumentTitle from Document where DocumentTitle like '%test%'";
		search.searchRows = false;
		
		let result: SearchResults = await p8.client.search(search);

		expect(result).not.toBe(null);
		expect(result.rows).not.toBe(null);
		expect(result.rows.length).toBeGreaterThan(0);
		
		let doc: Document = result.rows[0].This;
		
		expect(doc).not.toBe(null);
		console.log(`doc: ${doc.id} - ${JSON.stringify(doc.properties)}`);
		let contents: any[] = await doc.download();
		console.log(`contents: ${JSON.stringify(contents)}`);
		// expect(contents).not.toBe(null);
		// expect(contents.length).toBeGreaterThan(0);
		// expect(contents[0].mime).not.toBe(null);
		// expect(contents[0].data).not.toBe(null);
		done();
	});
});
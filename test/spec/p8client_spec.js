var P8Client = require('../../lib/p8client')
var P8Search = require('../../lib/requests/p8search')
var Document = require('../../lib/objects/p8document')

var OSAPPINTERNAS = '{42180535-85DC-478A-9194-792B6F12F145}'

jasmine.getEnv().defaultTimeoutInterval = 20 * 1000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;

var p8 = new P8Client('http://ltesfncpe00.caf.net')

describe('P8Client', function() {
	it('should exists', function() {
		expect(p8).not.toBe(null)
		expect(p8.connect).not.toBe(null)
	})
	
	it('should extend correctly', function() {
		var doc = new Document()
		
		expect(Document).not.toBe(null)
		expect(doc).not.toBe(null)
		expect(doc.properties).not.toBe(null)
		expect(typeof doc.save === 'function').toBe(true)
		expect(typeof doc.download === 'function').toBe(true)
	})
	
	it('should connect', function(done) {
		p8.connect('p8admin', 'filenet', function(err, client) {
			expect(err).toBe(null)
			expect(client).not.toBe(null)
			expect(client.ws).not.toBe(null)
			expect(client.search).not.toBe(null)
			expect(client.ws.FNCEWS40Service).not.toBe(null)
			expect(client.ws.FNCEWS40Service.FNCEWS40MTOMPort).not.toBe(null)
			expect(client.ws.FNCEWS40Service.FNCEWS40MTOMPort.ExecuteSearch).not.toBe(null)
			console.log(client.ws.describe())
			done()
		})
	})
	
	it('should return results', function(done) {
		var search = new P8Search()
		
		search.objectStore = OSAPPINTERNAS
		search.query = "select This, * from Document where DocumentTitle like '%test%'"
		search.searchRows = false
		
		p8.client.search(search, function(err, result) {
			expect(err).toBe(null)
			expect(result).not.toBe(null)
			expect(result.rows).not.toBe(null)
			expect(result.rows.length).toBeGreaterThan(0)
			
			// for (var i = 0, len = result.rows.length; i < len; i++) {
			// 	var item = result.rows[i]
				
			// 	console.log(item.This.id, item.This.objectClass, item.This.properties)
			// 	break
			// }
			
			done()
		})
	})
	
	it('should download content', function(done) {
		var search = new P8Search()
		
		search.objectStore = OSAPPINTERNAS
		search.query = "select This, DocumentTitle from Document where DocumentTitle like '%test%'"
		search.searchRows = false
		
		p8.client.search(search, function(err, result) {
			expect(err).toBe(null)
			expect(result).not.toBe(null)
			expect(result.rows).not.toBe(null)
			expect(result.rows.length).toBeGreaterThan(0)
			
			var doc = result.rows[0].This
			
			expect(doc).not.toBe(null)
			
			doc.download(function(err, contents) {
				expect(err).toBe(null)
				expect(contents).not.toBe(null)
				expect(contents.length).toBeGreaterThan(0)
				expect(contents[0].mime).not.toBe(null)
				expect(contents[0].data).not.toBe(null)
				done()
			})
		})
	})
})
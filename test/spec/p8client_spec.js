var has_require = typeof require !== 'undefined'

if (has_require) {
	P8Client = require('../../lib/p8client')
}

jasmine.getEnv().defaultTimeoutInterval = 20 * 1000;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;

var p8 = new P8Client('http://ltesfncpe00.caf.net')

describe('P8Client', function() {
	it('should exists', function() {
		expect(p8).not.toBe(null)
		expect(p8.login).not.toBe(null)
	})
	
	it('should login and get a user token', function(done) {
		p8.login('p8admin', 'filenet', function(err, result) {
			expect(err).toBe(null)
			expect(result).not.toBe(null)
			expect(result.token).not.toBe(null)
			done()
		})
	})
	
	it('should return results', function(done) {
		p8.search("select * from SGIIFBaseDocument where pt_caf_ejecutor = '13884'", function(err, result) {
			expect(err).toBe(null)
			expect(result).not.toBe(null)
			expect(result.rows).not.toBe(null)
			expect(result.rows.length).toBeGreaterThan(0)
			done()
		})
	})
})
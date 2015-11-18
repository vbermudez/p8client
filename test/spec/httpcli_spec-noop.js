var has_require = typeof require !== 'undefined'

if (has_require) {
	httpcli = require('../../lib/httpcli')
}

describe('HTTPCli', function() {
	it('should exists', function() {
		expect(httpcli).not.toBe(null)
		expect(httpcli.get).not.toBe(null)
		expect(httpcli.post).not.toBe(null)
	})
	
	it('should respond with a user token', function(done) {
		httpcli.post('http://ltesfncpe00.caf.net/Workplace/caf/GetTokenJson.jsp', {
			user: 'p8admin',
			password: 'filenet'
		}, function(err, result) {
			expect(err).toBe(null)
			expect(result).not.toBe(null)
			expect(result.token).not.toBe(null)
			done()
		})
	})
})
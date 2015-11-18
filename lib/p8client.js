(function() { 
	'use strict'
	
	var has_require = typeof require !== 'undefined'
	var root = this
	var prev_module = root.P8Client
	var httpcli = root.httpcli
	
	if( typeof httpcli === 'undefined' ) {
		if( has_require ) {
			httpcli = require('./httpcli')
		} else {
			throw new Error('P8Client requires httpcli')
		}
	}
	
	var P8Client = function(baseUrl) {
		this.baseUrl = baseUrl
		this.ut = null
	}
	
	P8Client.noConflict = function() {
		root.P8Client = prev_module		
		
		return P8Client
	}
	
	P8Client.prototype.login = function(user, password, callback) {
		var p8 = this
		
		return httpcli.post(this.baseUrl + '/Workplace/caf/GetTokenJson.jsp', {
			user: user,
			password: password
		}, function(err, result) {
			if (result && result.token) {
				p8.ut = result.token
			}
			
			callback.call(this, err, result)
		})
	}
	
	P8Client.prototype.search = function(query, callback) {
		return httpcli.post(this.baseUrl + '/Widgets/ws/p8', {
			op: 'search',
			ut: this.ut,
			query: query
		}, callback)
	}
	
	if( typeof exports !== 'undefined' ) {
		if( typeof module !== 'undefined' && module.exports ) {
			exports = module.exports = P8Client
		}
		
		exports.P8Client = P8Client
	} else {
		root.P8Client = P8Client
	}
}).call(this)
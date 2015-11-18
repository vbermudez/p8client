(function() { 
	'use strict'
	
	require('./utils/extend')
	var soap = require('soap')
	var Document = require('./objects/p8document')
	
	var P8SOAPClient = function(client) {
		this.ws = client
		this.port = client.FNCEWS40Service.FNCEWS40MTOMPort
	}
	
	P8SOAPClient.prototype.download = function(downloadRequest, callback) {
		var p8sc = this
		
		this.port.GetContent(downloadRequest.build(), function(err, result) {
			if (err) {
				console.log('download callback error', err.root.Envelope.Body.Fault)
				return callback.call(p8sc, err.root.Envelope.Body.Fault)
			}
			console.log(p8sc.ws.lastResponse)
			return callback.call(p8sc, null, result.ContentResponse[downloadRequest.itemIndex].Content.Binary)
		})
	}
	
	P8SOAPClient.prototype.save = function(object, callback) {
		var p8sc = this
		
		callback.call(p8sc, null, object)
	}
	
	P8SOAPClient.prototype.search = function(searchRequest, callback) {
		var p8sc = this
		
		this.ws.addSoapHeader({
			'ctyp:Localization': {
				'ctyp:Locale': searchRequest.locale
			}
		})
		
		this.port.ExecuteSearch(searchRequest.build(), function(err, result) {
			if (err) {
				console.log('search callback error', err.root.Envelope.Body.Fault)
				return callback.call(p8sc, err.root.Envelope.Body.Fault)
			}
			
			return callback.call(p8sc, null, parseSearchResults.call(p8sc, result, searchRequest.objectStore, searchRequest.searchRows))
		})
	}
	
	var P8Client = function(baseUrl) {
		this.baseUrl = baseUrl + '/wsi/FNCEWS40MTOM?wsdl'
		this.basicAuth = null
		this.client = null
	}
	
	P8Client.prototype.connect = function(user, password, callback) {
		if (this.client) {
			return callback.call(this, null, this.client)
		}
		
		var p8 = this
		
		soap.createClient(this.baseUrl, {
			attributesKey: '$attributes'
		}, function(err, client) {
			if (err) {
				return callback.call(p8, err)
			}
			
			p8.basicAuth = new soap.WSSecurity(user, password) //soap.WSSecurity //soap.BasicAuthSecurity
			p8.client = new P8SOAPClient(client)
			
			p8.client.ws.setSecurity(p8.basicAuth)
			console.log(p8.client.ws.describe())
			
			return callback.call(p8, null, p8.client)
		})
	}
	
	function parseSearchResults(result, objectStore, rowsonly) {
		var rows = []
		
		for (var i = 0, len = result.Object.length; i < len; i++) {
			var item = result.Object[i]
			var row = parseRowSearchResultsItem(item.Property)
			
			row['ObjectStore'] = {
				type: 'ObjectReference',
				settable: false,
				value: objectStore
			}
			
			if (!rowsonly && row.This) {
				var doc = new Document(this)
				
				doc.id = row.This.value.objectId
				doc.objectClass = row.This.value.classId
				doc.objectStore = row.ObjectStore.value
				doc.properties = copyRow2Properties(row)
				row.This = doc
			}
			
			rows.push(row)
		}
		
		return { rows: rows }
	}
	
	function parseRowSearchResultsItem(item) {
		var row = {}
			
		for (var l = 0, llen = item.length; l < llen; l++) {
			var name = item[l]['$attributes'].propertyId
			var type = item[l]['$attributes']['i:type'].split(':')[1]
			var value = item[l].Value || null
			
			if (type == 'SingletonObject' && value && typeof value === 'object' && value['$attributes']) {
				var val = value['$attributes']
				
				type = val['i:type'].split(':')[1]
				value = {
					classId: val.classId,
					objectId: val.objectId
				}
			}
			
			row[name] = {
				type: type,
				settable: item[l]['$attributes'].settable == '1',
				value: value
			}
		}
		
		return row;
	}
	
	function copyRow2Properties(row) {
		var props = {}
		
		for (var prop in row) {
			if (prop == 'This') {
				continue
			}
			
			props[prop] = row[prop]
		}
		
		return props
	}
	
	module.exports = P8Client
}).call(this)
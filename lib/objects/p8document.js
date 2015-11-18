(function() {
	'use strict'
	
	var CustomObject = require('./p8custom')
	var P8DownloadRequest = require('../requests/p8download')
	
	var Document = function(p8c) {
		this.extends( new CustomObject() )
		this._client = p8c
	}
	
	Document.prototype = CustomObject.prototype
	
	Document.prototype.download = function(callback) {
		var download = new P8DownloadRequest()
		
		download.classId = this.objectClass
		download.objectId = this.id
		download.objectStore = this.objectStore
		
		this._client.download(download, callback)
	}
	
	module.exports = Document
}).call(this)
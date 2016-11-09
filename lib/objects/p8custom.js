(function() {
	'use strict';
	
	var CustomObject = function(p8c) {
		this._client = p8c;
		this.id = null;
		this.objectClass = null;
		this.objectStore = null;
		this.properties = {};
		this.acl = [];
	}
	
	CustomObject.prototype.save = function(callback) {
		this._client.save(this);
	}
	
	module.exports = CustomObject;
}).call(this);
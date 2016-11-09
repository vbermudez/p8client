(function() {
	'use strict';

	let _client = new WeakMap();
	let _id = new WeakMap();
	let _objectClass = new WeakMap();
	let _objectStore = new WeakMap();
	let _properties = new WeakMap();
	let _acl = new WeakMap();

	class CustomObject {
		constructor(p8c) {
			_client.set(this, p8c);
			_id.set(this, null);
			_objectClass.set(this, null);
			_objectStore.set(this, null);
			_properties.set(this, {});
			_acl.set(this, []);
		}

		get id() { return _id.get(this); }
		set id(value) { _id.set(this, value); }

		get objectClass() { return _objectClass.get(this); }
		set objectClass(value) { _objectClass.set(this, value); }

		get objectStore() { return _objectStore.get(this); }
		set objectStore(value) { _objectStore.set(this, value); }

		get properties() { return _properties.get(this); }
		set properties(value) { _properties.set(this, value); }

		get acl() { return _acl.get(this); }
		set acl(value) { _acl.set(this, value); }

		save(callback) {
			let p8c = _client.get(this);

			p8c.save(this);
		}
	}

	module.exports = CustomObject;
}).call(this);

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
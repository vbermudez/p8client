(function() {
	'use strict';

	let _classId = new WeakMap();
	let _objectId = new WeakMap();
	let _objectStore = new WeakMap();
	let _cacheAllowed = new WeakMap();
	let _maxBytes = new WeakMap();
	let _validateOnly = new WeakMap();
	let _itemIndex = new WeakMap();

	class P8DownloadRequest {
		constructor() {
			_classId.set(this, null);
			_objectId.set(this, null);
			_objectStore.set(this, null);
			_cacheAllowed.set(this, false);
			_maxBytes.set(this, 1000000);
			_validateOnly.set(this, false);
			_itemIndex.set(this, 0);
		}

		get classId() { return _classId.get(this); }
		set classId(value) { _classId.set(this, value); }

		get objectId() { return _objectId.get(this); }
		set objectId(value) { _objectId.set(this, value); }

		get objectStore() { return _objectStore.get(this); }
		set objectStore(value) { _objectStore.set(this, value); }

		get cacheAllowed() { return _cacheAllowed.get(this); }
		set cacheAllowed(value) { _cacheAllowed.set(this, value); }

		get maxBytes() { return _maxBytes.get(this); }
		set maxBytes(value) { _maxBytes.set(this, value); }

		get validateOnly() { return _validateOnly.get(this); }
		set validateOnly(value) { _validateOnly.set(this, value); }

		get itemIndex() { return _itemIndex.get(this); }
		set itemIndex(value) { _itemIndex.set(this, value); }

		build() {
			if (!this.objectStore || !this.classId || !this.objectId) {
				throw new Error('The ObjectStoreID, the ClassID and the ObjectID are mandatory');
			}
			
			return {
				$attributes: {
					validateOnly: this.validateOnly
				},
				ContentRequest: {
					$attributes: {
						id: '1',
						cacheAllowed: this.cacheAllowed,
						maxBytes: 1000000,
						continuable: this.continuable
					},
					SourceSpecification: {
						$attributes: {
							classId: this.classId,
							objectId: this.objectId,
							objectStore: this.objectStore
						}
					},
					ElementSpecification: {
						$attributes: {
							itemIndex: this.itemIndex
						}
					}
				}
			};
		}
	}

	module.exports = P8DownloadRequest;
}).call(this);


// (function() {
// 	'use strict';
	
// 	var P8DownloadRequest = function() {
// 		this.classId = null;
// 		this.objectId = null;
// 		this.objectStore = null;
// 		this.cacheAllowed = false;
// 		this.maxBytes = 1000000;
// 		this.validateOnly = false;
// 		this.itemIndex = 0;
// 	}
	
// 	P8DownloadRequest.prototype.build = function() {
// 		if (!this.objectStore || !this.classId || !this.objectId) {
// 			throw new Error('The ObjectStoreID, the ClassID and the ObjectID are mandatory');
// 		}
		
// 		return {
// 			$attributes: {
// 				validateOnly: this.validateOnly
// 			},
// 			ContentRequest: {
// 				$attributes: {
// 					id: '1',
// 					cacheAllowed: this.cacheAllowed,
// 					maxBytes: 1000000,
// 					continuable: this.continuable
// 				},
// 				SourceSpecification: {
// 					$attributes: {
// 						classId: this.classId,
// 						objectId: this.objectId,
// 						objectStore: this.objectStore
// 					}
// 				},
// 				ElementSpecification: {
// 					$attributes: {
// 						itemIndex: this.itemIndex
// 					}
// 				}
// 			}
// 		};
// 	}
	
// 	module.exports = P8DownloadRequest;
// }).call(this);
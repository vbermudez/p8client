(function() {
	'use strict'
	
	var P8DownloadRequest = function() {
		this.classId = null
		this.objectId = null
		this.objectStore = null
		this.cacheAllowed = false
		this.maxBytes = 1000000
		this.validateOnly = false
		this.itemIndex = 0
	}
	
	P8DownloadRequest.prototype.build = function() {
		if (!this.objectStore || !this.classId || !this.objectId) {
			throw new Error('The ObjectStoreID, the ClassID and the ObjectID are mandatory')
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
		}
	}
	
	module.exports = P8DownloadRequest
}).call(this)
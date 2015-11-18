(function() {
	'use strict'
	
	var P8SearchRequest = function() {
		this.objectStore = null
		this.searchRows = true
		this.maxElements = 0
		this.continuable = true
		this.query = null
		this.locale = 'en-US'
	}
	
	P8SearchRequest.prototype.build = function() {
		if (!this.objectStore || !this.query) {
			throw new Error('The ObjectStoreID and the Query are mandatory')
		}
		
		return {
			$attributes: {
				'xsi:type': 'RepositorySearch',
				repositorySearchMode: this.searchRows ? 'Rows' : 'Objects',
				maxElements: this.maxElements,
				continuable: this.continuable
			},
			SearchScope: {
				$attributes: {
					'xsi:type': 'ObjectStoreScope',
					objectStore: this.objectStore
				}
			},
			SearchSQL: this.query
		}
	}
	
	module.exports = P8SearchRequest
}).call(this)
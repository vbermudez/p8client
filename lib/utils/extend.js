(function() {
	'use strict'
	
	if (typeof Object.extends === 'undefined') {
		Object.defineProperty(Object.prototype, 'extends', {
			configurable: false,
			enumerable: false,
			writeable: false,
			value: function(superClass) {
				for (var prop in superClass) {
					if (prop == 'prototype') {
						continue
					}
					
					this[prop] = superClass[prop]
				}
			}
		})
	}
	
	module.exports = {
		extends: function(actual, superClass) {
			actual.extends(superClass)
		}
	}
}).call(this)
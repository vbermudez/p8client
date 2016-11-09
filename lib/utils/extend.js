(function() {
	'use strict';
	
	if (typeof Object.extends === 'undefined') {
		Object.defineProperty(Object.prototype, 'extends', {
			configurable: false,
			enumerable: false,
			writeable: false,
			value: function(superClass) {
				for (var prop in superClass) {
					if (prop == 'prototype') {
						continue;
					}
					
					this[prop] = superClass[prop];
				}
			}
		});
	}
	
	if (typeof Object.keys === 'undefined') {
		Object['keys'] = function(obj) {
			var keys = [];
			
			for (var key in obj) {
				keys.push(key);
			}
			
			return keys;
		}
	}
	
	if (typeof String.toByteArray === 'undefined') {
		Object.defineProperty(String.prototype, 'toByteArray', {
			configurable: false,
			enumerable: false,
			writeable: false,
			value: function() {
				var bytes = [];
				
				for (var i = 0, len = this.length; i < len; i++) {
					bytes.push(this.charCodeAt(i));
				}
				
				return bytes;
			}
		})
	}
	
	module.exports = {
		extends: function(actual, superClass) {
			actual.extends(superClass);
		}
	}
}).call(this);
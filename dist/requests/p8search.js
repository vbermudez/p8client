"use strict";
var P8SearchRequest = (function () {
    function P8SearchRequest() {
        this.build = function () {
            if (!this.objectStore || !this.query) {
                throw new Error('The ObjectStoreID and the Query are mandatory');
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
            };
        };
        this._objectStore = null;
        this._searchRows = true;
        this._maxElements = 0;
        this._continuable = true;
        this._query = null;
        this._locale = 'en-US';
    }
    Object.defineProperty(P8SearchRequest.prototype, "objectStore", {
        get: function () { return this._objectStore; },
        set: function (value) { this._objectStore = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8SearchRequest.prototype, "searchRows", {
        get: function () { return this._searchRows; },
        set: function (value) { this._searchRows = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8SearchRequest.prototype, "maxElements", {
        get: function () { return this._maxElements; },
        set: function (value) { this._maxElements = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8SearchRequest.prototype, "continuable", {
        get: function () { return this._continuable; },
        set: function (value) { this._continuable = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8SearchRequest.prototype, "query", {
        get: function () { return this._query; },
        set: function (value) { this._query = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8SearchRequest.prototype, "locale", {
        get: function () { return this._locale; },
        set: function (value) { this._locale = value; },
        enumerable: true,
        configurable: true
    });
    return P8SearchRequest;
}());
exports.P8SearchRequest = P8SearchRequest;

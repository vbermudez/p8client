'use strict';
var P8DownloadRequest = (function () {
    function P8DownloadRequest() {
        this._classId = null;
        this._objectId = null;
        this._objectStore = null;
        this._cacheAllowed = false;
        this._maxBytes = 1000000;
        this._validateOnly = false;
        this._itemIndex = 0;
        this._continuable = false;
    }
    Object.defineProperty(P8DownloadRequest.prototype, "classId", {
        get: function () { return this._classId; },
        set: function (value) { this._classId = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "objectId", {
        get: function () { return this._objectId; },
        set: function (value) { this._objectId = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "objectStore", {
        get: function () { return this._objectStore; },
        set: function (value) { this._objectStore = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "cacheAllowed", {
        get: function () { return this._cacheAllowed; },
        set: function (value) { this._cacheAllowed = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "maxBytes", {
        get: function () { return this._maxBytes; },
        set: function (value) { this._maxBytes = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "validateOnly", {
        get: function () { return this._validateOnly; },
        set: function (value) { this._validateOnly = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "itemIndex", {
        get: function () { return this._itemIndex; },
        set: function (value) { this.itemIndex = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8DownloadRequest.prototype, "continuable", {
        get: function () { return this._continuable; },
        set: function (value) { this.continuable = value; },
        enumerable: true,
        configurable: true
    });
    P8DownloadRequest.prototype.build = function () {
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
    };
    return P8DownloadRequest;
}());
exports.P8DownloadRequest = P8DownloadRequest;
//# sourceMappingURL=p8download.js.map
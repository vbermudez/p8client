'use strict';
var CustomObject = (function () {
    function CustomObject(p8c) {
        this._client = p8c;
        this._id = null;
        this._objectClass = null;
        this._objectStore = null;
        this._properties = {};
        this._acl = [];
    }
    Object.defineProperty(CustomObject.prototype, "id", {
        get: function () { return this._id; },
        set: function (value) { this._id = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomObject.prototype, "objectClass", {
        get: function () { return this._objectClass; },
        set: function (value) { this._objectClass = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomObject.prototype, "objectStore", {
        get: function () { return this._objectStore; },
        set: function (value) { this._objectStore = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomObject.prototype, "properties", {
        get: function () { return this._properties; },
        set: function (value) { this._properties = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomObject.prototype, "acl", {
        get: function () { return this._acl; },
        set: function (value) { this._acl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CustomObject.prototype, "client", {
        get: function () { return this._client; },
        set: function (value) { this._client = value; },
        enumerable: true,
        configurable: true
    });
    CustomObject.prototype.save = function (callback) {
        this.client.save(this);
    };
    return CustomObject;
}());
exports.CustomObject = CustomObject;
//# sourceMappingURL=p8custom.js.map
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class P8DownloadRequest {
    constructor() {
        this._classId = null;
        this._objectId = null;
        this._objectStore = null;
        this._cacheAllowed = false;
        this._maxBytes = 1000000;
        this._validateOnly = false;
        this._itemIndex = 0;
        this._continuable = false;
    }
    get classId() { return this._classId; }
    set classId(value) { this._classId = value; }
    get objectId() { return this._objectId; }
    set objectId(value) { this._objectId = value; }
    get objectStore() { return this._objectStore; }
    set objectStore(value) { this._objectStore = value; }
    get cacheAllowed() { return this._cacheAllowed; }
    set cacheAllowed(value) { this._cacheAllowed = value; }
    get maxBytes() { return this._maxBytes; }
    set maxBytes(value) { this._maxBytes = value; }
    get validateOnly() { return this._validateOnly; }
    set validateOnly(value) { this._validateOnly = value; }
    get itemIndex() { return this._itemIndex; }
    set itemIndex(value) { this.itemIndex = value; }
    get continuable() { return this._continuable; }
    set continuable(value) { this.continuable = value; }
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
exports.P8DownloadRequest = P8DownloadRequest;
//# sourceMappingURL=p8download.js.map
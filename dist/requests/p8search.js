"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class P8SearchRequest {
    constructor() {
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
    get objectStore() { return this._objectStore; }
    set objectStore(value) { this._objectStore = value; }
    get searchRows() { return this._searchRows; }
    set searchRows(value) { this._searchRows = value; }
    get maxElements() { return this._maxElements; }
    set maxElements(value) { this._maxElements = value; }
    get continuable() { return this._continuable; }
    set continuable(value) { this._continuable = value; }
    get query() { return this._query; }
    set query(value) { this._query = value; }
    get locale() { return this._locale; }
    set locale(value) { this._locale = value; }
}
exports.P8SearchRequest = P8SearchRequest;
//# sourceMappingURL=p8search.js.map
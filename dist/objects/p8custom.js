'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class CustomObject {
    constructor(p8c) {
        this._client = p8c;
        this._id = null;
        this._objectClass = null;
        this._objectStore = null;
        this._properties = {};
        this._acl = [];
    }
    get id() { return this._id; }
    set id(value) { this._id = value; }
    get objectClass() { return this._objectClass; }
    set objectClass(value) { this._objectClass = value; }
    get objectStore() { return this._objectStore; }
    set objectStore(value) { this._objectStore = value; }
    get properties() { return this._properties; }
    set properties(value) { this._properties = value; }
    get acl() { return this._acl; }
    set acl(value) { this._acl = value; }
    get client() { return this._client; }
    set client(value) { this._client = value; }
    save(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.save(this);
        });
    }
}
exports.CustomObject = CustomObject;
//# sourceMappingURL=p8custom.js.map
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
const p8custom_1 = require("./p8custom");
const p8download_1 = require("../requests/p8download");
class Document extends p8custom_1.CustomObject {
    constructor(p8c) {
        super(p8c);
    }
    get version() { return this._version; }
    set version(value) { this._version = value; }
    download() {
        return __awaiter(this, void 0, void 0, function* () {
            let download = new p8download_1.P8DownloadRequest();
            download.classId = this.objectClass;
            download.objectId = this.id;
            download.objectStore = this.objectStore;
            return yield this.client.download(download);
        });
    }
}
exports.Document = Document;
//# sourceMappingURL=p8document.js.map
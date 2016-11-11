'use strict';
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var p8custom_1 = require('./p8custom');
var p8download_1 = require('../requests/p8download');
var Document = (function (_super) {
    __extends(Document, _super);
    function Document(p8c) {
        _super.call(this, p8c);
    }
    Document.prototype.download = function (callback) {
        var download = new p8download_1.P8DownloadRequest();
        download.classId = this.objectClass;
        download.objectId = this.id;
        download.objectStore = this.objectStore;
        this.client.download(download, callback);
    };
    return Document;
}(p8custom_1.CustomObject));
exports.Document = Document;
//# sourceMappingURL=p8document.js.map
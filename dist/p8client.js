'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const soap = __importStar(require("soap"));
const objects_1 = require("./objects");
class P8SOAPClient {
    constructor(client) {
        this._ws = client;
        this._port = client.FNCEWS40Service.FNCEWS40MTOMPort;
    }
    get ws() { return this._ws; }
    set ws(value) { this._ws = value; }
    get port() { return this._port; }
    set port(value) { this._port = value; }
    createDocument() {
        return new objects_1.Document(this);
    }
    download(downloadRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.port.GetContentAsync(downloadRequest.build());
            let binaries = [];
            for (let binId in this._ws.binaries) {
                binaries.push(this._ws.binaries[binId]);
            }
            return binaries;
        });
    }
    save(object) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield object;
        });
    }
    search(searchRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.addSoapHeader({
                'ctyp:Localization': {
                    'ctyp:Locale': searchRequest.locale
                }
            });
            let result = yield this.port.ExecuteSearchAsync(searchRequest.build());
            return this._parseSearchResults.call(result, searchRequest.objectStore, searchRequest.searchRows);
        });
    }
    _parseSearchResults(result, objectStore, rowsOnly) {
        let rows = [];
        for (let i = 0, len = result.Object.length; i < len; i++) {
            let item = result.Object[i];
            let row = this._parseRowSearchResultsItem(item.Property);
            row['ObjectStore'] = {
                type: 'ObjectReference',
                settable: false,
                value: objectStore
            };
            if (!rowsOnly && row.This) {
                let doc = new objects_1.Document(this);
                doc.id = row.This.value.objectId;
                doc.objectClass = row.This.value.classId;
                doc.objectStore = row.ObjectStore.value;
                doc.properties = this._copyRow2Properties(row);
                row.This = doc;
            }
            rows.push(row);
        }
        return { rows: rows };
    }
    _parseRowSearchResultsItem(item) {
        let row = {};
        for (let l = 0, len = item.length; l < len; l++) {
            let name = item[l]['$attributes'].propertyId;
            let type = item[l]['$attributes']['i:type'].split(':')[1];
            let value = item[l].Value || null;
            if (type == 'SingletonObject' && value && typeof value === 'object' && value['$attributes']) {
                let val = value['$attributes'];
                type = val['i:type'].split(':')[1];
                value = {
                    classId: val.classId,
                    objectId: val.objectId
                };
            }
            row[name] = {
                type: type,
                settable: item[l]['$attributes'].settable == '1',
                value: value
            };
        }
        return row;
    }
    _copyRow2Properties(row) {
        let props = {};
        for (let prop in row) {
            if (prop == 'This') {
                continue;
            }
            props[prop] = row[prop];
        }
        return props;
    }
}
exports.P8SOAPClient = P8SOAPClient;
class P8Client {
    constructor(baseUrl) {
        this._baseUrl = baseUrl + P8Client.FNCEWS40MTOM_WSDL;
        this._basicAuth = null;
        this._client = null;
    }
    get url() { return this._baseUrl; }
    set url(value) { this._baseUrl = value; }
    get wsSecurity() { return this._basicAuth; }
    set wsSecurity(value) { this._basicAuth = value; }
    get client() { return this._client; }
    set client(value) { this._client = value; }
    connect(user, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let soapClient = yield soap.createClientAsync(this.url, {
                attributesKey: '$attributes',
                wsdl_headers: {
                    connection: 'keep-alive'
                }
            });
            this.wsSecurity = new soap.WSSecurity(user, password);
            this.client = new P8SOAPClient(soapClient);
            this.client.ws.setSecurity(this.wsSecurity);
            return this.client;
        });
    }
}
P8Client.FNCEWS40MTOM_WSDL = '/wsi/FNCEWS40MTOM?wsdl';
exports.P8Client = P8Client;
//# sourceMappingURL=p8client.js.map
'use strict';
require('./utils/extend');
var soap = require('soap');
var p8document_1 = require('./objects/p8document');
var P8SOAPClient = (function () {
    function P8SOAPClient(client) {
        this._ws = client;
        this._port = client.FNCEWS40Service.FNCEWS40MTOMPort;
    }
    Object.defineProperty(P8SOAPClient.prototype, "ws", {
        get: function () { return this._ws; },
        set: function (value) { this._ws = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8SOAPClient.prototype, "port", {
        get: function () { return this._port; },
        set: function (value) { this._port = value; },
        enumerable: true,
        configurable: true
    });
    P8SOAPClient.prototype.download = function (downloadRequest, callback) {
        var p8sc = this;
        this.port.GetContent(downloadRequest.build(), function (err, result) {
            if (err) {
                console.log('download callback error', err.root.Envelope.Body.Fault);
                return callback.call(p8sc, err.root.Envelope.Body.Fault);
            }
            var binaries = [];
            for (var binId in p8sc._ws.binaries) {
                binaries.push(p8sc._ws.binaries[binId]);
            }
            return callback.call(p8sc, null, binaries);
        });
    };
    P8SOAPClient.prototype.save = function (object, callback) {
        var p8sc = this;
        callback.call(p8sc, null, object);
    };
    P8SOAPClient.prototype.search = function (searchRequest, callback) {
        var p8sc = this;
        this.ws.addSoapHeader({
            'ctyp:Localization': {
                'ctyp:Locale': searchRequest.locale
            }
        });
        this.port.ExecuteSearch(searchRequest.build(), function (err, result) {
            if (err) {
                console.log('search callback error', err.root.Envelope.Body.Fault);
                return callback.call(p8sc, err.root.Envelope.Body.Fault);
            }
            return callback.call(p8sc, null, this._parseSearchResults.call(p8sc, result, searchRequest.objectStore, searchRequest.searchRows));
        });
    };
    P8SOAPClient.prototype._parseSearchResults = function (result, objectStore, rowsonly) {
        var rows = [];
        for (var i = 0, len = result.Object.length; i < len; i++) {
            var item = result.Object[i];
            var row = this._parseRowSearchResultsItem(item.Property);
            row['ObjectStore'] = {
                type: 'ObjectReference',
                settable: false,
                value: objectStore
            };
            if (!rowsonly && row.This) {
                var doc = new p8document_1.Document(this);
                doc.id = row.This.value.objectId;
                doc.objectClass = row.This.value.classId;
                doc.objectStore = row.ObjectStore.value;
                doc.properties = this._copyRow2Properties(row);
                row.This = doc;
            }
            rows.push(row);
        }
        return { rows: rows };
    };
    P8SOAPClient.prototype._parseRowSearchResultsItem = function (item) {
        var row = {};
        for (var l = 0, llen = item.length; l < llen; l++) {
            var name_1 = item[l]['$attributes'].propertyId;
            var type = item[l]['$attributes']['i:type'].split(':')[1];
            var value = item[l].Value || null;
            if (type == 'SingletonObject' && value && typeof value === 'object' && value['$attributes']) {
                var val = value['$attributes'];
                type = val['i:type'].split(':')[1];
                value = {
                    classId: val.classId,
                    objectId: val.objectId
                };
            }
            row[name_1] = {
                type: type,
                settable: item[l]['$attributes'].settable == '1',
                value: value
            };
        }
        return row;
    };
    P8SOAPClient.prototype._copyRow2Properties = function (row) {
        var props = {};
        for (var prop in row) {
            if (prop == 'This') {
                continue;
            }
            props[prop] = row[prop];
        }
        return props;
    };
    return P8SOAPClient;
}());
exports.P8SOAPClient = P8SOAPClient;
var P8Client = (function () {
    function P8Client(baseUrl) {
        this._baseUrl = baseUrl + '/wsi/FNCEWS40MTOM?wsdl';
        this._basicAuth = null;
        this._client = null;
    }
    Object.defineProperty(P8Client.prototype, "url", {
        get: function () { return this._baseUrl; },
        set: function (value) { this._baseUrl = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8Client.prototype, "wsSecurity", {
        get: function () { return this._basicAuth; },
        set: function (value) { this._basicAuth = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(P8Client.prototype, "client", {
        get: function () { return this._client; },
        set: function (value) { this._client = value; },
        enumerable: true,
        configurable: true
    });
    P8Client.prototype.connect = function (user, password, callback) {
        if (this.client) {
            return callback.call(this, null, this.client);
        }
        var p8 = this;
        soap.createClient(this.url, {
            attributesKey: '$attributes'
        }, function (err, client) {
            if (err) {
                return callback.call(p8, err);
            }
            p8.wsSecurity = new soap.WSSecurity(user, password);
            p8.client = new P8SOAPClient(client);
            p8.client.ws.setSecurity(p8.wsSecurity);
            return callback.call(p8, null, p8.client);
        });
    };
    return P8Client;
}());
exports.P8Client = P8Client;

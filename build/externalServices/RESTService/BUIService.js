"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
const util_1 = require("util");
//CAMBIA ESTADO DE COMPROBANTE BUI (default PAGADA)
function cambiarEstadoBUI(idBui, estado) {
    let url = 'http://sade-mule.gcba.gob.ar/rest/';
    let method = "POST";
    let headers = '{"Content-Type":"application/json","contexttype":"application/json"}';
    let body;
    if (util_1.isNullOrUndefined(estado)) {
        body = '{"id":' + idBui + ',"estado":"PAGADA"}';
    }
    else {
        body = '{"id":' + idBui + ',"estado":"' + estado + '"}';
    }
    return resttools.apiRestConsume(url, method, headers, cambiarEstadoBUI.name, body);
}
exports.cambiarEstadoBUI = cambiarEstadoBUI;
//RECIBE TOKEN DE AUTORIZACION
function getAuthTokenBUI() {
    let url = 'https://siccsir-qa.gcba.gob.ar/api/auth';
    let method = "POST";
    let headers = '{"Content-Type":"application/json","contexttype":"application/json"}';
    let body = '{"clave":"admin.","cuil":"20304005006"}';
    return resttools.apiRestConsume(url, method, headers, getAuthTokenBUI.name, body);
}
exports.getAuthTokenBUI = getAuthTokenBUI;
//# sourceMappingURL=BUIService.js.map
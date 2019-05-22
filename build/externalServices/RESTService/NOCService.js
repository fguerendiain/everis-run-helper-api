"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
const config = require("../../config");
const util_1 = require("util");
const NOCCREDENTIALS = config.get('credentials').noc;
//CREAR NOC
function createNoc(nocInstance) {
    let url = NOCCREDENTIALS.host;
    let method = "POST";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let param = '?' + nocRequestParamsGet("ADD_REQUEST", 'xml') + nocRequestParamsNocCreator(nocInstance);
    return resttools.apiRestConsume(url, method, null, createNoc.name, null, param);
}
exports.createNoc = createNoc;
//MODIFICAR NOC
function modifyNoc(nocInstance) {
    let url = NOCCREDENTIALS.host;
    let method = "POST";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let param = '/' + nocInstance.getId() + '?' + nocRequestParamsGet("EDIT_REQUEST", 'xml') + nocRequestParamsNocCreator(nocInstance);
    return resttools.apiRestConsume(url, method, null, modifyNoc.name, null, param);
}
exports.modifyNoc = modifyNoc;
//BUSCAR NOC POR ID
function getNocById(v_id) {
    let url = NOCCREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let param = '/' + v_id + '?' + nocRequestParamsGet("GET_REQUEST", 'json');
    return resttools.apiRestConsume(url, method, null, getNocById.name, null, param);
}
exports.getNocById = getNocById;
//BUSCAR NOC POR FILTRO
function getNocByFilter(v_filter) {
    if (util_1.isNullOrUndefined(v_filter)) {
        v_filter = NOCCREDENTIALS.defaultFilter;
    }
    let url = NOCCREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let param = '?' + nocRequestParamsGet("GET_REQUESTS", 'json', v_filter);
    return resttools.apiRestConsume(url, method, null, getNocByFilter.name, null, param);
}
exports.getNocByFilter = getNocByFilter;
//OBTENER COMENTARIOS POR ID
function getNocCommentsById(v_id) {
    let url = NOCCREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let param = '/' + v_id + '/notes?' + nocRequestParamsGet("GET_NOTES", 'json');
    return resttools.apiRestConsume(url, method, null, getNocCommentsById.name, null, param);
}
exports.getNocCommentsById = getNocCommentsById;
//AGREGAR COMENTARIO A NOC POR ID
function addNocCommentsById(v_id, v_coment) {
    let url = NOCCREDENTIALS.host;
    let method = "POST";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let param = '/' + v_id + '/notes?' + nocRequestParamsGet("ADD_NOTE", 'xml') + nocRequestParamsCommentCreator(v_coment);
    return resttools.apiRestConsume(url, method, null, addNocCommentsById.name, null, param);
}
exports.addNocCommentsById = addNocCommentsById;
//Arma el string con los parametros para consultas
function nocRequestParamsGet(v_operatorName, v_format, v_filter) {
    let operationName = 'OPERATION_NAME=' + v_operatorName;
    let technicianKey = '&TECHNICIAN_KEY=' + NOCCREDENTIALS.techniciankey;
    let format = '&format=' + v_format;
    let filter = '';
    if (!util_1.isNullOrUndefined(v_filter)) {
        filter = '&INPUT_DATA={"operation": {"details": {"from": "0","limit": "100","filterby": "' + v_filter + '"}}}';
    }
    return operationName + technicianKey + format + filter;
}
//Arma string con parametros para crear noc
function nocRequestParamsNocCreator(nocInstance) {
    let newNocData;
    newNocData = '&INPUT_DATA=<Operation><Details>';
    newNocData += '<requester>' + NOCCREDENTIALS.newNocUser + '</requester>';
    newNocData += '<subject>' + nocInstance.getSubject() + '</subject>';
    newNocData += '<description>' + nocInstance.getDescription() + '</description>';
    //        newNocData += '<callbackURL>http://localhost:8080/CustomReportHandler.do</callbackURL>';
    newNocData += '<requesttemplate>' + nocInstance.getPlantilla() + '</requesttemplate>';
    newNocData += '<priority>' + nocInstance.getPriroriry() + '</priority>';
    newNocData += '<site>' + NOCCREDENTIALS.newNocSite + '</site>';
    newNocData += '<group>' + nocInstance.getAssigneGrupo() + '</group>';
    newNocData += '<technician>' + nocInstance.getAssigneTecnico() + '</technician>';
    //        newNocData += '<level>'+Tier 3+'</level>';
    newNocData += '<status>' + nocInstance.getStatus() + '</status>';
    //        newNocData += '<service>'+nocInstance.get+'</service>';
    newNocData += '</Details></Operation>';
    return newNocData;
}
//Arma string con parametros para comentarios
function nocRequestParamsCommentCreator(v_comment) {
    return '&INPUT_DATA=<Operation><Details><Notes><Note><isPublic>false</isPublic><notesText>' + v_comment + '</notesText></Note></Notes></Details></Operation>';
}
//CREAR NOC
//ELIMINAR NOC
//BUSCAR NOC POR ID
//BUSCAR NOC POR QUERY
//CREAR COMENTARIO
//BORRAR COMENTARIO
//BUSCAR COMENTARIOS
//ASIGNAR GRUPO Y TECNICO
//ADJUNTAR ARCHIVO
//DESCARGAR ARCHIVOS ADJUNTOS
//# sourceMappingURL=NOCService.js.map
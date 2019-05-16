"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
const config = require("../../config");
const JIRACREDENTIALS = config.get("credentials").jira;
//AGREGAR LABLE /*con esto pongo y quito los s1, run-n3, etc*/
//QUITAR LABLE
//CARGAR HORAS A TICKET
//QUITAR HORAS A TICKET
//ASIGNAR TICKET
//CREAR JIRA
//BORRAR JIRA POR ID
function deleteJiraById(v_query) {
    let url = encodeURI(JIRACREDENTIALS.host);
    let method = "DELETE";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = encodeURI('issue/' + v_query + '?fields&expand');
    return resttools.apiRestConsume(url, method, headers, deleteJiraById.name, null, param);
}
exports.deleteJiraById = deleteJiraById;
//ADJUNTAR ARCHIVOS
//DESCARGAR ARCHIVOS ADJUNTOS
//BUSCAR JIRAS POR ID
function getJiraById(v_query) {
    let url = encodeURI(JIRACREDENTIALS.host);
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = encodeURI('issue/' + v_query + '?fields&expand');
    return resttools.apiRestConsume(url, method, headers, getJiraById.name, null, param);
}
exports.getJiraById = getJiraById;
//BUSCAR JIRA POR QUERY
function getJiraByText(v_query) {
    let url = encodeURI(JIRACREDENTIALS.host);
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = encodeURI('search?jql=text ~ "' + v_query + '"');
    return resttools.apiRestConsume(url, method, headers, getJiraByText.name, null, param);
}
exports.getJiraByText = getJiraByText;
//OBTENER TRANSICION DE JIRA
function getTransicionJira(v_query) {
    let url = encodeURI(JIRACREDENTIALS.host);
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = encodeURI('issue/' + v_query + '/transitions?expand=transitions.fields');
    return resttools.apiRestConsume(url, method, headers, getJiraByText.name, null, param);
}
exports.getTransicionJira = getTransicionJira;
function authConverter() {
    let convert = '"Basic ' + Buffer.from(JIRACREDENTIALS.user + ':' + config.passDecoder(JIRACREDENTIALS.password)).toString("base64") + '"';
    return '"Authorization":' + convert;
}
//# sourceMappingURL=JIRAService.js.map
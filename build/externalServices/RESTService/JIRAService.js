"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
const config = require("../../config");
const credenciales = config.get("credenciales");
//BUSCAR JIRA POR QUERY
function getJiraByText(v_query) {
    let url = encodeURI('https://steps.everis.com/jiraproy/rest/api/2/search?jql=text ~ "' + v_query + '"');
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    return resttools.apiRestConsume(url, method, headers, getJiraByText.name);
}
exports.getJiraByText = getJiraByText;
//OBTENER TRANSICION DE JIRA
function getTransicionJira(v_query) {
    let url = encodeURI('https://steps.everis.com/jiraproy/rest/api/2/issue/' + v_query + '/transitions?expand=transitions.fields');
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    return resttools.apiRestConsume(url, method, headers, getTransicionJira.name);
}
exports.getTransicionJira = getTransicionJira;
function authConverter() {
    return '"Authorization":"Basic ' + Buffer.from(credenciales.jira.user + ':' + credenciales.jira.password).toString("base64") + ' "';
}
//# sourceMappingURL=JIRAService.js.map
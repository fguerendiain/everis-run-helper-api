"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
const config = require("../../config");
//import JiraApi from 'jira-client';
const JIRACREDENTIALS = config.get("credentials").jira;
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
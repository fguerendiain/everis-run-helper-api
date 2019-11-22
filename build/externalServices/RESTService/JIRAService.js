"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
const config = require("../../config");
const JIRACREDENTIALS = config.get("credentials").jira;
//BUSCAR JIRAS POR ID
function getJiraById(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'issue/' + v_query + '?fields&expand';
    return resttools.apiRestConsume(url, method, headers, getJiraById.name, null, param);
}
exports.getJiraById = getJiraById;
//CREAR JIRA
function createJira(jiraInstance) {
    let url = JIRACREDENTIALS.host;
    let method = "POST";
    let headers = { "Content-Type": "application/json", Authorization: authConverter_v2() };
    let param = 'issue';
    let body = bodyFormatForJira(jiraInstance);
    return resttools.apiRestConsume_v1(url, method, headers, createJira.name, body, param);
}
exports.createJira = createJira;
//MODIFICAR JIRA
function modifyJira(jiraInstance) {
    let url = JIRACREDENTIALS.host;
    let method = "PUT";
    let headers = { "Content-Type": "application/json", Authorization: authConverter_v2() };
    let param = 'issue/' + jiraInstance.getId();
    let body = bodyFormatForJira(jiraInstance);
    return resttools.apiRestConsume_v1(url, method, headers, createJira.name, body, param);
}
exports.modifyJira = modifyJira;
//BORRAR JIRA POR ID
function deleteJiraById(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "DELETE";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'issue/' + v_query + '?fields&expand';
    return resttools.apiRestConsume(url, method, headers, deleteJiraById.name, null, param);
}
exports.deleteJiraById = deleteJiraById;
//BUSCAR COMENTARIOS DE JIRA POR ID
function getJiraCommentsById(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'issue/' + v_query + '/comment';
    return resttools.apiRestConsume(url, method, headers, getJiraCommentsById.name, null, param);
}
exports.getJiraCommentsById = getJiraCommentsById;
//AGREGAR COMENTARIO A JIRA POR ID
function addJiraCommentsById(v_id, v_coment) {
    let url = JIRACREDENTIALS.host;
    let method = "POST";
    let headers = { "Content-Type": "application/json", Accept: "application/json", Authorization: authConverter_v2() };
    let param = 'issue/' + v_id + '/comment';
    let body = { body: v_coment };
    return resttools.apiRestConsume_v1(url, method, headers, addJiraCommentsById.name, body, param);
}
exports.addJiraCommentsById = addJiraCommentsById;
//BUSCAR WORKLOG DE JIRA POR ID
function getJiraWorklogById(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'issue/' + v_query + '/worklog';
    return resttools.apiRestConsume(url, method, headers, getJiraWorklogById.name, null, param);
}
exports.getJiraWorklogById = getJiraWorklogById;
//AGREGAR WORKLOG A JIRA POR ID
function addJiraWorklogById(v_id, v_worklog) {
    let url = JIRACREDENTIALS.host;
    let method = "POST";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'issue/' + v_id + '/worklog';
    let body = v_worklog;
    return resttools.apiRestConsume(url, method, headers, addJiraWorklogById.name, body, param);
}
exports.addJiraWorklogById = addJiraWorklogById;
//BUSCAR JIRA POR TEXTO
function getJiraByText(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'search?jql=text ~ "' + v_query + '"';
    return resttools.apiRestConsume(url, method, headers, getJiraByText.name, null, param);
}
exports.getJiraByText = getJiraByText;
//BUSCAR JIRA POR QUERY
function getJiraByJql(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",' + authConverter() + '}';
    let param = 'search?jql=' + v_query;
    return resttools.apiRestConsume(url, method, headers, getJiraByJql.name, null, param);
}
exports.getJiraByJql = getJiraByJql;
//OBTENER TRANSICION DE JIRA
function getTransicionJira(v_query) {
    let url = JIRACREDENTIALS.host;
    let method = "GET";
    let headers = { "Content-Type": "application/json", Accept: "application/json", Authorization: authConverter_v2() };
    let param = 'issue/' + v_query + '/transitions?expand=transitions.fields';
    return resttools.apiRestConsume_v1(url, method, headers, getTransicionJira.name, null, param);
}
exports.getTransicionJira = getTransicionJira;
//CAMBIAR ESTADO DE JIRA
function setTransicionJira(v_query, v_mssage, v_status) {
    let url = JIRACREDENTIALS.host;
    let method = "POST";
    let headers = { "Content-Type": "application/json", Accept: "application/json", Authorization: authConverter_v2() };
    let param = 'issue/' + v_query + '/transitions?expand=transitions.fields';
    let body = { update: { comment: [{ add: { body: v_mssage } }] }, transition: { id: v_status } };
    return resttools.apiRestConsume_v1(url, method, headers, getTransicionJira.name, body, param);
}
exports.setTransicionJira = setTransicionJira;
function authConverter() {
    let convert = '"Basic ' + Buffer.from(JIRACREDENTIALS.user + ':' + config.passDecoder(JIRACREDENTIALS.password)).toString("base64") + '"';
    return '"Authorization":' + convert;
}
function authConverter_v2() {
    return 'Basic ' + Buffer.from(JIRACREDENTIALS.user + ':' + config.passDecoder(JIRACREDENTIALS.password)).toString("base64");
}
function bodyFormatForJira(v_JiraObject) {
    let body = {
        fields: {
            summary: v_JiraObject.getSubject(),
            issuetype: { name: "COM_Bug" },
            components: componentBuilder(v_JiraObject),
            labels: v_JiraObject.getLabels(),
            versions: [{ id: "111917" }],
            project: {
                key: "BISADE"
            },
            description: v_JiraObject.getDescription(),
            assignee: {
                name: v_JiraObject.getAssigne()
            },
            priority: {
                id: v_JiraObject.getPriroriry()
            }
        }
    };
    return body;
}
function componentBuilder(v_JiraObject) {
    let formatedComponents = new Array;
    for (let i = 0; i < v_JiraObject.getComponents().length; i++) {
        formatedComponents.push({ "id": v_JiraObject.getComponents()[i] });
    }
    return formatedComponents;
}
//# sourceMappingURL=JIRAService.js.map
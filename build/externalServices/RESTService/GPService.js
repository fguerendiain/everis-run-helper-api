"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resttools = require("../../tools/RESTtools");
//OBTENER PARTICIPANTES DE UN EXPEDIENTE
function getParticipantesExpediente(v_idExpedienteTad) {
    let url = 'https://servicios.gcba.gob.ar/api/v1/tramites/' + v_idExpedienteTad + '/participaciones';
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    return resttools.apiRestConsume(url, method, headers);
}
exports.getParticipantesExpediente = getParticipantesExpediente;
//# sourceMappingURL=GPService.js.map
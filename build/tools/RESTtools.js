"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const request = require("request-promise-native");
const util_1 = require("util");
//RETORNA RESULTADO DE CONSULTA COMO PROMISE
function apiRestConsume(v_url, v_method, v_header, callMethod, v_body, v_params, v_auth) {
    return new Promise((resolve, reject) => {
        //FORMATEA EL JSON CON LOS DATOS DEL SERVICIO WEB
        let options = '{"uri":"' + v_url;
        if (!util_1.isNullOrUndefined(v_params)) {
            options += v_params + '",';
        }
        else {
            options += '",';
        }
        options += '"method":"' + v_method + '",';
        if (!util_1.isNullOrUndefined(v_body)) {
            options += '"body":' + v_body + ',';
        }
        if (!util_1.isNullOrUndefined(v_auth)) {
            options += '"auth":' + v_auth + ',';
        }
        options += '"header":' + v_header;
        options += '}';
        queryApiRest(options, resolve, reject, callMethod);
    });
}
exports.apiRestConsume = apiRestConsume;
;
//ARMADO DE CONSULTA A SERVICIO REST
function queryApiRest(v_options, resolve, reject, callMethod) {
    request(JSON.parse(v_options), (err, response, body) => {
        if (err) {
            logger.error("REST", err);
            return reject(err);
        }
        else {
            logger.info("REST", response.statusCode + " - " + JSON.stringify(body));
            return resolve(JSON.parse('{"' + callMethod + '":' + body + '}'));
        }
    });
}
//# sourceMappingURL=RESTtools.js.map
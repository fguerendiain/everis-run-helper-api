"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const request = require("request-promise-native");
const util_1 = require("util");
//RETORNA RESULTADO DE CONSULTA COMO PROMISE
function apiRestConsume(v_url, v_method, v_header, callMethod, v_body, v_params, v_auth) {
    return new Promise((resolve, reject) => {
        //FORMATEA EL JSON CON LOS DATOS DEL SERVICIO WEB
        let v_json = 'true';
        if (util_1.isNullOrUndefined(v_params)) {
            v_params = null;
        }
        if (util_1.isNullOrUndefined(v_body)) {
            v_body = null;
            v_json = null;
        }
        else {
            v_body = JSON.parse(v_body);
        }
        if (util_1.isNullOrUndefined(v_auth)) {
            v_auth = null;
        }
        if (util_1.isNullOrUndefined(v_header)) {
            v_header = null;
        }
        else {
            v_header = JSON.parse(v_header);
        }
        let options = {
            "uri": encodeURI(v_url + v_params),
            "body": v_body,
            "json": v_json,
            "auth": v_auth,
            "headers": v_header,
            "method": v_method
        };
        logger.info('REST', 'request: ' + JSON.stringify(options));
        queryApiRest(options, resolve, reject, callMethod);
    });
}
exports.apiRestConsume = apiRestConsume;
;
//ARMADO DE CONSULTA A SERVICIO REST
function queryApiRest(v_options, resolve, reject, callMethod) {
    request(v_options, (err, response, body) => {
        if (err) {
            logger.error("REST", 'Call Method: ' + callMethod + ' -  response error: ' + err);
            return reject(err);
        }
        else {
            if (response.statusCode != 200) {
                try {
                    logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + escapeSpecialChars(JSON.stringify(response)));
                    return resolve(JSON.parse(response.body));
                }
                catch (err) {
                    logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + JSON.stringify(response));
                    logger.error("REST", 'Call Method: ' + callMethod + " - " + err);
                    return resolve(response);
                }
            }
            try {
                logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + escapeSpecialChars(JSON.stringify(response)));
                return resolve(JSON.parse(response.body));
            }
            catch (err) {
                logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + JSON.stringify(response));
                logger.error("REST", 'Call Method: ' + callMethod + " - " + err);
                return resolve(response);
            }
        }
    }).catch((err) => { return reject(err); });
}
function escapeSpecialChars(v_string) {
    return v_string.replace(/\\r\\n/g, "")
        .replace(/:\'/g, ":")
        .replace(/\,\\/g, ',"')
        .replace(/\\\"/g, '"')
        .replace(/ /g, "");
}
;
//# sourceMappingURL=RESTtools.js.map
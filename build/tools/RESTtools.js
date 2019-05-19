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
            options += '"json":true,';
        }
        if (!util_1.isNullOrUndefined(v_auth)) {
            options += '"auth":' + v_auth + ',';
        }
        options += '"headers":' + v_header;
        options += '}';
        logger.info('REST', 'request: ' + options);
        queryApiRest(options, resolve, reject, callMethod);
    });
}
exports.apiRestConsume = apiRestConsume;
;
//ARMADO DE CONSULTA A SERVICIO REST
function queryApiRest(v_options, resolve, reject, callMethod) {
    request(JSON.parse(v_options), (err, response, body) => {
        if (err) {
            logger.error("REST", 'Call Method: ' + callMethod + ' -  response error: ' + err);
            return reject(err);
        }
        else {
            if (response.statusCode != 200) {
                try {
                    logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + escapeSpecialChars(JSON.stringify(response)));
                    return resolve(JSON.parse(response));
                }
                catch (err) {
                    logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + JSON.stringify(response));
                    logger.error("REST", 'Call Method: ' + callMethod + " - " + err);
                    return resolve(response);
                }
            }
            try {
                logger.info("REST", 'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + escapeSpecialChars(JSON.stringify(response.body)));
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
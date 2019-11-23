"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const config = require("../config");
const xmlToJson = require("xml2json");
const axios = require('axios');
const wstimeout = config.get("wstimeout");
//RETORNA PROMESA CON CONSULTA SOAP
function soapRequest(url, xml, callMethod) {
    logger.info('SOAP', 'Genera consulta: ' + xml);
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url,
            headers: {
                "Content-Type": "text/xml;charset=UTF-8",
                "SOAPAction": "",
                "Connection": "Keep-Alive",
                "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
            },
            data: xml,
            timeout: wstimeout,
        }).then((response) => {
            resolve(JSON.parse(escapeSpecialChars(xmlToJson.toJson(response.data))));
            logger.info('SOAP', response.status + ' - ' + response.data);
        }).catch((error) => {
            if (error.response) {
                reject(error.response.data);
                logger.error('SOAP', error);
            }
            else {
                reject(error);
                logger.error('SOAP', error);
            }
        });
    });
}
exports.soapRequest = soapRequest;
;
function escapeSpecialChars(v_string) {
    return v_string.replace(/S:/g, '')
        .replace(/:S/g, '')
        .replace(/:ns2/g, '')
        .replace(/ns2:/g, '');
}
;
//# sourceMappingURL=WStools.js.map
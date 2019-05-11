"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const axios = require('axios');
const config = require("../config");
const xmlToJson = require("xml2json");
const wstimeout = config.get("wstimeout");
//RETORNA PROMESA CON CONSULTA SOAP
function soapRequest(url, xml, callMethod) {
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
            resolve(JSON.parse('{"' + callMethod + '":' + xmlToJson.toJson(response.data) + '}'));
            logger.info('SOAP', response.status + ' - ' + response.data);
        }).catch((error) => {
            if (error.response) {
                logger.error('SOAP', error);
                reject(error.response.data);
            }
            else {
                logger.error('SOAP', error);
                reject(error);
            }
        });
    });
}
exports.soapRequest = soapRequest;
;
//# sourceMappingURL=WStools.js.map
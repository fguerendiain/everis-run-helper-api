"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const axios = require('axios');
function soapRequest(url, xml) {
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
            timeout: 10000,
        }).then((response) => {
            resolve(response.data);
            logger.info('WS', 'SOAP SUCCED: ' + response.status + ' - ' + response.data);
        }).catch((error) => {
            if (error.response) {
                logger.error('WS', 'SOAP FAIL: ' + error);
                reject(error.response.data);
            }
            else {
                logger.error('WS', 'SOAP FAIL: ' + error);
                reject(error);
            }
        });
    });
}
exports.soapRequest = soapRequest;
;
//# sourceMappingURL=WStools.js.map
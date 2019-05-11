import * as logger from '../logger';
const axios = require('axios');
import * as config from '../config';
import * as xmlToJson from 'xml2json';

const wstimeout = config.get("wstimeout");

//RETORNA PROMESA CON CONSULTA SOAP
export function soapRequest(url, xml, callMethod) {
  
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      headers : {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "",
        "Connection": "Keep-Alive",
        "User-Agent": "Apache-HttpClient/4.1.1 (java 1.5)"
      },
      data: xml,
      timeout : wstimeout,
    }).then((response) => {
        resolve(JSON.parse('{"'+callMethod+'":'+xmlToJson.toJson(response.data)+'}'));
        logger.info('SOAP', response.status + ' - ' + response.data);
    }).catch((error) => {
      if (error.response) {
        logger.error('SOAP',error);
        reject(error.response.data);
      } else {
        logger.error('SOAP',error);
        reject(error);
      }
    });
  });
};
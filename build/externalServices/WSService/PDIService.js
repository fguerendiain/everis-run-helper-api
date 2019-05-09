"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wstools = require("../../tools/WStools");
/* template para agregar webservice
export function NOMBREDELSERVICIO(v_param){
    let v_url = '';
    let v_xml = '';
    return wstools.soapRequest(v_url,v_xml);
}
*/
//CONSULTAR DIRECCION VALIDA
function getCalleDireccionValidas(v_calle, v_altura) {
    let v_url = 'http://sade-mule.gcba.gob.ar/TADServices/pdi';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.tad.service.external.pdi/"><soapenv:Header/><soapenv:Body><ar:getCalleDireccionValidas><arg0>' + v_calle + '</arg0><arg1>' + v_altura + '</arg1></ar:getCalleDireccionValidas></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.getCalleDireccionValidas = getCalleDireccionValidas;
//# sourceMappingURL=PDIService.js.map
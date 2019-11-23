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
function grabarTransaccion(v_entorno, vFechaTransaccion, vFormName, vSistemaOrigen, data) {
    let v_url = v_entorno + '/dynform-web/transaccionService';
    let xmlStringBuilder;
    xmlStringBuilder = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.dynform.tramelec.everis.com/">';
    xmlStringBuilder += '<soapenv:Header/>';
    xmlStringBuilder += '<soapenv:Body>';
    xmlStringBuilder += '<ser:grabarTransaccion>';
    xmlStringBuilder += '<arg0>';
    xmlStringBuilder += vFechaTransaccion;
    xmlStringBuilder += vFormName;
    xmlStringBuilder += '<sistOrigen>' + vSistemaOrigen + '</sistOrigen>';
    for (let i = 0; i < data.length; i++) {
        xmlStringBuilder += '<valorFormComps>';
        xmlStringBuilder += data[i].ETIQUETA;
        xmlStringBuilder += data[i].IDFORMCOMP;
        xmlStringBuilder += data[i].INPUTNAME;
        xmlStringBuilder += data[i].VALOR;
        xmlStringBuilder += '</valorFormComps>';
    }
    xmlStringBuilder += '</arg0>';
    xmlStringBuilder += '</ser:grabarTransaccion>';
    xmlStringBuilder += '</soapenv:Body>';
    xmlStringBuilder += '</soapenv:Envelope>';
    return wstools.soapRequest(v_url, xmlStringBuilder, grabarTransaccion.name);
}
exports.grabarTransaccion = grabarTransaccion;
//# sourceMappingURL=FFCCService.js.map
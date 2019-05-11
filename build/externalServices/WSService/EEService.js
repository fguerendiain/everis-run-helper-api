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
/*****************
DOCUMENTOS DE EE
*****************/
//VINCULAR DOCUMENTO A EE POR TRANSACCION
function vincularDocumentosOficialesConTransaccionFC(v_sistemaUsuario, v_usuario, v_codsade, v_nroSadeDocumento, v_idTransaccion) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/documentos-oficiales';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:vincularDocumentosOficialesConTransaccionFC><sistemaUsuario>' + v_sistemaUsuario + '</sistemaUsuario><usuario>' + v_usuario + '</usuario><codigoEE>' + v_codsade + '</codigoEE><documento>' + v_nroSadeDocumento + '</documento><idTransaccionFC>' + v_idTransaccion + '</idTransaccionFC></ar:vincularDocumentosOficialesConTransaccionFC></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.vincularDocumentosOficialesConTransaccionFC = vincularDocumentosOficialesConTransaccionFC;
//VINCULAR DOCUMENTO A EE
function vincularDocumentosOficiales(v_sistemaUsuario, v_usuario, v_codsade, v_nroSadeDocumento) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/documentos-oficiales';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:vincularDocumentosOficiales><sistemaUsuario>' + v_sistemaUsuario + '</sistemaUsuario><usuario>' + v_usuario + '</usuario><codigoEE>' + v_codsade + '</codigoEE><listaDocumentos>' + v_nroSadeDocumento + '</listaDocumentos></ar:vincularDocumentosOficiales></soapenv:Body></soapenv:Envelope';
    return wstools.soapRequest(v_url, v_xml);
}
exports.vincularDocumentosOficiales = vincularDocumentosOficiales;
//HACER DOCUMENTOS DE EE DEFINITIVOS
function hacerDefinitivosDocsDeEE(v_codsade, v_sistemaUsuario, v_usuario) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/documentos-oficiales';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:hacerDefinitivosDocsDeEE><request><codigoEE>' + v_codsade + '</codigoEE><sistemaUsuario>' + v_sistemaUsuario + '</sistemaUsuario><usuario>' + v_usuario + '</usuario></request></ar:hacerDefinitivosDocsDeEE></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.hacerDefinitivosDocsDeEE = hacerDefinitivosDocsDeEE;
/*****************
GENERAR PASE
*****************/
//GENERAR PASE DE EXPEDIENTE GUARDA TEMPORAL
function generarPaseEEaGuardaTemporal(v_codsade, v_sistemaOrigen, v_usuarioDestino, v_usuarioOrigen) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/generar-pase';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:generarPaseEE><datosPase><codigoEE>' + v_codsade + '</codigoEE><esReparticionDestino>1</esReparticionDestino><estadoSeleccionado>Guarda Temporal</estadoSeleccionado><motivoPase>Pase a Guarda Temporal</motivoPase><sistemaOrigen>' + v_sistemaOrigen + '</sistemaOrigen><usuarioDestino>' + v_usuarioDestino + '</usuarioDestino><usuarioOrigen>' + v_usuarioOrigen + '</usuarioOrigen></datosPase></ar:generarPaseEE></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.generarPaseEEaGuardaTemporal = generarPaseEEaGuardaTemporal;
//GENERAR PASE DE EXPEDIENTE A REPA-SECTOR
function generarPaseEEaRepaSector(v_codsade, v_estadoEx, v_reparticion, v_sector, v_sistemaOrigen, v_usuarioOrigen) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/generar-pase';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:generarPaseEE><datosPase><codigoEE>' + v_codsade + '</codigoEE><esSectorDestino>1</esSectorDestino><estadoSeleccionado>' + v_estadoEx + '</estadoSeleccionado><motivoPase>Se realiza pase para regularización de inconsistencia del expediente</motivoPase><reparticionDestino>' + v_reparticion + '</reparticionDestino><sectorDestino>' + v_sector + '</sectorDestino><sistemaOrigen>' + v_sistemaOrigen + '</sistemaOrigen><usuarioOrigen>' + v_usuarioOrigen + '</usuarioOrigen></datosPase> </ar:generarPaseEE></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.generarPaseEEaRepaSector = generarPaseEEaRepaSector;
//GENERAR PASE DE EXPEDIENTE A USUARIO
function generarPaseEEaUsuario(v_codsade, v_estadoEx, v_sistemaOrigen, v_usuarioDestino, v_usuarioOrigen) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/generar-pase';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:generarPaseEE><datosPase><codigoEE>' + v_codsade + '</codigoEE><esUsuarioDestino>1</esUsuarioDestino><estadoSeleccionado>' + v_estadoEx + '+</estadoSeleccionado><motivoPase>Se realiza pase para regularización de inconsistencia del expediente</motivoPase><sistemaOrigen>' + v_sistemaOrigen + '</sistemaOrigen><usuarioDestino>' + v_usuarioDestino + '+</usuarioDestino>--><usuarioOrigen>' + v_usuarioOrigen + '</usuarioOrigen></datosPase></ar:generarPaseEE></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.generarPaseEEaUsuario = generarPaseEEaUsuario;
/********************
BLOQUEO Y DESBLOQUEO
*********************/
//BLOQUEAR EXPEDIENTE ELECTRONICO
function bloquearExpediente(v_codsade, v_sistemaApoderado) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/bloqueo-expediente';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:bloquearExpediente><sistemaBloqueador>' + v_sistemaApoderado + '</sistemaBloqueador><codigoEE>' + v_codsade + '</codigoEE></ar:bloquearExpediente></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.bloquearExpediente = bloquearExpediente;
//DESBLOQUEAR EXPEDIENTE ELECTRONICO
function desbloquearExpediente(v_codsade, v_sistemaApoderado) {
    let v_url = 'http://sade-mule.gcba.gob.ar/EEServices/bloqueo-expediente';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.ee.services.external/"><soapenv:Header/><soapenv:Body><ar:desbloquearExpediente><sistemaSolicitante>' + v_sistemaApoderado + '</sistemaSolicitante><codigoEE>' + v_codsade + '</codigoEE></ar:desbloquearExpediente></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url, v_xml);
}
exports.desbloquearExpediente = desbloquearExpediente;
//# sourceMappingURL=EEService.js.map
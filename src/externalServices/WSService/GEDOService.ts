import * as wstools from "../../tools/WStools";

/* template para agregar webservice
export function NOMBREDELSERVICIO(v_param){
    let v_url = '';
    let v_xml = '';
    return wstools.soapRequest(v_url,v_xml);
}
*/

//GENERAR DOCUMENTO
export function generarDocumentoGEDO(v_acronimo,v_dataBase64,v_referencia,v_sistemaOrigen,v_tipoArchivo,v_usuario){
    let v_url = 'http://sade-mule.gcba.gob.ar/GEDOServices/generarDocumento';
    let v_xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gob.gcaba.gedo.satra.services.external.generardocumento/"><soapenv:Header/><soapenv:Body><ar:generarDocumentoGEDO><request><acronimoTipoDocumento>'+v_acronimo+'</acronimoTipoDocumento><data>'+v_dataBase64+'</data><referencia>'+v_referencia+'</referencia><sistemaOrigen>'+v_sistemaOrigen+'</sistemaOrigen><tipoArchivo>'+v_tipoArchivo+'</tipoArchivo><usuario>'+v_usuario+'</usuario></request></ar:generarDocumentoGEDO></soapenv:Body></soapenv:Envelope>';
    return wstools.soapRequest(v_url,v_xml);
}
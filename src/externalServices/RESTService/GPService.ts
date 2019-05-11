import * as resttools from '../../tools/RESTtools';

//INFORMAR PARTICIPANTE PARA EXPEDIENTE
export function informarParticipante(v_idExpedienteTad,v_trata,v_codSade,v_cuitParticipante,v_perfilParticipante,v_interviniente,v_sistema,v_nombresParticipante,v_apellidosParticipante,v_razonSocial){
    let url = 'https://servicios.gcba.gob.ar/api/v1/tramites/'+v_idExpedienteTad+'/participaciones';
    let method = "POST";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let body = '{"codTipoTramite" : "'+v_trata+'","nroExpediente" : "'+v_codSade+'","cuitParticipante" : "'+v_cuitParticipante+'","idPerfil" : "'+v_perfilParticipante+'","intervinienteTad" : '+v_interviniente+',"idSistema" : "'+v_sistema+'","nombre" : "'+v_nombresParticipante+'","apellido" : "'+v_apellidosParticipante+'","razonSocial": "'+v_razonSocial+'"}'
    return resttools.apiRestConsume(url,method,headers,informarParticipante.name,body);     
}

//ELIMINAR PARTICIPANTE PARA EXPEDIENTE
export function deleteParticipante(v_idExpedienteTad,v_cuitParticipante,v_perfilParticipante,v_sistema){
    let url = 'https://servicios.gcba.gob.ar/api/v1/tramites/'+v_idExpedienteTad+'/participaciones';
    let method = "DELETE";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    let body = '{"sistema":'+v_sistema+',"operador": {"cuit":'+v_cuitParticipante+',"idPerfil":'+v_perfilParticipante+'}}'
    return resttools.apiRestConsume(url,method,headers,deleteParticipante.name,body);     
}

//OBTENER PARTICIPANTES DE UN EXPEDIENTE
export function getParticipantesExpediente(v_idExpedienteTad){
    let url = 'https://servicios.gcba.gob.ar/api/v1/tramites/'+v_idExpedienteTad+'/participaciones';
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    return resttools.apiRestConsume(url,method,headers,getParticipantesExpediente.name);     
}

//OBTENER PERFILES HABILITADOS POR TRATA DE UN EXPEDIENTE
export function getPerfilesPorTrata(v_trataTad){
    let url = 'https://servicios.gcba.gob.ar/api/v1/tiposTramite/'+v_trataTad+'/perfiles';
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
    return resttools.apiRestConsume(url,method,headers,getPerfilesPorTrata.name);     
}
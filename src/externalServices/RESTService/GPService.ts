import * as resttools from '../../tools/RESTtools';


//OBTENER PARTICIPANTES DE UN EXPEDIENTE
export function getParticipantesExpediente(v_idExpedienteTad){
    let url = 'https://servicios.gcba.gob.ar/api/v1/tramites/'+v_idExpedienteTad+'/participaciones';
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json"}';

    return resttools.apiRestConsume(url,method,headers);     
}
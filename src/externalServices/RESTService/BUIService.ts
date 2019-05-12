import * as resttools from '../../tools/RESTtools';
import { isNullOrUndefined } from 'util';


//CAMBIA ESTADO DE COMPROBANTE BUI (default PAGADA)
export function cambiarEstadoBUI(idBui:string,estado?:string){
    let url = 'http://sade-mule.gcba.gob.ar/rest/';
    let method = "POST";
    let headers = '{"Content-Type":"application/json","contexttype":"application/json"}';
    let body;
    if(isNullOrUndefined(estado)){
        body = '{"id":'+idBui+',"estado":"PAGADA"}'
    }else{
        body = '{"id":'+idBui+',"estado":"'+estado+'"}'
    }
    return resttools.apiRestConsume(url,method,headers,cambiarEstadoBUI.name,body);     
}

//RECIBE TOKEN DE AUTORIZACION
export function getAuthTokenBUI(){
    let url = 'https://siccsir-qa.gcba.gob.ar/api/auth';
    let method = "POST";
    let headers = '{"Content-Type":"application/json","contexttype":"application/json"}';
    let body = '{"clave":"admin.","cuil":"20304005006"}'
    return resttools.apiRestConsume(url,method,headers,getAuthTokenBUI.name,body);
}
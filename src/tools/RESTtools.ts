import * as logger from '../logger';
import * as request from 'request-promise-native';
import { resolve } from 'url';
import { isNullOrUndefined } from 'util';

//RETORNA RESULTADO DE CONSULTA COMO PROMISE
export function apiRestConsume(v_url:string, v_method:string, v_header:string, v_body?:string, v_params?:string){
    return new Promise((resolve,reject)=>{

        //FORMATEA EL JSON CON LOS DATOS DEL SERVICIO WEB
        let options = '{"uri":"' + v_url + '"';
        if (!isNullOrUndefined(v_params)){
            options += v_params + ',';
        }else
        {
            options += ',';
        }
        options += '"method":"' + v_method + '",';
        options += '"header":' + v_header;
        if (!isNullOrUndefined(v_body)){
            options += ',"body":' + v_body + '}';
        }
        options += '}';

        queryApiRest(options,resolve,reject);

    })};

//ARMADO DE CONSULTA A SERVICIO REST
function queryApiRest (v_options:string,resolve,reject){
       
    request(JSON.parse(v_options),(err,response, body)=>{
        if(err){
            logger.error("REST",err);
            return reject(err);
        } 
        logger.info("REST",response.statusCode + " - " + body);
        return resolve(body);
    });
}

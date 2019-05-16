import * as config from '../config';
import * as logger from '../logger';
import * as request from 'request-promise-native';
import { isNullOrUndefined } from 'util';
import { stringify } from 'querystring';


//RETORNA RESULTADO DE CONSULTA COMO PROMISE
export function apiRestConsume(v_url:string, v_method:string, v_header:string, callMethod:string, v_body?:string, v_params?:string, v_auth?:string){
    return new Promise((resolve,reject)=>{

        //FORMATEA EL JSON CON LOS DATOS DEL SERVICIO WEB
        let options = '{"uri":"' + v_url;
        if (!isNullOrUndefined(v_params)){
            options += v_params + '",';
        }else
        {
            options += '",';
        }
        options += '"method":"' + v_method + '",';
        if (!isNullOrUndefined(v_body)){
            options += '"body":' + v_body + ',';
        }
        if (!isNullOrUndefined(v_auth)){
            options += '"auth":' + v_auth + ',';
        }
        options += '"headers":' + v_header;
        options += '}';

        logger.info('REST','Genera consulta: '+options)

        queryApiRest(options,resolve,reject,callMethod);

    })};

//ARMADO DE CONSULTA A SERVICIO REST
function queryApiRest (v_options:string,resolve,reject,callMethod){
    request(JSON.parse(v_options),(err,response, body)=>{
        if(err){
            logger.error("REST",err);
            return reject(err);
        }else{
            if(response.statusCode == 204){
                logger.info("REST",response.statusCode + " - " + escapeSpecialChars(JSON.stringify('{"'+callMethod+'":"no content"}')));
                return resolve(JSON.parse('{"'+callMethod+'":"no content"}'));
            }
            logger.info("REST",response.statusCode + " - " + escapeSpecialChars(JSON.stringify(body)));
//            return resolve(JSON.parse('{"'+callMethod+'":'+body+'}'));
            return resolve(JSON.parse(body));
        }
    });
}

export function escapeSpecialChars(str:string) {
    return str.replace(/\\r\\n/g, "")
                .replace(/:\'/g, ":")
                .replace(/\,\\/g, ',"')
                .replace(/\\\"/g, '"')
                .replace(/ /g, "");
};
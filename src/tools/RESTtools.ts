import * as config from '../config';
import * as logger from '../logger';
import * as request from 'request-promise-native';
import { isNullOrUndefined } from 'util';


//RETORNA RESULTADO DE CONSULTA COMO PROMISE
export function apiRestConsume(v_url:string, v_method:string, v_header:string, callMethod:string, v_body?:string, v_params?:string, v_auth?:string){
    return new Promise((resolve,reject)=>{

        //FORMATEA EL JSON CON LOS DATOS DEL SERVICIO WEB

        let v_json:string = 'true';

        if (isNullOrUndefined(v_params)){
            v_params = null;
        }
        if (isNullOrUndefined(v_body)){
            v_body = null;
            v_json = null;
        }else{
            v_body = JSON.parse(v_body);
        }
        if (isNullOrUndefined(v_auth)){
            v_auth = null;
        }
        if (isNullOrUndefined(v_header)){
            v_header = null;
        }else{
            v_header = JSON.parse(v_header);
        }

        let options:{} = { 
            "uri": encodeURI(v_url+v_params),
            "body": v_body,
            "json":v_json,
            "auth": v_auth,            
            "headers": v_header,
            "method": v_method
        }

        logger.info('REST','request: '+ JSON.stringify(options));

        queryApiRest(options,resolve,reject,callMethod);

    })};

//ARMADO DE CONSULTA A SERVICIO REST
function queryApiRest (v_options:{},resolve,reject,callMethod){
    request(v_options,(err,response, body)=>{
            if(err){
            logger.error("REST",'Call Method: ' + callMethod + ' -  response error: ' + err);
            return reject(err);
        }else{
            if(response.statusCode != 200){
                try{
                    logger.info("REST",'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + escapeSpecialChars(JSON.stringify(response)));
                    return resolve(JSON.parse(response.body));
                }catch(err){
                    logger.info("REST",'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + JSON.stringify(response));
                    logger.error("REST",'Call Method: ' + callMethod + " - " + err);
                    return resolve(response);
                }
            }
            try{
                logger.info("REST",'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + escapeSpecialChars(JSON.stringify(response)));
                return resolve(JSON.parse(response.body));
            }catch(err){
                logger.info("REST",'response: ' + response.statusCode + " - Call Method: " + callMethod + " - " + JSON.stringify(response));
                logger.error("REST",'Call Method: ' + callMethod + " - " + err);
                return resolve(response);
        }
        }
    }).catch((err)=>{return reject(err);});
}

function escapeSpecialChars(v_string:string) {
    return v_string.replace(/\\r\\n/g, "")
                .replace(/:\'/g, ":")
                .replace(/\,\\/g, ',"')
                .replace(/\\\"/g, '"')
                .replace(/ /g, "");
};


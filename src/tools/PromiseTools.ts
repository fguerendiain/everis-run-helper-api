import { isNullOrUndefined } from "util";
import * as logger from '../logger';


export function handlePromises(queryArray,endMessage,resExpress?){
    let jsonResponseArray = {"response":[]};
    Promise.all(queryArray)
    .then((results)=>{
        for(let i = 0; i < results.length; i++){
            if (isNullOrUndefined(results[i])){
                logger.error('PROMISE','response [' + results[i] + ']')
            }else{
                jsonResponseArray.response.push(results[i]);
            }
        }
        if (isNullOrUndefined(resExpress)){
            logger.taskEndInfo(endMessage);
            return jsonResponseArray.response;
        }
        else{
            resExpress.status(200).send(jsonResponseArray.response);
            logger.taskEndInfo(endMessage);
        }
    });
}
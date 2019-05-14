import * as config from '../config';
import * as logger from '../logger';
import { isNullOrUndefined } from "util";

/*RECIBE UN ARRAY DE PROMESAS Y ESPERA LA RESPUESTA DE TODAS PARA DEVOLVER EL RESULTADO
*param: queryArray - Array de Promesas
*param: endMessage - Mensaje para imprimir en log
*param: makeItHappend - Funcion que controla la logica de la tarea en que llama al metodo
*/
export function handlePromises(queryArray, endMessage: string, makeItHappen) {
    let jsonResponseArray = { "response": [] };
    Promise.all(queryArray)
        .then((results) => {
            for (let i = 0; i < results.length; i++) {
                if (isNullOrUndefined(results[i])) {
                    logger.error('PROMISE', 'response [' + results[i] + ']')
                } else {
                    jsonResponseArray.response.push(results[i]);
                }
            }
            logger.info("PROMISE", endMessage);
            makeItHappen(jsonResponseArray.response);
        })
}


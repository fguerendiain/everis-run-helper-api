"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../logger");
const util_1 = require("util");
/*RECIBE UN ARRAY DE PROMESAS Y ESPERA LA RESPUESTA DE TODAS PARA DEVOLVER EL RESULTADO
*param: queryArray - Array de Promesas
*param: endMessage - Mensaje para imprimir en log
*param: makeItHappend - Funcion que controla la logica de la tarea en que llama al metodo
*/
function handlePromises(queryArray, endMessage, makeItHappen) {
    let jsonResponseArray = []; // = { "response": [] };
    Promise.all(queryArray)
        .then((results) => {
        if (!util_1.isNullOrUndefined(results)) {
            for (let i = 0; i < results.length; i++) {
                if (util_1.isNullOrUndefined(results[i])) {
                    logger.error('PROMISE', 'response [' + results[i] + ']');
                }
                else {
                    jsonResponseArray.push(results[i]);
                }
            }
            logger.info("PROMISE", endMessage);
            makeItHappen(jsonResponseArray);
        }
    })
        .catch((err) => {
        logger.info("PROMISE", err);
        makeItHappen(undefined);
    });
}
exports.handlePromises = handlePromises;
//# sourceMappingURL=PromiseTools.js.map
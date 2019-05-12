import * as config from '../config';
import * as logger from '../logger';
import { isNullOrUndefined } from "util";

/*RECIBE UN ARRAY DE PROMESAS Y ESPERA LA RESPUESTA DE TODAS PARA DEVOLVER EL RESULTADO
*param: queryArray - Array de Promesas
*param: endMessage - Mensaje para imprimir en log
*param: makeItHappend - Funcion que controla la logica de la tarea en que llama al metodo
*/
export function handlePromises(queryArray,endMessage:string,makeItHappen,resExpress){
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
        logger.info("PROMISE",endMessage);
        makeItHappen(jsonResponseArray.response,resExpress);
    });
}

//FORMATEA CONSULTAS A BBDD A JSON
export function responsePromiseJsonFormat(response,promiseNumber){
    let newResultsArray = [];
    let i0 = promiseNumber; //Seleccion de resultado de promesa individual
    if(!isNullOrUndefined(response[i0])){
        if(!response[i0].hasOwnProperty('BBDDData')){
            newResultsArray.push(JSON.parse('{"typenobbddis":"'+Object.getOwnPropertyNames(response[i0])+'"}'));
            newResultsArray.push(response[i0]);
        }else{
            let stringBuilder;
            let cantFilas = Object.keys(response[i0].BBDDData.rows).length;
            let cantColumnas = Object.keys(response[i0].BBDDData.metaData).length
        
            //ARMO JSON COMO STRING
            for (let i1=0 ; i1 < cantFilas ; i1++){
                stringBuilder = '{"res'+i1+'":{';
                for (let i2=0 ; i2 < cantColumnas ; i2++){
                    stringBuilder += '"'+response[i0].BBDDData.metaData[i2].name+'"';//NOMBRE DE COLUMNA
                    stringBuilder +=':"'+response[i0].BBDDData.rows[i1][i2]+'"'; //VALOR EQUIVALENTE DE FILA
                    if(i2+1 != cantColumnas){
                        stringBuilder += ','
                    }
                }
                stringBuilder += '}}';
                try{
                    newResultsArray.push(JSON.parse(stringBuilder));
                    logger.info('PROMISE-BBDD-FORMAT',stringBuilder);
                }catch(err){
                    logger.error('PROMISE-BBDD-FORMAT',err+' - Objeto push attempt'+stringBuilder);
                }
            }
        }
    }
    return newResultsArray;
  }
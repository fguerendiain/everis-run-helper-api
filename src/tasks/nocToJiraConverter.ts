import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';
import { isNullOrUndefined } from 'util';

import * as promisetools from '../tools/PromiseTools';
import * as emailtools from '../tools/EMAILTools';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
// import * as nocervices from '../externalServices/RESTService/NOCService';
// import * as gsheetservices from '../externalServices/RESTService/GSHEETService';

const TASKNAME = 'NOC TO JIRA CONVERTER'
const RESPONSABLE = 'fguerendiain33@gmail.com'

let response:express.Response;

export async function run(req: express.Request, res: express.Response){

    response = res;    

    let idJira = 'BISADE-69587';
    let serchJiraKeyWords = 'Gestion Administrativa';

    let querys = [
        await jiraservices.getJiraByText(serchJiraKeyWords).catch((err)=>logger.awaitAsyncErrorHandler(err)),
        await jiraservices.getJiraById(idJira).catch((err)=>logger.awaitAsyncErrorHandler(err)),
        await jiraservices.deleteJiraById(idJira).catch((err)=>logger.awaitAsyncErrorHandler(err))
    ];


    promisetools.handlePromises(querys,'PRUEBA: Retorno de Multiples consultas a servicios',makeItHappen);

}


//CONTROLA LA LOGICA INTEGRAL DE LA TAREA TENIENDO TODOS LOS DATOS
async function makeItHappen(result){
    if(isNullOrUndefined(result[0])){
        logger.taskEndInfo(TASKNAME);
        response.status(500).send(JSON.parse('{"statuscode":"500","message":"No se obtuvo respuesta del servicio"}'));
    }else{


        /*HACER MAGIA
            ...
        */

        await response.status(200).send(result);

        await logger.taskEndInfo(TASKNAME);

        let mailTxt = 'integracion jira noc';
        await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);
        
    }

}

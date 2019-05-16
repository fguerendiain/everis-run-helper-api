import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';
import { isNullOrUndefined } from 'util';

import * as promisetools from '../tools/PromiseTools';
import * as emailtools from '../tools/EMAILTools';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { Jira } from '../entities/Jira';
// import * as nocervices from '../externalServices/RESTService/NOCService';
// import * as gsheetservices from '../externalServices/RESTService/GSHEETService';

const TASKNAME = 'NOC TO JIRA CONVERTER'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

let response:express.Response;

export async function run(req: express.Request, res: express.Response){

    response = res;    

    let idJira = 'BISADE-48690';
    let serchJiraKeyWords = 'Gestion Administrativa';

    let querys = [
    //    await jiraservices.getJiraByText(serchJiraKeyWords).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}),
    //    await jiraservices.getJiraById(idJira).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}),
    //    await jiraservices.deleteJiraById(idJira).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}),
    //    await jiraservices.getTransicionJira(idJira).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})
    ];

    let jira1 = new Jira();
    await jira1.jiraFillTicketCreator(idJira);

    console.log("OBJETO JIRA "+jira1.getComments());
//    response.status(200).send(jira1.getDescription());

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

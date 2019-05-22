import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';
import { isNullOrUndefined } from 'util';

import * as promisetools from '../tools/PromiseTools';
import * as emailtools from '../tools/EMAILTools';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { Jira } from '../entities/Jira';
import { Noc } from '../entities/Noc';
// import * as nocervices from '../externalServices/RESTService/NOCService';
// import * as gsheetservices from '../externalServices/RESTService/GSHEETService';

const TASKNAME = 'NOC TO JIRA CONVERTER'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

let response:express.Response;

export async function run(req: express.Request, res: express.Response){

    response = res;    

    let idJira = 'BISADE-69659';
    let serchJiraKeyWords = 'Gestion Administrativa';
    let idJiraABorrar = 'BISADE-69658';

    let idNoc = '265199';

    let querys = [
    //    await jiraservices.getJiraByText(serchJiraKeyWords).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}),
        await jiraservices.getJiraById(idJira).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}),
    //    await jiraservices.deleteJiraById(idJiraABorrar).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}),
    //    await jiraservices.getTransicionJira(idJira).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})
    ];

    let jira1 = new Jira(idJira);
    await jira1.fillInstanceByJiraId();
    let noc1 = new Noc(idNoc);
    await noc1.fillInstanceByNocId();

    jira1.setWorklog(2000,'fguerend',"estoy cargando");



    noc1.setComments("Este es OTRO comentario soez");

    console.log("DESCRIPCION DE NOC: "+JSON.stringify(noc1.getComments()));

    await noc1.saveInstanceOnNoc();

    
    // await jira1.saveInstanceOnJira();

//    let jira2 = new Jira();
//    let nuevoJira = await jira2.saveInstanceOnJira();

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
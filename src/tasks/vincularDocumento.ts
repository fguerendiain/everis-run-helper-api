import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';

//Task makeer Resources
import * as promisetools from '../tools/PromiseTools';
import * as bbddtools from '../tools/BBDDtools';
import * as eeservices from '../externalServices/WSService/EEService';
import * as gedoservices from '../externalServices/WSService/GEDOService';
import * as pdiservices from '../externalServices/WSService/PDIService';
import * as buiservices from '../externalServices/RESTService/BUIService';
import * as gpservices from '../externalServices/RESTService/GPService';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
//import * as nocservices from '../externalServices/RESTService/NOCService';


const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'VINCULAR DOCUMENTO'


export async function run(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME);
     
    let queryString = 'select codexpediente from loys_man_sade.st_expediente where rownum < 2';
    let queryString1 = 'select NOMBRE_APELLIDO from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';
    let idExpTad = '1625485';
    let direccion = ['amenabar','2000'];
    let queryBuscaJira = 'Gestion Administrativa y de tareas Internas';
    let queryBuscaJiraTrans = 'BISADE-69361';

    let querys = [
            await bbddtools.BBDDData(BBDDORACLE.prd,queryString).catch((err)=>logger.awaitAsyncErrorHandler(err)),
            await bbddtools.BBDDData(BBDDORACLE.prd,queryString1).catch((err)=>logger.awaitAsyncErrorHandler(err)),
            await pdiservices.getCalleDireccionValidas(direccion[0],direccion[1]).catch((err)=>logger.awaitAsyncErrorHandler(err)),
            await gpservices.getParticipantesExpediente(idExpTad).catch((err)=>logger.awaitAsyncErrorHandler(err)),
            await jiraservices.getJiraByText(queryBuscaJira).catch((err)=>logger.awaitAsyncErrorHandler(err))
        //    await jiraservices.getTransicionJira(queryBuscaJiraTrans).catch((err)=>logger.awaitAsyncErrorHandler(err))
        ];

    promisetools.handlePromises(querys,TASKNAME,res);

    }

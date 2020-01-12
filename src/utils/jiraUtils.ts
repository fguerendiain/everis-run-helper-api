import * as express from 'express'
import * as logger from '../logger';
import * as bbddpostgres from '../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';
import * as AsiJiraService from '../externalServices/RESTService/ASIJIRAService';

const TASKNAME = 'JIRAUTILS';
const TASKLABLE = 'UTIL';

let response:express.Response;


export async function verifyVersionTag(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME + " verifyVersionTag");
    response = res;    

    let projectParam = '#'
    let moduleParam = '#';
    let versionParam = '#';

    if(!isNullOrUndefined(req.params.project)) {
        projectParam = req.params.project
    }
    if(!isNullOrUndefined(req.params.version)) {
        moduleParam = req.params.module
    }
    if(!isNullOrUndefined(req.params.version)) {
        versionParam = req.params.version
    }

    let result:{
        id: number, 
        version: string, 
    };

    let projectTagList = (await AsiJiraService.getJiraProjectTagList(projectParam).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}))

    result = {
        id : 0,
        version : 'not found'
    }

    if(!isNullOrUndefined(projectTagList)){
        for (let i = 0; i < projectTagList.length ; i++) {
            if ( ((projectTagList[i].name).toUpperCase()).includes(moduleParam.toUpperCase()) &&  
            (projectTagList[i].name).includes(versionParam)) {
                result = {
                    id : projectTagList[i].id,
                    version : projectTagList[i].name
                }
                break;
            }
        }
    }

    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME + ' verifyVersionTag');
}



export async function chekAssociatedIssuesData(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME + ' chekAssociatedIssuesData');
    response = res;    

    let projectParam:string = '#';
    let nroTicketParam: number = 0;

    let result: {
        idAsiJira:number,
        ticket:string, 
        summary:string,
        url:string,
    };

    result = {
        idAsiJira: 0,
        ticket:'#', 
        summary:'#',
        url:'#',
    };

    if(!isNullOrUndefined(req.params.project)){
        projectParam = req.params.project
    }
    if(!isNullOrUndefined(req.params.nroTicket)){
        nroTicketParam = req.params.nroTicket
    }

    let asiJiraExist = (await AsiJiraService.getJiraById(projectParam+'-'+nroTicketParam).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined}));

    if(!isNullOrUndefined(asiJiraExist)){
        if(isNullOrUndefined(asiJiraExist.errorMessages)){
            result = {
                idAsiJira: asiJiraExist.id,
                ticket: asiJiraExist.key,
                summary: asiJiraExist.fields.summary,
                url: asiJiraExist.self
            }
        }
    }

    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME + ' chekAssociatedIssuesData');

}


export async function getJiraProjectsList(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME + " getJiraProjectsList");
    response = res;    

    let result = [];

	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
    let listData = (await BBDDcheckDataBase.query(
        `SELECT id, proyecto FROM Jira_proyectos;`
        ));

    if (!isNullOrUndefined(listData)) {
        for (let i = 0; i < (<[]>listData).length; i++) {
            result.push({
                id: listData[i].id, 
                project: listData[i].proyecto
            });
        }    
    }

    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME + ' getJiraProjectsList');

}
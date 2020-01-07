import * as express from 'express'
import * as logger from '../../logger';
import * as bbddpostgres from '../../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';

const TASKNAME = 'UTILS';
const TASKLABLE = 'UTIL';

let response:express.Response;

export async function verifyVersionTag(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME);
    response = res;    

    let result:{} = null;


    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME);

}


export async function getAssociatedIssuesData(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME);
    response = res;    

    let result:{} = null;


    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME);

}
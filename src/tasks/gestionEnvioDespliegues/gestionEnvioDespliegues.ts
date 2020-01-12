import * as express from 'express'
import * as logger from '../logger';
import * as bbddpostgres from '../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';
import * as AsiJiraService from '../externalServices/RESTService/ASIJIRAService';

const TASKNAME = 'G.DESPLIEGUE';
const TASKLABLE = 'UTIL';

let response:express.Response;

export async function generarDespliegue(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME + " generarDespliegue");
    response = res;    

    let reqParam:{
        

    }

    let result:{
        
    };

	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
    let listData = (await BBDDcheckDataBase.query(
        `SELECT id, proyecto FROM Jira_proyectos;`
        ));



        
    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME + ' generarDespliegue');

}
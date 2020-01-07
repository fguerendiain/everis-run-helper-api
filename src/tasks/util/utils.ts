import * as express from 'express'
import * as logger from '../../logger';
import * as bbddpostgres from '../../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';

const TASKNAME = 'UTILS';
const TASKLABLE = 'UTIL';

let response:express.Response;

export async function getLidersPryectAndModule(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME);
    response = res;    

    let result:{} = null;

	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
	let BacklogByDate = (await BBDDcheckDataBase.query(''));


    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME);

}
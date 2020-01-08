import * as express from 'express'
import * as logger from '../../logger';
import * as bbddpostgres from '../../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';

const TASKNAME = 'UTILS';
const TASKLABLE = 'UTIL';

let response:express.Response;

export async function verifyVersionTag(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME + "verifyVersionTag");
    response = res;    

    let tagVersionParam = '';

    let result:{
        id: string, 
        version: string, 
    };

	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
    let liderData = (await BBDDcheckDataBase.query(`
    
    `
        ))[0];

    if (!isNullOrUndefined(liderData)) {
        let emailAux = '';
        let cuitAux = '';
        if(!isNullOrUndefined(liderData.mail)){
            emailAux = liderData.mail;
        }
        if(!isNullOrUndefined(liderData.nrocuit)){
            cuitAux = liderData.nrocuit;
        }
        result = {
            nombre: liderData.nombre, 
            usuario: liderData.user, 
            email: emailAux, 
            cuit: cuitAux
        }
    }

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
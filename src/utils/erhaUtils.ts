import * as express from 'express'
import * as logger from '../logger';
import * as bbddpostgres from '../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';

const TASKNAME = 'ERHAUTILS';
const TASKLABLE = 'UTIL';

let response:express.Response;

export async function getLeaderByProjectAndModule(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME + " getLeaderByProjectAndModule");
    response = res;    

    let projectParam = '';
    let moduleParam = '';

    if (!isNullOrUndefined(req.params.project)) {
        projectParam = req.params.project;
    }
    if (!isNullOrUndefined(req.params.module)) {
        moduleParam = req.params.module;
    }

    let result:{
        nombre: string, 
        usuario: string, 
        email: string, 
        cuit: string
    };

	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
    let liderData = (await BBDDcheckDataBase.query(
        `SELECT 
        ee.nombre_apellido as nombre, 
        ee.usuario as user, 
        ee.email as mail, 
        ee.cuit as nrocuit
        FROM Jira_Assignee_Mapper jam
        JOIN Jira_Componentes jc ON jam.fk_jira_comp = jc.id
        JOIN Jira_proyectos jp ON jam.fk_jira_proy = jp.id
        JOIN Jira_usuarios ju ON jam.fk_jira_usuario = ju.id
        JOIN Everis_empleados ee ON ju.fk_everis_Empleado = ee.id
        WHERE jp.proyecto = '`+projectParam.toUpperCase()+`'
        AND jc.componente = '`+moduleParam.toUpperCase()+`';`
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
    logger.taskEndInfo(TASKNAME + getLeaderByProjectAndModule);
}




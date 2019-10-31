import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';
import { isNullOrUndefined } from 'util';

import * as promisetools from '../tools/PromiseTools';
import * as emailtools from '../tools/EMAILTools';
import { AsiJira } from '../entities/AsiJira';
import { Jira } from '../entities/Jira';
import * as asijiraservices from '../externalServices/RESTService/ASIJIRAService';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { rejects } from 'assert';
// import * as nocervices from '../externalServices/RESTService/NOCService';
// import * as gsheetservices from '../externalServices/RESTService/GSHEETService';

const JIRACREDENTIALS = config.get("credentials");
const TASKNAME = 'ASIJIRA TO JIRA CONVERTER';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
const TASKLABLE = 'ASI JIRA CONVERTER';

let response:express.Response;


export async function createJirafromAsiJira(req: express.Request, res: express.Response){
	logger.taskBeginInfo(TASKNAME);
    response = res;    

/*
puntos a definir de negocio.
    -Alcance: Para que proyectos se utilizara la herramienta.
    -Que datos deben importarse en Jira interno de acuerdo a las metricas.
    -Que usuario/s se utilizaran para obtener y crear los Jiras

FALTA ARMAR LA LOGICA DE TRANSICION DE ESTADOS.    
*/

    let createdJira;
    let idJira = 'APPSADE-8525';
    let asijira = new AsiJira(idJira);
    await asijira.fillInstanceByJiraId();

    let jiraExist = await jiraservices.getJiraByText(asijira.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
    
    //SI EL ASIJIRA EXISTE EN JIRA SOLO VERIFICO EL ESTADO Y LOS COMENTARIOS
    if(jiraExist.total != 0){
        logger.info(TASKLABLE,"Inicio: Se actualiza Jira a partir de "+asijira.getSubject())
        let existingJira = new Jira(jiraExist.issues[0].key);
        await existingJira.fillInstanceByJiraId();
        
        //VERIFICO LOS COMENTARIOS
        for (let i= 0; i < asijira.getComments().length; i++){
            let v_flagAddCommentary:boolean = true;
            for (let e= 0; e < existingJira.getComments().length; e++){
                if(asijira.getComments()[i].id == (existingJira.getComments()[e].body).substr(41,6)){
                    v_flagAddCommentary = false
                }
            }
            //SI EL COMENTARIO NO EXISTE EN JIRA LO CARGO
            if(v_flagAddCommentary){
                existingJira.setComments(asijira.getComments()[i].body,asijira.getComments()[i].assignee,asijira.getComments()[i].created,asijira.getComments()[i].id);
                let newBody:string = "---------------------------\r\n\tCommentId: "+asijira.getComments()[i].id+"\r\n\t"+" CommentAssignee: "+asijira.getComments()[i].assignee+"\r\n---------------------------\r\n"+asijira.getComments()[i].body;
                await jiraservices.addJiraCommentsById(jiraExist.issues[0].id,newBody).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})                
            }
        };
        logger.info(TASKLABLE,"Fin: Se actualiza Jira a partir de "+asijira.getSubject())

    //SI EL NO EXISTE EN JIRA LO CREO CON LOS COMENTARIOS QUE TENGA
    }else{
        logger.info(TASKLABLE,"Inicio: Se crea "+asijira.getSubject()+" inexisitente en Jira")

        let newJira = new Jira();
        newJira.setSubject(asijira.getSubject());
        newJira.setDescription(asijira.getDescription());        
        newJira.setType(asijira.getType());
        newJira.setAssigne(JIRACREDENTIALS.jira.user);
        newJira.setPriroriry(asijira.getPriroriry());
        //CREO EL JIRA
        createdJira = await jiraservices.createJira(newJira).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        
        //CREO LOS COMENTARIOS
        for (let i= 0; i < asijira.getComments().length; i++){
            newJira.setComments(asijira.getComments()[i].body,asijira.getComments()[i].assignee,asijira.getComments()[i].created,asijira.getComments()[i].id);
            let newBody:string = "---------------------------\r\n\tCommentId: "+asijira.getComments()[i].id+"\r\n\t"+" CommentAssignee: "+asijira.getComments()[i].assignee+"\r\n---------------------------\r\n"+asijira.getComments()[i].body;
            await jiraservices.addJiraCommentsById(createdJira.body.id,newBody).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})                
        };
        logger.info(TASKLABLE,"Fin: Se crea "+asijira.getSubject()+" inexisitente en Jira")
    }

    await response.status(200).send(asijira);

    logger.taskEndInfo(TASKNAME);

    let mailTxt = 'Integracion ASIJira - Jira';
    await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);

}



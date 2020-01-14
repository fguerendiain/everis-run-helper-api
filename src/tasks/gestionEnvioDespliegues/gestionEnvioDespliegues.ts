import * as express from 'express'
import * as logger from '../../logger';
import * as bbddpostgres from '../../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';
import * as AsiJiraService from '../../externalServices/RESTService/ASIJIRAService';
import { AsiJira } from '../../entities/AsiJira';
import { stringify } from 'querystring';
import * as checktask from '../../tasks/checkTask';
import * as config from '../../config';
import * as emailtools from '../../tools/EMAILTools'
import { Noc } from '../../entities/Noc';

const TASKNAME = 'GENERAR DESPLIEGUE';
const TASKLABLE = 'DESPLIEGUE';
const PROCESSSTATUS = config.get("informeBacklogDiario").estadoProceso;
let response:express.Response;

export async function generarDespliegue(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME);
    response = res;    

	let processID = await checktask.saveStatus(0,TASKNAME,PROCESSSTATUS.enProgreso,'Inicia Proceso');

    let result:{
        idTarea: number,
        asiJira: string,
        asijiraUrl: string,
        noc: string,
        nocUrl: string
    }
     let ticket;

    if(req.body.environment === 'QA'){

        let asiJiraDespliegue:AsiJira = new AsiJira();

        asiJiraDespliegue.setType(req.body.issuetype);
        asiJiraDespliegue.setProject(req.body.projectAsiJiraParam);
        asiJiraDespliegue.setComponents(req.body.moduleAsiJiraParam);
        asiJiraDespliegue.setVersion(req.body.versionAsiJiraParam.id);
        asiJiraDespliegue.setSubject(req.body.summary);
        asiJiraDespliegue.setDescription(req.body.description);
        asiJiraDespliegue.setAssigne(req.body.assignee);
    
        // let createdJira = await AsiJiraService.createJira(asiJiraDespliegue).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        // if(!isNullOrUndefined(createdJira)){
        //     asiJiraDespliegue.setId(createdJira.body.key);

            asiJiraDespliegue.setId('APPSADE-10043');
            result = {
                idTarea: processID.id,
                asiJira: asiJiraDespliegue.getId(),
                asijiraUrl: 'https://asijira.buenosaires.gob.ar/browse/'+asiJiraDespliegue.getId(),
                noc: '',
                nocUrl: ''
            }
            ticket = asiJiraDespliegue.getId()
    //     }
    }else{
        //se crea NOC
        let nocDespliegue:Noc = new Noc();
        nocDespliegue.setType(req.body.issuetype);
        nocDespliegue.setProject(req.body.projectAsiJiraParam);
        nocDespliegue.setComponents(req.body.moduleAsiJiraParam);
        nocDespliegue.setVersion(req.body.versionAsiJiraParam.id);
        nocDespliegue.setSubject(req.body.summary);
        nocDespliegue.setDescription(req.body.description);
        nocDespliegue.setAssigne(req.body.assignee);

        //         ticket = 'NOC-'+createdNoc.Id;    
    }

    let stringBuilder = 
`Estimados,
Se ha generado el ${ticket} solicitando el despliegue en ${req.body.environment} de la versión ${req.body.versionAsiJiraParam.name}
${formatAsocJiraList()}
Quedamos atentos a cualquier consulta.
    
Muchas Gracias!`

    function formatAsocJiraList(){
        let asocJiraList: string = '\n';
        if(!isNullOrUndefined(req.body.associatedIssues) && req.body.associatedIssues.length > 0){
            if(req.body.associatedIssues.length > 1){
                asocJiraList = 'El mismo incluye los siguientes requerimientos:\n\n';
            }else{
                asocJiraList = 'El mismo incluye el siguiente requerimiento:\n\n';
            }
            for (let i = 0; i < req.body.associatedIssues.length; i++){
                asocJiraList += req.body.associatedIssues[i].summary+'\n';
            }
        }
        return asocJiraList;
    }



    //guardo datos en la bbdd
    // let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
    // let listData = (await BBDDcheckDataBase.query(
    //     `SELECT id, proyecto FROM Jira_proyectos;`
    //     ));

    
    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);
    await emailtools.sendByMail(req.body.mailAddress,TASKNAME,stringBuilder);
    await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.finalizado,'Proceso Finalizado',JSON.stringify(result));


    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME);

}
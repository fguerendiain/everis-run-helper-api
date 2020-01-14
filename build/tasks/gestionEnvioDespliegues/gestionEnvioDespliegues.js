"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("../../logger");
const util_1 = require("util");
const AsiJira_1 = require("../../entities/AsiJira");
const checktask = require("../../tasks/checkTask");
const config = require("../../config");
const emailtools = require("../../tools/EMAILTools");
const Noc_1 = require("../../entities/Noc");
const TASKNAME = 'GENERAR DESPLIEGUE';
const TASKLABLE = 'DESPLIEGUE';
const PROCESSSTATUS = config.get("informeBacklogDiario").estadoProceso;
let response;
function generarDespliegue(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        response = res;
        let processID = yield checktask.saveStatus(0, TASKNAME, PROCESSSTATUS.enProgreso, 'Inicia Proceso');
        let result;
        let ticket;
        if (req.body.environment === 'QA') {
            let asiJiraDespliegue = new AsiJira_1.AsiJira();
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
                asijiraUrl: 'https://asijira.buenosaires.gob.ar/browse/' + asiJiraDespliegue.getId(),
                noc: '',
                nocUrl: ''
            };
            ticket = asiJiraDespliegue.getId();
            //     }
        }
        else {
            //se crea NOC
            let nocDespliegue = new Noc_1.Noc();
            nocDespliegue.setType(req.body.issuetype);
            nocDespliegue.setProject(req.body.projectAsiJiraParam);
            nocDespliegue.setComponents(req.body.moduleAsiJiraParam);
            nocDespliegue.setVersion(req.body.versionAsiJiraParam.id);
            nocDespliegue.setSubject(req.body.summary);
            nocDespliegue.setDescription(req.body.description);
            nocDespliegue.setAssigne(req.body.assignee);
            //         ticket = 'NOC-'+createdNoc.Id;    
        }
        let stringBuilder = `Estimados,
Se ha generado el ${ticket} solicitando el despliegue en ${req.body.environment} de la versión ${req.body.versionAsiJiraParam.name}
${formatAsocJiraList()}
Quedamos atentos a cualquier consulta.
    
Muchas Gracias!`;
        function formatAsocJiraList() {
            let asocJiraList = '\n';
            if (!util_1.isNullOrUndefined(req.body.associatedIssues) && req.body.associatedIssues.length > 0) {
                if (req.body.associatedIssues.length > 1) {
                    asocJiraList = 'El mismo incluye los siguientes requerimientos:\n\n';
                }
                else {
                    asocJiraList = 'El mismo incluye el siguiente requerimiento:\n\n';
                }
                for (let i = 0; i < req.body.associatedIssues.length; i++) {
                    asocJiraList += req.body.associatedIssues[i].summary + '\n';
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
        yield response.status(200).send(result);
        yield emailtools.sendByMail(req.body.mailAddress, TASKNAME, stringBuilder);
        yield checktask.saveStatus(processID.id, TASKNAME, PROCESSSTATUS.finalizado, 'Proceso Finalizado', JSON.stringify(result));
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.generarDespliegue = generarDespliegue;
//# sourceMappingURL=gestionEnvioDespliegues.js.map
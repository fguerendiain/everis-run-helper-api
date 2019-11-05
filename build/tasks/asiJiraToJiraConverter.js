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
const config = require("../config");
const logger = require("../logger");
//import * as promisetools from '../tools/PromiseTools';
const emailtools = require("../tools/EMAILTools");
const AsiJira_1 = require("../entities/AsiJira");
const Jira_1 = require("../entities/Jira");
const jiraservices = require("../externalServices/RESTService/JIRAService");
const asijiraservices = require("../externalServices/RESTService/ASIJIRAService");
//import { rejects } from 'assert';
// import * as nocervices from '../externalServices/RESTService/NOCService';
// import * as gsheetservices from '../externalServices/RESTService/GSHEETService';
const JIRACREDENTIALS = config.get("credentials");
const TASKNAME = 'ASIJIRA TO JIRA CONVERTER';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
const TASKLABLE = 'ASI JIRA CONVERTER';
let response;
function createJirafromAsiJira(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        response = res;
        /*
        puntos a definir de negocio.
            -Alcance: Para que proyectos se utilizara la herramienta.
            -Que datos deben importarse en Jira interno de acuerdo a las metricas.
            -Que usuario/s se utilizaran para obtener y crear los Jiras
            -Definir relacion de estados cuales estados de ASIJira pasan a cerrado el Jira se utilizaron los que figuran con verde en el flow de AsiJira
        
        */
        const result = [];
        let resultCommentPrintflag = false;
        let resultStatusPrintflag = false;
        let resultCreatePrintflag = false;
        let jiraExistenteFlag;
        let asiJiraListNotEmptyFlag = false;
        let statusCloseCondition = ['Listo', 'CANCELADO', 'CERRADO', 'RECHAZADO', 'VERIFICADO', 'Implementado', 'Testing Desaprobado', 'Instalacion Cancelada QA', 'Assesment Desaprobado', 'Instalacion Cancelada HML', 'Aceptacion Usuario HML Desaprobado', 'Aceptacion Usuario PROD Desaprobado', 'Implementado en PRODUCCION', 'Inst Cancelada PROD', 'Testing Cancelado', 'Autorización Rechazada', 'IMPLEMENTADO EN PROD CON EXCEPCIÓN', 'Implementacion en Prueba', 'AUTORIZACION QA CANCELADA', 'Rechazado por Controles', 'Resolucíon'];
        let filtroAsiJira = 'project = APPSADE AND issuetype in (".ASI Bug SW", ".ASI Incidente") AND resolution = Unresolved AND component = "RIB - Registro de Identificación de Beneficiarios"';
        //BUSCO LOS ASIJIRA A IMPORTAR A PARTIR DEL FILTRO
        let asiJiraList = yield asijiraservices.getJiraByJql(filtroAsiJira).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
        //ARMO UN ARRAY CON LOS ID DE LOS ASIJIRA ENCONTRADOS
        let idJira = [];
        if (asiJiraList.total != 0) {
            for (let i = 0; i < asiJiraList.total; i++) {
                idJira.push(asiJiraList.issues[i].key);
                asiJiraListNotEmptyFlag = true;
            }
        }
        //SI EXISTEN RESULTADOS COMIENZO EL PROCESO
        if (asiJiraListNotEmptyFlag) {
            for (let nro = 0; nro < idJira.length; nro++) {
                let jira;
                let asijira = new AsiJira_1.AsiJira(idJira[nro]);
                yield asijira.fillInstanceByJiraId();
                let jiraExist = yield jiraservices.getJiraByText(asijira.getId()).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
                let createdJira;
                let jiraExistente = null;
                jiraExistenteFlag = false;
                resultCommentPrintflag = false;
                resultStatusPrintflag = false;
                resultCreatePrintflag = false;
                //SI ENCUENTRA MAS DE UN JIRA CREADO VALIDO QUE SE TRATE DEL ASIJIRA BUSCADO
                if (jiraExist.total != 0) {
                    for (let i = 0; i < jiraExist.total; i++) {
                        let summaryToCompare = jiraExist.issues[i].fields.summary;
                        if (summaryToCompare.substr(0, asijira.getId().length) == asijira.getId()) {
                            jiraExistente = jiraExist.issues[i];
                            jiraExistenteFlag = true;
                        }
                    }
                }
                //SI EL ASIJIRA EXISTE EN JIRA SOLO VERIFICO EL ESTADO Y LOS COMENTARIOS
                if (jiraExistenteFlag) {
                    logger.info(TASKLABLE, "Inicio: Se actualiza Jira a partir de " + asijira.getSubject());
                    jira = new Jira_1.Jira(jiraExistente.key);
                    yield jira.fillInstanceByJiraId();
                    //VERIFICO LOS COMENTARIOS
                    for (let i = 0; i < asijira.getComments().length; i++) {
                        let v_flagAddCommentary = true;
                        for (let e = 0; e < jira.getComments().length; e++) {
                            if (asijira.getComments()[i].id == (jira.getComments()[e].body).substr(41, asijira.getComments()[i].id)) {
                                v_flagAddCommentary = false;
                            }
                        }
                        //SI EL COMENTARIO NO EXISTE EN JIRA LO CARGO
                        if (v_flagAddCommentary) {
                            resultCommentPrintflag = true;
                            jira.setComments(asijira.getComments()[i].body, asijira.getComments()[i].assignee, asijira.getComments()[i].created, asijira.getComments()[i].id);
                            let newBody = "---------------------------\r\n\tCommentId: " + asijira.getComments()[i].id + "\r\n\t" + " CommentAssignee: " + asijira.getComments()[i].assignee + "\r\n---------------------------\r\n" + asijira.getComments()[i].body;
                            yield jiraservices.addJiraCommentsById(jiraExistente.id, newBody).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
                        }
                    }
                    ;
                    //CIERRO EL JIRA EN CASO QUE CORRESPONDA POR CAMBIO DE ESTADO DE ASIJIRA
                    if (jira.getStatus() != 'Cerrada') {
                        let changeStatusflag = false;
                        //COMPARO ESTADOS
                        statusCloseCondition.forEach((closingStatus) => {
                            if (asijira.getStatus().includes(closingStatus)) {
                                changeStatusflag = true;
                            }
                        });
                        if (changeStatusflag) {
                            //CIERRO JIRA
                            resultStatusPrintflag = true;
                            jira.setStatus('Cerrada');
                            let closeMessage = 'Se cierra Jira por cambio de estado de ' + asijira.getId() + ' a "' + asijira.getStatus() + '"';
                            yield jiraservices.setTransicionJira(jiraExistente.id, closeMessage, '21').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
                        }
                    }
                    logger.info(TASKLABLE, "Fin: Se actualiza Jira: " + jira.getId() + " a partir de AsiJira: " + asijira.getId());
                    //SI NO EXISTE EN JIRA LO CREO CON LOS COMENTARIOS QUE TENGA
                }
                else {
                    logger.info(TASKLABLE, "Inicio: Se crea " + asijira.getSubject() + " inexisitente en Jira");
                    jira = new Jira_1.Jira();
                    jira.setSubject(asijira.getSubject());
                    jira.setDescription(asijira.getDescription());
                    jira.setType(asijira.getType());
                    jira.setAssigne(JIRACREDENTIALS.jira.user);
                    jira.setPriroriry(asijira.getPriroriry());
                    jira.setLabels(asijira.getProject());
                    //CREO EL JIRA
                    createdJira = yield jiraservices.createJira(jira).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
                    resultCreatePrintflag = true;
                    jira.setId(createdJira.body.key);
                    //CREO LOS COMENTARIOS
                    for (let i = 0; i < asijira.getComments().length; i++) {
                        jira.setComments(asijira.getComments()[i].body, asijira.getComments()[i].assignee, asijira.getComments()[i].created, asijira.getComments()[i].id);
                        let newBody = "---------------------------\r\n\tCommentId: " + asijira.getComments()[i].id + "\r\n\t" + " CommentAssignee: " + asijira.getComments()[i].assignee + "\r\n---------------------------\r\n" + asijira.getComments()[i].body;
                        yield jiraservices.addJiraCommentsById(createdJira.body.id, newBody).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
                    }
                    ;
                    logger.info(TASKLABLE, "Fin: Se crea Jira: " + jira.getId() + " a partir de AsiJira: " + asijira.getId());
                }
                //ARMO EL JSON PARA EL RESPONSE CON LA DATA DE LOS JIRA PROCESADOS
                if (resultCommentPrintflag || resultStatusPrintflag || resultCreatePrintflag) {
                    let process = {};
                    process.jiraID = jira.getId();
                    process.asiJiraID = asijira.getId();
                    if (resultCreatePrintflag) {
                        process.create = "Se crea Jira " + jira.getId() + " a partir de " + asijira.getId();
                    }
                    if (resultCommentPrintflag) {
                        process.modifComment = "Se actualizaron comentarios";
                    }
                    if (resultStatusPrintflag) {
                        process.modifStatus = 'Cambio de estado a ' + jira.getStatus();
                    }
                    result.push(process);
                }
            }
        }
        yield response.status(200).send(result);
        logger.taskEndInfo(TASKNAME);
        let mailTxt = 'Integracion ASIJira - Jira';
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
    });
}
exports.createJirafromAsiJira = createJirafromAsiJira;
//# sourceMappingURL=asiJiraToJiraConverter.js.map
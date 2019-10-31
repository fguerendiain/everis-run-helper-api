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
const emailtools = require("../tools/EMAILTools");
const AsiJira_1 = require("../entities/AsiJira");
const Jira_1 = require("../entities/Jira");
const jiraservices = require("../externalServices/RESTService/JIRAService");
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
        
        FALTA ARMAR LA LOGICA DE TRANSICION DE ESTADOS.
        */
        let createdJira;
        let idJira = 'APPSADE-8525';
        let asijira = new AsiJira_1.AsiJira(idJira);
        yield asijira.fillInstanceByJiraId();
        let jiraExist = yield jiraservices.getJiraByText(asijira.getId()).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
        //SI EL ASIJIRA EXISTE EN JIRA SOLO VERIFICO EL ESTADO Y LOS COMENTARIOS
        if (jiraExist.total != 0) {
            logger.info(TASKLABLE, "Inicio: Se actualiza Jira a partir de " + asijira.getSubject());
            let existingJira = new Jira_1.Jira(jiraExist.issues[0].key);
            yield existingJira.fillInstanceByJiraId();
            //VERIFICO LOS COMENTARIOS
            for (let i = 0; i < asijira.getComments().length; i++) {
                let v_flagAddCommentary = true;
                for (let e = 0; e < existingJira.getComments().length; e++) {
                    if (asijira.getComments()[i].id == (existingJira.getComments()[e].body).substr(41, 6)) {
                        v_flagAddCommentary = false;
                    }
                }
                //SI EL COMENTARIO NO EXISTE EN JIRA LO CARGO
                if (v_flagAddCommentary) {
                    existingJira.setComments(asijira.getComments()[i].body, asijira.getComments()[i].assignee, asijira.getComments()[i].created, asijira.getComments()[i].id);
                    let newBody = "---------------------------\r\n\tCommentId: " + asijira.getComments()[i].id + "\r\n\t" + " CommentAssignee: " + asijira.getComments()[i].assignee + "\r\n---------------------------\r\n" + asijira.getComments()[i].body;
                    yield jiraservices.addJiraCommentsById(jiraExist.issues[0].id, newBody).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
                }
            }
            ;
            logger.info(TASKLABLE, "Fin: Se actualiza Jira a partir de " + asijira.getSubject());
            //SI EL NO EXISTE EN JIRA LO CREO CON LOS COMENTARIOS QUE TENGA
        }
        else {
            logger.info(TASKLABLE, "Inicio: Se crea " + asijira.getSubject() + " inexisitente en Jira");
            let newJira = new Jira_1.Jira();
            newJira.setSubject(asijira.getSubject());
            newJira.setDescription(asijira.getDescription());
            newJira.setType(asijira.getType());
            newJira.setAssigne(JIRACREDENTIALS.jira.user);
            newJira.setPriroriry(asijira.getPriroriry());
            //CREO EL JIRA
            createdJira = yield jiraservices.createJira(newJira).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            //CREO LOS COMENTARIOS
            for (let i = 0; i < asijira.getComments().length; i++) {
                newJira.setComments(asijira.getComments()[i].body, asijira.getComments()[i].assignee, asijira.getComments()[i].created, asijira.getComments()[i].id);
                let newBody = "---------------------------\r\n\tCommentId: " + asijira.getComments()[i].id + "\r\n\t" + " CommentAssignee: " + asijira.getComments()[i].assignee + "\r\n---------------------------\r\n" + asijira.getComments()[i].body;
                yield jiraservices.addJiraCommentsById(createdJira.body.id, newBody).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            }
            ;
            logger.info(TASKLABLE, "Fin: Se crea " + asijira.getSubject() + " inexisitente en Jira");
        }
        yield response.status(200).send(asijira);
        logger.taskEndInfo(TASKNAME);
        let mailTxt = 'Integracion ASIJira - Jira';
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
    });
}
exports.createJirafromAsiJira = createJirafromAsiJira;
//# sourceMappingURL=asiJiraToJiraConverter.js.map
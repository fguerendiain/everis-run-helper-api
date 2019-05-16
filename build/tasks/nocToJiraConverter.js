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
const logger = require("../logger");
const util_1 = require("util");
const emailtools = require("../tools/EMAILTools");
const Jira_1 = require("../entities/Jira");
// import * as nocervices from '../externalServices/RESTService/NOCService';
// import * as gsheetservices from '../externalServices/RESTService/GSHEETService';
const TASKNAME = 'NOC TO JIRA CONVERTER';
const RESPONSABLE = 'fguerendiain33@gmail.com';
let response;
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response = res;
        let idJira = 'BISADE-48690';
        let serchJiraKeyWords = 'Gestion Administrativa';
        let querys = [
        //        await jiraservices.getJiraByText(serchJiraKeyWords).catch((err)=>logger.awaitAsyncErrorHandler(err)),
        //    await jiraservices.getJiraById(idJira).catch((err)=>logger.awaitAsyncErrorHandler(err)),
        //    await jiraservices.deleteJiraById(idJira).catch((err)=>logger.awaitAsyncErrorHandler(err))
        //      await jiraservices.getTransicionJira(idJira).catch((err)=>logger.awaitAsyncErrorHandler(err))
        ];
        let jira1 = new Jira_1.Jira();
        yield jira1.jiraFillTicketCreator(idJira);
        console.log("OBJETO JIRA " + jira1.getDescription());
        response.status(200).send(jira1.getDescription());
        //    promisetools.handlePromises(querys,'PRUEBA: Retorno de Multiples consultas a servicios',makeItHappen);
    });
}
exports.run = run;
//CONTROLA LA LOGICA INTEGRAL DE LA TAREA TENIENDO TODOS LOS DATOS
function makeItHappen(result) {
    return __awaiter(this, void 0, void 0, function* () {
        if (util_1.isNullOrUndefined(result[0])) {
            logger.taskEndInfo(TASKNAME);
            response.status(500).send(JSON.parse('{"statuscode":"500","message":"No se obtuvo respuesta del servicio"}'));
        }
        else {
            /*HACER MAGIA
                ...
            */
            yield response.status(200).send(result);
            yield logger.taskEndInfo(TASKNAME);
            let mailTxt = 'integracion jira noc';
            yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
        }
    });
}
//# sourceMappingURL=nocToJiraConverter.js.map
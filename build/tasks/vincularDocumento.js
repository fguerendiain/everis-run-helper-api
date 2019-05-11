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
//Task makeer Resources
const promisetools = require("../tools/PromiseTools");
const bbddtools = require("../tools/BBDDtools");
const pdiservices = require("../externalServices/WSService/PDIService");
const gpservices = require("../externalServices/RESTService/GPService");
const jiraservices = require("../externalServices/RESTService/JIRAService");
//import * as nocservices from '../externalServices/RESTService/NOCService';
const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'VINCULAR DOCUMENTO';
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        let queryString = 'select codexpediente from loys_man_sade.st_expediente where rownum < 2';
        let queryString1 = 'select NOMBRE_APELLIDO from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';
        let idExpTad = '1625485';
        let direccion = ['amenabar', '2000'];
        let queryBuscaJira = 'Gestion Administrativa y de tareas Internas';
        let queryBuscaJiraTrans = 'BISADE-69361';
        let querys = [
            yield bbddtools.BBDDData(BBDDORACLE.prd, queryString).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield bbddtools.BBDDData(BBDDORACLE.prd, queryString1).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield pdiservices.getCalleDireccionValidas(direccion[0], direccion[1]).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield gpservices.getParticipantesExpediente(idExpTad).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield jiraservices.getJiraByText(queryBuscaJira).catch((err) => logger.awaitAsyncErrorHandler(err))
            //    await jiraservices.getTransicionJira(queryBuscaJiraTrans).catch((err)=>logger.awaitAsyncErrorHandler(err))
        ];
        promisetools.handlePromises(querys, TASKNAME, res);
    });
}
exports.run = run;
//# sourceMappingURL=vincularDocumento.js.map
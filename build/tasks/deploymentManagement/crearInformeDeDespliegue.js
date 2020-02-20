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
const AsiJiraService = require("../../externalServices/RESTService/ASIJIRAService");
const TASKNAME = 'UTILS';
const TASKLABLE = 'UTIL';
let response;
function verifyVersionTag(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME + "verifyVersionTag");
        response = res;
        let projectParam = '#';
        let moduleParam = '#';
        let versionParam = '#';
        if (!util_1.isNullOrUndefined(req.params.project)) {
            projectParam = req.params.project;
        }
        if (!util_1.isNullOrUndefined(req.params.version)) {
            moduleParam = req.params.module;
        }
        if (!util_1.isNullOrUndefined(req.params.version)) {
            versionParam = req.params.version;
        }
        let result;
        let projectTagList = (yield AsiJiraService.getJiraProjectTagList(projectParam).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; }));
        result = {
            id: 0,
            version: 'not found'
        };
        if (!util_1.isNullOrUndefined(projectTagList)) {
            for (let i = 0; i < projectTagList.length; i++) {
                if (((projectTagList[i].name).toUpperCase()).includes(moduleParam.toUpperCase()) &&
                    (projectTagList[i].name).includes(versionParam)) {
                    result = {
                        id: projectTagList[i].id,
                        version: projectTagList[i].name
                    };
                    break;
                }
            }
        }
        //SE ENVIA RESPUESTA AL CLIENTE
        yield response.status(200).send(result);
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.verifyVersionTag = verifyVersionTag;
function chekAssociatedIssuesData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        response = res;
        let projectParam = '#';
        let nroTicketParam = 0;
        let result;
        result = {
            idAsiJira: 0,
            ticket: '#',
            summary: '#',
            url: '#',
        };
        if (!util_1.isNullOrUndefined(req.params.project)) {
            projectParam = req.params.project;
        }
        if (!util_1.isNullOrUndefined(req.params.nroTicket)) {
            nroTicketParam = req.params.nroTicket;
        }
        let asiJiraExist = (yield AsiJiraService.getJiraById(projectParam + '-' + nroTicketParam).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; }));
        console.log(asiJiraExist);
        if (!util_1.isNullOrUndefined(asiJiraExist)) {
            if (util_1.isNullOrUndefined(asiJiraExist.errorMessages)) {
                result = {
                    idAsiJira: asiJiraExist.id,
                    ticket: asiJiraExist.key,
                    summary: asiJiraExist.fields.summary,
                    url: asiJiraExist.self
                };
            }
        }
        //SE ENVIA RESPUESTA AL CLIENTE
        yield response.status(200).send(result);
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.chekAssociatedIssuesData = chekAssociatedIssuesData;
//# sourceMappingURL=crearInformeDeDespliegue.js.map
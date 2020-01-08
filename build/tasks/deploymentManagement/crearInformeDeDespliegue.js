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
const TASKNAME = 'UTILS';
const TASKLABLE = 'UTIL';
let response;
function verifyVersionTag(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        response = res;
        let result = null;
        //SE ENVIA RESPUESTA AL CLIENTE
        yield response.status(200).send(result);
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.verifyVersionTag = verifyVersionTag;
function getAssociatedIssuesData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        response = res;
        let result = null;
        //SE ENVIA RESPUESTA AL CLIENTE
        yield response.status(200).send(result);
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.getAssociatedIssuesData = getAssociatedIssuesData;
//# sourceMappingURL=crearInformeDeDespliegue.js.map
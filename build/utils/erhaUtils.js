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
const bbddpostgres = require("../entities/BBDDPostgres");
const util_1 = require("util");
const TASKNAME = 'UTILS';
const TASKLABLE = 'UTIL';
let response;
function getLeaderByProjectAndModule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME + "getLeaderByProjectAndModule");
        response = res;
        let projectParam = '';
        let moduleParam = '';
        if (!util_1.isNullOrUndefined(req.params.project)) {
            projectParam = req.params.project;
        }
        if (!util_1.isNullOrUndefined(req.params.module)) {
            moduleParam = req.params.module;
        }
        let result;
        let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        let liderData = (yield BBDDcheckDataBase.query(`SELECT 
        ee.nombre_apellido as nombre, 
        ee.usuario as user, 
        ee.email as mail, 
        ee.cuit as nrocuit
        FROM Jira_Assignee_Mapper jam
        JOIN Jira_Componentes jc ON jam.fk_jira_comp = jc.id
        JOIN Jira_proyectos jp ON jam.fk_jira_proy = jp.id
        JOIN Jira_usuarios ju ON jam.fk_jira_usuario = ju.id
        JOIN Everis_empleados ee ON ju.fk_everis_Empleado = ee.id
        WHERE jp.proyecto = '` + projectParam.toUpperCase() + `'
        AND jc.componente = '` + moduleParam.toUpperCase() + `';`))[0];
        if (!util_1.isNullOrUndefined(liderData)) {
            let emailAux = '';
            let cuitAux = '';
            if (!util_1.isNullOrUndefined(liderData.mail)) {
                emailAux = liderData.mail;
            }
            if (!util_1.isNullOrUndefined(liderData.nrocuit)) {
                cuitAux = liderData.nrocuit;
            }
            result = {
                nombre: liderData.nombre,
                usuario: liderData.user,
                email: emailAux,
                cuit: cuitAux
            };
        }
        //SE ENVIA RESPUESTA AL CLIENTE
        yield response.status(200).send(result);
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.getLeaderByProjectAndModule = getLeaderByProjectAndModule;
//# sourceMappingURL=erhaUtils.js.map
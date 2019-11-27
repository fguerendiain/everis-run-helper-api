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
const TASKNAME = 'CHECK TASK PROGRESS';
const TASKLABLE = 'CHECKPROGRESS';
let response;
function checkTaskProcessStatusById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        response = res;
        let result = null;
        //VALIDO COMPATIBILIDAD DEL DATO PASADO POR PARAMETRO
        let regexp = new RegExp('^[0-9]+$');
        if (regexp.test(req.params.id)) {
            //OBTENGO DATOS DE LA BBDD DEL ID PASADO POR PARAMETRO
            let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
            yield BBDDcheckDataBase.query('SELECT * FROM "TASK_PROCESS_AUD" WHERE "ID" = ' + req.params.id + ';')
                .then((selctResult) => {
                if (!util_1.isNullOrUndefined(selctResult[0])) {
                    //ARMO LA RESPUESTA CON LOS DATOS
                    let auxResponse;
                    try {
                        auxResponse = JSON.parse(selctResult[0].RESPUESTA);
                    }
                    catch (_a) {
                        auxResponse = selctResult[0].RESPUESTA;
                    }
                    result = {
                        idProcess: selctResult[0].ID,
                        task: selctResult[0].TASK,
                        status: selctResult[0].ESTADO,
                        detail: selctResult[0].DETALLE,
                        create: selctResult[0].FECHA_INICIO,
                        update: selctResult[0].FECHA_ACTUALIZACION,
                        response: auxResponse
                    };
                }
                else {
                    result = { id: req.params.id, error: 'No existe registro para el ID indicado' };
                }
            });
        }
        else {
            result = { id: req.params.id, error: 'El ID indicado no es valido' };
        }
        //SE ENVIA RESPUESTA AL CLIENTE
        yield response.status(200).send(result);
        logger.info(TASKLABLE, JSON.stringify(result));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.checkTaskProcessStatusById = checkTaskProcessStatusById;
//METODO PARA CREAR O MODIFICAR UN ESTADO DE TAREA
function saveStatus(processID, taskName, status, detail, response) {
    return __awaiter(this, void 0, void 0, function* () {
        let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        if (util_1.isNullOrUndefined(response)) {
            response = 'Pendiente';
        }
        //SI NO SE DETERMINA UN ID VALIDO EN EL METODO SE CREA UN NUEVO REGISTRO
        if (processID == 0 || util_1.isNullOrUndefined(processID)) {
            return yield BBDDcheckDataBase.query('INSERT INTO "TASK_PROCESS_AUD"("ID", "TASK", "ESTADO", "DETALLE", "RESPUESTA","FECHA_INICIO","FECHA_ACTUALIZACION") VALUES ((SELECT MAX("ID")+1 FROM "TASK_PROCESS_AUD"),\'' + taskName + '\',\'' + status + '\',\'' + detail + '\',\'' + response + '\',now(),now()) returning "ID";')
                .then((query) => {
                return { id: query[0].ID, task: taskName };
            });
        }
        else {
            //SE MODIFICA REGISTRO EXISTENTE
            BBDDcheckDataBase.query('UPDATE "TASK_PROCESS_AUD" SET "ESTADO" = \'' + status + '\',"DETALLE"=\'' + detail + '\', "RESPUESTA"=\'' + response + '\',"FECHA_ACTUALIZACION" = now() WHERE "ID" = ' + processID + ';');
            return { id: processID, task: taskName };
        }
    });
}
exports.saveStatus = saveStatus;
//# sourceMappingURL=checkTask.js.map
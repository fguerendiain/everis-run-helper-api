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
const Noc_1 = require("../entities/Noc");
const logger = require("../logger");
const emailtools = require("../tools/EMAILTools");
const nocservices = require("../externalServices/RESTService/NOCService");
const jiraservices = require("../externalServices/RESTService/JIRAService");
const priorizadosupdate = require("../tasks/priorizadosUpdate");
const moment = require("moment");
const bbddpostgres = require("../entities/BBDDPostgres");
const util_1 = require("util");
const checktask = require("./checkTask");
const config = require("../config");
const TASKNAME = 'INFORME BACKLOG DIARIO';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
const PROCESSSTATUS = config.get("informeBacklogDiario").estadoProceso;
//GENERAR EL INFORME DE BACKLOG
function backlogDiario(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        let date = moment().subtract(1, 'days').format('YYYYMMDD');
        let save = false;
        let processID = yield checktask.saveStatus(0, TASKNAME, PROCESSSTATUS.enProgreso, 'Inicia Proceso');
        yield res.status(200).send(processID);
        //si el metodo es POST graba el backlog en la BBDD a menos que ya exista
        if (req.method == 'POST') {
            save = true;
            let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
            let backlogExistOnBBDD = (yield BBDDcheckDataBase.query('select count(*) FROM "BACKLOG" WHERE "FECHA" = ' + "'" + date + "'" + ';'))[0].count;
            if (backlogExistOnBBDD != 0) {
                let mailTxt = 'el backlog ya existe para la fecha indicada';
                yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
                yield res.status(200).send('{"message":"' + mailTxt + '"}');
                logger.taskEndInfo(TASKNAME);
                return;
            }
        }
        let nocsArray = new Array;
        let modulesArrayAll = new Array;
        let modulesArray = new Array;
        let datosUltimos6DiasArray = new Array;
        //contadores
        let countBacklogPriorizadoUrgente = 0;
        let countBacklogPriorizadoAlta = 0;
        let countBacklogPriorizadoBaja = 0;
        let countDistribucionModuloPrd = 0;
        let countDistribucionModuloHml = 0;
        let countDistribucionModuloCapa = 0;
        let distribucionModulo = new Array();
        //obtengo listado de nocs desde el servidor de noc
        let queryNocsIdEnBandeja = ((yield nocservices.getNocByFilter().catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).operation.details);
        //obtengo listado de JIRAS creados el dia anterior al actual
        let queryJIRACreados = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Open, "In Progress", Paused) AND created >= -1d AND created <= 0d').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //obtengo listado de JIRAS solucionados el dia anterior al actual
        let queryJIRAResueltos = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Resolved, Closed) AND resolved >= -1d AND resolved <= -0d').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //obtengo listado de JIRAS con reopen en 1 modificados el dia anterior al actual
        let queryJIRAReOpen = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Open, "In Progress", Paused) AND "Reopen Counter" = "1" AND updated >= -1d AND updated <= 0d').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //Obtengo listado de JIRAS correspondientes a regulatorios repetitivos
        let quwryJIRARepetitivos = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = REGULATORIO AND status in (Open, "In Progress")').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        if (util_1.isNullOrUndefined(queryNocsIdEnBandeja)) {
            let mailTxt = 'error de servicio externo al obtener Tickets en bandeja';
            yield emailtools.sendByMail(RESPONSABLE, 'Error: ' + TASKNAME, mailTxt);
            logger.taskEndInfo(TASKNAME);
            return;
        }
        if (util_1.isNullOrUndefined(queryJIRACreados)) {
            let mailTxt = 'error de servicio externo al obtener Tickets creados';
            yield emailtools.sendByMail(RESPONSABLE, 'Error: ' + TASKNAME, mailTxt);
            logger.taskEndInfo(TASKNAME);
            return;
        }
        if (util_1.isNullOrUndefined(queryJIRAResueltos)) {
            let mailTxt = 'error de servicio externo al obtener Tickets resueltos';
            yield emailtools.sendByMail(RESPONSABLE, 'Error: ' + TASKNAME, mailTxt);
            logger.taskEndInfo(TASKNAME);
            return;
        }
        if (util_1.isNullOrUndefined(queryJIRAReOpen)) {
            let mailTxt = 'error de servicio externo al obtener Tickets reabiertos';
            yield emailtools.sendByMail(RESPONSABLE, 'Error: ' + TASKNAME, mailTxt);
            logger.taskEndInfo(TASKNAME);
            return;
        }
        if (util_1.isNullOrUndefined(quwryJIRARepetitivos)) {
            let mailTxt = 'error de servicio externo al obtener Tickets repetitivos';
            yield checktask.saveStatus(processID.id, TASKNAME, PROCESSSTATUS.error, mailTxt);
            yield emailtools.sendByMail(RESPONSABLE, 'Error: ' + TASKNAME, mailTxt);
            logger.taskEndInfo(TASKNAME);
            return;
        }
        //genero un array de objetos noc
        for (let i = 0; i < queryNocsIdEnBandeja.length; i++) {
            let auxNocInsatnce;
            auxNocInsatnce = new Noc_1.Noc(queryNocsIdEnBandeja[i]['WORKORDERID']);
            yield auxNocInsatnce.fillInstanceByNocId();
            nocsArray.push(auxNocInsatnce);
        }
        //recorro el listado de nocs para llenar contar prioridades y entornos
        for (let i = 0; i < nocsArray.length; i++) {
            if (util_1.isNullOrUndefined(nocsArray[i].getPriroriry())) {
                countBacklogPriorizadoUrgente++;
            }
            else {
                let stringSubject = nocsArray[i].getPriroriry();
                if (stringSubject.includes("Alta")) {
                    countBacklogPriorizadoUrgente++;
                }
                else if (stringSubject.includes("Media")) {
                    countBacklogPriorizadoAlta++;
                }
                else if (stringSubject.includes("Baja")) {
                    countBacklogPriorizadoBaja++;
                }
                else {
                    countBacklogPriorizadoUrgente++;
                }
            }
            //armo un array auxiliar con los modulos
            modulesArrayAll.push(nocsArray[i].getSubCategoria());
        }
        //genero el listado unico de modulos
        modulesArray = modulesArrayAll.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        //recorro el listado de modulos para contar insidencias desglozando por ambientes
        //armo todo en un JSON como string
        let v_saveBacklogBBDDQueryDistrinucion;
        for (let i = 0; i < modulesArray.length; i++) {
            for (let a = 0; a < nocsArray.length; a++) {
                if (nocsArray[a].getSubCategoria() == modulesArray[i]) {
                    let stringSubject = nocsArray[a].getSubject();
                    if (stringSubject.includes("PRD")) {
                        countDistribucionModuloPrd++;
                    }
                    else if (stringSubject.includes("HML")) {
                        countDistribucionModuloHml++;
                    }
                    else if (stringSubject.includes("CAPA")) {
                        countDistribucionModuloCapa++;
                    }
                    else {
                        countDistribucionModuloPrd++;
                    }
                }
            }
            let distribucionModuloToJSON = {
                "module": modulesArray[i],
                "prd": countDistribucionModuloPrd,
                "hml": countDistribucionModuloHml,
                "capa": countDistribucionModuloCapa
            };
            if (save) {
                let totalPorModulo = countDistribucionModuloPrd + countDistribucionModuloHml + countDistribucionModuloCapa;
                //INSERTAR LOS DATOS EN LA BBDD	
                v_saveBacklogBBDDQueryDistrinucion = 'INSERT INTO "BACKLOG_DISTRIBUCION"("FECHA","MODULO","CANT_PRD","CANT_HML", "CANT_CAPA","TOTAL")	VALUES (';
                v_saveBacklogBBDDQueryDistrinucion += /*FECHA*/ date + ",";
                v_saveBacklogBBDDQueryDistrinucion += /*MODULO*/ "'" + modulesArray[i] + "',";
                v_saveBacklogBBDDQueryDistrinucion += /*CANT_PRD*/ countDistribucionModuloPrd + ',';
                v_saveBacklogBBDDQueryDistrinucion += /*CANT_HML*/ countDistribucionModuloHml + ',';
                v_saveBacklogBBDDQueryDistrinucion += /*CANT_CAPA*/ countDistribucionModuloCapa + ',';
                v_saveBacklogBBDDQueryDistrinucion += /*TOTAL*/ totalPorModulo + ");";
                //inserto distribucion por modulos
                yield new bbddpostgres.BBDDconect().query(v_saveBacklogBBDDQueryDistrinucion);
            }
            distribucionModulo.push(distribucionModuloToJSON);
            countDistribucionModuloPrd = 0;
            countDistribucionModuloHml = 0;
            countDistribucionModuloCapa = 0;
        }
        let priorizadosPorRegistro = yield priorizadosupdate.getAllPriorizadosByDay(date);
        if (save) {
            //INSERTAR LOS DATOS EN LA BBDD	
            let v_saveBacklogBBDDQuery;
            v_saveBacklogBBDDQuery = 'INSERT INTO "BACKLOG"("FECHA","PRIORIZADO_BAJA","PRIORIZADO_ALTA","PRIORIZADO_URGENTE", "CREADAS","RESUELTAS","PRIORIZADO_PORCENTUAL_BAJA","PRIORIZADO_PORCENTUAL_ALTA",';
            v_saveBacklogBBDDQuery += '"PRIORIZADO_PORCENTUAL_URGENTE","REABIERTOS","RESUMEN_PRIORIZADOS","RESUMEN_REPETITIVOS","RESUMEN_TOTAL_PENDIENTES","DISTRIBUCION")	VALUES (';
            v_saveBacklogBBDDQuery += /*FECHA*/ date + ',';
            v_saveBacklogBBDDQuery += /*PRIORIZADO_BAJA*/ countBacklogPriorizadoBaja + ',';
            v_saveBacklogBBDDQuery += /*PRIORIZADO_ALTA*/ countBacklogPriorizadoAlta + ',';
            v_saveBacklogBBDDQuery += /*PRIORIZADO_URGENTE*/ countBacklogPriorizadoUrgente + ',';
            v_saveBacklogBBDDQuery += /*CREADAS*/ queryJIRACreados + ',';
            v_saveBacklogBBDDQuery += /*RESUELTAS*/ queryJIRAResueltos + ',';
            v_saveBacklogBBDDQuery += /*PRIORIZADO_PORCENTUAL_BAJA*/ ((countBacklogPriorizadoBaja / queryNocsIdEnBandeja.length).toFixed(2)) + ',';
            v_saveBacklogBBDDQuery += /*PRIORIZADO_PORCENTUAL_ALTA*/ ((countBacklogPriorizadoAlta / queryNocsIdEnBandeja.length).toFixed(2)) + ',';
            v_saveBacklogBBDDQuery += /*PRIORIZADO_PORCENTUAL_URGENTE*/ ((countBacklogPriorizadoUrgente / queryNocsIdEnBandeja.length).toFixed(2)) + ',';
            v_saveBacklogBBDDQuery += /*REABIERTOS*/ queryJIRAReOpen + ',';
            v_saveBacklogBBDDQuery += /*RESUMEN_PRIORIZADOS*/ priorizadosPorRegistro.length + ',';
            v_saveBacklogBBDDQuery += /*RESUMEN_REPETITIVOS*/ quwryJIRARepetitivos + ',';
            v_saveBacklogBBDDQuery += /*RESUMEN_TOTAL_PENDIENTES*/ queryNocsIdEnBandeja.length + ',';
            v_saveBacklogBBDDQuery += /*DISTRIBUCION*/ "'" + JSON.stringify(distribucionModulo) + "');";
            //si no existen registros de backlog para la fecha lo inserto en la BBDD
            let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
            let backlogExistOnBBDD = (yield BBDDcheckDataBase.query('select count(*) FROM "BACKLOG" WHERE "FECHA" = ' + "'" + date + "'" + ';'))[0].count;
            if (backlogExistOnBBDD == 0) {
                let BBDDinsertBacklog = new bbddpostgres.BBDDconect();
                yield BBDDinsertBacklog.query(v_saveBacklogBBDDQuery);
            }
        }
        //Obtengo la informacion de los campos con historial para los ultimos 6 dias
        let BBDDBacklogLastDays = new bbddpostgres.BBDDconect();
        let backlogLastDays = yield BBDDBacklogLastDays.query('SELECT "FECHA", "CREADAS", "RESUELTAS", "PRIORIZADO_PORCENTUAL_BAJA","PRIORIZADO_PORCENTUAL_ALTA","PRIORIZADO_PORCENTUAL_URGENTE","REABIERTOS"FROM "BACKLOG" ORDER BY "FECHA" desc LIMIT 6;');
        let datosUltimos6Dias;
        if (!save) {
            datosUltimos6Dias = {
                "fecha": date,
                "reaperturas": queryJIRAReOpen,
                "creadas": queryJIRACreados,
                "resueltas": queryJIRAResueltos,
                "urgentePriorizadoPorcentaje": ((countBacklogPriorizadoUrgente / queryNocsIdEnBandeja.length).toFixed(2)),
                "altaPriorizadoPorcentaje": ((countBacklogPriorizadoAlta / queryNocsIdEnBandeja.length).toFixed(2)),
                "bajaPriorizadoPorcentaje": ((countBacklogPriorizadoBaja / queryNocsIdEnBandeja.length).toFixed(2))
            };
            datosUltimos6DiasArray.push(datosUltimos6Dias);
        }
        //armo el JSON
        for (let i = 0; i < backlogLastDays.length; i++) {
            datosUltimos6Dias = {
                "fecha": backlogLastDays[i].FECHA,
                "reaperturas": backlogLastDays[i].REABIERTOS,
                "creadas": backlogLastDays[i].CREADAS,
                "resueltas": backlogLastDays[i].RESUELTAS,
                "urgentePriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_URGENTE,
                "altaPriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_ALTA,
                "bajaPriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_BAJA
            };
            datosUltimos6DiasArray.push(datosUltimos6Dias);
        }
        let backlog = {
            "priorizacionDiaBaja": countBacklogPriorizadoBaja,
            "priorizacionDiaAlta": countBacklogPriorizadoAlta,
            "priorizacionDiaUrgente": countBacklogPriorizadoUrgente,
            "reaperturas": queryJIRAReOpen,
            "priorizados": priorizadosPorRegistro.length,
            "repetitivos": quwryJIRARepetitivos,
            "totalPendientes": queryNocsIdEnBandeja.length
        };
        //armo el json de la respuesta final
        let backlogJsonResponse = {
            backlog,
            datosUltimos6DiasArray,
            distribucionModulo,
            priorizadosPorRegistro
        };
        yield checktask.saveStatus(processID.id, TASKNAME, PROCESSSTATUS.finalizado, 'Proceso Finalizado', JSON.stringify(backlogJsonResponse));
        logger.taskEndInfo(TASKNAME);
    });
}
exports.backlogDiario = backlogDiario;
//BUSCAR DATOS DE BACKLOG POR UNA FECHA DETERMINADA
function searchBacklogByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        let BacklogByDate = (yield BBDDcheckDataBase.query('select * FROM "BACKLOG" WHERE "FECHA" = ' + "'" + req.params.date + "'" + ';'));
        let priorizadosPorRegistro = yield priorizadosupdate.getAllPriorizadosByDay(req.params.date);
        let backlogJsonResponse = {
            BacklogByDate,
            priorizadosPorRegistro,
        };
        yield res.status(200).send(backlogJsonResponse);
        logger.taskEndInfo(TASKNAME);
    });
}
exports.searchBacklogByDate = searchBacklogByDate;
//# sourceMappingURL=informeBacklogDiario.js.map
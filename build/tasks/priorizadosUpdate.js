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
const moment = require("moment");
const bbddpostgres = require("../entities/BBDDPostgres");
const logger = require("../logger");
const emailtools = require("../tools/EMAILTools");
const googlesheet = require("../externalServices/RESTService/GSHEETService");
const TASKNAME = 'PRIORIZADOS UPDATE';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
let response;
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response = res;
        let dateNow = moment().format('YYYYMMDD');
        logger.taskBeginInfo(TASKNAME);
        let listadoPriorizados = yield googlesheet.getPriorizados();
        for (let i = 0; i < listadoPriorizados.length; i++) {
            let queryInsertPriorizados = 'INSERT INTO "PRIORIZADOS"("FECHA","NOC","RESUMEN","MODULO","ENTORNO","ESTADO","FECHA_CREACION")VALUES(';
            queryInsertPriorizados += /*FECHA*/ dateNow + ',';
            queryInsertPriorizados += /*NOC*/ "'" + listadoPriorizados[i].noc + "',";
            queryInsertPriorizados += /*RESUMEN*/ "'" + listadoPriorizados[i].resumen + "',";
            queryInsertPriorizados += /*MODULO*/ "'" + listadoPriorizados[i].modulo + "',";
            queryInsertPriorizados += /*ENTORNO*/ "'" + listadoPriorizados[i].entorno + "',";
            queryInsertPriorizados += /*ESTADO*/ "'" + listadoPriorizados[i].estado + "',";
            queryInsertPriorizados += /*FECHA_CREACION*/ "'" + listadoPriorizados[i].fechacreacion + "');";
            //si ya existe el priorizado para la fecha no lo inserta en la BBDD
            let priorizadoExiste = (yield new bbddpostgres.BBDDconect().query('SELECT count(*) FROM "PRIORIZADOS" WHERE "FECHA" = ' + "'" + dateNow + "'" + ' AND "NOC" = ' + "'" + listadoPriorizados[i].noc + "'" + ';'))[0].count;
            if (priorizadoExiste == 0) {
                yield new bbddpostgres.BBDDconect().query(queryInsertPriorizados);
            }
        }
        yield response.status(200).send(listadoPriorizados);
        logger.taskEndInfo(TASKNAME);
        let mailTxt = 'Se cargaron priorizados a la BBDD';
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
    });
}
exports.run = run;
//Obtengo el listado de priorizados para el dia indicado
function getAllPriorizadosByDay(date) {
    return __awaiter(this, void 0, void 0, function* () {
        let listadoPriorizadosArray = new Array();
        let BBDDPriorizados = new bbddpostgres.BBDDconect();
        let listadoPriorizados = (yield BBDDPriorizados.query('SELECT * FROM "PRIORIZADOS" WHERE "FECHA" = ' + "'" + date + "'" + ';'));
        //armo el JSON
        for (let i = 0; i < listadoPriorizados.length; i++) {
            let datosPriorizado = {
                "fecha": listadoPriorizados[i].FECHA,
                "noc": listadoPriorizados[i].NOC,
                "resumen": listadoPriorizados[i].RESUMEN,
                "modulo": listadoPriorizados[i].MODULO,
                "entorno": listadoPriorizados[i].ENTORNO,
                "estado": listadoPriorizados[i].ESTADO,
                "fechaCreacion": listadoPriorizados[i].FECHA_CREACION
            };
            listadoPriorizadosArray.push(datosPriorizado);
        }
        return listadoPriorizadosArray;
    });
}
exports.getAllPriorizadosByDay = getAllPriorizadosByDay;
//# sourceMappingURL=priorizadosUpdate.js.map
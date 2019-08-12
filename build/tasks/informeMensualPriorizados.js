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
const emailtools = require("../tools/EMAILTools");
const bbddpostgres = require("../entities/BBDDPostgres");
const TASKNAME = 'INFORME MENSUAL PRIORIZADOS';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
//OBTENER TODOS LOS PRIORIZADOS EXISTENTES EN EL MES
function getPriorizadosByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        let PriorizadosByDate = (yield BBDDcheckDataBase.query("select 'NOC-'||\"NOC\" AS \"NOCs\",\"RESUMEN\",\"MODULO\",\"ENTORNO\", substr(\"FECHA_CREACION\",7,2)||'/'|| substr(\"FECHA_CREACION\",5,2)||'/'||substr(\"FECHA_CREACION\",1,4) AS \"FECHA_CREACION\",max(CAST (\"FECHA\" AS INTEGER)) from \"PRIORIZADOS\" where \"FECHA\" LIKE " + "'" + req.params.date + "%' GROUP BY 'NOC-'||\"NOC\",\"RESUMEN\",\"MODULO\",\"ENTORNO\",substr(\"FECHA_CREACION\",7,2)||'/'||substr(\"FECHA_CREACION\",5,2)||'/'||substr(\"FECHA_CREACION\",1,4)ORDER BY 1;"));
        let mailTxt = "<table border='1'>";
        mailTxt += "<tr>";
        mailTxt += "<th>NOCs</th>";
        mailTxt += "<th>RESUMEN</th>";
        mailTxt += "<th>MODULO</th>";
        mailTxt += "<th>ENTORNO</th>";
        mailTxt += "<th>FECHA_CREACION</th>";
        mailTxt += "</tr>";
        for (let i = 0; i < Object.keys(PriorizadosByDate).length; i++) {
            mailTxt += "<tr>";
            mailTxt += "<td>" + PriorizadosByDate[i].NOCs + "</td>";
            mailTxt += "<td>" + PriorizadosByDate[i].RESUMEN + "</td>";
            mailTxt += "<td>" + PriorizadosByDate[i].MODULO + "</td>";
            mailTxt += "<td>" + PriorizadosByDate[i].ENTORNO + "</td>";
            mailTxt += "<td>" + PriorizadosByDate[i].FECHA_CREACION + "</td>";
            mailTxt += "</tr>";
        }
        mailTxt += "</table>";
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
        yield res.status(200).send(mailTxt);
        logger.taskEndInfo(TASKNAME);
    });
}
exports.getPriorizadosByDate = getPriorizadosByDate;
//OBTENER EL VALOR DIARIO DEL BACKLOG DE TODO EL MES
function getEverisNocByDate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME);
        let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        var BacklogByDate = (yield BBDDcheckDataBase.query("select substr(\"FECHA\",7,2)||'/'||substr(\"FECHA\",5,2) as \"Fecha\",\"RESUMEN_TOTAL_PENDIENTES\" from \"BACKLOG\" WHERE substr(\"FECHA\",5,2) = " + "'" + req.params.date + "'" + " order by \"FECHA\" desc;"));
        let mailTxt = "<table border='1'>";
        mailTxt += "<tr>";
        mailTxt += "<th>FECHA</th>";
        mailTxt += "<th>RESUMEN_TOTAL_PENDIENTES</th>";
        mailTxt += "</tr>";
        for (let i = 0; i < Object.keys(BacklogByDate).length; i++) {
            mailTxt += "<tr>";
            mailTxt += "<td>" + BacklogByDate[i].Fecha + "</td>";
            mailTxt += "<td>" + BacklogByDate[i].RESUMEN_TOTAL_PENDIENTES + "</td>";
            mailTxt += "</tr>";
        }
        mailTxt += "</table>";
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
        yield res.status(200).send(mailTxt);
        logger.taskEndInfo(TASKNAME);
    });
}
exports.getEverisNocByDate = getEverisNocByDate;
//# sourceMappingURL=informeMensualPriorizados.js.map
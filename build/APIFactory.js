"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const vincularDocumento = require("./tasks/vincularDocumento");
const nocToJiraConverter = require("./tasks/nocToJiraConverter");
const informeBacklogDiario = require("./tasks/informeBacklogDiario");
const priorizadosupdate = require("./tasks/priorizadosUpdate");
const informeMensualPriorizados = require("./tasks/informeMensualPriorizados");
function build() {
    let app = express();
    app.use(bodyParser.json());
    app.use(cors());
    //URLs DEFINITIVAS
    app.get("/informeBacklogDiario", informeBacklogDiario.backlogDiario); //genera backlog
    app.post("/informeBacklogDiario", informeBacklogDiario.backlogDiario); //genera backlog y guarda en BBDD local
    app.get("/informeBacklogDiario/date/:date", informeBacklogDiario.searchBacklogByDate); //recibe una fecha para traer el backlog de ese dia en formato YYYYMMDD
    app.get("/priorizadosupdate", priorizadosupdate.run); //actualiza el listado de priorizados en BBDD local
    app.get("/informemensual/priorizados/:date", informeMensualPriorizados.getPriorizadosByDate); //devuelve el total de priorizados del mes
    app.get("/informemensual/backlog/:date", informeMensualPriorizados.getEverisNocByDate); //devuelve el total de backlog del mes
    //TEST
    app.get("/vincularDocumento", vincularDocumento.run);
    app.get("/noctojiraconverter", nocToJiraConverter.run);
    return app;
}
exports.build = build;
//# sourceMappingURL=APIFactory.js.map
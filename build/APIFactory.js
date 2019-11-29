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
const convertirBase64 = require("./tasks/convertirBase64");
const asiJiraToJiraConverter = require("./tasks/asiJiraToJiraConverter");
const checkTask = require("./tasks/checkTask");
const config = require("./config");
const APIRESTVERSION = config.get("apiRestVersion");
function build() {
    let app = express();
    app.use(bodyParser.json());
    app.use(cors());
    //URLs DEFINITIVAS
    app.get('/v' + APIRESTVERSION.prod + '/informeBacklogDiario', informeBacklogDiario.backlogDiario); // [RUN] genera backlog
    app.post('/v' + APIRESTVERSION.prod + '/informeBacklogDiario', informeBacklogDiario.backlogDiario); // [RUN] genera backlog y guarda en BBDD local
    app.get('/v' + APIRESTVERSION.prod + '/informeBacklogDiario/date/:date', informeBacklogDiario.searchBacklogByDate); // [RUN] recibe una fecha para traer el backlog de ese dia en formato YYYYMMDD
    app.get('/v' + APIRESTVERSION.prod + '/priorizadosupdate', priorizadosupdate.run); // [RUN] actualiza el listado de priorizados en BBDD local
    app.get('/v' + APIRESTVERSION.prod + '/informemensual/priorizados/:date', informeMensualPriorizados.getPriorizadosByDate); // [RUN] devuelve el total de priorizados del mes
    app.get('/v' + APIRESTVERSION.prod + '/informemensual/backlog/:date', informeMensualPriorizados.getEverisNocByDate); // [RUN] devuelve el total de backlog del mes
    app.get('/v' + APIRESTVERSION.prod + '/asijiratojiraconverter', asiJiraToJiraConverter.createJirafromAsiJira); // [DESA] importa los jiraAsi a Jira segun filtro predeterminado
    app.post('/v' + APIRESTVERSION.prod + '/asijiratojiraconverter/:asijira', asiJiraToJiraConverter.createJirafromAsiJira); // [DESA] importa los jiraAsi a Jira segun parametro enviado por el usuario
    app.get('/v' + APIRESTVERSION.prod + '/checktask/:id', checkTask.checkTaskProcessStatusById); // [ERHA] devuelve estado de ejecucion de tarea
    //REGULATORIOS
    //    app.get("'/v'+APIRESTVERSION.prod+'/appSade9570", appSade9570.run); //genera nueva transaccion a partir de la anterior, imprime update para actualizar registro de psoc con nueva transaccion.
    //DEVELOP
    app.get("'/v'+APIRESTVERSION.prod+'/vincularDocumento", vincularDocumento.run);
    app.get("'/v'+APIRESTVERSION.prod+'/noctojiraconverter", nocToJiraConverter.run);
    app.get("'/v'+APIRESTVERSION.prod+'/convertirBase64/encode/:filedir", convertirBase64.base64Encoder); //devuelve el documento pasado por parametro como un string en Base64
    return app;
}
exports.build = build;
//# sourceMappingURL=APIFactory.js.map
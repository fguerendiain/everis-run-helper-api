"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const vincularDocumento = require("./tasks/vincularDocumento");
const nocToJiraConverter = require("./tasks/nocToJiraConverter");
const informeBacklogDiario = require("./tasks/informeBacklogDiario");
const priorizadosupdate = require("./tasks/priorizadosUpdate");
function build() {
    let app = express();
    app.use(bodyParser.json());
    app.use(cors());
    //URLs DEFINITIVAS
    app.get("/informeBacklogDiario", informeBacklogDiario.run);
    app.get("/priorizadosupdate", priorizadosupdate.run);
    //TEST
    app.get("/vincularDocumento", vincularDocumento.run);
    app.get("/noctojiraconverter", nocToJiraConverter.run);
    return app;
}
exports.build = build;
//# sourceMappingURL=APIFactory.js.map
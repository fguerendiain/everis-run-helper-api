"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const vincularDocumento = require("./tasks/vincularDocumento");
const nocToJiraConverter = require("./tasks/nocToJiraConverter");
function build() {
    let app = express();
    app.use(bodyParser.json());
    app.use(cors());
    //    app.get("URL", FUNCTION);
    app.get("/vincularDocumento", vincularDocumento.run);
    app.get("/noctojiraconverter", nocToJiraConverter.run);
    return app;
}
exports.build = build;
//# sourceMappingURL=APIFactory.js.map
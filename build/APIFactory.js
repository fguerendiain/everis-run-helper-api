"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const vincularDocumento = require("./tasks/vincularDocumento");
function build() {
    let app = express();
    app.use(bodyParser.json());
    app.use(cors());
    //    app.get("/test", BBDDtools.test);
    app.get("/vincluarDocumento", vincularDocumento.run);
    return app;
}
exports.build = build;
//# sourceMappingURL=APIFactory.js.map
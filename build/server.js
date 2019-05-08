"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const config = require("./config");
const APIFactory = require("./APIFactory");
const log = require("./logger");
const apiPort = +config.get('apiPort');
const api = APIFactory.build();
const server = http.createServer(api);
server.listen(apiPort);
log.info('SERVER', `Ready: Listening on port ${apiPort}`);
//# sourceMappingURL=server.js.map
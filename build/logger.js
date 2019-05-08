"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function log(type, tag, msg) {
    let date = moment().format('YYYY.MM.DD HH:mm:ss.SS') + ': ';
    type = '[' + type + '] ';
    tag = tag + ': ';
    console.log(date + type + tag + msg);
}
exports.log = log;
function info(tag, msg) {
    log('INFO', tag, msg);
}
exports.info = info;
function error(tag, msg) {
    log('ERROR', tag, msg);
}
exports.error = error;
//# sourceMappingURL=logger.js.map
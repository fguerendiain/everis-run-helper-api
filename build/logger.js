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
function awaitAsyncErrorHandler(msg) {
    log('ERROR', 'PROMISE', msg);
}
exports.awaitAsyncErrorHandler = awaitAsyncErrorHandler;
function taskBeginInfo(msg) {
    log('INFO', 'TASK', ' --COMIENZA EJECUCION DE TAREA: ' + msg);
}
exports.taskBeginInfo = taskBeginInfo;
function taskEndInfo(msg) {
    log('INFO', 'TASK', ' --FINALIZA EJECUCION DE TAREA: ' + msg);
}
exports.taskEndInfo = taskEndInfo;
//# sourceMappingURL=logger.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const config = require("./config");
const fs = require("fs");
const util_1 = require("util");
const FILELOCATION = config.get('logs').logsavelocation;
const FILEEXTENSION = config.get('logs').logfileextension;
const LOGFILENAME = config.get("logs").logsavefilename;
const PRINTLENGTH = config.get("logs").printLength;
function info(tag, msg, filename) {
    if (util_1.isNullOrUndefined(filename)) {
        log('INFO', tag, msg, LOGFILENAME);
    }
    else {
        log('INFO', tag, msg, filename);
    }
}
exports.info = info;
function error(tag, msg, filename) {
    if (util_1.isNullOrUndefined(filename)) {
        log('ERROR', tag, msg);
    }
    else {
        log('ERROR', tag, msg, filename);
    }
}
exports.error = error;
function awaitAsyncErrorHandler(msg, filename) {
    if (util_1.isNullOrUndefined(filename)) {
        log('ERROR', 'PROMISE', msg);
    }
    else {
        log('ERROR', 'PROMISE', msg, filename);
    }
}
exports.awaitAsyncErrorHandler = awaitAsyncErrorHandler;
function taskBeginInfo(msg, filename) {
    if (util_1.isNullOrUndefined(filename)) {
        log('INFO', 'TASK', ' --COMIENZA EJECUCION DE TAREA: ' + msg);
    }
    else {
        log('INFO', 'TASK', ' --COMIENZA EJECUCION DE TAREA: ' + msg, filename);
    }
}
exports.taskBeginInfo = taskBeginInfo;
function taskEndInfo(msg, filename) {
    if (util_1.isNullOrUndefined(filename)) {
        log('INFO', 'TASK', ' --FINALIZA EJECUCION DE TAREA: ' + msg);
    }
    else {
        log('INFO', 'TASK', ' --FINALIZA EJECUCION DE TAREA: ' + msg, filename);
    }
}
exports.taskEndInfo = taskEndInfo;
function minimal(msg, filename) {
    logMinimal(msg, filename);
}
exports.minimal = minimal;
function logMinimal(msg, filename) {
    let message = msg;
    console.log(message);
    if (!util_1.isNullOrUndefined(filename)) {
        logFileWriter(filename, message);
    }
    ;
}
function log(type, tag, msg, filename) {
    let date = moment().format('YYYY.MM.DD HH:mm:ss.SS') + ': ';
    type = '[' + type + '] ';
    tag = tag + ': ';
    let message = date + type + tag + cutLogString(msg);
    console.log(message);
    if (!util_1.isNullOrUndefined(filename)) {
        logFileWriter(filename, message);
    }
    ;
}
function logFileWriter(filename, msg) {
    let file = FILELOCATION + filename + '_' + moment().format('YYYY-MM-DD') + '.' + FILEEXTENSION;
    let infoStream = fs.createWriteStream(file, { flags: 'a' });
    infoStream.write(msg + '\r\n');
}
function cutLogString(v_string) {
    if (v_string.length > PRINTLENGTH) {
        let endOfString = '   ... (continua con ' + (v_string.length - PRINTLENGTH) + ' caracteres)';
        v_string = v_string.substring(0, PRINTLENGTH) + endOfString;
    }
    return v_string;
}
//# sourceMappingURL=logger.js.map
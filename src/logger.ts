import * as moment from 'moment';
import * as config from './config';
import * as fs from 'fs';
import { isNullOrUndefined } from 'util';

const FILELOCATION = config.get('logs').logsavelocation;
const FILEEXTENSION = config.get('logs').logfileextension;
const LOGFILENAME = config.get("logs").logsavefilename;
const PRINTLENGTH = config.get("logs").printLength;


export function info(tag:string, msg:string, filename?:string){
    if(isNullOrUndefined(filename)){
        log('INFO', tag, msg,LOGFILENAME);
    }else{
        log('INFO', tag, msg, filename);
    }
}

export function error(tag:string, msg:string, filename?:string){
    if(isNullOrUndefined(filename)){
        log('ERROR', tag, msg);
    }else{
        log('ERROR', tag, msg, filename);
    }
}

export function awaitAsyncErrorHandler(msg:string, filename?:string){
    if(isNullOrUndefined(filename)){
        log('ERROR', 'PROMISE', msg);
    }else{
        log('ERROR', 'PROMISE', msg, filename);
    }
}


export function taskBeginInfo(msg:string, filename?:string){
    if(isNullOrUndefined(filename)){
        log('INFO', 'TASK', ' --COMIENZA EJECUCION DE TAREA: '+msg);
    }else{
        log('INFO', 'TASK', ' --COMIENZA EJECUCION DE TAREA: '+msg, filename);
    }
}

export function taskEndInfo(msg:string, filename?:string){
    if(isNullOrUndefined(filename)){
        log('INFO', 'TASK', ' --FINALIZA EJECUCION DE TAREA: '+msg);
    }else{
        log('INFO', 'TASK', ' --FINALIZA EJECUCION DE TAREA: '+msg, filename);
    }
}




function log(type:string, tag:string, msg:string, filename?:string){
	let date:string = moment().format('YYYY.MM.DD HH:mm:ss.SS') + ': ';
	type = '['+type+'] ';
    tag = tag+': ';
    let message = date + type + tag + cutLogString(msg); 
    console.log(message);
        if(!isNullOrUndefined(filename)){
            logFileWriter(filename,message)
        };
}

function logFileWriter(filename,msg){
    let file = FILELOCATION + filename +'_'+moment().format('YYYY-MM-DD') + '.' + FILEEXTENSION
    let infoStream = fs.createWriteStream(file,{flags:'a'});
    infoStream.write(msg+'\r\n');
}

function cutLogString (v_string:string){
    if(v_string.length > PRINTLENGTH){
        let endOfString = '   ... (continua con ' + (v_string.length - PRINTLENGTH) + ' caracteres)'
        v_string = v_string.substring(0,PRINTLENGTH) + endOfString
    }
    return v_string;
}


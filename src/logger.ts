import * as moment from 'moment'

export function log(type:string, tag:string, msg:string){
	let date:string = moment().format('YYYY.MM.DD HH:mm:ss.SS') + ': ';
	type = '['+type+'] ';
    tag = tag+': ';
	console.log(date + type + tag + msg);
}

export function info(tag:string, msg:string){
    log('INFO', tag, msg);
}

export function error(tag:string, msg:string){
    log('ERROR', tag, msg);
}

export function awaitAsyncErrorHandler(msg:string){
    log('ERROR', 'PROMISE', msg);
}

export function taskBeginInfo(msg:string){
    log('INFO', 'TASK', ' --COMIENZA EJECUCION DE TAREA: '+msg);
}

export function taskEndInfo(msg:string){
    log('INFO', 'TASK', ' --FINALIZA EJECUCION DE TAREA: '+msg);
}
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

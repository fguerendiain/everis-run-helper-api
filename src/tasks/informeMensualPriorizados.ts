import express = require('express');
import * as logger from '../logger';
import * as emailtools from '../tools/EMAILTools';
import * as bbddpostgres from '../entities/BBDDPostgres';

const TASKNAME = 'INFORME MENSUAL'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

//OBTENER TODOS LOS PRIORIZADOS EXISTENTES EN EL MES
export async function getPriorizadosByDate(req: express.Request, res: express.Response){
    let specificTaskName = TASKNAME + " PRIORIZADOS";
	logger.taskBeginInfo(specificTaskName);
	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
	let PriorizadosByDate = (await BBDDcheckDataBase.query("select 'NOC-'||\"NOC\" AS \"NOCs\",\"RESUMEN\",\"MODULO\",\"ENTORNO\", substr(\"FECHA_CREACION\",7,2)||'/'|| substr(\"FECHA_CREACION\",5,2)||'/'||substr(\"FECHA_CREACION\",1,4) AS \"FECHA_CREACION\",max(CAST (\"FECHA\" AS INTEGER)) from \"PRIORIZADOS\" where \"FECHA\" LIKE "+"'"+req.params.date+"%' GROUP BY 'NOC-'||\"NOC\",\"RESUMEN\",\"MODULO\",\"ENTORNO\",substr(\"FECHA_CREACION\",7,2)||'/'||substr(\"FECHA_CREACION\",5,2)||'/'||substr(\"FECHA_CREACION\",1,4)ORDER BY 1;"));

    let mailTxt = "<table border='1'>";
    mailTxt += "<tr>"
    mailTxt += "<th>NOCs</th>";
    mailTxt += "<th>RESUMEN</th>";
    mailTxt += "<th>MODULO</th>";
    mailTxt += "<th>ENTORNO</th>";
    mailTxt += "<th>FECHA_CREACION</th>";
    mailTxt += "</tr>"

    for (let i = 0 ; i < Object.keys(PriorizadosByDate).length  ; i++) {
        mailTxt += "<tr>"
        mailTxt += "<td>" + PriorizadosByDate[i].NOCs + "</td>";
        mailTxt += "<td>" + PriorizadosByDate[i].RESUMEN + "</td>";
        mailTxt += "<td>" + PriorizadosByDate[i].MODULO + "</td>";
        mailTxt += "<td>" + PriorizadosByDate[i].ENTORNO + "</td>";
        mailTxt += "<td>" + PriorizadosByDate[i].FECHA_CREACION + "</td>";
        mailTxt += "</tr>"
    }
    mailTxt += "</table>" 

    await emailtools.sendByMail(RESPONSABLE,specificTaskName,mailTxt);

    await res.status(200).send(mailTxt);
    logger.taskEndInfo(specificTaskName);
}

//OBTENER EL VALOR DIARIO DEL BACKLOG DE TODO EL MES
export async function getEverisNocByDate(req: express.Request, res: express.Response){
    let specificTaskName = TASKNAME + " BACKLOG";
	logger.taskBeginInfo(specificTaskName);
	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
	var BacklogByDate = (await BBDDcheckDataBase.query("select substr(\"FECHA\",7,2)||'/'||substr(\"FECHA\",5,2) as \"Fecha\",\"RESUMEN_TOTAL_PENDIENTES\" from \"BACKLOG\" WHERE \"FECHA\" LIKE "+"'"+req.params.date+"%'"+" order by \"FECHA\" desc;"));

    let mailTxt = "<table border='1'>";
    mailTxt += "<tr>"
    mailTxt += "<th>FECHA</th>";
    mailTxt += "<th>RESUMEN_TOTAL_PENDIENTES</th>";
    mailTxt += "</tr>"

    for (let i = 0 ; i < Object.keys(BacklogByDate).length  ; i++) {
        mailTxt += "<tr>"
        mailTxt += "<td>" + BacklogByDate[i].Fecha + "</td>";
        mailTxt += "<td>" + BacklogByDate[i].RESUMEN_TOTAL_PENDIENTES + "</td>";
        mailTxt += "</tr>"
    }
    mailTxt += "</table>" 

    await emailtools.sendByMail(RESPONSABLE,specificTaskName,mailTxt);
   
	await res.status(200).send(mailTxt);
    logger.taskEndInfo(specificTaskName);
}



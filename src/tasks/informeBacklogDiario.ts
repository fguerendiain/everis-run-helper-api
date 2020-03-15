import { Noc } from '../entities/Noc';
import express = require('express');
import * as logger from '../logger';
import * as emailtools from '../tools/EMAILTools';
import * as nocservices from '../externalServices/RESTService/NOCService';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import * as priorizadosupdate from '../tasks/priorizadosUpdate';
import * as moment from 'moment';
import * as bbddpostgres from '../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';
import * as checktask from './checkTask';
import * as config from '../config'


const TASKNAME = 'INFORME BACKLOG DIARIO'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'
const PROCESSSTATUS = config.get("informeBacklogDiario").estadoProceso;

//GENERAR EL INFORME DE BACKLOG
export async function backlogDiario(req: express.Request, res: express.Response){

	logger.taskBeginInfo(TASKNAME);
	let date:string = moment().subtract(1, 'days').format('YYYYMMDD');
	let save = false;

	let processID = await checktask.saveStatus(0,TASKNAME,PROCESSSTATUS.enProgreso,'Inicia Proceso');

	await res.status(200).send(processID);


	//si el metodo es POST graba el backlog en la BBDD a menos que ya exista
	if(req.method == 'POST'){
		save = true;
		let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
		let backlogExistOnBBDD = (await BBDDcheckDataBase.query('select count(*) FROM "BACKLOG" WHERE "FECHA" = '+"'"+date+"'"+';'))[0].count;
		if(backlogExistOnBBDD != 0){
			let mailTxt = 'el backlog ya existe para la fecha indicada';
			await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);
			await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.finalizado,'Proceso Finalizado',JSON.stringify({resultado:mailTxt}));
			logger.taskEndInfo(TASKNAME);
			return;
			}
	}

	let nocsArray = new Array;
	let modulesArrayAll = new Array;
	let modulesArray = new Array;
	let datosUltimosDiasArray = new Array;

	//contadores
	let countBacklogPriorizadoUrgente:number = 0;
	let countBacklogPriorizadoAlta:number = 0;
	let countBacklogPriorizadoBaja:number = 0;
	let countDistribucionModuloPrd:number = 0;
	let countDistribucionModuloHml:number = 0;
	let countDistribucionModuloCapa:number = 0;

	let distribucionModulo = new Array();

	//obtengo listado de nocs desde el servidor de noc
	let queryNocsIdEnBandeja:{}[] = ((await nocservices.getNocByFilter().catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).operation.details);
	//obtengo listado de JIRAS creados el dia anterior al actual
	let queryJIRACreados = (await jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Open, "In Progress", Paused) AND created >= -1d AND created <= 0d').catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).total;
	//obtengo listado de JIRAS solucionados el dia anterior al actual
	let queryJIRAResueltos = (await jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Resolved, Closed) AND resolved >= -1d AND resolved <= -0d').catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).total;
	//obtengo listado de JIRAS con reopen en 1 modificados el dia anterior al actual
	let queryJIRAReOpen = (await jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Open, "In Progress", Paused) AND "Reopen Counter" = "1" AND updated >= -1d AND updated <= 0d').catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).total;
	//Obtengo listado de JIRAS correspondientes a regulatorios repetitivos
	let queryJIRARepetitivos = (await jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = REGULATORIO AND status in (Open, "In Progress")').catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).total
	//Obtengo listado de JIRAS correspondientes a RUN-N3
	let queryJIRARunN3 = (await jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = RUN-N3 AND status in (Open, "In Progress")').catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).total

	if(isNullOrUndefined(queryNocsIdEnBandeja)){
		let mailTxt = 'error de servicio externo al obtener Tickets en bandeja';
		await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.error,mailTxt);
		await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);
		logger.taskEndInfo(TASKNAME);
		return;
	}
	if(isNullOrUndefined(queryJIRACreados)){
		let mailTxt = 'error de servicio externo al obtener Tickets creados';
		await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.error,mailTxt);
		await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);
		logger.taskEndInfo(TASKNAME);
		return;
	}
	if(isNullOrUndefined(queryJIRAResueltos)){
		let mailTxt = 'error de servicio externo al obtener Tickets resueltos';
		await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.error,mailTxt);
		await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);
		logger.taskEndInfo(TASKNAME);
		return;
	}
	if(isNullOrUndefined(queryJIRAReOpen)){
		let mailTxt = 'error de servicio externo al obtener Tickets reabiertos';
		await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.error,mailTxt);
		await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);
		logger.taskEndInfo(TASKNAME);
		return;
	}
	if(isNullOrUndefined(queryJIRARepetitivos)){
		let mailTxt = 'error de servicio externo al obtener Tickets repetitivos';
		await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.error,mailTxt);
		await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);
		logger.taskEndInfo(TASKNAME);
		return;
	}

	if(isNullOrUndefined(queryJIRARunN3)){
		let mailTxt = 'error de servicio externo al obtener Tickets RUN-N3';
		await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.error,mailTxt);
		await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);
		logger.taskEndInfo(TASKNAME);
		return;
	}

	//genero un array de objetos noc
	for(let i = 0; i < queryNocsIdEnBandeja.length; i++){
		let auxNocInsatnce:Noc;
		auxNocInsatnce = new Noc(queryNocsIdEnBandeja[i]['WORKORDERID']);
		await auxNocInsatnce.fillInstanceByNocId();
		nocsArray.push(auxNocInsatnce);
	}

	//recorro el listado de nocs para llenar contar prioridades y entornos
	for(let i = 0; i < nocsArray.length; i++){
		if(isNullOrUndefined(nocsArray[i].getPriroriry())){
			countBacklogPriorizadoUrgente++;
		}else{
			let stringSubject:string = <string>nocsArray[i].getPriroriry();
			if(stringSubject.includes("Alta")){
				countBacklogPriorizadoUrgente++;
			}else if(stringSubject.includes("Media")){
				countBacklogPriorizadoAlta++
			}else if(stringSubject.includes("Baja")){
				countBacklogPriorizadoBaja++
			}else{
				countBacklogPriorizadoUrgente++;
			}
		}
	//armo un array auxiliar con los modulos
		modulesArrayAll.push(<string>nocsArray[i].getSubCategoria());		
	}

	//genero el listado unico de modulos
	modulesArray = modulesArrayAll.filter((value,index,self)=>{
		return self.indexOf(value) === index;
	})

	//recorro el listado de modulos para contar insidencias desglozando por ambientes
	//armo todo en un JSON como string
	let v_saveBacklogBBDDQueryDistrinucion:string;
	for(let i = 0; i < modulesArray.length; i++){
		for(let a = 0; a < nocsArray.length; a++){

			if(<string>nocsArray[a].getSubCategoria() == <string>modulesArray[i]){				
				let stringSubject:string = <string>nocsArray[a].getSubject();
				if(stringSubject.includes("PRD")){
					countDistribucionModuloPrd++;
				}else if(stringSubject.includes("HML")){
					countDistribucionModuloHml++
				}else if(stringSubject.includes("CAPA")){
					countDistribucionModuloCapa++
				}else{
					countDistribucionModuloPrd++;
				}
			}
		}
		let distribucionModuloToJSON = {
			"module":modulesArray[i],
			"prd": countDistribucionModuloPrd,
			"hml": countDistribucionModuloHml,
			"capa": countDistribucionModuloCapa
		}

		if(save){
			let totalPorModulo = countDistribucionModuloPrd+countDistribucionModuloHml+countDistribucionModuloCapa;
			//INSERTAR LOS DATOS EN LA BBDD	
			v_saveBacklogBBDDQueryDistrinucion = 'INSERT INTO "BACKLOG_DISTRIBUCION"("FECHA","MODULO","CANT_PRD","CANT_HML", "CANT_CAPA","TOTAL")	VALUES (';
			v_saveBacklogBBDDQueryDistrinucion += /*FECHA*/date+",";
			v_saveBacklogBBDDQueryDistrinucion += /*MODULO*/"'"+modulesArray[i]+"',";
			v_saveBacklogBBDDQueryDistrinucion += /*CANT_PRD*/countDistribucionModuloPrd+',';
			v_saveBacklogBBDDQueryDistrinucion += /*CANT_HML*/countDistribucionModuloHml+','; 
			v_saveBacklogBBDDQueryDistrinucion += /*CANT_CAPA*/countDistribucionModuloCapa+',';
			v_saveBacklogBBDDQueryDistrinucion += /*TOTAL*/totalPorModulo+");";

			//inserto distribucion por modulos
			await new bbddpostgres.BBDDconect().query(v_saveBacklogBBDDQueryDistrinucion)
		}

		distribucionModulo.push(distribucionModuloToJSON);

		countDistribucionModuloPrd = 0;
		countDistribucionModuloHml = 0;
		countDistribucionModuloCapa = 0;
	}


	//Obtengo la informacion de los campos con historial para los ultimos 6 dias
	let BBDDBacklogLastDays = new bbddpostgres.BBDDconect()
	let backlogLastDays:any[] = <[]>await BBDDBacklogLastDays.query('SELECT "FECHA", "CREADAS", "RESUELTAS", "PRIORIZADO_PORCENTUAL_BAJA","PRIORIZADO_PORCENTUAL_ALTA","PRIORIZADO_PORCENTUAL_URGENTE","REABIERTOS"FROM "BACKLOG" ORDER BY "FECHA" desc LIMIT 20;');

	let datosDiaAnterior:{};

	console.log("")
	console.log("")
	console.log("ARMO LOS DIAS")


	if(!save){
		datosDiaAnterior = {
			"fecha": date,
			"reaperturas": queryJIRAReOpen,
			"creadas": queryJIRACreados,
			"resueltas": queryJIRAResueltos,
			"urgentePriorizadoPorcentaje": ((countBacklogPriorizadoUrgente/queryNocsIdEnBandeja.length).toFixed(2)),
			"altaPriorizadoPorcentaje": ((countBacklogPriorizadoAlta/queryNocsIdEnBandeja.length).toFixed(2)),
			"bajaPriorizadoPorcentaje": ((countBacklogPriorizadoBaja/queryNocsIdEnBandeja.length).toFixed(2))
		};
		datosUltimosDiasArray.push(datosDiaAnterior);
	}

	//armo el JSON
	for(let i = 0; i < backlogLastDays.length ; i++){
		datosDiaAnterior = {
			"fecha": backlogLastDays[i].FECHA,
			"reaperturas": parseInt(backlogLastDays[i].REABIERTOS),
			"creadas": parseInt(backlogLastDays[i].CREADAS),
			"resueltas": parseInt(backlogLastDays[i].RESUELTAS),
			"urgentePriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_URGENTE,
			"altaPriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_ALTA,
			"bajaPriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_BAJA
		};
		datosUltimosDiasArray.push(datosDiaAnterior);
	}

	for (let i = 0; i < datosUltimosDiasArray.length; i++) {
		if (datosUltimosDiasArray[i].creadas === 0 && datosUltimosDiasArray[i].resueltas === 0) {
			datosUltimosDiasArray.splice(i,1);
			i--;
		}
	}

	let priorizadosPorRegistro:any[] = await priorizadosupdate.getAllPriorizadosByDay(datosUltimosDiasArray[0].fecha);

	if(save){

		//INSERTAR LOS DATOS EN LA BBDD	
		let v_saveBacklogBBDDQuery:string;
		v_saveBacklogBBDDQuery = 'INSERT INTO "BACKLOG"("FECHA","PRIORIZADO_BAJA","PRIORIZADO_ALTA","PRIORIZADO_URGENTE", "CREADAS","RESUELTAS","PRIORIZADO_PORCENTUAL_BAJA","PRIORIZADO_PORCENTUAL_ALTA",';
		v_saveBacklogBBDDQuery += '"PRIORIZADO_PORCENTUAL_URGENTE","REABIERTOS","RESUMEN_PRIORIZADOS","RESUMEN_REPETITIVOS","RESUMEN_TOTAL_PENDIENTES","DISTRIBUCION")	VALUES (';
		v_saveBacklogBBDDQuery += /*FECHA*/date+',';
		v_saveBacklogBBDDQuery += /*PRIORIZADO_BAJA*/countBacklogPriorizadoBaja+',';
		v_saveBacklogBBDDQuery += /*PRIORIZADO_ALTA*/countBacklogPriorizadoAlta+',';
		v_saveBacklogBBDDQuery += /*PRIORIZADO_URGENTE*/countBacklogPriorizadoUrgente+','; 
		v_saveBacklogBBDDQuery += /*CREADAS*/queryJIRACreados+',';
		v_saveBacklogBBDDQuery += /*RESUELTAS*/queryJIRAResueltos+',';
		v_saveBacklogBBDDQuery += /*PRIORIZADO_PORCENTUAL_BAJA*/((countBacklogPriorizadoBaja/queryNocsIdEnBandeja.length).toFixed(2))+',';
		v_saveBacklogBBDDQuery += /*PRIORIZADO_PORCENTUAL_ALTA*/((countBacklogPriorizadoAlta/queryNocsIdEnBandeja.length).toFixed(2))+',';
		v_saveBacklogBBDDQuery += /*PRIORIZADO_PORCENTUAL_URGENTE*/((countBacklogPriorizadoUrgente/queryNocsIdEnBandeja.length).toFixed(2))+',';
		v_saveBacklogBBDDQuery += /*REABIERTOS*/queryJIRAReOpen+',';
		v_saveBacklogBBDDQuery += /*RESUMEN_PRIORIZADOS*/priorizadosPorRegistro.length+',';
		v_saveBacklogBBDDQuery += /*RESUMEN_REPETITIVOS*/queryJIRARepetitivos+',';
		v_saveBacklogBBDDQuery += /*RESUMEN_TOTAL_PENDIENTES*/queryNocsIdEnBandeja.length+',';
		v_saveBacklogBBDDQuery += /*DISTRIBUCION*/"'"+JSON.stringify(distribucionModulo)+"');";
		

		//si no existen registros de backlog para la fecha lo inserto en la BBDD
		let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
		let backlogExistOnBBDD = (await BBDDcheckDataBase.query('select count(*) FROM "BACKLOG" WHERE "FECHA" = '+"'"+date+"'"+';'))[0].count;
		if(backlogExistOnBBDD == 0){
			let BBDDinsertBacklog = new bbddpostgres.BBDDconect();
			await BBDDinsertBacklog.query(v_saveBacklogBBDDQuery);
		}
	}

	let backlog:{} = {
		"priorizacionDiaBaja": countBacklogPriorizadoBaja,
		"priorizacionDiaAlta": countBacklogPriorizadoAlta,
		"priorizacionDiaUrgente": countBacklogPriorizadoUrgente,
		"reaperturas": queryJIRAReOpen,
		"priorizados": priorizadosPorRegistro.length,
		"repetitivos": queryJIRARepetitivos,
		"totalPendientes": queryNocsIdEnBandeja.length,
		"runn3":queryJIRARunN3
	};


	//armo el json de la respuesta final
	let backlogJsonResponse = {
		backlog,
		datosUltimosDiasArray,
		distribucionModulo,
		priorizadosPorRegistro
	} 

	await checktask.saveStatus(processID.id,TASKNAME,PROCESSSTATUS.finalizado,'Proceso Finalizado',JSON.stringify(backlogJsonResponse));
	logger.taskEndInfo(TASKNAME);
}




//BUSCAR DATOS DE BACKLOG POR UNA FECHA DETERMINADA
export async function searchBacklogByDate(req: express.Request, res: express.Response){
	logger.taskBeginInfo(TASKNAME);
	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
	let BacklogByDate = (await BBDDcheckDataBase.query('select * FROM "BACKLOG" WHERE "FECHA" = '+"'"+req.params.date+"'"+';'));
	let priorizadosPorRegistro:any[] = await priorizadosupdate.getAllPriorizadosByDay(req.params.date);

	let backlogJsonResponse = {
		BacklogByDate,
		priorizadosPorRegistro,
	} 


	await res.status(200).send(backlogJsonResponse);
	logger.taskEndInfo(TASKNAME);

}
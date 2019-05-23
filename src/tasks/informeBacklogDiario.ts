import { Noc } from '../entities/Noc';
import express = require('express');
import * as logger from '../logger';
import * as emailtools from '../tools/EMAILTools';
import * as nocservices from '../externalServices/RESTService/NOCService';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import * as priorizadosupdate from '../tasks/priorizadosUpdate';
import * as moment from 'moment';
import * as bbddpostgres from '../entities/BBDDPostgres';


const TASKNAME = 'INFORME BACKLOG DIARIO'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

let response:express.Response;

export async function run(req: express.Request, res: express.Response){
	response = res;    

	let date:string = moment().subtract(1, 'days').format('YYYYMMDD');

	logger.taskBeginInfo(TASKNAME);


	let nocsArray = new Array;
	let modulesArrayAll = new Array;
	let modulesArray = new Array;
	let datosUltimos6DiasArray = new Array;

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
	let quwryJIRARepetitivos = (await jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = REGULATORIO AND status in (Open, "In Progress", Paused)').catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).total


	//genero un array de objetos noc
	for(let i = 0; i < queryNocsIdEnBandeja.length; i++){
		let auxNocInsatnce:Noc;
		auxNocInsatnce = new Noc(queryNocsIdEnBandeja[i]['WORKORDERID']);
		await auxNocInsatnce.fillInstanceByNocId();
		nocsArray.push(auxNocInsatnce);
	}

	//recorro el listado de nocs para llenar contar prioridades y entornos
	for(let i = 0; i < nocsArray.length; i++){
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

		//armo un array auxiliar con los modulos
		modulesArrayAll.push(<string>nocsArray[i].getSubCategoria());		
	}

	//genero el listado unico de modulos
	modulesArray = modulesArrayAll.filter((value,index,self)=>{
		return self.indexOf(value) === index;
	})

	//recorro el listado de modulos para contar insidencias desglozando por ambientes
	//armo todo en un JSON como string
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

		distribucionModulo.push(distribucionModuloToJSON);

		countDistribucionModuloPrd = 0;
		countDistribucionModuloHml = 0;
		countDistribucionModuloCapa = 0;
	}


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
	v_saveBacklogBBDDQuery += /*RESUMEN_PRIORIZADOS*/'0,';
	v_saveBacklogBBDDQuery += /*RESUMEN_REPETITIVOS*/quwryJIRARepetitivos+',';
	v_saveBacklogBBDDQuery += /*RESUMEN_TOTAL_PENDIENTES*/queryNocsIdEnBandeja.length+',';
	v_saveBacklogBBDDQuery += /*DISTRIBUCION*/"'"+JSON.stringify(distribucionModulo)+"');";
	

	//si no existen registros de backlog para la fecha lo inserto en la BBDD
	let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
	let backlogExistOnBBDD = (await BBDDcheckDataBase.query('select count(*) FROM "BACKLOG" WHERE "FECHA" = '+"'"+date+"'"+';'))[0].count;
	if(backlogExistOnBBDD == 0){
		let BBDDinsertBacklog = new bbddpostgres.BBDDconect();
		await BBDDinsertBacklog.query(v_saveBacklogBBDDQuery);
	}

	//Obtengo la informacion de los campos con historial para los ultimos 6 dias
	let BBDDBacklogLastDays = new bbddpostgres.BBDDconect()
	let backlogLastDays:any[] = <[]>await BBDDBacklogLastDays.query('SELECT "FECHA", "CREADAS", "RESUELTAS", "PRIORIZADO_PORCENTUAL_BAJA","PRIORIZADO_PORCENTUAL_ALTA","PRIORIZADO_PORCENTUAL_URGENTE","REABIERTOS"FROM "BACKLOG" ORDER BY "FECHA" desc LIMIT 6;');

		//armo el JSON
	for(let i = 0; i < backlogLastDays.length ; i++){
		let datosUltimos6Dias:{} = {
			"fecha": backlogLastDays[i].FECHA,
			"reaperturas": backlogLastDays[i].REABIERTOS,
			"creadas": backlogLastDays[i].CREADAS,
			"resueltas": backlogLastDays[i].RESUELTAS,
			"urgentePriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_URGENTE,
			"altaPriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_ALTA,
			"bajaPriorizadoPorcentaje": backlogLastDays[i].PRIORIZADO_PORCENTUAL_BAJA
		};
		datosUltimos6DiasArray.push(datosUltimos6Dias);
	}

	let priorizadosPorRegistro:any[] = await priorizadosupdate.getAllPriorizadosByDay(date);

	let backlog:{} = {
		"priorizacionDiaBaja": countBacklogPriorizadoBaja,
		"priorizacionDiaAlta": countBacklogPriorizadoAlta,
		"priorizacionDiaUrgente": countBacklogPriorizadoUrgente,
		"reaperturas": queryJIRAReOpen,
		"priorizados": priorizadosPorRegistro.length,
		"repetitivos": quwryJIRARepetitivos,
		"totalPendientes": queryNocsIdEnBandeja.length
	};


	//armo el json de la respuesta final
	let backlogJsonResponse = {
		backlog,
		datosUltimos6DiasArray,
		distribucionModulo,
		priorizadosPorRegistro
	} 

	await response.status(200).send(backlogJsonResponse);

	logger.taskEndInfo(TASKNAME);

	let mailTxt = 'Se envio Backlog Diario';
	await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);
}

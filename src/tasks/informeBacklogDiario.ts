import { Noc } from '../entities/Noc';
import express = require('express');
import * as logger from '../logger';
import * as emailtools from '../tools/EMAILTools';
import * as nocservices from '../externalServices/RESTService/NOCService';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import * as googlesheet from '../tools/GSHEETTools';


//lau necesita registro previo de     
// resumen.totalPendientes
// priorizados[{todas las filas

const TASKNAME = 'INFORME BACKLOG DIARIO'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

let response:express.Response;

export async function run(req: express.Request, res: express.Response){
	response = res;    
	logger.taskBeginInfo(TASKNAME);


	let nocsArray = new Array;
	let modulesArrayAll = new Array;
	let modulesArray = new Array;
	//contadores
	let countBacklogPriorizadoUrgente:number = 0;
	let countBacklogPriorizadoAlta:number = 0;
	let countBacklogPriorizadoBaja:number = 0;

	let countDistribucionModuloPrd:number = 0;
	let countDistribucionModuloHml:number = 0;
	let countDistribucionModuloCapa:number = 0;

	let distribucionModulo:{};
	let distribucionModuloToJSON:string;

	let priorizadosPorRegistro:{};
	let priorizadosPorRegistroToJSON:string;


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

	//recorro el listado de nocs para llenar contar prioridades
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
	distribucionModuloToJSON = '{';
	for(let i = 0; i < modulesArray.length; i++){
		distribucionModuloToJSON += '"'+modulesArray[i]+'":{'
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
		distribucionModuloToJSON += '"prd":"'+countDistribucionModuloPrd+'",';
		distribucionModuloToJSON += '"hml":"'+countDistribucionModuloHml+'",';
		distribucionModuloToJSON += '"capa":"'+countDistribucionModuloCapa+'"';
		distribucionModuloToJSON += '}'

		countDistribucionModuloPrd = 0;
		countDistribucionModuloHml = 0;
		countDistribucionModuloCapa = 0;

		if(i < modulesArray.length-1){
			distribucionModuloToJSON += ','
		}
	}
	distribucionModuloToJSON += '}';


	//armado de listado de priorizados

	let listaPriorizados;
	listaPriorizados = await googlesheet.getPriorizados();

	priorizadosPorRegistroToJSON = '{'
	for(let i = 0; i < listaPriorizados.length; i++){

		priorizadosPorRegistroToJSON += '"priorizado'+(i+1)+'":'
		priorizadosPorRegistroToJSON += '{'
		priorizadosPorRegistroToJSON += '"noc":"'          +(<string>listaPriorizados[i]['noc']).     replace(/"/g,'')+'",';
		priorizadosPorRegistroToJSON += '"resumen":"'      +(<string>listaPriorizados[i]['resumen']). replace(/"/g,'')+'",';
		priorizadosPorRegistroToJSON += '"modulo":"'       +(<string>listaPriorizados[i]['modulo']).  replace(/"/g,'')+'",';
		priorizadosPorRegistroToJSON += '"entorno":"'	   +(<string>listaPriorizados[i]['entorno']). replace(/"/g,'')+'",';
		priorizadosPorRegistroToJSON += '"estado":"'	   +(<string>listaPriorizados[i]['estado']).  replace(/"/g,'')+'",';
		priorizadosPorRegistroToJSON += '"fechaCreacion":"'+(<string>listaPriorizados[i]['asignado']).replace(/"/g,'')+'"';
		priorizadosPorRegistroToJSON += '}'

		if(i < listaPriorizados.length-1){
			priorizadosPorRegistroToJSON += ','
		}
	}
	priorizadosPorRegistroToJSON += '}'

	console.log(priorizadosPorRegistroToJSON);

	let priorizacionDia:{} = {
		"baja": countBacklogPriorizadoBaja,
		"alta": countBacklogPriorizadoAlta,
		"urgente": countBacklogPriorizadoUrgente
	};

	let creadasVsResueltasDia:{} = {
		"creadas": queryJIRACreados,
		"resueltas": queryJIRAResueltos
	};

	let backlogPriorizadoPorcentaje:{} = {
		"urgente": (countBacklogPriorizadoUrgente/queryNocsIdEnBandeja.length).toFixed(2),
		"alta": (countBacklogPriorizadoAlta/queryNocsIdEnBandeja.length).toFixed(2),
		"baja": (countBacklogPriorizadoBaja/queryNocsIdEnBandeja.length).toFixed(2)
	};

	let reabiertosDia:{} = {
		"reaperturas": queryJIRAReOpen,
	}

	distribucionModulo = JSON.parse(distribucionModuloToJSON);

	let resumen:{} = {
		"reaperturas": queryJIRAReOpen,
		"priorizados": listaPriorizados.length,
		"repetitivos": quwryJIRARepetitivos,
		"totalPendientes": queryNocsIdEnBandeja.length
	};

	priorizadosPorRegistro = JSON.parse(priorizadosPorRegistroToJSON)


	let backlogJsonResponse = {
		priorizacionDia,
		creadasVsResueltasDia,
		backlogPriorizadoPorcentaje,
		reabiertosDia,
		distribucionModulo,
		resumen,
		priorizadosPorRegistro
	} 

	//INSERTAR LOS DATOS EN LA BBDD	
	//TRAER DATOS DE DIAS ANTERIORES DESDE BBDD
	//ARMAR SERVICIO PARA EL GUARDADO CONSTANTE DE PRIORIZADOS EN LA BBDD

	await response.status(200).send(backlogJsonResponse);

	logger.taskEndInfo(TASKNAME);

	let mailTxt = 'Se envio Backlog Diario';
	await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);
}

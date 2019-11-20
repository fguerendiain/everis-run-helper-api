import * as moment from 'moment';
import * as bbddpostgres from '../entities/BBDDPostgres';
import express = require('express');
import * as logger from '../logger';
import * as emailtools from '../tools/EMAILTools';
import * as googlesheet from '../externalServices/RESTService/GSHEETService'
import { isNullOrUndefined } from 'util';

const TASKNAME = 'PRIORIZADOS UPDATE'
const RESPONSABLE = 'gilda.lucia.russo@everis.com'

export async function run(req: express.Request, res: express.Response){

	let dateNow:string = moment().format('YYYYMMDD');

	logger.taskBeginInfo(TASKNAME);

    let listadoPriorizados = await googlesheet.getPriorizados();

    
    for(let i = 0; i < listadoPriorizados.length; i++){

        let stringResumen:string = listadoPriorizados[i].resumen;
        if(!isNullOrUndefined(stringResumen)){
            stringResumen = stringResumen.replace(/\'/,'´');
        }

        let queryInsertPriorizados:string = 'INSERT INTO "PRIORIZADOS"("FECHA","NOC","RESUMEN","MODULO","ENTORNO","ESTADO","FECHA_CREACION")VALUES(';
        queryInsertPriorizados+= /*FECHA*/dateNow+',';
        queryInsertPriorizados+= /*NOC*/"'"+listadoPriorizados[i].noc+"',";
        queryInsertPriorizados+= /*RESUMEN*/"'"+stringResumen+"',";
        queryInsertPriorizados+= /*MODULO*/"'"+listadoPriorizados[i].modulo+"',";
        queryInsertPriorizados+= /*ENTORNO*/"'"+listadoPriorizados[i].entorno+"',";
        queryInsertPriorizados+= /*ESTADO*/"'"+listadoPriorizados[i].estado+"',";
        queryInsertPriorizados+= /*FECHA_CREACION*/"'"+listadoPriorizados[i].fechacreacion+"');";

        //si el priorizado no tiene visibilidad no se inserta en base y se envia por mail
        if(listadoPriorizados[i].entorno == 'SIN VISIBILIDAD'){

            let existeEnBBDD = (await new bbddpostgres.BBDDconect().query('SELECT COUNT(1) as EXISTE FROM "PRIORIZADOS_SIN_VISIBILIDAD" WHERE "NOC" = '+"'"+listadoPriorizados[i].noc+"'"+' AND "FECHA" = '+"'"+dateNow+"'"+';'));
            //si el noc sin visibilidad no existe en la BBDD lo creo e informo por mail
            if(existeEnBBDD[0].existe == 0){
                        await new bbddpostgres.BBDDconect().query('INSERT INTO public."PRIORIZADOS_SIN_VISIBILIDAD"("NOC", "FECHA") VALUES ('+"'"+listadoPriorizados[i].noc+"'"+', '+"'"+dateNow+"'"+');');
                let mailTxt =
                `El NOC-${listadoPriorizados[i].noc} no posee visibilidad para Everis\
                \nhttps://noc-mesa.buenosaires.gob.ar/WorkOrder.do?woMode=viewWO&woID=${listadoPriorizados[i].noc}&&fromListView=true`;
                await emailtools.sendByMail(RESPONSABLE,'Error: '+TASKNAME,mailTxt);            }
        }else{
            //si ya existe el priorizado se verifica el estado de lo contrario se inserta
            let priorizadoExiste = (await new bbddpostgres.BBDDconect().query('SELECT count(*) FROM "PRIORIZADOS" WHERE "FECHA" = '+"'"+dateNow+"'"+' AND "NOC" = '+"'"+listadoPriorizados[i].noc+"'"+';'))[0].count;
            if(priorizadoExiste == 0){
                await new bbddpostgres.BBDDconect().query(queryInsertPriorizados);
            }else{
                let estadoExistente = (await new bbddpostgres.BBDDconect().query('SELECT "ESTADO" FROM "PRIORIZADOS" WHERE "FECHA" = '+"'"+dateNow+"'"+' AND "NOC" = '+"'"+listadoPriorizados[i].noc+"'"+';'))[0].ESTADO;
                if(!(estadoExistente ==  listadoPriorizados[i].estado)){
                    await new bbddpostgres.BBDDconect().query('UPDATE "PRIORIZADOS" SET "ESTADO" = '+"'"+listadoPriorizados[i].estado+"'"+'WHERE "FECHA" = '+"'"+dateNow+"'"+' AND "NOC" = '+"'"+listadoPriorizados[i].noc+"'"+';')
                }
            }
        }
    }

	//let mailTxt = 'Se cargaron priorizados a la BBDD';
	//await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);

    await res.status(200).send(listadoPriorizados);
    logger.taskEndInfo(TASKNAME);
}


//Obtengo el listado de priorizados para el dia indicado
export async function getAllPriorizadosByDay(date:string){
    let listadoPriorizadosArray = new Array();
	let BBDDPriorizados = new bbddpostgres.BBDDconect()
	let listadoPriorizados:any[] = <[]>(await BBDDPriorizados.query('SELECT * FROM "PRIORIZADOS" WHERE "FECHA" = '+"'"+date+"'"+';'));

    //armo el JSON
	for(let i = 0; i < listadoPriorizados.length ; i++){
		let datosPriorizado:{} = {
			"fecha": listadoPriorizados[i].FECHA,
			"noc": listadoPriorizados[i].NOC,
			"resumen": listadoPriorizados[i].RESUMEN,
			"modulo": listadoPriorizados[i].MODULO,
			"entorno": listadoPriorizados[i].ENTORNO,
			"estado": listadoPriorizados[i].ESTADO,
			"fechaCreacion": listadoPriorizados[i].FECHA_CREACION
		};
		listadoPriorizadosArray.push(datosPriorizado);
	}

    return listadoPriorizadosArray;
}
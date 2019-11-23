import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';

//Task makeer Resources
import * as bbddtools from '../entities/BBDDOracle';
import * as emailtools from '../tools/EMAILTools';
import * as ffccservices from '../externalServices/WSService/FFCCService';
import { isNullOrUndefined } from 'util';

var readEachLineSync = require('read-each-line-sync')
//const LineByLineReader = require('line-by-line')

const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'APPSADE-9570 - Update nro Transaccion PSOC'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

let response: express.Response;

var bbdd = new bbddtools.BBDDinstance(BBDDORACLE.test);
var vSistemaOrigen:string = 'PSOC';
var vUrlEntorno:string = 'http://fc-test.gcaba.everis.int';
var succesCounter:number = 0;
var errorCounter:number = 0;

export async function run(req: express.Request, res: express.Response) {
    
    response = res;

    await logger.taskBeginInfo(TASKNAME);

    await readEachLineSync('./src/resources/APPSADE9579CASOS.txt',async function(line) {
        await processEachLine(line);
    });

    let mailTxt = 'Regulatorio APPSADE-9570 se genera nueva transaccion para transacciones con problemas en JSON de visibilidad';
    await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);

	await res.status(200).send({response:'Fin del Regulatorio',resultado:{ok:succesCounter,error:errorCounter}});
	await logger.taskEndInfo(TASKNAME);

}

async function processEachLine(line){
    return new Promise(async (resolve,reject)=>{
        let vIdOldTransaccion:number;
        let serviceResponse;
        let vIdNewTransaccion;
        let vIdBeneficio:number;

        let queryString: string = "select ft.id_transaccion, ft.fk_beneficio, '<fechaCreacion>'||ft.fecha_transaccion||'</fechaCreacion>' as fechaCreacion,'<nombreFormulario>'||df.name||'</nombreFormulario>' as nombreFormulario, '<etiqueta>'||dfc.LABEL||'</etiqueta>' as etiqueta, '<idFormComp>'||gdfcv.ID_FORM_COMPONENT||'</idFormComp>' as idFormComp, '<inputName>'||gdfcv.INPUT_NAME||'</inputName>' as inputName, (SELECT CASE WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NOT NULL) THEN '<valorBoolean>'||TO_CHAR(gdfcv.VALUE_BOOLEAN)||'</valorBoolean>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS not NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorDouble>'||TO_CHAR(gdfcv.VALUE_DOUBLE)||'</valorDouble>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS not NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorDate>'||TO_CHAR(gdfcv.VALUE_DATE,'YYYY-MM-DD\"T\"HH24:MI:SS.FF')||'</valorDate>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NOT NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorLong>'||TO_CHAR(gdfcv.VALUE_INT)||'</valorLong>' WHEN (gdfcv.VALUE_STR IS NOT NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorStr>'||TO_CHAR(gdfcv.VALUE_STR)||'</valorStr>' END AS SARAZA FROM DUAL) AS VALOR from psoc_sade.PSOC_FC_TRANSACCIONES ft JOIN GEDO_SADE.DF_FORM_COMP_VALUE gdfcv ON gdfcv.ID_TRANSACTION = ft.ID_TRANSACCION JOIN GEDO_SADE.DF_FORM_COMPONENT dfc ON dfc.id = gdfcv.id_form_component join gedo_sade.df_form df ON dfc.id_form = df.ID where ft.ID_TRANSACCION ="+line;
        
        //OBTENGO DATOS DE BBDD
        let bbddData = await bbdd.BBDDData(queryString).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});

        vIdOldTransaccion = bbddData[0].ID_TRANSACCION;
        vIdBeneficio = bbddData[0].FK_BENEFICIO;

        //GENERO NUEVA TRANSACCION
        serviceResponse = await ffccservices.grabarTransaccion(vUrlEntorno,bbddData[0].FECHACREACION,bbddData[0].NOMBREFORMULARIO,vSistemaOrigen,bbddData);

        vIdNewTransaccion = serviceResponse.Envelope.Body.grabarTransaccionResponse.return;

        //GUARDO LOG SEGUN LA RESPUESTA OBTENIDA
        if(isNullOrUndefined(vIdNewTransaccion)){
            let errorLogMessage:string = 'transaccion anterior: '+vIdOldTransaccion+' | transaccion nueva: '+vIdNewTransaccion+' | ID_BENEFICIO = '+vIdBeneficio;
            logger.minimal(errorLogMessage,'appsade9570_ERROR.txt');
            errorCounter += 1;
        }else{
            let updatePsocLogMessage:string = 'UPDATE PSOC_SADE.PSOC_FC_TRANSACCIONES SET ID_TRANSACCION = '+vIdNewTransaccion+' WHERE FK_BENEFICIO = '+vIdBeneficio+' AND ID_TRANSACCION = '+vIdOldTransaccion+';';
            let updateGedoLogMessage:string = 'UPDATE GEDO_SADE.GEDO_DOCUMENTO_SOLICITUD SET ID_TRANSACCION = '+vIdNewTransaccion+' WHERE ID_TRANSACCION = '+vIdOldTransaccion+';';
            let historyLogMessage:string = 'transaccion anterior: '+vIdOldTransaccion+' | transaccion nueva: '+vIdNewTransaccion+' | ID_BENEFICIO = '+vIdBeneficio;
            logger.minimal(updatePsocLogMessage,'appsade9570_UPDATES.txt');
            logger.minimal(updateGedoLogMessage,'appsade9570_UPDATES.txt');
            logger.minimal(historyLogMessage,'appsade9570_HIST.txt');
            succesCounter += 1;
        }
        return resolve;        
    });
}
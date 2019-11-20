import * as express from 'express'
import * as config from '../config'
import * as logger from '../logger';

//Task makeer Resources
import * as promisetools from '../tools/PromiseTools';
import * as bbddtools from '../entities/BBDDOracle';
import * as emailtools from '../tools/EMAILTools';
import * as eeservices from '../externalServices/WSService/EEService';
import * as gedoservices from '../externalServices/WSService/GEDOService';
import * as pdiservices from '../externalServices/WSService/PDIService';
import * as buiservices from '../externalServices/RESTService/BUIService';
import * as gpservices from '../externalServices/RESTService/GPService';
import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { isNullOrUndefined } from 'util';
//import * as nocservices from '../externalServices/RESTService/NOCService';


const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'APPSADE-9570 - Update nro Transaccion PSOC'
const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

let response: express.Response;

export async function run(req: express.Request, res: express.Response) {

    response = res;

    logger.taskBeginInfo(TASKNAME);

    let transacciones:Number[] = casosARegularizar();

//    for(let i= 0 ; i > transacciones.length ; i++){

        let bbdd = new bbddtools.BBDDinstance(BBDDORACLE.test);
        let queryString: string = "select ft.id_transaccion, ft.fk_beneficio, '<nombreFormulario>'||df.name||'</nombreFormulario>' as nombreFormulario, '<etiqueta>'||dfc.LABEL||'</etiqueta>' as etiqueta, '<idFormComp>'||gdfcv.ID_FORM_COMPONENT||'</idFormComp>' as idFormComp, '<inputName>'||gdfcv.INPUT_NAME||'</inputName>' as inputName, (SELECT CASE WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NOT NULL) THEN '<valorBoolean>'||TO_CHAR(gdfcv.VALUE_BOOLEAN)||'</valorBoolean>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS not NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorLong>'||TO_CHAR(gdfcv.VALUE_DOUBLE)||'</valorLong>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS not NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorStr>'||TO_CHAR(gdfcv.VALUE_DATE)||'</valorStr>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NOT NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorLong>'||TO_CHAR(gdfcv.VALUE_INT)||'</valorLong>' WHEN (gdfcv.VALUE_STR IS NOT NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorStr>'||TO_CHAR(gdfcv.VALUE_STR)||'</valorStr>' END AS SARAZA FROM DUAL) AS VALOR from psoc_sade.PSOC_FC_TRANSACCIONES ft JOIN GEDO_SADE.DF_FORM_COMP_VALUE gdfcv ON gdfcv.ID_TRANSACTION = ft.ID_TRANSACCION JOIN GEDO_SADE.DF_FORM_COMPONENT dfc ON dfc.id = gdfcv.id_form_component join gedo_sade.df_form df ON dfc.id_form = df.ID where ft.ID_TRANSACCION ="+transacciones[0];
        let vIdOldTransaccion:number;
        let vIdNewTransaccion:number;
        let vIdBeneficio:number;

        let bbddData = await bbdd.BBDDData(queryString).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});

        vIdOldTransaccion = bbddData[0].ID_TRANSACCION;
        vIdBeneficio = bbddData[0].FK_BENEFICIO;

        let xmlStringBuilder:string;
        xmlStringBuilder = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.dynform.tramelec.everis.com/">';
        xmlStringBuilder += '<soapenv:Header/>';
        xmlStringBuilder += '<soapenv:Body>';
        xmlStringBuilder += '<ser:grabarTransaccion>';
        xmlStringBuilder += '<arg0>';
        xmlStringBuilder += '<fechaCreacion>'+/*SYSDATE EN RFC3339*/'</fechaCreacion>';
        xmlStringBuilder += bbddData[0].NOMBREFORMULARIO;
        xmlStringBuilder += '<sistOrigen>PSOC</sistOrigen>';

        for(let i=0; i < bbddData.length; i++){
            xmlStringBuilder += '<valorFormComps>';
            xmlStringBuilder += bbddData[i].ETIQUETA;
            xmlStringBuilder += bbddData[i].IDFORMCOMP;
            xmlStringBuilder += bbddData[i].INPUTNAME;
            xmlStringBuilder += bbddData[i].VALOR;
            xmlStringBuilder += '</valorFormComps>';

        }
        xmlStringBuilder += '</arg0>';
        xmlStringBuilder += '</ser:grabarTransaccion>';
        xmlStringBuilder += '</soapenv:Body>';
        xmlStringBuilder += '</soapenv:Envelope>';

//Armar controlador de webService para generar las transacciones
//        await pdiservices.getCalleDireccionValidas(direccion[0], direccion[1]).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});

        let updateString:string = 'UPDATE PSOC_SADE.PSOC_BENEFICIO SET ID_TRANSACCION = '+vIdNewTransaccion+' WHERE ID_BENEFICIO = '+vIdBeneficio+';'
        logger.info('UPDATE',updateString,'appsade9570.txt');

//    }

	let mailTxt = 'Se envio Backlog Diario';
	await emailtools.sendByMail(RESPONSABLE,TASKNAME,mailTxt);

	await res.status(200).send(xmlStringBuilder);
	logger.taskEndInfo(TASKNAME);

}


function casosARegularizar(){
    return [114720,112700,112701,113708,113707]
}
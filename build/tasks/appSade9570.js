"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config");
const logger = require("../logger");
const bbddtools = require("../entities/BBDDOracle");
const emailtools = require("../tools/EMAILTools");
//import * as nocservices from '../externalServices/RESTService/NOCService';
const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'APPSADE-9570 - Update nro Transaccion PSOC';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
let response;
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response = res;
        logger.taskBeginInfo(TASKNAME);
        let transacciones = casosARegularizar();
        //    for(let i= 0 ; i > transacciones.length ; i++){
        let bbdd = new bbddtools.BBDDinstance(BBDDORACLE.test);
        let queryString = "select ft.id_transaccion, ft.fk_beneficio, '<nombreFormulario>'||df.name||'</nombreFormulario>' as nombreFormulario, '<etiqueta>'||dfc.LABEL||'</etiqueta>' as etiqueta, '<idFormComp>'||gdfcv.ID_FORM_COMPONENT||'</idFormComp>' as idFormComp, '<inputName>'||gdfcv.INPUT_NAME||'</inputName>' as inputName, (SELECT CASE WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NOT NULL) THEN '<valorBoolean>'||TO_CHAR(gdfcv.VALUE_BOOLEAN)||'</valorBoolean>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS not NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorLong>'||TO_CHAR(gdfcv.VALUE_DOUBLE)||'</valorLong>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS not NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorStr>'||TO_CHAR(gdfcv.VALUE_DATE)||'</valorStr>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NOT NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorLong>'||TO_CHAR(gdfcv.VALUE_INT)||'</valorLong>' WHEN (gdfcv.VALUE_STR IS NOT NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorStr>'||TO_CHAR(gdfcv.VALUE_STR)||'</valorStr>' END AS SARAZA FROM DUAL) AS VALOR from psoc_sade.PSOC_FC_TRANSACCIONES ft JOIN GEDO_SADE.DF_FORM_COMP_VALUE gdfcv ON gdfcv.ID_TRANSACTION = ft.ID_TRANSACCION JOIN GEDO_SADE.DF_FORM_COMPONENT dfc ON dfc.id = gdfcv.id_form_component join gedo_sade.df_form df ON dfc.id_form = df.ID where ft.ID_TRANSACCION =" + transacciones[0];
        let vIdOldTransaccion;
        let vIdNewTransaccion;
        let vIdBeneficio;
        let bbddData = yield bbdd.BBDDData(queryString).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
        vIdOldTransaccion = bbddData[0].ID_TRANSACCION;
        vIdBeneficio = bbddData[0].FK_BENEFICIO;
        let xmlStringBuilder;
        xmlStringBuilder = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.dynform.tramelec.everis.com/">';
        xmlStringBuilder += '<soapenv:Header/>';
        xmlStringBuilder += '<soapenv:Body>';
        xmlStringBuilder += '<ser:grabarTransaccion>';
        xmlStringBuilder += '<arg0>';
        xmlStringBuilder += '<fechaCreacion>' + /*SYSDATE EN RFC3339*/ '</fechaCreacion>';
        xmlStringBuilder += bbddData[0].NOMBREFORMULARIO;
        xmlStringBuilder += '<sistOrigen>PSOC</sistOrigen>';
        for (let i = 0; i < bbddData.length; i++) {
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
        //        await pdiservices.getCalleDireccionValidas(direccion[0], direccion[1]).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        //        let updateString:string = 'UPDATE PSOC_SADE.PSOC_BENEFICIO SET ID_TRANSACCION = '+vIdNewTransaccion+' WHERE ID_BENEFICIO = '+vIdBeneficio+';'
        //        logger.info('UPDATE',updateString,'appsade9570.txt');
        //    }
        let mailTxt = 'Se envio Backlog Diario';
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
        yield res.status(200).send(xmlStringBuilder);
        logger.taskEndInfo(TASKNAME);
    });
}
exports.run = run;
function casosARegularizar() {
    return [114720, 112700, 112701, 113708, 113707];
}
//# sourceMappingURL=appSade9570.js.map
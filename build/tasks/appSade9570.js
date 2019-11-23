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
//Task makeer Resources
const bbddtools = require("../entities/BBDDOracle");
const emailtools = require("../tools/EMAILTools");
const ffccservices = require("../externalServices/WSService/FFCCService");
const util_1 = require("util");
var readEachLineSync = require('read-each-line-sync');
//const LineByLineReader = require('line-by-line')
const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'APPSADE-9570 - Update nro Transaccion PSOC';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
let response;
var bbdd = new bbddtools.BBDDinstance(BBDDORACLE.test);
var vSistemaOrigen = 'PSOC';
var vUrlEntorno = 'http://fc-test.gcaba.everis.int';
var succesCounter = 0;
var errorCounter = 0;
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response = res;
        yield logger.taskBeginInfo(TASKNAME);
        yield readEachLineSync('./src/resources/APPSADE9579CASOS.txt', function (line) {
            return __awaiter(this, void 0, void 0, function* () {
                yield processEachLine(line);
            });
        });
        let mailTxt = 'Regulatorio APPSADE-9570 se genera nueva transaccion para transacciones con problemas en JSON de visibilidad';
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
        yield res.status(200).send({ response: 'Fin del Regulatorio', resultado: { ok: succesCounter, error: errorCounter } });
        yield logger.taskEndInfo(TASKNAME);
    });
}
exports.run = run;
function processEachLine(line) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let vIdOldTransaccion;
            let serviceResponse;
            let vIdNewTransaccion;
            let vIdBeneficio;
            let queryString = "select ft.id_transaccion, ft.fk_beneficio, '<fechaCreacion>'||ft.fecha_transaccion||'</fechaCreacion>' as fechaCreacion,'<nombreFormulario>'||df.name||'</nombreFormulario>' as nombreFormulario, '<etiqueta>'||dfc.LABEL||'</etiqueta>' as etiqueta, '<idFormComp>'||gdfcv.ID_FORM_COMPONENT||'</idFormComp>' as idFormComp, '<inputName>'||gdfcv.INPUT_NAME||'</inputName>' as inputName, (SELECT CASE WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NOT NULL) THEN '<valorBoolean>'||TO_CHAR(gdfcv.VALUE_BOOLEAN)||'</valorBoolean>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS not NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorDouble>'||TO_CHAR(gdfcv.VALUE_DOUBLE)||'</valorDouble>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS not NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorDate>'||TO_CHAR(gdfcv.VALUE_DATE,'YYYY-MM-DD\"T\"HH24:MI:SS.FF')||'</valorDate>' WHEN (gdfcv.VALUE_STR IS NULL AND gdfcv.VALUE_INT IS NOT NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorLong>'||TO_CHAR(gdfcv.VALUE_INT)||'</valorLong>' WHEN (gdfcv.VALUE_STR IS NOT NULL AND gdfcv.VALUE_INT IS NULL AND gdfcv.VALUE_DATE IS NULL AND gdfcv.VALUE_DOUBLE IS NULL AND gdfcv.VALUE_BOOLEAN IS NULL) THEN '<valorStr>'||TO_CHAR(gdfcv.VALUE_STR)||'</valorStr>' END AS SARAZA FROM DUAL) AS VALOR from psoc_sade.PSOC_FC_TRANSACCIONES ft JOIN GEDO_SADE.DF_FORM_COMP_VALUE gdfcv ON gdfcv.ID_TRANSACTION = ft.ID_TRANSACCION JOIN GEDO_SADE.DF_FORM_COMPONENT dfc ON dfc.id = gdfcv.id_form_component join gedo_sade.df_form df ON dfc.id_form = df.ID where ft.ID_TRANSACCION =" + line;
            //OBTENGO DATOS DE BBDD
            let bbddData = yield bbdd.BBDDData(queryString).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            vIdOldTransaccion = bbddData[0].ID_TRANSACCION;
            vIdBeneficio = bbddData[0].FK_BENEFICIO;
            //GENERO NUEVA TRANSACCION
            serviceResponse = yield ffccservices.grabarTransaccion(vUrlEntorno, bbddData[0].FECHACREACION, bbddData[0].NOMBREFORMULARIO, vSistemaOrigen, bbddData);
            vIdNewTransaccion = serviceResponse.Envelope.Body.grabarTransaccionResponse.return;
            //GUARDO LOG SEGUN LA RESPUESTA OBTENIDA
            if (util_1.isNullOrUndefined(vIdNewTransaccion)) {
                let errorLogMessage = 'transaccion anterior: ' + vIdOldTransaccion + ' | transaccion nueva: ' + vIdNewTransaccion + ' | ID_BENEFICIO = ' + vIdBeneficio;
                logger.minimal(errorLogMessage, 'appsade9570_ERROR.txt');
                errorCounter += 1;
            }
            else {
                let updatePsocLogMessage = 'UPDATE PSOC_SADE.PSOC_FC_TRANSACCIONES SET ID_TRANSACCION = ' + vIdNewTransaccion + ' WHERE FK_BENEFICIO = ' + vIdBeneficio + ' AND ID_TRANSACCION = ' + vIdOldTransaccion + ';';
                let updateGedoLogMessage = 'UPDATE GEDO_SADE.GEDO_DOCUMENTO_SOLICITUD SET ID_TRANSACCION = ' + vIdNewTransaccion + ' WHERE ID_TRANSACCION = ' + vIdOldTransaccion + ';';
                let historyLogMessage = 'transaccion anterior: ' + vIdOldTransaccion + ' | transaccion nueva: ' + vIdNewTransaccion + ' | ID_BENEFICIO = ' + vIdBeneficio;
                logger.minimal(updatePsocLogMessage, 'appsade9570_UPDATES.txt');
                logger.minimal(updateGedoLogMessage, 'appsade9570_UPDATES.txt');
                logger.minimal(historyLogMessage, 'appsade9570_HIST.txt');
                succesCounter += 1;
            }
            return resolve;
        }));
    });
}
//# sourceMappingURL=appSade9570.js.map
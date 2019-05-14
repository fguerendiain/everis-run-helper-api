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
const promisetools = require("../tools/PromiseTools");
const bbddtools = require("../tools/BBDDtools");
const emailtools = require("../tools/EMAILTools");
const pdiservices = require("../externalServices/WSService/PDIService");
const gpservices = require("../externalServices/RESTService/GPService");
const jiraservices = require("../externalServices/RESTService/JIRAService");
const util_1 = require("util");
//import * as nocservices from '../externalServices/RESTService/NOCService';
const BBDDORACLE = config.get("bbddoracle");
const TASKNAME = 'VINCULAR DOCUMENTO';
const RESPONSABLE = 'fguerendiain33@gmail.com';
let response;
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response = res;
        logger.taskBeginInfo(TASKNAME);
        let bbdd = new bbddtools.BBDDinstance(BBDDORACLE.prd);
        let queryString = "select ttt.ID as ID_TRATA,ttt.TRATA,ttt.NOMBRE,ttt.MOTIVO,ttt.ESTADO as ESTADO_TRATA,ttt.USUARIO_INICIADOR, (SELECT CASE WHEN ssu.ESTADO_REGISTRO = 1 THEN 'ALTA' WHEN ssu.ESTADO_REGISTRO = 0 THEN 'BAJA' end as SARAZA from dual) AS ESTADO_USR, (select count(1) from TAD_sADE.TAD_EXPEDIENTE_BASE tebcarat JOIN EE_SADE.EE_EXPEDIENTE_ELECTRONICO eeecarat ON ((tebcarat.anio = eeecarat.anio and tebcarat.numero = tebcarat.numero) and eeecarat.FECHA_CREACION > SYSDATE-30) WHERE tebcarat.TIPO_TRAMITE_ID = ttt.ID) as EX_CARTULADOS_ULT_MES, (select eeeult.TIPO_DOCUMENTO||'-'||eeeult.ANIO||'-'||LPAD(eeeult.NUMERO,8,0)||'-   -'||eeeult.CODIGO_REPARTICION_ACTUACION||'-'||eeeult.CODIGO_REPARTICION_USUARIO||' creado: '||eeeult.FECHA_CREACION FROM EE_SADE.EE_EXPEDIENTE_ELECTRONICO eeeult WHERE eeeult.ID = (select MAX(eeecarat1.id) from TAD_sADE.TAD_EXPEDIENTE_BASE tebcarat1 JOIN EE_SADE.EE_EXPEDIENTE_ELECTRONICO eeecarat1 ON ((tebcarat1.anio = eeecarat1.anio and tebcarat1.numero = tebcarat1.numero) and eeecarat1.FECHA_CREACION > SYSDATE-30) WHERE tebcarat1.TIPO_TRAMITE_ID = ttt.ID)) as ULT_EXP_CARATULADO, ttt.REPARTICION_INICIADORA, (SELECT CASE WHEN sr.ESTADO_REGISTRO = 1 THEN 'ALTA' WHEN sr.ESTADO_REGISTRO = 0 THEN 'BAJA' END AS SARAZA FROM DUAL) AS ESTADO_REPA, TRIM(TO_CHAR(sr.vigencia_hasta,'DD/MM/YYYY')) as VIGENCIA_REPA, ttt.SECTOR_INICIADOR, (SELECT CASE WHEN ssi.ESTADO_REGISTRO = 1 THEN 'ALTA' WHEN ssi.ESTADO_REGISTRO = 0 THEN 'BAJA' END AS SARAZA FROM DUAL) AS ESTADO_SEC, TRIM(TO_CHAR(ssi.vigencia_hasta,'DD/MM/YYYY')) AS VIGENCIA_SEC, ttt.PATH_INICIAL, ttt.NOMBRE_FORMULARIO, ttt.APODERABLE, ttt.INTERVINIENTE, ttt.MULTIPLES_INTERVINIENTES, TRIM(TO_CHAR(ttt.FECHA_CREACION,'DD/MM/YYYY HH24:MI:SS')) AS FECHA_CREACION, TRIM(TO_CHAR(ttt.FECHA_MODIFICACION,'DD/MM/YYYY HH24:MI:SS')) AS FECHA_MODIFICACION, ttt.USUARIO_MODIFICACION, ttt.ACRONIMO_GEDO_BUI, ttt.GENERA_BUI, ttt.DGROC, ttt.DEFENSA_CIVIL, ttt.VALIDARLM, ttt.AGILES, ttt.REQUISITOS_COD_CONTENIDO, ttt.ID_TIPO_DOC_FORMULARIO, ttt.ID_GRUPO, ttt.VERSION, ttt.MENSAJE_EXITO, ttt.ANEXO1, ttt.ANEXO3, ttt.PAGO, ttt.TURNO, ttt.ID_TRAMITE_TURNO, ttt.ARCHIVO_TRABAJO, ttt.PREVALIDACION, ttt.SUPER_TRATA, ttt.INPUT_NAME_FC, ttt.VALIDA_TRAMITE_UNICO, ttt.FK_TIPO_NOTIFICACION_TEMPLATE, ttt.ORDEN_DE_GRUPO, ttt.URL_SISTEMA_EXTERNO, ttt.ESTADO_TRAMITE_DEFAULT from tad_Sade.tad_tipo_tramite ttt join TRACK_SADE.SADE_SECTOR_INTERNO ssi on (ssi.codigo_sector_interno = ttt.SECTOR_INICIADOR AND ssi.CODIGO_REPARTICION = ( SELECT ID_REPARTICION FROM TRACK_SADE.SADE_REPARTICION WHERE CODIGO_REPARTICION = ttt.REPARTICION_INICIADORA)) JOIN TRACK_SADE.SADE_REPARTICION sr on sr.CODIGO_REPARTICION = ttt.REPARTICION_INICIADORA left outer join (select usr.nombre_usuario, usr.estado_registro,sr.codigo_reparticion, ssi.codigo_sector_interno from (select 'Sade_Sector_Usuario' as Tabla, nombre_usuario, id_sector_interno, estado_registro from TRACK_SADE.Sade_Sector_Usuario union select 'Sade_Usr_Repa_Habilitada' as Tabla, nombre_usuario, id_sector_interno, 'Sin Estado' from TRACK_SADE.Sade_Usr_Repa_Habilitada) usr join TRACK_SADE.SADE_SECTOR_INTERNO ssi on ssi.id_sector_interno = Usr.Id_Sector_Interno join track_sade.sade_reparticion sr on sr.id_reparticion = ssi.codigo_reparticion) ssu on ((ssu.Nombre_Usuario, ssu.codigo_reparticion, ssu.codigo_sector_interno) in ((ttt.USUARIO_INICIADOR,ttt.REPARTICION_INICIADORA,ttt.SECTOR_INICIADOR))) where ttt.trata in ('MDUG0112H,','MCGC0105B','MCGC0302A')";
        let queryString1 = 'select * from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';
        let idExpTad = '1625485';
        let direccion = ['amenabar', '2000'];
        let queryBuscaJira = 'Gestion Administrativa y de tareas Internas';
        let queryBuscaJiraTrans = 'BISADE-69361';
        //ARRAY DE PROMESAS CON LAS CONSULTAS A LOS SERVICIOS NECESARIAS PARA LA TAREA
        let querys = [
            yield bbdd.BBDDData(queryString).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield bbdd.BBDDData(queryString1).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield gpservices.getParticipantesExpediente(idExpTad).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield pdiservices.getCalleDireccionValidas(direccion[0], direccion[1]).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield jiraservices.getJiraByText(queryBuscaJira).catch((err) => logger.awaitAsyncErrorHandler(err)),
            yield jiraservices.getTransicionJira(queryBuscaJiraTrans).catch((err) => logger.awaitAsyncErrorHandler(err))
        ];
        promisetools.handlePromises(querys, 'PRUEBA: Retorno de Multiples consultas a servicios', makeItHappen);
    });
}
exports.run = run;
//CONTROLA LA LOGICA INTEGRAL DE LA TAREA TENIENDO TODOS LOS DATOS
function makeItHappen(result) {
    return __awaiter(this, void 0, void 0, function* () {
        if (util_1.isNullOrUndefined(result[0])) {
            logger.taskEndInfo(TASKNAME);
            response.status(404).send(JSON.parse('{"statuscode":"404","message":"No se obtuvo respuesta del servicio"}'));
        }
        else {
            /*HACER MAGIA
                ...
            */
            yield response.status(200).send(result);
            yield logger.taskEndInfo(TASKNAME);
            let mailTxt = 'codeando codeando termine programando';
            yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
        }
    });
}
//# sourceMappingURL=vincularDocumento.js.map
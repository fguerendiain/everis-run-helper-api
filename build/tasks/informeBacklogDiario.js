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
const Noc_1 = require("../entities/Noc");
const logger = require("../logger");
const emailtools = require("../tools/EMAILTools");
const nocservices = require("../externalServices/RESTService/NOCService");
const jiraservices = require("../externalServices/RESTService/JIRAService");
const googlesheet = require("../tools/GSHEETTools");
//lau necesita registro previo de     
// resumen.totalPendientes
// priorizados[{todas las filas
const TASKNAME = 'INFORME BACKLOG DIARIO';
const RESPONSABLE = 'franco.javier.guerendiain@everis.com';
let response;
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        response = res;
        logger.taskBeginInfo(TASKNAME);
        let nocsArray = new Array;
        let modulesArrayAll = new Array;
        let modulesArray = new Array;
        //contadores
        let countBacklogPriorizadoUrgente = 0;
        let countBacklogPriorizadoAlta = 0;
        let countBacklogPriorizadoBaja = 0;
        let countDistribucionModuloPrd = 0;
        let countDistribucionModuloHml = 0;
        let countDistribucionModuloCapa = 0;
        let distribucionModulo;
        let distribucionModuloToJSON;
        let priorizadosPorRegistro;
        let priorizadosPorRegistroToJSON;
        //obtengo listado de nocs desde el servidor de noc
        let queryNocsIdEnBandeja = ((yield nocservices.getNocByFilter().catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).operation.details);
        //obtengo listado de JIRAS creados el dia anterior al actual
        let queryJIRACreados = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Open, "In Progress", Paused) AND created >= -1d AND created <= 0d').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //obtengo listado de JIRAS solucionados el dia anterior al actual
        let queryJIRAResueltos = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Resolved, Closed) AND resolved >= -1d AND resolved <= -0d').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //obtengo listado de JIRAS con reopen en 1 modificados el dia anterior al actual
        let queryJIRAReOpen = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = APM-SUP AND status in (Open, "In Progress", Paused) AND "Reopen Counter" = "1" AND updated >= -1d AND updated <= 0d').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //Obtengo listado de JIRAS correspondientes a regulatorios repetitivos
        let quwryJIRARepetitivos = (yield jiraservices.getJiraByJql('project = BISADE AND issuetype = COM_Bug AND labels = REGULATORIO AND status in (Open, "In Progress", Paused)').catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; })).total;
        //genero un array de objetos noc
        for (let i = 0; i < queryNocsIdEnBandeja.length; i++) {
            let auxNocInsatnce;
            auxNocInsatnce = new Noc_1.Noc(queryNocsIdEnBandeja[i]['WORKORDERID']);
            yield auxNocInsatnce.fillInstanceByNocId();
            nocsArray.push(auxNocInsatnce);
        }
        //recorro el listado de nocs para llenar contar prioridades
        for (let i = 0; i < nocsArray.length; i++) {
            let stringSubject = nocsArray[i].getPriroriry();
            if (stringSubject.includes("Alta")) {
                countBacklogPriorizadoUrgente++;
            }
            else if (stringSubject.includes("Media")) {
                countBacklogPriorizadoAlta++;
            }
            else if (stringSubject.includes("Baja")) {
                countBacklogPriorizadoBaja++;
            }
            else {
                countBacklogPriorizadoUrgente++;
            }
            //armo un array auxiliar con los modulos
            modulesArrayAll.push(nocsArray[i].getSubCategoria());
        }
        //genero el listado unico de modulos
        modulesArray = modulesArrayAll.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
        //recorro el listado de modulos para contar insidencias desglozando por ambientes
        //armo todo en un JSON como string
        distribucionModuloToJSON = '{';
        for (let i = 0; i < modulesArray.length; i++) {
            distribucionModuloToJSON += '"' + modulesArray[i] + '":{';
            for (let a = 0; a < nocsArray.length; a++) {
                if (nocsArray[a].getSubCategoria() == modulesArray[i]) {
                    let stringSubject = nocsArray[a].getSubject();
                    if (stringSubject.includes("PRD")) {
                        countDistribucionModuloPrd++;
                    }
                    else if (stringSubject.includes("HML")) {
                        countDistribucionModuloHml++;
                    }
                    else if (stringSubject.includes("CAPA")) {
                        countDistribucionModuloCapa++;
                    }
                    else {
                        countDistribucionModuloPrd++;
                    }
                }
            }
            distribucionModuloToJSON += '"prd":"' + countDistribucionModuloPrd + '",';
            distribucionModuloToJSON += '"hml":"' + countDistribucionModuloHml + '",';
            distribucionModuloToJSON += '"capa":"' + countDistribucionModuloCapa + '"';
            distribucionModuloToJSON += '}';
            countDistribucionModuloPrd = 0;
            countDistribucionModuloHml = 0;
            countDistribucionModuloCapa = 0;
            if (i < modulesArray.length - 1) {
                distribucionModuloToJSON += ',';
            }
        }
        distribucionModuloToJSON += '}';
        //armado de listado de priorizados
        let listaPriorizados;
        listaPriorizados = yield googlesheet.getPriorizados();
        priorizadosPorRegistroToJSON = '{';
        for (let i = 0; i < listaPriorizados.length; i++) {
            priorizadosPorRegistroToJSON += '"priorizado' + (i + 1) + '":';
            priorizadosPorRegistroToJSON += '{';
            priorizadosPorRegistroToJSON += '"noc":"' + listaPriorizados[i]['noc'].replace(/"/g, '') + '",';
            priorizadosPorRegistroToJSON += '"resumen":"' + listaPriorizados[i]['resumen'].replace(/"/g, '') + '",';
            priorizadosPorRegistroToJSON += '"modulo":"' + listaPriorizados[i]['modulo'].replace(/"/g, '') + '",';
            priorizadosPorRegistroToJSON += '"entorno":"' + listaPriorizados[i]['entorno'].replace(/"/g, '') + '",';
            priorizadosPorRegistroToJSON += '"estado":"' + listaPriorizados[i]['estado'].replace(/"/g, '') + '",';
            priorizadosPorRegistroToJSON += '"fechaCreacion":"' + listaPriorizados[i]['asignado'].replace(/"/g, '') + '"';
            priorizadosPorRegistroToJSON += '}';
            if (i < listaPriorizados.length - 1) {
                priorizadosPorRegistroToJSON += ',';
            }
        }
        priorizadosPorRegistroToJSON += '}';
        console.log(priorizadosPorRegistroToJSON);
        //ok
        let priorizacionDia = {
            "baja": countBacklogPriorizadoBaja,
            "alta": countBacklogPriorizadoAlta,
            "urgente": countBacklogPriorizadoUrgente
        };
        //ok
        let creadasVsResueltasDia = {
            "creadas": queryJIRACreados,
            "resueltas": queryJIRAResueltos
        };
        //ok
        let backlogPriorizadoPorcentaje = {
            "urgente": (countBacklogPriorizadoUrgente / queryNocsIdEnBandeja.length).toFixed(2),
            "alta": (countBacklogPriorizadoAlta / queryNocsIdEnBandeja.length).toFixed(2),
            "baja": (countBacklogPriorizadoBaja / queryNocsIdEnBandeja.length).toFixed(2)
        };
        //ok
        let reabiertosDia = {
            "reaperturas": queryJIRAReOpen,
        };
        //ok
        distribucionModulo = JSON.parse(distribucionModuloToJSON);
        //ok
        let resumen = {
            "reaperturas": queryJIRAReOpen,
            "priorizados": listaPriorizados.length,
            "repetitivos": quwryJIRARepetitivos,
            "totalPendientes": queryNocsIdEnBandeja.length
        };
        //ok
        priorizadosPorRegistro = JSON.parse(priorizadosPorRegistroToJSON);
        let backlogJsonResponse = {
            priorizacionDia,
            creadasVsResueltasDia,
            backlogPriorizadoPorcentaje,
            reabiertosDia,
            distribucionModulo,
            resumen,
            priorizadosPorRegistro
        };
        yield response.status(200).send(backlogJsonResponse);
        logger.taskEndInfo(TASKNAME);
        let mailTxt = 'Se envio Backlog Diario';
        yield emailtools.sendByMail(RESPONSABLE, TASKNAME, mailTxt);
    });
}
exports.run = run;
//# sourceMappingURL=informeBacklogDiario.js.map
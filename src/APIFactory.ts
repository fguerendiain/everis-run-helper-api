import * as express from 'express'
import { Express } from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as vincularDocumento from './tasks/vincularDocumento';
import * as nocToJiraConverter from './tasks/nocToJiraConverter';
import * as informeBacklogDiario from './tasks/informeBacklogDiario';
import * as priorizadosupdate from './tasks/priorizadosUpdate';
import * as informeMensualPriorizados from './tasks/informeMensualPriorizados';
import * as convertirBase64 from './tasks/convertirBase64';
import * as asiJiraToJiraConverter from './tasks/asiJiraToJiraConverter';
import * as appSade9570 from './tasks/appSade9570';

export function build():Express{
 
    let app = express();

    app.use(bodyParser.json());
    app.use(cors());

    //URLs DEFINITIVAS
    app.get("/informeBacklogDiario", informeBacklogDiario.backlogDiario); //genera backlog
    app.post("/informeBacklogDiario", informeBacklogDiario.backlogDiario); //genera backlog y guarda en BBDD local
    app.get("/informeBacklogDiario/date/:date", informeBacklogDiario.searchBacklogByDate); //recibe una fecha para traer el backlog de ese dia en formato YYYYMMDD
    app.get("/priorizadosupdate", priorizadosupdate.run); //actualiza el listado de priorizados en BBDD local
    app.get("/informemensual/priorizados/:date", informeMensualPriorizados.getPriorizadosByDate); //devuelve el total de priorizados del mes
    app.get("/informemensual/backlog/:date", informeMensualPriorizados.getEverisNocByDate); //devuelve el total de backlog del mes
    app.get("/asijiratojiraconverter", asiJiraToJiraConverter.createJirafromAsiJira); //importa los jiraAsi a Jira


    //REGULATORIOS
    app.get("/appSade9570", appSade9570.run); //genera nueva transaccion a partir de la anterior, imprime update para actualizar registro de psoc con nueva transaccion.

    //DEVELOP
    app.get("/vincularDocumento", vincularDocumento.run);
    app.get("/noctojiraconverter", nocToJiraConverter.run);
    app.get("/convertirBase64/encode/:filedir", convertirBase64.base64Encoder); //devuelve el documento pasado por parametro como un string en Base64





   
    return app;
}
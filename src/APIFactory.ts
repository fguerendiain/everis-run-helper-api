import * as express from 'express'
import { Express } from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as vincularDocumento from './tasks/vincularDocumento';
import * as nocToJiraConverter from './tasks/nocToJiraConverter';
import * as informeBacklogDiario from './tasks/informeBacklogDiario';
import * as priorizadosupdate from './tasks/priorizadosUpdate';

export function build():Express{
 
    let app = express();

    app.use(bodyParser.json());
    app.use(cors());

    //URLs DEFINITIVAS
    app.get("/informeBacklogDiario", informeBacklogDiario.backlogDiario); //genera backlog
    app.post("/informeBacklogDiario", informeBacklogDiario.backlogDiario); //genera backlog y guarda en BBDD local
    app.get("/informeBacklogDiario/date/:date", informeBacklogDiario.searchBacklogByDate); //recibe una fecha para traer el backlog de ese dia en formato YYYYMMDD



    app.get("/priorizadosupdate", priorizadosupdate.run); //actualiza el listado de priorizados en BBDD local


    //TEST
    app.get("/vincularDocumento", vincularDocumento.run);
    app.get("/noctojiraconverter", nocToJiraConverter.run);





   
    return app;
}
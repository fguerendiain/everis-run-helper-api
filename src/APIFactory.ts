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
    app.get("/informeBacklogDiario", informeBacklogDiario.run);
    app.get("/priorizadosupdate", priorizadosupdate.run);


    //TEST
    app.get("/vincularDocumento", vincularDocumento.run);
    app.get("/noctojiraconverter", nocToJiraConverter.run);





   
    return app;
}
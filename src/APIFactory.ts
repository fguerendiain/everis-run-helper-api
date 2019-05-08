import * as express from 'express'
import { Express } from 'express'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import * as vincularDocumento from './tasks/vincularDocumento'
import * as BBDDtools from './tools/BBDDtools'

export function build():Express{
 
    let app = express();

    app.use(bodyParser.json());
    app.use(cors());

//    app.get("/test", BBDDtools.test);
   app.get("/vincluarDocumento", vincularDocumento.run);





   
    return app;
}
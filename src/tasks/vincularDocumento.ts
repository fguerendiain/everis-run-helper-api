import * as express from 'express'
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import * as config from '../config'

import * as bbddtools from '../tools/BBDDtools';
import * as resttools from '../tools/RESTtools';
import * as eeservices from '../externalServices/WSService/EEService';
import * as gedoservices from '../externalServices/WSService/GEDOService';
import * as pdiservices from '../externalServices/WSService/PDIService';
import * as gpservices from '../externalServices/RESTService/GPService';

const bbddoracle = config.get("bbddoracle");

export async function run(req: express.Request, res: express.Response){

    let queryString = 'select codexpediente from loys_man_sade.st_expediente where rownum < 2';
    let queryString1 = 'select NOMBRE_APELLIDO from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';
    let idExpTad = '1625485';
    let direccion = ['amenabar','2000'];

    let stringBuilder;

    let querys = [
            await bbddtools.BBDDData(bbddoracle.prd,queryString),
            await bbddtools.BBDDData(bbddoracle.prd,queryString1),
            await gpservices.getParticipantesExpediente(idExpTad),
            await pdiservices.getCalleDireccionValidas(direccion[0],direccion[1])
        ];
    Promise.all(querys)
        .then((results)=>{
            for(let i = 0; i < results.length; i++){
                if (isNullOrUndefined(stringBuilder)){
                    stringBuilder = results[i];
                }else{
                    stringBuilder = stringBuilder + " | " + results[i];
                }
            }
            res.status(200).send(stringBuilder);
        });
}

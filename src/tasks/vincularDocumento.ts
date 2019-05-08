import * as express from 'express'
import * as BBDDtools from '../tools/BBDDtools';
import * as RESTtools from '../tools/RESTtools';
import * as config from '../config'
import { isNull, isNullOrUndefined, isUndefined } from 'util';


const bbddoracle = config.get("bbddoracle");


export async function run(req: express.Request, res: express.Response){

    let queryString = 'select codexpediente from loys_man_sade.st_expediente where rownum < 2';
    let queryString1 = 'select NOMBRE_APELLIDO from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';

    let urlGP = 'https://servicios.gcba.gob.ar/api/v1/tramites/1625485/participaciones'

    let stringBuilder;

    let querys = [
            await BBDDtools.BBDDData(bbddoracle.prd,queryString),
            await BBDDtools.BBDDData(bbddoracle.prd,queryString1),
            await RESTtools.apiRestConsume(urlGP,"GET",'{"Content-Type":"application/json","Accept":"application/json"}')        
        ];
    Promise.all(querys)
        .then((results)=>{
            for(let i = 0; i < results.length; i++){
                if (isNull(stringBuilder) || isUndefined(stringBuilder)){
                    stringBuilder = results[i];
                }else{
                    stringBuilder = stringBuilder + " | " + results[i];
                }
            }
            res.status(200).send(stringBuilder);
        });
}

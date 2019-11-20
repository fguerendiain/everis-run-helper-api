import express = require('express');
import * as logger from '../logger';

const TASKNAME = 'CONVERTIR BASE64'
//const RESPONSABLE = 'franco.javier.guerendiain@everis.com'

//BUSCAR DATOS DE BACKLOG POR UNA FECHA DETERMINADA
export async function base64Encoder(req: express.Request, res: express.Response){
	logger.taskBeginInfo(TASKNAME+ ' CODIFICAR');
    let urlfile:string = req.params.filedir

    console.log(urlfile);
    const file = window.open(urlfile);;

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
 

    await res.status(200).send(await toBase64(file));
	logger.taskEndInfo(TASKNAME+ ' CODIFICAR');

}
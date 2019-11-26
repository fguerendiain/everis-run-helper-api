import * as express from 'express'
import * as logger from '../logger';
import * as bbddpostgres from '../entities/BBDDPostgres';
import { isNullOrUndefined } from 'util';

const TASKNAME = 'CHECK TASK PROGRESS';
const TASKLABLE = 'CHECKPROGRESS';

let response:express.Response;

export async function checkTaskProcessStatusById(req: express.Request, res: express.Response){

    logger.taskBeginInfo(TASKNAME);
    response = res;    

    let result:{} = null;

    //VALIDO COMPATIBILIDAD DEL DATO PASADO POR PARAMETRO
    let regexp = new RegExp('^[0-9]+$');
    if(regexp.test(req.params.id)){
        //OBTENGO DATOS DE LA BBDD DEL ID PASADO POR PARAMETRO
        let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        await BBDDcheckDataBase.query('SELECT * FROM "TASK_PROCESS_AUD" WHERE "ID" = '+req.params.id+';')
        .then((selctResult)=>{
            if(!isNullOrUndefined(selctResult[0])){
                //ARMO LA RESPUESTA CON LOS DATOS
                let auxResponse;
                try{
                    auxResponse = JSON.parse(selctResult[0].RESPUESTA);
                }catch{
                    auxResponse = selctResult[0].RESPUESTA;
                }

                result = {
                    idProcess: selctResult[0].ID,
                    task: selctResult[0].TASK,
                    status: selctResult[0].ESTADO,
                    detail : selctResult[0].DETALLE,
                    create: selctResult[0].FECHA_INICIO,
                    update: selctResult[0].FECHA_ACTUALIZACION,
                    response: auxResponse
                }
            }
            else{
                result = {id: req.params.id, error: 'No existe registro para el ID indicado'};
            }
        });
    }
    else{
        result = {id: req.params.id, error: 'El ID indicado no es valido'};
    }



    //SE ENVIA RESPUESTA AL CLIENTE
    await response.status(200).send(result);

    logger.info(TASKLABLE,JSON.stringify(result));
    logger.taskEndInfo(TASKNAME);

}

//METODO PARA CREAR O MODIFICAR UN ESTADO DE TAREA
export async function saveStatus(processID:number,taskName:string,status:string,detail:string,response?:string){
    let BBDDcheckDataBase = new bbddpostgres.BBDDconect();
    if(isNullOrUndefined(response)){
        response = 'Pendiente';
    }
    //SI NO SE DETERMINA UN ID VALIDO EN EL METODO SE CREA UN NUEVO REGISTRO
    if(processID == 0 || isNullOrUndefined(processID)){
        return await BBDDcheckDataBase.query('INSERT INTO "TASK_PROCESS_AUD"("ID", "TASK", "ESTADO", "DETALLE", "RESPUESTA","FECHA_INICIO","FECHA_ACTUALIZACION") VALUES ((SELECT MAX("ID")+1 FROM "TASK_PROCESS_AUD"),\''+taskName+'\',\''+status+'\',\''+detail+'\',\''+response+'\',now(),now()) returning "ID";')
        .then((query)=>{
            return {id:query[0].ID,task:taskName}
        });
    }else{
        //SE MODIFICA REGISTRO EXISTENTE
        BBDDcheckDataBase = new bbddpostgres.BBDDconect();
        BBDDcheckDataBase.query('UPDATE "TASK_PROCESS_AUD" SET "ESTADO" = \''+status+'\',"DETALLE"=\''+detail+'\', "RESPUESTA"=\''+response+'\',"FECHA_ACTUALIZACION" = now() WHERE "ID" = '+processID+';');
        return {id:processID,task:taskName};
    }
}
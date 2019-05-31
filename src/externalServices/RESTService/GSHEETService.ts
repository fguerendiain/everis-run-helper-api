import * as gsheettools from '../../tools/GSHEETTools'
import * as config from '../../config'
import { Noc } from '../../entities/Noc';
import { isNullOrUndefined } from 'util';

const GOOGLESHEETS = config.get('googlesheets');

export async function getPriorizados(){

    //obtengo el listado de los priorizados
    let listaPriorizados =  <Array<{}>>await gsheettools.getSheetRows(GOOGLESHEETS.priorizadossade);

    let nocsArray = new Array;
    let priorizadosPorRegistroArray = new Array;
    let priorizadosPorRegistroToJSON:{};

    //genero un array de objetos noc
	for(let i = 0; i < listaPriorizados.length; i++){
        let auxNocInsatnce:Noc;
		auxNocInsatnce = await new Noc(<string>listaPriorizados[i]['noc']);
        await auxNocInsatnce.fillInstanceByNocId();
        if(isNullOrUndefined(auxNocInsatnce.getId())){
            auxNocInsatnce.setId(<string>listaPriorizados[i]['noc']);
        }
		nocsArray.push(auxNocInsatnce);
	}

    //armo json con el listado de priorizados basado en la info de noc
	for(let i = 0; i < nocsArray.length; i++){
        let v_estado:string;
        if(<string>nocsArray[i].getAssigneGrupo() == "EVERIS"){
            v_estado = "EVERIS"
        }else{
            v_estado = "INFORMADOR"
        }
        priorizadosPorRegistroToJSON = {
            "noc": nocsArray[i].getId(),
            "resumen":nocsArray[i].getSubject(),
            "modulo":nocsArray[i].getSubCategoria(),
            "entorno":nocsArray[i].getEntorno(),
            "estado":v_estado,
            "fechacreacion":nocsArray[i].getCreated()
        }
/*
        if(!(nocsArray[i].getEntorno() == 'SIN VISIBILIDAD')){
            priorizadosPorRegistroArray.push(priorizadosPorRegistroToJSON);
        }
*/
        priorizadosPorRegistroArray.push(priorizadosPorRegistroToJSON);

    }
    return priorizadosPorRegistroArray;
}
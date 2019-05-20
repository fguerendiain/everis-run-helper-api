import * as resttools from '../../tools/RESTtools';
import * as config from '../../config'
import { isNullOrUndefined } from 'util';
import { Noc } from '../../entities/Noc';

const NOCCREDENTIALS = config.get('credentials').noc;

    //CREAR NOC
    export function createNoc(nocInstance:Noc){
        let url = NOCCREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
        let param = '?'+nocRequestParamsGet("ADD_REQUEST",'xml')+nocRequestParamsNocCreator(nocInstance);
        return resttools.apiRestConsume(url,method,null,createNoc.name,null,param);
    }

    //MODIFICAR NOC
    export function modifyNoc(nocInstance:Noc){
        let url = NOCCREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
        let param = nocInstance.getId()+'?'+nocRequestParamsGet("EDIT_REQUEST",'xml')+nocRequestParamsNocCreator(nocInstance);
        return resttools.apiRestConsume(url,method,null,modifyNoc.name,null,param);
    }


    //BUSCAR NOC POR ID
    export function getNocById(v_id:string){
        let url = NOCCREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
        let param = v_id+'?'+nocRequestParamsGet("GET_REQUEST",'json');
        return resttools.apiRestConsume(url,method,null,getNocById.name,null,param);
    }

    //BUSCAR NOC POR FILTRO
    export function getNocByFilter(v_filter?:string){
        if(isNullOrUndefined(v_filter)){
            v_filter = NOCCREDENTIALS.defaultFilter;
        }
        let url = NOCCREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
        let param = '?'+nocRequestParamsGet("GET_REQUEST",'json',v_filter);
        return resttools.apiRestConsume(url,method,null,getNocByFilter.name,null,param);
    }

    //OBTENER COMENTARIOS POR ID
    export function getNocCommentsById(v_id:string){
        let url = NOCCREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
        let param = v_id+'/notes?'+nocRequestParamsGet("GET_NOTES",'json');
        return resttools.apiRestConsume(url,method,null,getNocCommentsById.name,null,param);
    }


    //AGREGAR COMENTARIO A NOC POR ID
    export function addNocCommentsById(v_id:string,v_coment:string){
        let url = NOCCREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json"}';
        let param = v_id+'/notes?'+nocRequestParamsGet("ADD_NOTE",'xml')+nocRequestParamsCommentCreator(v_coment);
        return resttools.apiRestConsume(url,method,null,addNocCommentsById.name,null,param);
    }






    //Arma el string con los parametros para consultas
    function nocRequestParamsGet(v_operatorName:string,v_format:string,v_filter?:string){
        let operationName:string = 'OPERATION_NAME='+v_operatorName;
        let technicianKey:string = '&TECHNICIAN_KEY='+NOCCREDENTIALS.techniciankey;
        let format:string = '&format='+v_format;
        let filter:string = '';
        if(!isNullOrUndefined(v_filter)){
            filter = '&INPUT_DATA={"operation": {"details": {"from": "0","limit": "50","filterby": "'+v_filter+'"}}}';
        }
        return operationName + technicianKey + format + filter;
    }

    //Arma string con parametros para crear noc
    function nocRequestParamsNocCreator(nocInstance:Noc){
        let newNocData:string;
        newNocData = '&INPUT_DATA=<Operation><Details>';
        newNocData += '<requester>'+NOCCREDENTIALS.newNocUser+'</requester>';
        newNocData += '<subject>'+nocInstance.getSubject()+'</subject>';
        newNocData += '<description>'+nocInstance.getDescription()+'</description>';
//        newNocData += '<callbackURL>http://localhost:8080/CustomReportHandler.do</callbackURL>';
        newNocData += '<requesttemplate>'+nocInstance.getPlantilla()+'</requesttemplate>';
        newNocData += '<priority>'+nocInstance.getPriroriry()+'</priority>';
        newNocData += '<site>'+NOCCREDENTIALS.newNocSite+'</site>';
        newNocData += '<group>'+nocInstance.getAssigneGrupo()+'</group>';
        newNocData += '<technician>'+nocInstance.getAssigneTecnico()+'</technician>';
//        newNocData += '<level>'+Tier 3+'</level>';
        newNocData += '<status>'+nocInstance.getStatus()+'</status>';
//        newNocData += '<service>'+nocInstance.get+'</service>';
        newNocData += '</Details></Operation>';

        return newNocData;
    }    

    //Arma string con parametros para comentarios
    function nocRequestParamsCommentCreator(v_comment:string){
        return '&INPUT_DATA=<Operation><Details><Notes><Note><isPublic>false</isPublic><notesText>'+v_comment+'</notesText></Note></Notes></Details></Operation>'
    }    

//CREAR NOC

//ELIMINAR NOC

//BUSCAR NOC POR ID

//BUSCAR NOC POR QUERY

//CREAR COMENTARIO

//BORRAR COMENTARIO

//BUSCAR COMENTARIOS

//ASIGNAR GRUPO Y TECNICO

//ADJUNTAR ARCHIVO

//DESCARGAR ARCHIVOS ADJUNTOS
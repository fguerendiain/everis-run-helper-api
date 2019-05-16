import * as resttools from '../../tools/RESTtools';
import * as config from '../../config';

const JIRACREDENTIALS = config.get("credentials").jira;

    //AGREGAR LABLE /*con esto pongo y quito los s1, run-n3, etc*/

    //QUITAR LABLE

    //CARGAR HORAS A TICKET

    //QUITAR HORAS A TICKET

    //ASIGNAR TICKET

    //CREAR JIRA

    //BORRAR JIRA POR ID
    export function deleteJiraById(v_query:string){
        let url = encodeURI(JIRACREDENTIALS.host);
        let method = "DELETE";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = encodeURI('issue/'+v_query+'?fields&expand');
        return resttools.apiRestConsume(url,method,headers,deleteJiraById.name,null,param);
    }

    //ADJUNTAR ARCHIVOS

    //DESCARGAR ARCHIVOS ADJUNTOS



    //BUSCAR JIRAS POR ID
    export function getJiraById(v_query:string){
        let url = encodeURI(JIRACREDENTIALS.host);
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = encodeURI('issue/'+v_query+'?fields&expand');
        return resttools.apiRestConsume(url,method,headers,getJiraById.name,null,param);
    }

    //BUSCAR JIRA POR QUERY
    export function getJiraByText(v_query:string){
        let url = encodeURI(JIRACREDENTIALS.host);
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = encodeURI('search?jql=text ~ "'+v_query+'"');
        return resttools.apiRestConsume(url,method,headers,getJiraByText.name,null,param);
    }



    //OBTENER TRANSICION DE JIRA
    export function getTransicionJira(v_query:string){
        let url = encodeURI(JIRACREDENTIALS.host);
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = encodeURI('issue/'+v_query+'/transitions?expand=transitions.fields');
        return resttools.apiRestConsume(url,method,headers,getJiraByText.name,null,param);
    }
    

    



    
    function authConverter(){
        let convert = '"Basic '+ Buffer.from(JIRACREDENTIALS.user+':'+config.passDecoder(JIRACREDENTIALS.password)).toString("base64")+'"';
        return '"Authorization":'+ convert;
    }

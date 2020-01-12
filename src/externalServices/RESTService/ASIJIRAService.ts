import * as resttools from '../../tools/RESTtools';
import * as config from '../../config';
import * as logger from '../../logger';
import { AsiJira } from '../../entities/AsiJira';


const JIRACREDENTIALS = config.get("credentials").asijira;

    //BUSCAR JIRAS POR ID
    export function getJiraById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue/'+v_query;
        return resttools.apiRestConsume(url,method,headers,getJiraById.name,null,param);
    }


/*     //CREAR JIRA
    export function createJira(jiraInstance:AsiJira){
        let url = JIRACREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue';
        let body = bodyFormatForJira(jiraInstance);
        return resttools.apiRestConsume(url,method,headers,createJira.name,body,param);
    }

    //MODIFICAR JIRA
    export function modifyJira(jiraInstance:AsiJira){
        let url = JIRACREDENTIALS.host;
        let method = "PUT";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue/'+jiraInstance.getId();
        let body = bodyFormatForJira(jiraInstance);
        return resttools.apiRestConsume(url,method,headers,modifyJira.name,body,param);
    }

    //BORRAR JIRA POR ID
    export function deleteJiraById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "DELETE";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue/'+v_query+'?fields&expand';
        return resttools.apiRestConsume(url,method,headers,deleteJiraById.name,null,param);
    }
*/

    //BUSCAR COMENTARIOS DE JIRA POR ID
    export function getJiraCommentsById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers:{} = {"Content-Type":"application/json",Accept:"application/json",Authorization:authConverter_v2(),Cookie:JIRACREDENTIALS.jsonidcookie};
        let param = 'issue/'+v_query+'/comment';
        return resttools.apiRestConsume_v1(url,method,headers,getJiraCommentsById.name,null,param);
    }

    //AGREGAR COMENTARIO A JIRA POR ID
    export function addJiraCommentsById(v_id:string,v_coment:string){
        let url = JIRACREDENTIALS.host;
        let method = "POST";
        let headers:{} = {"Content-Type":"application/json",Accept:"application/json",Authorization:authConverter_v2(),Cookie:JIRACREDENTIALS.jsonidcookie};
        let param = 'issue/'+v_id+'/comment';
        let body = '{"body":"'+v_coment+'"}';
        return resttools.apiRestConsume_v1(url,method,headers,addJiraCommentsById.name,body,param);
    }


/*     //BUSCAR WORKLOG DE JIRA POR ID
    export function getJiraWorklogById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue/'+v_query+'/worklog';
        return resttools.apiRestConsume(url,method,headers,getJiraWorklogById.name,null,param);
    }

    //AGREGAR WORKLOG A JIRA POR ID
    export function addJiraWorklogById(v_id:string,v_worklog:string){
        let url = JIRACREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue/'+v_id+'/worklog';
        let body = v_worklog;
        return resttools.apiRestConsume(url,method,headers,addJiraWorklogById.name,body,param);
    }

 */    //BUSCAR JIRA POR TEXTO
    export function getJiraByText(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers:{} = {"Content-Type":"application/json",Accept:"application/json",Authorization:authConverter_v2(),Cookie:JIRACREDENTIALS.jsonidcookie};
        let param = 'search?jql=text ~ "'+v_query+'"';
        return resttools.apiRestConsume_v1(url,method,headers,getJiraByText.name,null,param);
    }

    //BUSCAR JIRA POR QUERY
    export function getJiraByJql(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers:{} = {"Content-Type":"application/json",Accept:"application/json",Authorization:authConverter_v2(),Cookie:JIRACREDENTIALS.jsonidcookie};
        let param = 'search?jql='+v_query;
        return resttools.apiRestConsume_v1(url,method,headers,getJiraByJql.name,null,param);
    }

     
    //BUSCAR ETIQUETAS DE PROYECTO
    export function getJiraProjectTagList(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers:{} = {"Content-Type":"application/json",Accept:"application/json",Authorization:authConverter_v2(),Cookie:JIRACREDENTIALS.jsonidcookie};
        let param = 'project/'+v_query+'/versions';
        return resttools.apiRestConsume_v1(url,method,headers,getJiraByJql.name,null,param);
    }



    //OBTENER TRANSICION DE JIRA
    export function getTransicionJira(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+',"Cookie":"'+JIRACREDENTIALS.jsonidcookie+'"}';
        let param = 'issue/'+v_query+'/transitions?expand=transitions.fields';
        return resttools.apiRestConsume(url,method,headers,getTransicionJira.name,null,param);
    }
    

    



    
    function authConverter(){
        let convert = '"Basic '+ Buffer.from(JIRACREDENTIALS.user+':'+config.passDecoder(JIRACREDENTIALS.password)).toString("base64")+'"';
        return '"Authorization":'+ convert;
    }

    function authConverter_v2(){
        return 'Basic '+ Buffer.from(JIRACREDENTIALS.user+':'+config.passDecoder(JIRACREDENTIALS.password)).toString("base64");
    }


    function bodyFormatForJira(v_JiraObject:AsiJira){
        let body:{} = {
            "fields": {
                "summary" : v_JiraObject.getSubject(),
                "issuetype": {
                    "name" : v_JiraObject.getType()
                },
                "components": componentBuilder(v_JiraObject),
                "versions": [
                    {
                        "id": "111917"
                    }
                ],
                "project": {
                    "key": "BISADE"
                },
                "description": v_JiraObject.getDescription(),
                "assignee": {
                    "name": v_JiraObject.getAssigne()
                },
                "priority": {
                    "id": v_JiraObject.getPriroriry()
                },
                "labels": v_JiraObject.getLabels()
            }
        };
        return JSON.stringify(body);
    }

    function componentBuilder(v_JiraObject:AsiJira){
        let formatedComponents = new Array;
        for(let i=0; i < v_JiraObject.getComponents().length; i++){
            formatedComponents.push({"name": v_JiraObject.getComponents()[i]})
        }
        return formatedComponents;
    }                                
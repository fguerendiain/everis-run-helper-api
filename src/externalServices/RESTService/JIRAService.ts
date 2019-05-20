import * as resttools from '../../tools/RESTtools';
import * as config from '../../config';
import * as logger from '../../logger';
import { Jira } from '../../entities/Jira';


const JIRACREDENTIALS = config.get("credentials").jira;

    //BUSCAR JIRAS POR ID
    export function getJiraById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_query+'?fields&expand';
        return resttools.apiRestConsume(url,method,headers,getJiraById.name,null,param);
    }


    //CREAR JIRA
    export function createJira(jiraInstance:Jira){
        let url = JIRACREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue';
        let body = bodyFormatForJira(jiraInstance);
        return resttools.apiRestConsume(url,method,headers,createJira.name,body,param);
    }

    //MODIFICAR JIRA
    export function modifyJira(jiraInstance:Jira){
        let url = JIRACREDENTIALS.host;
        let method = "PUT";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+jiraInstance.getId();
        let body = bodyFormatForJira(jiraInstance);
        return resttools.apiRestConsume(url,method,headers,modifyJira.name,body,param);
    }

    //BORRAR JIRA POR ID
    export function deleteJiraById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "DELETE";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_query+'?fields&expand';
        return resttools.apiRestConsume(url,method,headers,deleteJiraById.name,null,param);
    }


    //BUSCAR COMENTARIOS DE JIRA POR ID
    export function getJiraCommentsById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_query+'/comment';
        return resttools.apiRestConsume(url,method,headers,getJiraCommentsById.name,null,param);
    }

    //AGREGAR COMENTARIO A JIRA POR ID
    export function addJiraCommentsById(v_id:string,v_coment:string){
        let url = JIRACREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_id+'/comment';
        let body = '{"body":"'+v_coment+'"}';
        return resttools.apiRestConsume(url,method,headers,addJiraCommentsById.name,body,param);
    }


    //BUSCAR WORKLOG DE JIRA POR ID
    export function getJiraWorklogById(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_query+'/worklog';
        return resttools.apiRestConsume(url,method,headers,getJiraWorklogById.name,null,param);
    }

    //AGREGAR WORKLOG A JIRA POR ID
    export function addJiraWorklogById(v_id:string,v_worklog:string){
        let url = JIRACREDENTIALS.host;
        let method = "POST";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_id+'/worklog';
        let body = v_worklog;
        return resttools.apiRestConsume(url,method,headers,addJiraWorklogById.name,body,param);
    }

    //BUSCAR JIRA POR QUERY
    export function getJiraByText(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'search?jql=text ~ "'+v_query+'"';
        return resttools.apiRestConsume(url,method,headers,getJiraByText.name,null,param);
    }



    //OBTENER TRANSICION DE JIRA
    export function getTransicionJira(v_query:string){
        let url = JIRACREDENTIALS.host;
        let method = "GET";
        let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
        let param = 'issue/'+v_query+'/transitions?expand=transitions.fields';
        return resttools.apiRestConsume(url,method,headers,getTransicionJira.name,null,param);
    }
    

    



    
    function authConverter(){
        let convert = '"Basic '+ Buffer.from(JIRACREDENTIALS.user+':'+config.passDecoder(JIRACREDENTIALS.password)).toString("base64")+'"';
        return '"Authorization":'+ convert;
    }


    function bodyFormatForJira(v_JiraObject:Jira){
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

    function componentBuilder(v_JiraObject:Jira){
        let formatedComponents = new Array;
        for(let i=0; i < v_JiraObject.getComponents().length; i++){
            formatedComponents.push({"name": v_JiraObject.getComponents()[i]})
        }
        return formatedComponents;
    }                                
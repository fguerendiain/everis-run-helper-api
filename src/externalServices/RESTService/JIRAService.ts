import * as resttools from '../../tools/RESTtools';
import * as config from '../../config';
//import JiraApi from 'jira-client';

const JIRACREDENTIALS = config.get("credentials").jira;

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

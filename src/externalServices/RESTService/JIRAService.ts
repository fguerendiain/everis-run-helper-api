import * as resttools from '../../tools/RESTtools';
import * as config from '../../config'

const credenciales = config.get("credenciales");

//BUSCAR JIRA POR QUERY
export function getJiraByText(v_query){
    let url = encodeURI('https://steps.everis.com/jiraproy/rest/api/2/search?jql=text ~ "'+v_query+'"');
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
 return resttools.apiRestConsume(url,method,headers,getJiraByText.name);
}

//OBTENER TRANSICION DE JIRA
export function getTransicionJira(v_query){
    let url = encodeURI('https://steps.everis.com/jiraproy/rest/api/2/issue/'+v_query+'/transitions?expand=transitions.fields');
    let method = "GET";
    let headers = '{"Content-Type":"application/json","Accept":"application/json",'+authConverter()+'}';
return resttools.apiRestConsume(url,method,headers,getTransicionJira.name);
}



function authConverter(){
    return '"Authorization":"Basic '+Buffer.from(credenciales.jira.user+':'+credenciales.jira.password).toString("base64")+' "';   
}
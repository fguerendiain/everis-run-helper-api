import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { ticket } from './Ticket';
import * as logger from '../logger';
import { isNullOrUndefined } from 'util';


export class Jira extends ticket{

	private assigne:string;
    private labels = new Array;
    private components = new Array;
	private reopenCounter:number;
	private timeTrakingLogged:number
	private worklog = new Array;

    constructor(v_id?:string){
        super();
        if(isNullOrUndefined(v_id)){
            this.setId(null);
        }
        this.setId(v_id);
    }



    //Graba los datos del objeto en el servidor
    public async saveInstanceOnJira(){
        if(isNullOrUndefined(this.getId())){
            //si la instancia no posee id creo un nuevo jira
            await jiraservices.createJira(this);
        }else{
            //modifico el existente
            await jiraservices.modifyJira(this);
            //grabo los comentarios nuevos
            for(let i = 0; i < this.getComments().length; i++){
                if(isNullOrUndefined(this.getComments()[i].id)){
                    await jiraservices.addJiraCommentsById(this.getId(),this.getComments()[i].body)
                }
            }
            //grabo los worklog nuevos
            for(let i = 0; i < this.getWorklog().length; i++){
                if(isNullOrUndefined(this.getWorklog()[i].id)){
                    let v_worklog:{} = {
                        "comment": this.getWorklog()[i].body,
                        "timeSpentSeconds": this.getWorklog()[i].timeSpent,
                    }

                    await jiraservices.addJiraWorklogById(this.getId(),JSON.stringify(v_worklog));
                }
            }
        }
    }

    //Carga una instancia del objeto con los datos provinientes del servidor
    public async fillInstanceByJiraId(){

        let jiraData = await jiraservices.getJiraById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        let jiraComment = await jiraservices.getJiraCommentsById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        let jiraWorklog = await jiraservices.getJiraWorklogById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});

        if(jiraData.errorMessages == "La solicitud no Existe") {
            logger.error('JIRA',this.getId()+': La solicitud no Existe')
            return null;
        }else{
            this.setId(jiraData.key);
            this.setSubject(jiraData.fields.summary);
            this.setCreated(jiraData.fields.created);
            this.setUpdated(jiraData.fields.updated);
            this.setDescription(jiraData.fields.description)
            this.setType(jiraData.fields.issuetype.name);
            this.setStatus(jiraData.fields.status.name);
            this.setPriroriry(jiraData.fields.priority.id);
            this.setReporter(jiraData.fields.reporter.name);
            this.settimeTrakingLogged(jiraData.fields.timetracking.timeSpentSeconds);
            this.setAssigne(jiraData.fields.assignee.name);
            this.setReopenCounter(jiraData.fields.customfield_10304);
            this.labels = jiraData.fields.labels;

            //cargo el listado de components
            for(let i = 0 ; i < jiraData.fields.components.length; i++){
                this.setComponents(jiraData.fields.components[i].name);
            }


            //cargo el listado de mensajes
            for(let i = 0 ; i < jiraComment.total; i++){

                let v_body = jiraComment.comments[i].body;
                let v_assignee = jiraComment.comments[i].author.name;
                let v_created = jiraComment.comments[i].created;
                let v_comentId = jiraComment.comments[i].id;

                this.setComments(v_body,v_assignee,v_created,v_comentId);
            }

            //cargo el listado de worklog
            for(let i = 0 ; i < jiraWorklog.total; i++){
                
                let worklogId = jiraWorklog.worklogs[i].id;
                let assignee = jiraWorklog.worklogs[i].author.name;
                let body = jiraWorklog.worklogs[i].comment;
                let created = jiraWorklog.worklogs[i].created;
                let timeSpent = jiraWorklog.worklogs[i].timeSpentSeconds;

                this.setWorklog(timeSpent,assignee,body,created,worklogId);
            }

            logger.info('JIRA','Se cargo objeto JIRA con datos de ticket: '+this.getId());
        };
    }



    //getters y setters

    public getAssigne(){
        return this.assigne;        
       }
   
    public setAssigne(v_assigne){
        this.assigne = v_assigne;
    }

    public getLabels(){
        return this.labels;        
       }

    public setLabels(v_labels){
        this.labels.push(v_labels)
    }

    public getReopenCounter(){
    return this.reopenCounter;        
    }
   
    public setReopenCounter(v_reopenCounter){
        this.reopenCounter = v_reopenCounter;
    }

    public getTimeTrakingLogged(){
        return this.timeTrakingLogged;        
       }
   
    public settimeTrakingLogged(v_timeTrakingLogged){
        this.timeTrakingLogged += v_timeTrakingLogged;
    }

    public getComponents(){
        return this.components;        
       }
   
    public setComponents(v_components){
        this.components.push(v_components);
    }

    public getWorklog(){
        return this.worklog;        
       }

    public setWorklog(v_timeSpent:number,v_assigne:string ,v_body?:string, v_created?:string, v_id?:string){
    let newJsonString:{};
    if(isNullOrUndefined(v_body)){
        v_body = '';
    }
    if(isNullOrUndefined(v_id)){
        newJsonString = { 
            "timeSpent" : v_timeSpent,
            "body" : v_body}
    }else{
        newJsonString = { 
            "timeSpent" : v_timeSpent,
            "assignee" : v_assigne,
            "body" : v_body,
            "created" : v_created,
            "id" : v_id}
    }
    this.worklog.push(newJsonString)
    }

    //permite eliminar una lable especifica
    public deleteLable(lableName:string){
        for(let i=0; i < this.getLabels().length; i++){
            if(this.getLabels()[i] == lableName){
                this.getLabels().splice(i,1);
            }
        }
    }

    //permite eliminar un componente especifico
    public deleteComponent(componentName:string){
        for(let i=0; i < this.getComponents().length; i++){
            if(this.getComponents()[i] == componentName){
                this.getComponents().splice(i,1);
            }
        }
    }



}





import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { ticket } from './Ticket';
import * as logger from '../logger';


export class Jira extends ticket{

	assigne:string;
	labels:string[]
	reopenCounter:number;
	timeTrakingLogged:number
	worklog:{}[]; //date,assigne,timeSpent,comment

    constructor(){
        super();
    }

    public async jiraFillTicketCreator(
            v_id:string, 
            v_summary?:string,
            v_description?:string,
            v_issuetype?:string,
            v_status?:string,
            v_priority?:string,
            v_reporter?:string
        ){
        let jiraData = await jiraservices.getJiraById(v_id).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        if(jiraData.errorMessages == "La solicitud no Existe") {

            //si no existe el Jira lo creo

            this.setId("NADA");
            this.setSubject("NADA");
            this.setCreated("NADA");
            this.setUpdated("NADA");
            this.setDescription("NADA")
            this.setType("NADA");
            this.setStatus("NADA");
            this.setPriroriry("NADA");
            this.setReporter("NADA");
        }else{

            this.setId(jiraData.key);
            this.setSubject(jiraData.fields.summary);
            this.setCreated(jiraData.fields.created);
            this.setUpdated(jiraData.fields.updated);
            this.setDescription(jiraData.fields.description)
            this.setType(jiraData.fields.issuetype.name);
            this.setStatus(jiraData.fields.status.name);
            this.setPriroriry(jiraData.fields.priority.name);
            this.setReporter(jiraData.fields.reporter.name);


/*
intentando traer 4 valores de los datos de cada comentario
y cargandolos en un array del objeto
*/


            console.log(typeof(jiraData.fields.comment.comments.total));
            for(let i = 0 ; jiraData.fields.comment.comments.total; i++){
                this.comments.push(
                    {"id": jiraData.fields.comment.comments[i].id,
                     "assignee": jiraData.fields.comment.comments[i].author.name,
                    "body":jiraData.fields.comment.comments[i].body,
                    "created":jiraData.fields.comment.comments[i].created})

                    // '{"id":"'+jiraData.fields.comment.comments[i].id+'",\
                    // "assignee":"'+jiraData.fields.comment.comments[i].author.name+'",\
                    // "body":"'+jiraData.fields.comment.comments[i].body+'",\
                    // "created":"'+jiraData.fields.comment.comments[i].created+'"}'
                    //);
                    console.log(jiraData.fields.comment.comments);
            }
        };
    }

    public getAssigne(){
        return this.assigne;        
       }
   
    public setAssigne(v_assigne){
        this.assigne = v_assigne;
    }

    public getLabels(){
        return this.labels;        
       }

    public getReopenCounter(){
    return this.reopenCounter;        
    }
   
    public setReopenCounter(v_reopenCounter){
        this.reopenCounter = v_reopenCounter;
    }

    public gettimeTrakingLogged(){
        return this.timeTrakingLogged;        
       }
   
    public settimeTrakingLogged(v_timeTrakingLogged){
        this.timeTrakingLogged += v_timeTrakingLogged;
    }

    public getComments(){
        console.log(this.comments);
        return this.comments;
    }
}





/*OBJ Ticket:{
	this. id:string;
	this. subject:string;
	this. created:Date;
	this. updated:Date;
	this. type:string;
	this. status:Enumerator;
	this. priroriry:Enumerator;
	this. reporter:string;

    this. attach:Blob[];
    this. comments:Object[];
    this. comment:{}; //date,assigne,comment	},
}

OBJ Jira:{
	assigne:"",
	labels:"",
	reopenCounter:""
	timeTrakingLogged:""
	worklog[]:{
		date:"",
		assigne:"",
		timeSpent:"",
		comment:""
	},
}*/
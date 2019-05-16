import * as jiraservices from '../externalServices/RESTService/JIRAService';
import { ticket } from './Ticket';
import { setPriority } from 'os';


export class Jira extends ticket{

	assigne:string;
	labels:string[]
	reopenCounter:number;
	timeTrakingLogged:number
	worklog:{}[]; //date,assigne,timeSpent,comment

    constructor(){
        super();
    }

    public async jiraFillTicketCreator(v_id){
        let jiraData = await jiraservices.getJiraById(v_id);

        this.setId(jiraData.key);
        this.setSubject(jiraData.fields.summary);
        this.setCreated(jiraData.fields.created);
        this.setUpdated(jiraData.fields.updated);
        this.setDescription(jiraData.fields.description)
        this.setType(jiraData.fields.issuetype.name);
        this.setStatus(jiraData.fields.status.name);
        this.setPriroriry(jiraData.fields.priority.name);
        this.setReporter(jiraData.fields.reporter.name);
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
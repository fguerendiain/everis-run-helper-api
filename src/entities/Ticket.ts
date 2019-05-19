import { isNullOrUndefined } from "util";

/*
OBJ Noc:{
	plantilla:"",
	assigneGrupo:"",
	assigneEquipoEveris:"",
	assigneTecnico:""
} */


export abstract class ticket{

	private id:string;
    private subject:string;
    private description:string;
	private created:Date;
	private updated:Date;
	private type:string;
	private status:string;
	private priroriry:string;
	private reporter:string;
    private comments = new Array;
    private attachments = new Array; //falta en jira

    //getters & setters    
    public getId(){
     return this.id;        
    }

    public setId(v_id){
        this.id = v_id;
    }

    public getSubject(){
        return this.subject;        
       }
   
    public setSubject(v_subject){
        this.subject = v_subject;
    }

    public getCreated(){
        return this.created;        
       }
   
    public setCreated(v_created){
        this.created = v_created;
    }

    public getUpdated(){
        return this.updated;        
       }
   
    public setUpdated(v_updated){
        this.updated = v_updated;
    }

    public getType(){
        return this.type;        
       }
   
    public setType(v_type){
        this.type = v_type;
    }
    
    public getStatus(){
        return this.status;        
       }
   
    public setStatus(v_status){
        this.status = v_status;
    }    

    public getPriroriry(){
        return this.priroriry;        
       }
   
    public setPriroriry(v_priroriry){
        this.priroriry = v_priroriry;
    }

    public getReporter(){
        return this.reporter;        
       }
   
    public setReporter(v_reporter){
        this.reporter = v_reporter;
    }

    public getDescription(){
        return this.description;        
       }
   
    public setDescription(v_description){
        this.description = v_description;
    }    

    public getComments(){
        return this.comments;        
       }

    public setComments(v_body:string, v_assignee?:string, v_created?:string, v_id?:string){
        let newJsonString:{};
        if(isNullOrUndefined(v_assignee)){
            newJsonString = { 
            "body" : v_body}
        }else{
            newJsonString = { "id" : v_id,
            "assignee" : v_assignee,
            "body" : v_body,
            "created" : v_created};
        }
        this.comments.push(newJsonString)
    }
    
    public getAttachments(){
        return this.attachments;        
       }

    public setAttachments(v_attachments){
        this.attachments.push(v_attachments)
    }
}
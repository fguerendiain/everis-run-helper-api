/*
OBJ Ticket:{
	id:"",
	subject:"",
	created:"",
	updated:""
	attach:
	type:"",
	status:"",
	priroriry:"",
	reporter:"",
	comments[]:{
		date:"",
		assigne:"",
		comment:""
	},
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
}

OBJ Noc:{
	plantilla:"",
	assigneGrupo:"",
	assigneEquipoEveris:"",
	assigneTecnico:""
} */


export abstract class ticket{

	public id:string;
    public subject:string;
    public description:string;
	public created:Date;
	public updated:Date;
	public type:string;
	public status:string;
	public priroriry:string;
	public reporter:string;

    public attach:Blob[];
    public comments:{}[];
    public comment:{}; //date,assigne,comment

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

}
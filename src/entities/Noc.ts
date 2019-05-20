import { isNullOrUndefined } from "util";
import * as logger from '../logger';
import { ticket } from "./Ticket";
import * as nocservices from "../externalServices/RESTService/NOCService";

export class Noc extends ticket{

	private plantilla:string;
	private assigneGrupo:string;
	private assigneEquipoEveris:string;
    private assigneTecnico:string;
    private subCategoria:string;

    constructor(v_id?:string){
        super();
        if(isNullOrUndefined(v_id)){
            this.setId(null);
        }
        this.setId(v_id);
    }


    //Graba los datos del objeto en el servidor
    public async saveInstanceOnNoc(){
        if(isNullOrUndefined(this.getId())){
            //si la instancia no posee id creo un nuevo noc
            await nocservices.createNoc(this);
        }else{
            //modifico el existente
            await nocservices.modifyNoc(this);
            //grabo los comentarios nuevos
            for(let i = 0; i < this.getComments().length; i++){
                if(isNullOrUndefined(this.getComments()[i].id)){
                    await nocservices.addNocCommentsById(this.getId(),this.getComments()[i].body)
                }
            }
        }
    }    



    //Carga una instancia del objeto con los datos provinientes del servidor
    public async fillInstanceByNocId(){

        let nocData = await nocservices.getNocById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
        let nocComment = await nocservices.getNocCommentsById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});

        if(nocData.hasOwnProperty('result')){
            if(nocData.operation.result.message == "Invalid requestID in given URL"){
                logger.error('NOC',this.getId()+': La solicitud no Existe');
            }
                logger.error('NOC',this.getId()+': '+nocData.operation.result.message);
            return null;
        }else{
            this.setId(nocData.WORKORDERID);
            this.setSubject(nocData.SUBJECT);
            this.setCreated(nocData.CREATEDTIME);
            this.setDescription(nocData.DESCRIPTION)
            this.setType(nocData.REQUESTTYPE);
            this.setStatus(nocData.STATUS);
            this.setPriroriry(nocData.URGENCY);
            this.setReporter(nocData["Usuario SADE"]);
            this.setAssigneGrupo(nocData.GROUP);
            this.setAssigneEquipoEveris(nocData["Equipo Everis"]);
            this.setAssigneTecnico(nocData.TECHNICIAN);
            this.setSubCategoria(nocData.SUBCATEGORY);
            this.setPlantilla(nocData.REQUESTTEMPLATE);


            //cargo el listado de mensajes
            for(let i = 0 ; i < nocComment.operation.Details.lenght; i++){

                let v_body = nocComment.operation.Details[i].NOTESTEXT; //ok
                let v_assignee = nocComment.operation.Details[i].USERNAME; //ok
                let v_created = nocComment.operation.Details[i].NOTESDATE; //ok
                let v_commentId = nocComment.operation.Details[i].notesid; //ok

                this.setComments(v_body,v_assignee,v_created,v_commentId);
            }

            logger.info('NOC','Se cargo objeto NOC con datos de ticket: '+this.getId());
        };
    }

    //getters y setters

    public getPlantilla(){
        return this.plantilla;        
       }
   
    public setPlantilla(v_plantilla){
        this.plantilla = v_plantilla;
    }

    public getAssigneGrupo(){
        return this.assigneGrupo;        
       }
   
    public setAssigneGrupo(v_assigneGrupo){
        this.assigneGrupo = v_assigneGrupo;
    }

    public getAssigneEquipoEveris(){
        return this.assigneEquipoEveris;        
       }
   
    public setAssigneEquipoEveris(v_assigneEquipoEveris){
        this.assigneEquipoEveris = v_assigneEquipoEveris;
    }    

    public getAssigneTecnico(){
        return this.assigneTecnico;        
       }
   
    public setAssigneTecnico(v_assigneTecnico){
        this.assigneTecnico = v_assigneTecnico;
    }

    public getSubCategoria(){
        return this.subCategoria;        
       }
   
    public setSubCategoria(v_subCategoria){
        this.subCategoria = v_subCategoria;
    }
}
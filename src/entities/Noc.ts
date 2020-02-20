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
    private entorno:string;

    constructor(v_id?:string){
        super();
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
        let nocComment:{}[] = ((await nocservices.getNocCommentsById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined})).operation.Details);

        if(nocData.hasOwnProperty('result') || isNullOrUndefined(nocData) || nocData.hasOwnProperty('error')){
            if(nocData.operation.result.message == "Invalid requestID in given URL"){
                logger.error('NOC',this.getId()+': La solicitud no Existe o no es visible');
            }
                logger.error('NOC',this.getId()+': '+nocData);
            return null;
        }else{
            this.setId(nocData.WORKORDERID);
            this.setSubject(nocData.SUBJECT);
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
            this.formatCreateDate(nocData.CREATEDTIME);
            this.setEntorno();

            //cargo el listado de mensajes
            if(!isNullOrUndefined(nocComment)){
                for(let i = 0 ; i < nocComment.length; i++){

                    let v_body = nocComment[i]['NOTESTEXT']; //ok
                    let v_assignee = nocComment[i]['USERNAME']; //ok
                    let v_created = nocComment[i]['NOTESDATE']; //ok
                    let v_commentId = nocComment[i]['notesid']; //ok

                    this.setComments(v_body,v_assignee,v_created,v_commentId);
                }
            }

            logger.info('NOC','Se cargo objeto NOC con datos de ticket: '+this.getId());
        }
        return this;
    };

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

    public getEntorno(){
        return this.entorno;        
       }
   
    public setEntorno(){
        let stringSubject:string = <string>this.getSubject();
        if(!isNullOrUndefined(stringSubject)){
            if(stringSubject.includes("PRD")){
                this.entorno = "PRD";
            }else if(stringSubject.includes("HML")){
                this.entorno = "HML";
            }else if(stringSubject.includes("CAPA")){
                this.entorno = "CAPA";
            }else{
                this.entorno = "PRD";
            }
        }else{
            this.entorno = "SIN VISIBILIDAD";
        }
    }


    private formatCreateDate(createTime: string){
        if(!isNullOrUndefined(createTime)){
            let formatedDate = new Date(+createTime);

            let year:string = formatedDate.getFullYear().toString();
            let month:string = (formatedDate.getUTCMonth()+1).toString();
            let day:string = formatedDate.getDate().toString();

            if(month.length == 1){
                month = '0'+month;
            } 
            if(day.length == 1){
                day = '0'+day;
            } 
            this.setCreated(year+month+day);
        }
    }

}
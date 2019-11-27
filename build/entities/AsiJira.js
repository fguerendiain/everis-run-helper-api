"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const asijiraservices = require("../externalServices/RESTService/ASIJIRAService");
const Ticket_1 = require("./Ticket");
const logger = require("../logger");
const util_1 = require("util");
class AsiJira extends Ticket_1.ticket {
    constructor(v_id) {
        super();
        this.labels = new Array;
        this.components = new Array;
        this.worklog = new Array;
        if (util_1.isNullOrUndefined(v_id)) {
            this.setId(null);
        }
        this.setId(v_id);
    }
    /*     //Graba los datos del objeto en el servidor
        public async saveInstanceOnJira(){
            if(isNullOrUndefined(this.getId())){
                //si la instancia no posee id creo un nuevo jira
                await asijiraservices.createJira(this);
            }else{
                //modifico el existente
                await asijiraservices.modifyJira(this);
                //grabo los comentarios nuevos
                for(let i = 0; i < this.getComments().length; i++){
                    if(isNullOrUndefined(this.getComments()[i].id)){
                        await asijiraservices.addJiraCommentsById(this.getId(),this.getComments()[i].body)
                    }
                }
                //grabo los worklog nuevos
                for(let i = 0; i < this.getWorklog().length; i++){
                    if(isNullOrUndefined(this.getWorklog()[i].id)){
                        let v_worklog:{} = {
                            "comment": this.getWorklog()[i].body,
                            "timeSpentSeconds": this.getWorklog()[i].timeSpent,
                        }
    
                        await asijiraservices.addJiraWorklogById(this.getId(),JSON.stringify(v_worklog));
                    }
                }
            }
        }
     */
    //Carga una instancia del objeto con los datos provinientes del servidor
    fillInstanceByJiraId() {
        return __awaiter(this, void 0, void 0, function* () {
            let jiraData = yield asijiraservices.getJiraById(this.getId()).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            let jiraComment = yield asijiraservices.getJiraCommentsById(this.getId()).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            //        let jiraWorklog = await asijiraservices.getJiraWorklogById(this.getId()).catch((err)=>{logger.awaitAsyncErrorHandler(err); return undefined});
            if (util_1.isNullOrUndefined(jiraData) || jiraData.errorMessages == "La Incidencia no Existe") {
                logger.info('JIRA', this.getId() + ': La Incidencia no Existe');
                return null;
            }
            else {
                this.setId(jiraData.key);
                this.setSubject(jiraData.key + " - " + jiraData.fields.summary);
                this.setCreated(jiraData.fields.created);
                this.setUpdated(jiraData.fields.updated);
                this.setDescription("https://asijira.buenosaires.gob.ar/browse/" + jiraData.key + "\r\n\r\n" + jiraData.fields.description + "\r\n\r\n------------------\r\nDATOS DE INFORMADOR:\r\n" + jiraData.fields.reporter.displayName + "\r\n" + jiraData.fields.reporter.emailAddress);
                if (!util_1.isNullOrUndefined(jiraData.fields.issuetype.name)) {
                    this.setType(jiraData.fields.issuetype.name);
                }
                ;
                if (!util_1.isNullOrUndefined(jiraData.fields.status.name)) {
                    this.setStatus(jiraData.fields.status.name);
                }
                ;
                this.setPriroriry(jiraData.fields.priority.id);
                if (!util_1.isNullOrUndefined(jiraData.fields.reporter.name)) {
                    this.setReporter(jiraData.fields.reporter.name);
                }
                ;
                this.settimeTrakingLogged(jiraData.fields.timetracking.timeSpentSeconds);
                if (!util_1.isNullOrUndefined(jiraData.fields.assignee)) {
                    this.setAssigne(jiraData.fields.assignee.name);
                }
                //else{
                //  this.setAssigne('laparlov');
                // }
                this.setReopenCounter(jiraData.fields.customfield_10304);
                this.labels = jiraData.fields.labels;
                this.setProject(jiraData.fields.project.key);
                //cargo el listado de components
                for (let i = 0; i < jiraData.fields.components.length; i++) {
                    this.setComponents(jiraData.fields.components[i].id);
                }
                //cargo el listado de mensajes
                for (let i = 0; i < jiraComment.total; i++) {
                    let v_body = jiraComment.comments[i].body;
                    let v_assignee = jiraComment.comments[i].author.displayName;
                    let v_created = jiraComment.comments[i].created;
                    let v_comentId = jiraComment.comments[i].id;
                    this.setComments(v_body, v_assignee, v_created, v_comentId);
                }
                /*             //cargo el listado de worklog
                            for(let i = 0 ; i < jiraWorklog.total; i++){
                                
                                let worklogId = jiraWorklog.worklogs[i].id;
                                let assignee = jiraWorklog.worklogs[i].author.displayName;
                                let body = jiraWorklog.worklogs[i].comment;
                                let created = jiraWorklog.worklogs[i].created;
                                let timeSpent = jiraWorklog.worklogs[i].timeSpentSeconds;
                
                                this.setWorklog(timeSpent,assignee,body,created,worklogId);
                            }
                 */
                logger.info('JIRA', 'Se cargo objeto JIRA con datos de ticket: ' + this.getId());
            }
            ;
        });
    }
    //getters y setters
    getAssigne() {
        return this.assigne;
    }
    setAssigne(v_assigne) {
        this.assigne = v_assigne;
    }
    getProject() {
        return this.project;
    }
    setProject(v_project) {
        this.project = v_project;
    }
    getLabels() {
        return this.labels;
    }
    setLabels(v_labels) {
        this.labels.push(v_labels);
    }
    getReopenCounter() {
        return this.reopenCounter;
    }
    setReopenCounter(v_reopenCounter) {
        this.reopenCounter = v_reopenCounter;
    }
    getTimeTrakingLogged() {
        return this.timeTrakingLogged;
    }
    settimeTrakingLogged(v_timeTrakingLogged) {
        this.timeTrakingLogged += v_timeTrakingLogged;
    }
    getComponents() {
        return this.components;
    }
    setComponents(v_components) {
        this.components.push(v_components);
    }
    getWorklog() {
        return this.worklog;
    }
    /*     public setWorklog(v_timeSpent:number,v_assigne:string ,v_body?:string, v_created?:string, v_id?:string){
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
     */
    //permite eliminar una lable especifica
    deleteLable(lableName) {
        for (let i = 0; i < this.getLabels().length; i++) {
            if (this.getLabels()[i] == lableName) {
                this.getLabels().splice(i, 1);
            }
        }
    }
    //permite eliminar un componente especifico
    deleteComponent(componentName) {
        for (let i = 0; i < this.getComponents().length; i++) {
            if (this.getComponents()[i] == componentName) {
                this.getComponents().splice(i, 1);
            }
        }
    }
}
exports.AsiJira = AsiJira;
//# sourceMappingURL=AsiJira.js.map
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
const jiraservices = require("../externalServices/RESTService/JIRAService");
const Ticket_1 = require("./Ticket");
const logger = require("../logger");
class Jira extends Ticket_1.ticket {
    constructor() {
        super();
    }
    jiraFillTicketCreator(v_id, v_summary, v_description, v_issuetype, v_status, v_priority, v_reporter) {
        return __awaiter(this, void 0, void 0, function* () {
            let jiraData = yield jiraservices.getJiraById(v_id).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            if (jiraData.errorMessages == "La solicitud no Existe") {
                //si no existe el Jira lo creo
                this.setId("NADA");
                this.setSubject("NADA");
                this.setCreated("NADA");
                this.setUpdated("NADA");
                this.setDescription("NADA");
                this.setType("NADA");
                this.setStatus("NADA");
                this.setPriroriry("NADA");
                this.setReporter("NADA");
            }
            else {
                this.setId(jiraData.key);
                this.setSubject(jiraData.fields.summary);
                this.setCreated(jiraData.fields.created);
                this.setUpdated(jiraData.fields.updated);
                this.setDescription(jiraData.fields.description);
                this.setType(jiraData.fields.issuetype.name);
                this.setStatus(jiraData.fields.status.name);
                this.setPriroriry(jiraData.fields.priority.name);
                this.setReporter(jiraData.fields.reporter.name);
                console.log(typeof (jiraData.fields.comment.comments.total));
                for (let i = 0; jiraData.fields.comment.comments.total; i++) {
                    this.comments.push({ "id": jiraData.fields.comment.comments[i].id,
                        "assignee": jiraData.fields.comment.comments[i].author.name,
                        "body": jiraData.fields.comment.comments[i].body,
                        "created": jiraData.fields.comment.comments[i].created });
                    // '{"id":"'+jiraData.fields.comment.comments[i].id+'",\
                    // "assignee":"'+jiraData.fields.comment.comments[i].author.name+'",\
                    // "body":"'+jiraData.fields.comment.comments[i].body+'",\
                    // "created":"'+jiraData.fields.comment.comments[i].created+'"}'
                    //);
                    console.log(jiraData.fields.comment.comments);
                }
            }
            ;
        });
    }
    getAssigne() {
        return this.assigne;
    }
    setAssigne(v_assigne) {
        this.assigne = v_assigne;
    }
    getLabels() {
        return this.labels;
    }
    getReopenCounter() {
        return this.reopenCounter;
    }
    setReopenCounter(v_reopenCounter) {
        this.reopenCounter = v_reopenCounter;
    }
    gettimeTrakingLogged() {
        return this.timeTrakingLogged;
    }
    settimeTrakingLogged(v_timeTrakingLogged) {
        this.timeTrakingLogged += v_timeTrakingLogged;
    }
    getComments() {
        console.log(this.comments);
        return this.comments;
    }
}
exports.Jira = Jira;
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
//# sourceMappingURL=Jira.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
/*
OBJ Noc:{
    plantilla:"",
    assigneGrupo:"",
    assigneEquipoEveris:"",
    assigneTecnico:""
} */
class ticket {
    constructor() {
        this.comments = new Array;
        this.attachments = new Array; //falta en jira
    }
    //getters & setters    
    getId() {
        return this.id;
    }
    setId(v_id) {
        this.id = v_id;
    }
    getProject() {
        return this.project;
    }
    setProject(v_project) {
        this.project = v_project;
    }
    getSubject() {
        return this.subject;
    }
    setSubject(v_subject) {
        this.subject = v_subject;
    }
    getCreated() {
        return this.created;
    }
    setCreated(v_created) {
        this.created = v_created;
    }
    getUpdated() {
        return this.updated;
    }
    setUpdated(v_updated) {
        this.updated = v_updated;
    }
    getType() {
        return this.type;
    }
    setType(v_type) {
        this.type = v_type;
    }
    getStatus() {
        return this.status;
    }
    setStatus(v_status) {
        this.status = v_status;
    }
    getPriroriry() {
        return this.priroriry;
    }
    setPriroriry(v_priroriry) {
        this.priroriry = v_priroriry;
    }
    getReporter() {
        return this.reporter;
    }
    setReporter(v_reporter) {
        this.reporter = v_reporter;
    }
    getDescription() {
        return this.description;
    }
    setDescription(v_description) {
        this.description = v_description;
    }
    getComments() {
        return this.comments;
    }
    setComments(v_body, v_assignee, v_created, v_id) {
        let newJsonString;
        if (util_1.isNullOrUndefined(v_assignee)) {
            newJsonString = {
                "body": v_body
            };
        }
        else {
            newJsonString = { "id": v_id,
                "assignee": v_assignee,
                "body": v_body,
                "created": v_created };
        }
        this.comments.push(newJsonString);
    }
    getAttachments() {
        return this.attachments;
    }
    setAttachments(v_attachments) {
        this.attachments.push(v_attachments);
    }
}
exports.ticket = ticket;
//# sourceMappingURL=Ticket.js.map
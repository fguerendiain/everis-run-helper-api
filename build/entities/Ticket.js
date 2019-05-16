"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
class ticket {
    //getters & setters    
    getId() {
        return this.id;
    }
    setId(v_id) {
        this.id = v_id;
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
}
exports.ticket = ticket;
//# sourceMappingURL=Ticket.js.map
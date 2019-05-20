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
const util_1 = require("util");
const logger = require("../logger");
const Ticket_1 = require("./Ticket");
const nocservices = require("../externalServices/RESTService/NOCService");
class Noc extends Ticket_1.ticket {
    constructor(v_id) {
        super();
        if (util_1.isNullOrUndefined(v_id)) {
            this.setId(null);
        }
        this.setId(v_id);
    }
    //Graba los datos del objeto en el servidor
    saveInstanceOnNoc() {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_1.isNullOrUndefined(this.getId())) {
                //si la instancia no posee id creo un nuevo noc
                yield nocservices.createNoc(this);
            }
            else {
                //modifico el existente
                yield nocservices.modifyNoc(this);
                //grabo los comentarios nuevos
                for (let i = 0; i < this.getComments().length; i++) {
                    if (util_1.isNullOrUndefined(this.getComments()[i].id)) {
                        yield nocservices.addNocCommentsById(this.getId(), this.getComments()[i].body);
                    }
                }
            }
        });
    }
    //Carga una instancia del objeto con los datos provinientes del servidor
    fillInstanceByNocId() {
        return __awaiter(this, void 0, void 0, function* () {
            let nocData = yield nocservices.getNocById(this.getId()).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            let nocComment = yield nocservices.getNocCommentsById(this.getId()).catch((err) => { logger.awaitAsyncErrorHandler(err); return undefined; });
            if (nocData.hasOwnProperty('result')) {
                if (nocData.operation.result.message == "Invalid requestID in given URL") {
                    logger.error('NOC', this.getId() + ': La solicitud no Existe');
                }
                logger.error('NOC', this.getId() + ': ' + nocData.operation.result.message);
                return null;
            }
            else {
                this.setId(nocData.WORKORDERID);
                this.setSubject(nocData.SUBJECT);
                this.setCreated(nocData.CREATEDTIME);
                this.setDescription(nocData.DESCRIPTION);
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
                for (let i = 0; i < nocComment.operation.Details.lenght; i++) {
                    let v_body = nocComment.operation.Details[i].NOTESTEXT; //ok
                    let v_assignee = nocComment.operation.Details[i].USERNAME; //ok
                    let v_created = nocComment.operation.Details[i].NOTESDATE; //ok
                    let v_commentId = nocComment.operation.Details[i].notesid; //ok
                    this.setComments(v_body, v_assignee, v_created, v_commentId);
                }
                logger.info('NOC', 'Se cargo objeto NOC con datos de ticket: ' + this.getId());
            }
            ;
        });
    }
    //getters y setters
    getPlantilla() {
        return this.plantilla;
    }
    setPlantilla(v_plantilla) {
        this.plantilla = v_plantilla;
    }
    getAssigneGrupo() {
        return this.assigneGrupo;
    }
    setAssigneGrupo(v_assigneGrupo) {
        this.assigneGrupo = v_assigneGrupo;
    }
    getAssigneEquipoEveris() {
        return this.assigneEquipoEveris;
    }
    setAssigneEquipoEveris(v_assigneEquipoEveris) {
        this.assigneEquipoEveris = v_assigneEquipoEveris;
    }
    getAssigneTecnico() {
        return this.assigneTecnico;
    }
    setAssigneTecnico(v_assigneTecnico) {
        this.assigneTecnico = v_assigneTecnico;
    }
    getSubCategoria() {
        return this.subCategoria;
    }
    setSubCategoria(v_subCategoria) {
        this.subCategoria = v_subCategoria;
    }
}
exports.Noc = Noc;
//# sourceMappingURL=Noc.js.map
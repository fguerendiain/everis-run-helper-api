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
const logger = require("../logger");
const TASKNAME = 'CONVERTIR BASE64';
//const RESPONSABLE = 'franco.javier.guerendiain@everis.com'
//BUSCAR DATOS DE BACKLOG POR UNA FECHA DETERMINADA
function base64Encoder(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger.taskBeginInfo(TASKNAME + ' CODIFICAR');
        let urlfile = req.params.filedir;
        console.log(urlfile);
        const file = window.open(urlfile);
        ;
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        yield res.status(200).send(yield toBase64(file));
        logger.taskEndInfo(TASKNAME + ' CODIFICAR');
    });
}
exports.base64Encoder = base64Encoder;
//# sourceMappingURL=convertirBase64.js.map
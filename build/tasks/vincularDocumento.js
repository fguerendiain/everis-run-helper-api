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
const config = require("../config");
const bbddtools = require("../tools/BBDDtools");
const pdiservices = require("../externalServices/WSService/PDIService");
const gpservices = require("../externalServices/RESTService/GPService");
const bbddoracle = config.get("bbddoracle");
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryString = 'select codexpediente from loys_man_sade.st_expediente where rownum < 2';
        let queryString1 = 'select NOMBRE_APELLIDO from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';
        let idExpTad = '1625485';
        let direccion = ['amenabar', '2000'];
        let stringBuilder;
        let querys = [
            yield bbddtools.BBDDData(bbddoracle.prd, queryString),
            yield bbddtools.BBDDData(bbddoracle.prd, queryString1),
            yield gpservices.getParticipantesExpediente(idExpTad),
            yield pdiservices.getCalleDireccionValidas(direccion[0], direccion[1])
        ];
        Promise.all(querys)
            .then((results) => {
            for (let i = 0; i < results.length; i++) {
                if (util_1.isNullOrUndefined(stringBuilder)) {
                    stringBuilder = results[i];
                }
                else {
                    stringBuilder = stringBuilder + " | " + results[i];
                }
            }
            res.status(200).send(stringBuilder);
        });
    });
}
exports.run = run;
//# sourceMappingURL=vincularDocumento.js.map
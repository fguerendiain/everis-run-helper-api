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
const BBDDtools = require("../tools/BBDDtools");
const RESTtools = require("../tools/RESTtools");
const config = require("../config");
const util_1 = require("util");
const bbddoracle = config.get("bbddoracle");
function run(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryString = 'select codexpediente from loys_man_sade.st_expediente where rownum < 2';
        let queryString1 = 'select NOMBRE_APELLIDO from TAD_SADE.TAD_PERSONA WHERE NOMBRE_APELLIDO IS NOT NULL AND rownum = 1';
        let urlGP = 'https://servicios.gcba.gob.ar/api/v1/tramites/1625485/participaciones';
        let stringBuilder;
        let querys = [
            yield BBDDtools.BBDDData(bbddoracle.prd, queryString),
            yield BBDDtools.BBDDData(bbddoracle.prd, queryString1),
            yield RESTtools.apiRestConsume(urlGP, "GET", '{"Content-Type":"application/json","Accept":"application/json"}')
        ];
        Promise.all(querys)
            .then((results) => {
            for (let i = 0; i < results.length; i++) {
                if (util_1.isNull(stringBuilder) || util_1.isUndefined(stringBuilder)) {
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
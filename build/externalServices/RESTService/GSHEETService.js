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
const gsheettools = require("../../tools/GSHEETTools");
const config = require("../../config");
const Noc_1 = require("../../entities/Noc");
const GOOGLESHEETS = config.get('googlesheets');
function getPriorizados() {
    return __awaiter(this, void 0, void 0, function* () {
        //obtengo el listado de los priorizados
        let listaPriorizados = yield gsheettools.getSheetRows(GOOGLESHEETS.priorizadossade);
        let nocsArray = new Array;
        let priorizadosPorRegistroArray = new Array;
        let priorizadosPorRegistroToJSON;
        //genero un array de objetos noc
        for (let i = 0; i < listaPriorizados.length; i++) {
            let auxNocInsatnce;
            auxNocInsatnce = new Noc_1.Noc(listaPriorizados[i]['noc']);
            yield auxNocInsatnce.fillInstanceByNocId();
            nocsArray.push(auxNocInsatnce);
        }
        //armo json con el listado de priorizados basado en la info de noc
        for (let i = 0; i < nocsArray.length; i++) {
            let v_estado;
            if (nocsArray[i].getAssigneGrupo() == "EVERIS") {
                v_estado = "EVERIS";
            }
            else {
                v_estado = "INFORMADOR";
            }
            priorizadosPorRegistroToJSON = {
                "noc": nocsArray[i].getId(),
                "resumen": nocsArray[i].getSubject(),
                "modulo": nocsArray[i].getSubCategoria(),
                "entorno": nocsArray[i].getEntorno(),
                "estado": v_estado,
                "fechacreacion": nocsArray[i].getCreated()
            };
            priorizadosPorRegistroArray.push(priorizadosPorRegistroToJSON);
        }
        return priorizadosPorRegistroArray;
    });
}
exports.getPriorizados = getPriorizados;
//# sourceMappingURL=GSHEETService.js.map
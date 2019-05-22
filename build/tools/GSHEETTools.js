"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googlesheet = require("google-spreadsheet");
const logger = require("../logger");
function getPriorizados() {
    return new Promise((resolve, reject) => {
        let creds = require('../../everis-run-helper-bd31067181d1.json');
        let priorizadosSadeSheet = new googlesheet('1fzw83CyWAH10ddNkZ_3TUu-eQapaGggvoA_G6hhMj0I');
        priorizadosSadeSheet.useServiceAccountAuth(creds, function (err, resp) {
            priorizadosSadeSheet.getRows(1, function (err, rows) {
                if (err) {
                    logger.error('GSHEET', err);
                    reject(err);
                }
                logger.info('GSHEET', rows);
                resolve(rows);
            });
        });
    });
}
exports.getPriorizados = getPriorizados;
//# sourceMappingURL=GSHEETTools.js.map
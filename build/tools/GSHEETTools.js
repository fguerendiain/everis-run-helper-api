"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const googlesheet = require("google-spreadsheet");
const logger = require("../logger");
function getSheetRows(v_googleSheet) {
    return new Promise((resolve, reject) => {
        let creds = require('../../gsheetCredentials.json');
        let priorizadosSadeSheet = new googlesheet(v_googleSheet);
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
exports.getSheetRows = getSheetRows;
//# sourceMappingURL=GSHEETTools.js.map
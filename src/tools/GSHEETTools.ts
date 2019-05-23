import * as googlesheet from 'google-spreadsheet';
import * as logger from '../logger';



export function getSheetRows(v_googleSheet:string){
return new Promise((resolve,reject)=>{
  let creds = require('../../gsheetCredentials.json');
  let priorizadosSadeSheet = new googlesheet(v_googleSheet);
  priorizadosSadeSheet.useServiceAccountAuth(creds, function(err,resp){
    priorizadosSadeSheet.getRows(1, function (err, rows) {
      if (err){
        logger.error('GSHEET',err)
        reject(err)
      }
      logger.info('GSHEET', rows)
      resolve(rows);
    })});
  });
}
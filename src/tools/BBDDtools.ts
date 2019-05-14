import * as oracledb from 'oracledb'
import * as logger from '../logger'
import { isNullOrUndefined } from 'util';

export class BBDDinstance{

  bbddoracle:string;


  constructor(v_bbddoracle:string){
    this.bbddoracle = v_bbddoracle; 
  }

  //RETORNA RESULTADO DE QUERY COMO PROMISE
  public BBDDData(queryString){
    return new Promise((resolve,reject)=>{
      this.query(queryString,resolve,reject);
    })};

  //GENERA CONEXION CON BBDD, REALIZA CONSULTA Y CIERRA LA CONEXION
  private query(queryString,resolve,reject){          
    this.connect((err,bbddconnection)=>{
      if(err){
        logger.info("BBDD","Error al conectar a la base");
      }
      else{
        logger.info("BBDD","Se abrio conexion a la BBDD");
        bbddconnection.execute(queryString,[], // no binds
          {
            outFormat: bbddconnection.OBJECT
          },function(err, queryResponse) {
            logger.info("BBDD","Se realizo consulta: "+queryString);
            if (err) {
              logger.error("BBDD",err.message);
              return reject(err);
            }
            logger.info("BBDD","Respuesta: "+queryResponse.rows);
            BBDDinstance.close(bbddconnection,(err)=>{
              if(err){
                logger.error("BBDD",err.message);
                return reject(err);
              }
              else{
                logger.info("BBDD","Se cerro conexion a BBDD");
              }
            })

            return resolve(BBDDinstance.responsePromiseJsonFormat(queryResponse));
          }
        );
        }
      });
  }
            
  //ABRE CONECCION CON BBDD
  private connect(callback){
    oracledb.getConnection(this.bbddoracle,
      function(err, bdconnect) {
        if (err) {
          logger.error("BBDD",err.message);
          callback(err,null);
          return;
        }
      callback(null,bdconnect);
      }
    )
  }

  //CIERRA CONEXION CON BBDD
  private static close(BBDDConnection,callback) {
    BBDDConnection.close(
      function(err) {
        if (err){
          callback(err);
          return
        }
        callback(null);
      }  
    );
  }

  private static responsePromiseJsonFormat(queryResponse) {
    let newResultsArray = [];
    let cantFilas = Object.keys(queryResponse.rows).length;
    let cantColumnas = Object.keys(queryResponse.metaData).length

    for (let row = 0; row < cantFilas; row++) {
        let rowResult = {};
        for (let col = 0; col < cantColumnas; col++) {
            rowResult[queryResponse.metaData[col].name] = queryResponse.rows[row][col];
        }
        newResultsArray.push(rowResult);
        logger.info('PROMISE-BBDD-FORMAT', JSON.stringify(rowResult));
    }
    return newResultsArray;
  }  
}

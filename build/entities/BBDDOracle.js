"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oracledb = require("oracledb");
const logger = require("../logger");
class BBDDinstance {
    constructor(v_bbddoracle) {
        this.bbddoracle = v_bbddoracle;
    }
    //RETORNA RESULTADO DE QUERY COMO PROMISE
    BBDDData(queryString) {
        return new Promise((resolve, reject) => {
            this.query(queryString, resolve, reject);
        });
    }
    ;
    //GENERA CONEXION CON BBDD, REALIZA CONSULTA Y CIERRA LA CONEXION
    query(queryString, resolve, reject) {
        this.connect((err, bbddconnection) => {
            if (err) {
                logger.info("BBDD", "Error al conectar a la base");
            }
            else {
                logger.info("BBDD", "Se abrio conexion a la BBDD");
                bbddconnection.execute(queryString, [], // no binds
                {
                    outFormat: bbddconnection.OBJECT
                }, function (err, queryResponse) {
                    logger.info("BBDD", "Se realizo consulta: " + queryString);
                    if (err) {
                        logger.error("BBDD", err.message);
                        return reject(err);
                    }
                    logger.info("BBDD", "Respuesta: " + queryResponse.rows);
                    BBDDinstance.close(bbddconnection, (err) => {
                        if (err) {
                            logger.error("BBDD", err.message);
                            return reject(err);
                        }
                        else {
                            logger.info("BBDD", "Se cerro conexion a BBDD");
                        }
                    });
                    return resolve(BBDDinstance.responsePromiseJsonFormat(queryResponse));
                });
            }
        });
    }
    //ABRE CONECCION CON BBDD
    connect(callback) {
        oracledb.getConnection(this.bbddoracle, function (err, bdconnect) {
            if (err) {
                logger.error("BBDD", err.message);
                callback(err, null);
                return;
            }
            callback(null, bdconnect);
        });
    }
    //CIERRA CONEXION CON BBDD
    static close(BBDDConnection, callback) {
        BBDDConnection.close(function (err) {
            if (err) {
                callback(err);
                return;
            }
            callback(null);
        });
    }
    static responsePromiseJsonFormat(queryResponse) {
        let newResultsArray = [];
        let cantFilas = Object.keys(queryResponse.rows).length;
        let cantColumnas = Object.keys(queryResponse.metaData).length;
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
exports.BBDDinstance = BBDDinstance;
//# sourceMappingURL=BBDDOracle.js.map
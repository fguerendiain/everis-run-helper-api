"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oracledb = require("oracledb");
const logger = require("../logger");
//RETORNA RESULTADO DE QUERY COMO PROMISE
function BBDDData(bbddoracle, queryString) {
    return new Promise((resolve, reject) => {
        query(bbddoracle, queryString, resolve);
    });
}
exports.BBDDData = BBDDData;
;
//GENERA CONEXION CON BBDD, REALIZA CONSULTA Y CIERRA LA CONEXION
function query(bbddoracle, queryString, callback) {
    connect(bbddoracle, (err, bbddconnection) => {
        if (err) {
            logger.info("BBDD", "Error al conectar a la base");
        }
        else {
            logger.info("BBDD", "Se abrio conexion a la BBDD");
            bbddconnection.execute(queryString, function (err, queryResponse) {
                logger.info("BBDD", "Se realizo consulta: " + queryString);
                if (err) {
                    logger.error("BBDD", err.message);
                    return callback(err);
                }
                logger.info("BBDD", "Respuesta: " + queryResponse.rows);
                close(bbddconnection, (err) => {
                    if (err) {
                        logger.error("BBDD", err.message);
                        return callback(err);
                    }
                    else {
                        logger.info("BBDD", "Se cerro conexion a BBDD");
                    }
                });
                return callback(queryResponse.rows);
            });
        }
    });
}
//ABRE CONECCION CON BBDD
function connect(bbddoracle, callback) {
    oracledb.getConnection(bbddoracle, function (err, bdconnect) {
        if (err) {
            logger.error("BBDD", err.message);
            callback(err, null);
            return;
        }
        callback(null, bdconnect);
    });
}
//CIERRA CONEXION CON BBDD
function close(BBDDConnection, callback) {
    BBDDConnection.close(function (err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}
//# sourceMappingURL=BBDDtools.js.map
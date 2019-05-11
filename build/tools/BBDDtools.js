"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oracledb = require("oracledb");
const logger = require("../logger");
const util_1 = require("util");
//RETORNA RESULTADO DE QUERY COMO PROMISE
function BBDDData(bbddoracle, queryString, callMethod) {
    if (util_1.isNullOrUndefined(callMethod)) {
        callMethod = BBDDData.name;
    }
    return new Promise((resolve, reject) => {
        query(bbddoracle, queryString, resolve, reject, callMethod);
    });
}
exports.BBDDData = BBDDData;
;
//GENERA CONEXION CON BBDD, REALIZA CONSULTA Y CIERRA LA CONEXION
function query(bbddoracle, queryString, resolve, reject, callMethod) {
    connect(bbddoracle, (err, bbddconnection) => {
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
                close(bbddconnection, (err) => {
                    if (err) {
                        logger.error("BBDD", err.message);
                        return reject(err);
                    }
                    else {
                        logger.info("BBDD", "Se cerro conexion a BBDD");
                    }
                });
                return resolve(JSON.parse('{"' + callMethod + '":' + JSON.stringify(queryResponse) + '}'));
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
import * as oracledb from 'oracledb'
import * as config from '../config'
import * as logger from '../logger'


const bbddoracle = {
    user          : config.get("bbddoracle.prd.user"),
    password      : config.get("bbddoracle.prd.password"),
    connectString : config.get("bbddoracle.prd.connectString")
}

let bdconnect;


try{
    bdconnect = oracledb.getConnection(bbddoracle);
}
catch(err){
    logger.error('BBDD','Error al conectar a BBDD oracle produccion - '+err.message);
}

    bdconnect.execute();

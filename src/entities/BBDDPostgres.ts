import * as config from '../config';
import * as logger from '../logger';
import { doesNotReject } from 'assert';
const { Client } = require('pg');

const BBDDCREDENTIALS = config.get('bbddpostgres');

export class BBDDconect{

    public client;

    constructor(){
        let connectionData = {
            "user": BBDDCREDENTIALS.user,
            "host": BBDDCREDENTIALS.host,
            "database": BBDDCREDENTIALS.database,
            "password": config.passDecoder(BBDDCREDENTIALS.password),
            "port": BBDDCREDENTIALS.port,
          }

          this.client = new Client(connectionData);
          this.client.connect();
    }

    public query(v_query:string){
        return new Promise((resolve,reject)=>{
            this.client.query(v_query,(err,resp)=>{
                if(err){
                    logger.error('BBDD',err+' - Coneccion cerrada');
                    reject(err);
                }else{
                    logger.info('BBDD',JSON.stringify(resp));
                    resolve(resp.rows);
                }
                this.endConnection();
            })
        })
    }

    public endConnection(){
        this.client.end();
    }

} 




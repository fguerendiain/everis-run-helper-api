import * as config from '../config';
import * as logger from '../logger';
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
            this.client.query(v_query)
            .then(response => {
                logger.info('BBDD',JSON.stringify(response));
                resolve(response.rows);
            })
            .catch(err => {
                logger.error('BBDD',err+' - Coneccion cerrada');
                this.endConnection();
                reject(err);
            })
        })
    }

    public endConnection(){
        this.client.end();
    }

} 




import * as config from '../config';
import * as logger from '../logger';
const { Client } = require('pg');

const BBDDCREDENTIALS = config.get('bbddpostgres');

export class BBDDconect{

    public client;

    constructor(){
        let connectionData = {
            user: BBDDCREDENTIALS.user,
            host: BBDDCREDENTIALS.host,
            database: BBDDCREDENTIALS.database,
            password: config.passDecoder(BBDDCREDENTIALS.password),
            port: 5432,
          }
          const client = new Client(connectionData)
          this.client = client.connect()
    }

    public query(v_query:string){
        return new Promise((resolve,reject)=>{
            this.client.query(v_query)
            .then(response => {
                logger.info('BBDD',response.rows);
                this.client.end();
                resolve(response.rows);
            })
            .catch(err => {
                logger.error('BBDD',err);
                this.client.end();
                reject(err);
            })
        })
    }
} 




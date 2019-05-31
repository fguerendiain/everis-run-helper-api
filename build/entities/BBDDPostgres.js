"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("../config");
const logger = require("../logger");
const { Client } = require('pg');
const BBDDCREDENTIALS = config.get('bbddpostgres');
class BBDDconect {
    constructor() {
        let connectionData = {
            "user": BBDDCREDENTIALS.user,
            "host": BBDDCREDENTIALS.host,
            "database": BBDDCREDENTIALS.database,
            "password": config.passDecoder(BBDDCREDENTIALS.password),
            "port": BBDDCREDENTIALS.port,
        };
        this.client = new Client(connectionData);
        this.client.connect();
    }
    query(v_query) {
        return new Promise((resolve, reject) => {
            this.client.query(v_query, (err, resp) => {
                if (err) {
                    logger.error('BBDD', err + ' - Coneccion cerrada');
                    reject(err);
                }
                else {
                    logger.info('BBDD', JSON.stringify(resp));
                    resolve(resp.rows);
                }
                this.endConnection();
            });
        });
    }
    endConnection() {
        this.client.end();
    }
}
exports.BBDDconect = BBDDconect;
//# sourceMappingURL=BBDDPostgres.js.map
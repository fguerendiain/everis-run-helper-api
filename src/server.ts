import * as http from 'http'
import * as config from './config'
import * as APIFactory from './APIFactory'
import * as log from './logger'

const apiPort:number = +config.get('apiPort');
const api = APIFactory.build();
const server = http.createServer(api);
server.listen(apiPort);
log.info('SERVER',`Ready: Listening on port ${apiPort}`)

import Server from './server/server';
import * as env from './config/environment';

const server = Server.init( env.SERVER_PORT );
server.start();

import Server from './server/server';
import * as db from './config/database';

db.Database();

let puerto: number = 3000;
const server = Server.init( puerto );

server.start( () => {
  console.log(`Servidor corriendo en el puerto ${ puerto }`);
});

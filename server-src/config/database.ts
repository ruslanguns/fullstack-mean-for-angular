const mongoose = require('mongoose');
import * as env from './environment';

export function Database() {

const dbUri = `mongodb://${ env.DB_HOST }:${ env.DB_PORT }/${ env.DB_NAME }`;

const optionsDB = {
  // user: env.DB_USERNAME,
  // pass: env.DB_PASSWORD,
  useNewUrlParser: true
};

const conn = mongoose.connection;

// const configuracionDb = {
//       useNewUrlParser: true,
//       auth: {
//           user: 'ruslan',
//           password: 'ruslan'
//       }
//   }

mongoose.set('useCreateIndex', true);
mongoose.connection.openUri( dbUri, optionsDB );

conn.on('error', console.error.bind( console, 'Hay un ERROR en la conexion con la base de datos'));

conn.once( 'open', () => console.log('La base de datos esta ONLINE'));

}


const mongoose = require('mongoose');

export function Database() {

const dbUri = 'mongodb://localhost:27017/hospitalDB';
const conn = mongoose.connection;

const configuracionDb = {
      useNewUrlParser: true,
      // auth: {
      //     user: 'user',
      //     password: 'password'
      // }
  }

mongoose.set('useCreateIndex', true);
mongoose.connection.openUri( dbUri, configuracionDb );

conn.on('error', console.error.bind( console, 'Hay un ERROR en la conexion con la base de datos'));

conn.once( 'open', () => console.log('La base de datos esta ONLINE'));

}


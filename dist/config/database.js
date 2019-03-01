"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
function Database() {
    const dbUri = 'mongodb://localhost:27017/hospitalDB';
    const conn = mongoose.connection;
    const configuracionDb = {
        useNewUrlParser: true,
    };
    mongoose.set('useCreateIndex', true);
    mongoose.connection.openUri(dbUri, configuracionDb);
    conn.on('error', console.error.bind(console, 'Hay un ERROR en la conexion con la base de datos'));
    conn.once('open', () => console.log('La base de datos esta ONLINE'));
}
exports.Database = Database;

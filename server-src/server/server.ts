
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import cors = require('cors');

import * as db from './../config/database';

db.Database();

// routes
import appRoutes from '../routes/app.routes';
import userRoutes from '../routes/user.routes';
import loginRoutes from '../routes/login.routes';
import mailRoutes from '../routes/login.routes';


export default class Server {

    public app: express.Application;
    public port: number;

    constructor( puerto: number ) {

        this.port = puerto;
        this.app = express();

        this.app.use( cors({ origin: true, credentials: true }));
        this.app.use( bodyParser.urlencoded({ extended: true }));
        this.app.use( bodyParser.json());

        this.app.use( '/api/v1/usuario', userRoutes );
        this.app.use( '/api/v1/login', loginRoutes );
        this.app.use( '/api/v1/mail', mailRoutes )
        this.app.use( '/api/v1', appRoutes );
    }

    /**
     * Inicializar la configuración del servidor
     * @param puerto Iniciar con el puerto
     */
    static init ( puerto: number ) {
        return new Server ( puerto );
    }

    private publicDir() {
        const publicDir = path.resolve( __dirname, '../../public');

        this.app.use( express.static( publicDir ));
    }

    /**
     * Ejecutar servidor
     * @param callback Callback Opcional
     */
    start( callback?: Function ) {
        this.app.listen( this.port, callback );
        this.publicDir();

        console.log(`Servidor corriendo en el puerto ${ this.port }`);
    }
}


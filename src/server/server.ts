
import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import cors = require('cors');


import Router from '../routes/app.router';
import usuarioRoutes from '../routes/user.router';


export default class Server {

    public app: express.Application;
    public port: number;

    constructor( puerto: number ) {

        this.port = puerto;
        this.app = express();

        this.app.use(cors());
        this.app.use( bodyParser.urlencoded({
          extended: false
        }));
        this.app.use(bodyParser.json());

        this.app.use( '/api/v1/usuario', usuarioRoutes );
        this.app.use( '/api/v1', Router );
    }

    static init ( puerto: number ) {
        return new Server ( puerto );
    }

    private publicDir() {
        const publicDir = path.resolve( __dirname, '../../public');

        this.app.use( express.static( publicDir ));
    }

    start( callback: Function ) {
        this.app.listen( this.port, callback );
        this.publicDir();
    }
}


"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = __importStar(require("./../config/database"));
db.Database();
// routes
const app_routes_1 = __importDefault(require("../routes/app.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const login_routes_1 = __importDefault(require("../routes/login.routes"));
const login_routes_2 = __importDefault(require("../routes/login.routes"));
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express();
        this.app.use(cors({ origin: true, credentials: true }));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use('/api/v1/usuario', user_routes_1.default);
        this.app.use('/api/v1/login', login_routes_1.default);
        this.app.use('/api/v1/mail', login_routes_2.default);
        this.app.use('/api/v1', app_routes_1.default);
    }
    /**
     * Inicializar la configuración del servidor
     * @param puerto Iniciar con el puerto
     */
    static init(puerto) {
        return new Server(puerto);
    }
    publicDir() {
        const publicDir = path.resolve(__dirname, '../../public');
        this.app.use(express.static(publicDir));
    }
    /**
     * Ejecutar servidor
     * @param callback Callback Opcional
     */
    start(callback) {
        this.app.listen(this.port, callback);
        this.publicDir();
        console.log(`Servidor corriendo en el puerto ${this.port}`);
    }
}
exports.default = Server;

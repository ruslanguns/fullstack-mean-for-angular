"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app_router_1 = __importDefault(require("../routes/app.router"));
const user_router_1 = __importDefault(require("../routes/user.router"));
class Server {
    constructor(puerto) {
        this.port = puerto;
        this.app = express();
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({
            extended: false
        }));
        this.app.use(bodyParser.json());
        this.app.use('/api/v1/usuario', user_router_1.default);
        this.app.use('/api/v1', app_router_1.default);
    }
    static init(puerto) {
        return new Server(puerto);
    }
    publicDir() {
        const publicDir = path.resolve(__dirname, '../../public');
        this.app.use(express.static(publicDir));
    }
    start(callback) {
        this.app.listen(this.port, callback);
        this.publicDir();
    }
}
exports.default = Server;

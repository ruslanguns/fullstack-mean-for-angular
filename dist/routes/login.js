"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const express_1 = require("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mdAutenticacion = __importStar(require("./../middlewares/authentication"));
const config = __importStar(require("./../config/config"));
const user_model_1 = __importDefault(require("./../models/user.model"));
const router = express_1.Router();
const SEED = config.SEED;
// Google
const CLIENT_ID = config.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
// ====================================
// AUTENTICACION TOKEN
// ====================================
router.get('/renuevatoken', mdAutenticacion.verificaToken, (req, res) => {
    let usuarioReq = req.params.usuario;
    let token = jwt.sign({ usuario: usuarioReq }, SEED, { expiresIn: 14400 });
    res.status(200).json({
        ok: true,
        usuario: usuarioReq,
        token: token
    });
});
// ====================================
// AUTENTICACION CON GOOGLE ...... <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// ====================================
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticket = yield client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        //const domain = payload['hd'];
        return {
            nombre: payload.name,
            email: payload.email,
            img: payload.picture,
            google: true
        };
    });
}
router.post('/google', (req, res) => __awaiter(this, void 0, void 0, function* () {
    let token = req.body.token;
    if (!token) {
        return res.status(403).json({
            ok: false,
            mensaje: 'No hay ningun token puesto'
        });
    }
    let googleUser;
    try {
        googleUser = yield verify(token);
    }
    catch (error) {
        return res.status(403).json({
            ok: false,
            mensaje: 'El token esta mal',
            errros: error.message
        });
    }
    user_model_1.default.findOne({
        email: googleUser.email
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe usar su autenticación normal'
                });
            }
            else {
                usuarioDB.password = ':)';
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            }
        }
        else {
            // el usuario no existe, hay que crearlo
            let usuario = new user_model_1.default();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuario - googe',
                        errors: err
                    });
                }
                // usuarioDB.password = ':)';
                let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token: token,
                    id: usuarioDB._id,
                    menu: obtenerMenu(usuarioDB.role)
                });
            });
        }
    });
}));
// ====================================
// AUTENTICACION NORMAL ...... <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// ====================================
// ====================================
// POST Método de login
// ====================================
router.post('/', (req, res) => {
    let body = req.body;
    user_model_1.default.findOne({
        email: body.email
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        // Crear un tocken
        usuarioDB.password = ':)';
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });
});
function obtenerMenu(ROLE) {
    let menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Gráficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RxJs', url: '/rxjs' },
                { titulo: 'Editor TinyMCE', url: '/editor-tinymce' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios'},
                { titulo: 'Hospitales', url: '/hospitales' },
                { titulo: 'Médicos', url: '/medicos' },
            ]
        },
        {
            titulo: 'Librerias',
            icono: 'mdi mdi-archive',
            submenu: [
                { titulo: 'Anartz - Openweather', url: '/librerias/openweather' },
            ]
        }
    ];
    // Aqui es donde se gestiona el tema de administrador
    if (ROLE === 'ADMIN_ROLE') {
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }
    return menu;
}
exports.default = router;

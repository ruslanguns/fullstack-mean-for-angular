"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const mdwAUTH = __importStar(require("../middlewares/authentication"));
const router = express_1.Router();
router.get('/', (req, res) => {
    let desde = req.query.desde || 0; // si viene un parametro, sino es cero
    desde = Number(desde);
    user_model_1.default.find({}, 'nombre email role')
        .skip(desde)
        .limit(5) // para paginacion
        .exec((err, usuarios) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar los usuarios',
                errors: err
            });
        }
        user_model_1.default.countDocuments({}, (err, conteo) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los usuarios',
                    errors: err
                });
            }
            else {
                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: conteo
                });
            }
        });
    });
});
router.get('/:id', (req, res) => {
    const id = req.params.id;
    user_model_1.default.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al cargar los usuarios',
                errors: err
            });
        }
        usuario.password = ':)';
        res.status(200).json({
            ok: true,
            usuario
        });
    });
});
router.put('/:id', [mdwAUTH.verificaToken, mdwAUTH.verificaAdminRole, mdwAUTH.verificaAdminRoleOUsuario], (req, res) => {
    const id = req.params.id;
    const body = req.body;
    user_model_1.default.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar al usuario',
                errors: err
            });
        }
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: { message: 'No exite un usuario con ese ID' }
            });
        }
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar al usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});
router.post('/', (req, res) => {
    const body = req.body;
    let usuario = new user_model_1.default({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10),
        role: body.role
    });
    if (usuario.role !== 'USER_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'No tiene permitida esta acción',
            errors: { message: 'No está autorizado para crear otro tipo de usuario, distinto al de tipo Usuario.' }
        });
    }
    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear al usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: usuario
        });
    });
});
router.delete('/:id', [mdwAUTH.verificaToken, mdwAUTH.verificaAdminRole], (req, res) => {
    const id = req.params.id;
    user_model_1.default.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});
exports.default = router;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_1 = require("../config/environment");
// ====================================
// VERIFICAR TOKEN — API  Midleware
// ====================================
function verificaToken(req, res, next) {
    const token = req.query.token;
    jsonwebtoken_1.default.verify(token, environment_1.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El token es inválido',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
}
exports.verificaToken = verificaToken;
// ====================================
// VERIFICA ADMIN
// ====================================
function verificaAdminRole(req, res, next) {
    const usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') { // SI ES VALIDO VAMOS A EJECUTAR LOS PROCESOS
        next();
        return;
    }
    else { // SI NO ES UN USUARIO ADMIN MANDA ERROR
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto — No es administrador',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
}
exports.verificaAdminRole = verificaAdminRole;
// ====================================
// VERIFICA ADMIN O SI ES USUARIO
// ====================================
function verificaAdminRoleOUsuario(req, res, next) {
    const usuario = req.usuario;
    const id = req.params.id;
    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    }
    else {
        return res.status(400).json({
            ok: false,
            message: 'Invalid Token - Wrong admin role user',
            errors: { message: 'No es administrador, no puede hacer eso' }
        });
    }
}
exports.verificaAdminRoleOUsuario = verificaAdminRoleOUsuario;

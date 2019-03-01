"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "'{VALUE}' no es un role permitido."
};
let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    role: { type: String, default: 'USER_ROLE', enum: rolesValidos }
});
usuarioSchema.plugin(uniqueValidator, { message: "El campo: '{PATH}' debe ser único" });
exports.default = mongoose.model('Usuario', usuarioSchema);

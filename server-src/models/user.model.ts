
import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: "'{VALUE}' no es un role permitido."
};

export interface IUser extends Document {
  id: string;
  nombre: string;
  email: string;
  password: string; 
  google?: boolean;
  role?: string;
  img?: string;
}

const UsuarioSchema: Schema = new Schema({
  nombre: { type: String, required: [true, 'El nombre es necesario'] },
  email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
  password: { type: String, required: [true, 'La contraseña es necesaria'] },
  img: { type: String, required: false },  
  role: { type: String, default: 'USER_ROLE', enum: rolesValidos },
  google: { type: Boolean, default: false }
});

UsuarioSchema.plugin( uniqueValidator, { message: "El campo: '{PATH}' debe ser único" });

export default mongoose.model<IUser>('Usuario', UsuarioSchema);

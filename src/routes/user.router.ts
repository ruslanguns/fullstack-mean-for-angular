import { Router, Request, Response } from "express";
const bcrypt = require('bcrypt');

import * as mdAutenticacion from './../middlewares/authentication';
import Usuario from './../models/user.model';

const router = Router();

router.get('/', ( req: Request, res: Response ) => {

  let desde = req.query.desde || 0; // si viene un parametro, sino es cero
  desde = Number( desde );

  Usuario.find({}, 'nombre email role')
    .skip(desde)
    .limit(5) // para paginacion
    .exec(( err: any, usuarios: any ) => {

      if (err) {
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al cargar los usuarios',
              errors: err
          });
      }

      Usuario.countDocuments({}, ( err: any, conteo: any ) => { // contador para contar los registros

        if (err) {
          return res.status(500).json({
              ok: false,
              mensaje: 'Error al cargar los usuarios',
              errors: err
          });
        } else {
          res.status(200).json({
            ok: true,
            usuarios: usuarios,
            total: conteo
        });
        }

      });
    });
});


router.put('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdminRole, mdAutenticacion.verificaAdminRoleOUsuario], ( req:any, res: any ) => {

  const id = req.params.id;
  const body = req.body;

  Usuario.findById(id, ( err: any, usuario: any ) => {

    if ( err ) {
      return res.status( 500 ).json({
        ok: false,
        mensaje: 'Error al buscar al usuario',
        errors: err
      });
    }

    if ( !usuario ) {
      return res.status( 400 ).json({
        ok: false,
        mensaje: 'El usuario con el id' + id + 'no existe',
        errors: { message: 'No exite un usuario con ese ID' }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save(( err: any, usuarioGuardado: any ) => {
      if ( err) {
        return res.status( 400 ).json({
          ok: false,
          mensaje: 'Error al actualizar al usuario',
          errors: err
        });
      }

      usuarioGuardado.password = ':)';

      res.status( 200 ).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
});


router.post('/', ( req: any, res: any ) => {
  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err: any, usuarioGuardado: any ) => {

    if (err) {
      return res.status( 400 ).json({
        ok: false,
        mensaje: 'Error al crear al usuario',
        errors: err
      });
    }

    res.status( 201 ).json({
      ok: true,
      usuario: usuarioGuardado,
      usuarioToken: req.usuario
    });
  });
});


router.delete('/:id', [mdAutenticacion.verificaToken, mdAutenticacion.verificaAdminRole], ( req: any, res: any ) => {

  var id = req.params.id;

    Usuario.findByIdAndRemove(id, ( err: any, usuarioBorrado: any ) => {

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


export default router;

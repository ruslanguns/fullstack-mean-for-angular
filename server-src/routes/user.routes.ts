import { Router, Request, Response } from "express";
import bcrypt from 'bcrypt';

import Usuario, { IUser } from '../models/user.model';
import * as mdwAUTH from '../middlewares/authentication';

const router = Router();

router.get('/', ( req: Request, res: Response ) => {

  let desde: number = req.query.desde || 0; // si viene un parametro, sino es cero
  desde = Number( desde );

  Usuario.find({}, 'nombre email role')
    .skip( desde )
    .limit( 5 ) // para paginacion
    .exec(( err: Error, usuarios: any ) => {

      if ( err ) {
          return res.status( 500 ).json({
              ok: false,
              mensaje: 'Error al cargar los usuarios',
              errors: err
          });
      }

      Usuario.countDocuments({}, ( err: Error, conteo: Number ) => { // contador para contar los registros

        if ( err ) {
          return res.status( 500 ).json({
              ok: false,
              mensaje: 'Error al cargar los usuarios',
              errors: err
          });
        } else {
          res.status( 200 ).json({
            ok: true,
            usuarios: usuarios,
            total: conteo
          });
        }

      });
    });
});

router.get('/:id', (req: Request, res: Response) => {

  const id = req.params.id;

  Usuario.findById( id, ( err: Error, usuario: IUser) => {

    if ( err ) {
      return res.status( 500 ).json({
          ok: false,
          mensaje: 'Error al cargar los usuarios',
          errors: err
      });
    }

    usuario.password = ':)';

    res.status( 200 ).json({
      ok: true,
      usuario
    });

  })
});


router.put('/:id', [mdwAUTH.verificaToken, mdwAUTH.verificaAdminRole, mdwAUTH.verificaAdminRoleOUsuario], ( req: Request, res: Response ) => {

  const id = req.params.id;
  const body = req.body;

  Usuario.findById(id, ( err: Error, usuario: IUser ) => {

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

    usuario.save(( err: Error, usuarioGuardado: any ) => {
      if ( err ) {
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


router.post('/', ( req: Request, res: Response ) => {
  const body = req.body;

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  if ( usuario.role !== 'USER_ROLE' ) {
    return res.status( 401 ).json({
      ok: false,
      mensaje: 'No tiene permitida esta acción',
      errors: { message: 'No está autorizado para crear otro tipo de usuario, distinto al de tipo Usuario.' }
    });
  }

  usuario.save((err: Error, usuarioGuardado: any ) => {

    if ( err ) {
      return res.status( 400 ).json({
        ok: false,
        mensaje: 'Error al crear al usuario',
        errors: err
      });
    }

    res.status( 201 ).json({
      ok: true,
      usuario: usuarioGuardado,
      usuarioToken: usuario
    });
  });
});


router.delete('/:id', [mdwAUTH.verificaToken, mdwAUTH.verificaAdminRole], ( req: Request, res: Response ) => {

  const id = req.params.id;

    Usuario.findByIdAndRemove(id, ( err: Error, usuarioBorrado: any ) => {

      if ( err ) {
          return res.status( 500 ).json({
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

      res.status( 200 ).json({
          ok: true,
          usuario: usuarioBorrado
      });
    });

});


export default router;

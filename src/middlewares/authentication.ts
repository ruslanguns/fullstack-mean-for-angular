const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;


// ====================================
// VERIFICAR TOKEN — API  Midleware
// ====================================
export function verificaToken ( req: any, res: any, next: any ) {

  const token = req.query.token;

  jwt.verify(token, SEED, ( err: any, decoded: any ) => {

    if ( err ) {
      return res.status( 401 ).json({
        ok: false,
        mensaje: 'El token es inválido',
        errors: err
      });
    }

    req.usuario = decoded.usuario;

    next();

  });
}


// ====================================
// VERIFICA ADMIN
// ====================================
export function verificaAdminRole ( req: any, res: any, next: any ) {

  const usuario = req.usuario;

  if (usuario.role === 'ADMIN_ROLE') { // SI ES VALIDO VAMOS A EJECUTAR LOS PROCESOS
    next();
    return;
  } else { // SI NO ES UN USUARIO ADMIN MANDA ERROR
    return res.status( 401 ).json({
      ok: false,
      mensaje: 'Token incorrecto — No es administrador',
      errors: { message: 'No es administrador, no puede hacer eso' }
    });
  }
}


// ====================================
// VERIFICA ADMIN O SI ES USUARIO
// ====================================
export function verificaAdminRoleOUsuario ( req: any, res: any, next: any ) {

  const usuario = req.usuario;
  const id = req.params.id;

  if ( usuario.role === 'ADMIN_ROLE' || usuario._id === id ) {
    next();
    return;
  } else {
    return res.status( 400 ).json({
      ok: false,
      message: 'Invalid Token - Wrong admin role user',
      errors: { message: 'No es administrador, no puede hacer eso' }
    });
  }
}

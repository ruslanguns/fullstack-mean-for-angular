import { Router, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

import * as mdAutenticacion from './../middlewares/authentication';
import * as config from './../config/config';
import Usuario from './../models/user.model';

const router = Router();

const SEED = config.SEED;

// Google
const CLIENT_ID = config.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// ====================================
// AUTENTICACION TOKEN
// ====================================
router.get('/renuevatoken', mdAutenticacion.verificaToken, ( req: Request, res: Response ) => {

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
async function verify( token: any ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
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
    }
}

router.post('/google', async( req: Request, res: Response ) => {

    let token = req.body.token;

    if (!token) {
        return res.status(403).json({
            ok: false,
            mensaje: 'No hay ningun token puesto'
        });
    }

    let googleUser: any;
    try {
        googleUser = await verify(token);
    } catch (error) {
        return res.status(403).json({
            ok: false,
            mensaje: 'El token esta mal',
            errros: error.message
        });
    }

    Usuario.findOne({
        email: googleUser.email
    }, (err: any, usuarioDB: any) => {

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
            } else {
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
        } else {
            // el usuario no existe, hay que crearlo
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err: any, usuarioDB: any) => {

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
});

// ====================================
// AUTENTICACION NORMAL ...... <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
// ====================================

// ====================================
// POST Método de login
// ====================================
router.post('/', ( req: Request, res: Response ) => {

    let body = req.body;

    Usuario.findOne({
        email: body.email
    }, (err: any, usuarioDB: any) => {

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

function obtenerMenu(ROLE: string) {

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

export default router;

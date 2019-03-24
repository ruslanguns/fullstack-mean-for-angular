import { Router, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import Usuario from './../models/user.model';
import { UsuarioI } from "../interfaces/usuario";
import * as env from '../config/environment';

const router = Router();

//Rutas
router.post('/cambiarPassword', (req: Request, res: Response) => {

    let body = req.body;
    let to = body.to;

    Usuario.findOne({
        email: to
    }, (err: any, usuarioDB: UsuarioI) => {

        if (err) {
            return res.status( 500 ).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status( 400 ).json({
                ok: false,
                mensaje: 'El usuario no existe en la base de datos',
                errors: err
            });
        }

        if (usuarioDB) {
            //Generar Token
            var token = jwt.sign({
                to
            }, env.SEED, {
                expiresIn: 1800
            }); //30 min

            // Plantilla de correo
            let mail_subject = 'Restablecer contraseña ✔';
            // let mail_template = '<b><br>Para restablecer tu contraseña, <br><br> <a href="http://localhost:4200/#/reset/' + token + '">Haz click Aquí</a> <br><br>  Gracias!  <br>  </b>';
            let mail_template = //html
                `
            <table cellspacing="0" cellpadding="0" border="0" style="color:#333;background:#fff;padding:0;margin:0;width:100%;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica">
                <tbody>
                    <tr width="100%">
                        <td valign="top" align="left" style="background:#eef0f1;font:15px/1.25em 'Helvetica Neue',Arial,Helvetica">
                            <table style="border:none;padding:0 18px;margin:50px auto;width:500px">
                                <tbody>
                                    <tr width="100%" height="60">
                                        <td valign="top" align="left" style="border-top-left-radius:4px;border-top-right-radius:4px;background:#27709b;padding:10px 18px;text-align:center"> <img height="60" width="60" src="https://rusgunx.tk/images/profile.png" title="RusGunX" style="font-weight:bold;font-size:18px;color:#fff;vertical-align:top"> </td>
                                    </tr>
                                    <tr width="100%">
                                        <td valign="top" align="left" style="background:#fff;padding:18px">
                                            <h1 style="font-size:20px;margin:16px 0;color:#333;text-align:center"> Recupera tu contraseña </h1>
                                            <p style="font:12px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center"> Hemos recibido una petición para cambiar tu contraseña, solo haz click en el botón y sigue las instrucciones para recuperarla.</p>
                                            <div style="background:#f6f7f8;border-radius:3px"> <br>
                                                <p style="font:15px/1.25em 'Helvetica Neue',Arial,Helvetica;margin-bottom:0;text-align:center"> <a href="http://localhost:4200/#/reset/${token}" style="border-radius:3px;background:#3aa54c;color:#fff;display:block;font-weight:700;font-size:16px;line-height:1.25em;margin:24px auto 6px;padding:10px 18px;text-decoration:none;width:180px"
                                                        target="_blank"> Recuperar contraseña</a> </p>
                                                <p style="font:11px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center"> Si tienes problemas con el botón, copia y pega el siguiente enlace en tu navegador: <br><br> http: //localhost:4200/#/reset/${token}
                                                </p> <br><br> </div>
                                            <p style="font:14px/1.25em 'Helvetica Neue',Arial,Helvetica;color:#333;text-align:center"> <strong>¿No has sido tú?</strong> No te preocupes, solo ignora este correo. <br><br> <a href="mailto:ruslanguns@gmail.com?subject=Reporto abuso" style="color:#306f9c;text-decoration:none;font-weight:bold" target="_blank">Reportar abuso »</a>                                    </p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            `;

            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

            // // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport( env.DATOS_SMTP );

            // setup email data with unicode symbols
            let mail_options = {
                from: env.EMAIL_FROM, // sender address
                to, // list of receivers
                subject: mail_subject, // Subject line
                text: mail_template, // plain text body
                html: mail_template // html body
            };

            console.log( mail_options );

            // send mail with defined transport object
            transporter.sendMail( mail_options, ( err: Error | null, info: any ) => {
                if (err) {
                    return res.status( 400 ).json({
                        ok: false,
                        mensaje: 'Error correo no pudo ser enviado',
                        errors: err
                    });
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl( info ));

                res.status( 200 ).json({
                    ok: true,
                    message: 'El correo fue enviado correctamente',
                    token: token
                });
            });
        }
    });

});


export default router;
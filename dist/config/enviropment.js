"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./../lib/dotenv/env");
// SERVER
exports.SERVER_PORT = Number(process.env.SERVER_PORT) || 3000;
// db setup
exports.DB_HOST = process.env.DB_HOST || 'localhost';
exports.DB_PORT = Number(process.env.DB_PORT) || 27017;
exports.DB_NAME = process.env.DB_NAME || '';
exports.DB_USERNAME = process.env.DB_USERNAME || '';
exports.DB_PASSWORD = process.env.DB_PASSWORD || '';
// public seed
exports.SEED = process.env.SEED || 'este-es-un-seed-dificil';
// google setup
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
exports.GOOGLE_SECRET = process.env.GOOGLE_SECRET || '';
// mail server setup
const EMAIL_HOST = process.env.EMAIL_HOST || '';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 25;
const EMAIL_SECURE = envMailSecure();
const EMAIL_USERNAME = process.env.EMAIL_USERNAME || '';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
function envMailSecure() {
    if (process.env.EMAIL_SECURE === 'false' || undefined || null || '') {
        return false;
    }
    else {
        return true;
    }
}
exports.DATOS_SMTP = {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
};
// mail envelop setup
const EMAIL_FROM_NAME = process.env.FROM_NAME || '';
const EMAIL_FROM_EMAIL = process.env.FROM_EMAIL || '';
exports.EMAIL_FROM = `"${EMAIL_FROM_NAME}" <${EMAIL_FROM_EMAIL}>`;

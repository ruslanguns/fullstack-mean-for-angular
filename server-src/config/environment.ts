
import '../lib/dotenv/env';

// SERVER
export const SERVER_PORT: number = Number( process.env.SERVER_PORT ) || 3000;

// db setup
export const DB_HOST: string = process.env.DB_HOST || 'localhost';
export const DB_PORT: number = Number( process.env.DB_PORT ) || 27017;
export const DB_NAME: string = process.env.DB_NAME || '';
export const DB_USERNAME: string = process.env.DB_USERNAME || '';
export const DB_PASSWORD: string = process.env.DB_PASSWORD || '';

// public seed
export const SEED: string = process.env.SEED || 'este-es-un-seed-dificil';

// google setup
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || '';
export const GOOGLE_SECRET: string = process.env.GOOGLE_SECRET || '';

// mail server setup
const EMAIL_HOST: string = process.env.EMAIL_HOST || '';
const EMAIL_PORT: number = Number( process.env.EMAIL_PORT ) || 25;
const EMAIL_SECURE: boolean = envMailSecure();
const EMAIL_USERNAME: string = process.env.EMAIL_USERNAME || '';
const EMAIL_PASSWORD: string = process.env.EMAIL_PASSWORD || '';

function envMailSecure() {
  if ( process.env.EMAIL_SECURE === 'false' || undefined || null || '') {
    return false;
  } else {
    return true;
  }
}

export const DATOS_SMTP = {
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD
  }
}

// mail envelop setup
const EMAIL_FROM_NAME: string = process.env.FROM_NAME || '';
const EMAIL_FROM_EMAIL: string =  process.env.FROM_EMAIL || '';

export const EMAIL_FROM = `"${ EMAIL_FROM_NAME }" <${ EMAIL_FROM_EMAIL }>`;


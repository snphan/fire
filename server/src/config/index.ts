import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const PLAID_PRODUCTS = process.env.PLAID_PRODUCTS.split(',');
export const PLAID_COUNTRY_CODES = process.env.PLAID_COUNTRY_CODES.split(',');
export const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
export const ORIGIN = process.env.ORIGIN === 'true';
export const {
  NODE_ENV,
  PORT,
  DB_TYPE,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_ENV,
} = process.env;

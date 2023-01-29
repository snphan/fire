import { config } from 'dotenv';
import { CountryCode, Products } from 'plaid';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const PLAID_PRODUCTS: Products[] = (process.env.PLAID_PRODUCTS || Products.Transactions).split(',').map((product: Products) => product);
export const PLAID_COUNTRY_CODES: CountryCode[] = (process.env.PLAID_COUNTRY_CODES || 'US').split(',').map((cc: CountryCode) => cc);
export const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || '';
export const PLAID_ANDROID_PACKAGE_NAME = process.env.PLAID_ANDROID_PACKAGE_NAME || '';
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
  DB_ENCRYPTION_KEY,
  LOG_FORMAT,
  LOG_DIR,
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  PLAID_ENV,
} = process.env;

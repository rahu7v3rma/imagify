export const CONTACT_EMAIL = 'support@imagify.pro';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export const APP_ENV = {
  PRODUCTION: 'production',
  DEVELOPMENT: 'development',
} as const;

export const IS_PRODUCTION = process.env.APP_ENV === APP_ENV.PRODUCTION;
export const IS_DEVELOPMENT = process.env.APP_ENV === APP_ENV.DEVELOPMENT;

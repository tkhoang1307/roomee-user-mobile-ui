export const LOGIN = 'LOGIN';
export const LOG_OUT = 'LOGOUT';
export const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

export enum AuthEndPoints {
  SIGN_IN_ENDPOINT = '/api/auth/sign-in',
  SIGN_UP_ENDPOINT = '/api/auth/sign-up',
  SIGN_IN_BY_GOOGLE_ENDPOINT = '/api/auth/google/sign-in',
  SIGN_UP_BY_GOOGLE_ENDPOINT = '/api/auth/google/sign-up',
  REFRESH_TOKEN_ENDPOINT = '/api/auth/refresh',
  FORGOT_PASSWORD = '/api/auth/forgot-password',
  VERIFY_CODE_FORGOT_PASSWORD = '/api/auth/verify-code',
  UPDATE_PASSWORD = '/api/auth/update-password',
  VERIFY_EMAIL_ENDPOINT = '/api/auth/verify-email',
  SEND_VERIFY_EMAIL_ENDPOINT = '/api/auth/verify-email',
  RESEND_VERIFY_EMAIL_ENDPOINT = '/api/auth/resend-verify-email',
}

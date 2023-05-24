export const errorCodesObject = {
  DUPLICATE_IDENTIFIER: {
    statusCode: 400,
    message: 'Username or email already in use',
  },

  INVALID_EMAIL_OR_PASSWORD: {
    statusCode: 400,
    message: 'Invalid user credentials',
  },

  WEAK_PASSWORD: {
    statusCode: 400,
    message: 'Password is not strong enough',
  },

  INVALID_TOKEN: {
    statusCode: 403,
    message: 'The provided token is invalid',
  },

  INVALID_PASSWORD_RESET_LINK: {
    statusCode: 403,
    message: 'Invalid or expired password reset link',
  },

  INTERNAL_ERROR: {
    statusCode: 500,
    message: 'Internal Server Error',
  },
};


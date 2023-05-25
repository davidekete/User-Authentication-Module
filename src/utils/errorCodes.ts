export const errorCodesObject = {
  DUPLICATE_IDENTIFIER: {
    statusCode: 400,
    message: 'Username or email already in use',
  },

  INVALID_EMAIL_OR_PASSWORD: {
    statusCode: 400,
    message: 'Invalid user credentials',
  },

  VALIDATION_ERROR: {
    statusCode: 400,
    message: "Invalid data object"
  },

  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'User not found: Invalid User Credentials',
  },

  WEAK_PASSWORD: {
    statusCode: 400,
    message: 'Password is not strong enough',
  },

  INVALID_TOKEN: {
    statusCode: 401,
    message: 'The provided token is invalid',
  },

  INVALID_PASSWORD: {
    statusCode: 403,
    message: "Password could not be verified"
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

import rateLimit from 'express-rate-limit';

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

const loginAttemptLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many login attempts from this IP, please try again after an hour',
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many password reset attempts from this IP, please try again after an hour',
});

const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many password reset attempts from this IP, please try again after an hour',
});

const refreshTokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 2, // start blocking after 2 requests
  message:
    'Too many refresh token requests from this IP, please try again after an hour',
});

export {
  createAccountLimiter,
  loginAttemptLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  refreshTokenLimiter,
};

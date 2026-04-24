import rateLimit from 'express-rate-limit';

// General API rate limit: 100 requests per minute per IP
export const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later' },
  },
});

// Strict rate limit for auth endpoints: 10 requests per minute per IP
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: { code: 'RATE_LIMITED', message: 'Too many authentication attempts' },
  },
});

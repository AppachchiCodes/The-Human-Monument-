const rateLimit = require('express-rate-limit');
const config = require('../config');
const logger = require('../utils/logger');

const contributionLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    success: false,
    error: 'Too many contributions from this IP. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      error: 'Too many contributions from this IP. Please try again later.',
      retryAfter: Math.ceil(config.rateLimitWindowMs / 1000 / 60) + ' minutes',
    });
  },
  skip: (req) => {
    // Skip rate limiting for localhost in development
    return config.nodeEnv === 'development' && req.ip === '::1';
  },
});

const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: {
    success: false,
    error: 'Too many requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  contributionLimiter,
  generalLimiter,
};
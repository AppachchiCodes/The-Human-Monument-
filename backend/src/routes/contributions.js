const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const contributionController = require('../controllers/contributionController');
const validateRequest = require('../middleware/validateRequest');
const { contributionLimiter, generalLimiter } = require('../middleware/rateLimiter');
const config = require('../config');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxAudioSize, // Max limit (audio is largest)
  },
  fileFilter: (req, file, cb) => {
    // Image validation
    if (file.fieldname === 'image') {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'), false);
      }
      if (file.size > config.maxImageSize) {
        return cb(new Error('Image size exceeds limit'), false);
      }
    }

    // Audio validation
    if (file.fieldname === 'audio') {
      const allowedAudioTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm'];
      if (!allowedAudioTypes.includes(file.mimetype)) {
        return cb(new Error('Invalid audio format'), false);
      }
      if (file.size > config.maxAudioSize) {
        return cb(new Error('Audio size exceeds limit'), false);
      }
    }

    cb(null, true);
  },
});

// Validation rules
const createContributionValidation = [
  body('type')
    .isIn(['TEXT', 'DRAWING', 'IMAGE', 'AUDIO'])
    .withMessage('Invalid contribution type'),
  body('content')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Content must be between 1 and 5000 characters'),
  body('drawing')
    .optional()
    .isString()
    .withMessage('Drawing must be a valid data URL'),
];

// Routes
router.post(
  '/',
  contributionLimiter,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  createContributionValidation,
  validateRequest,
  contributionController.createContribution
);

router.get(
  '/',
  generalLimiter,
  contributionController.getAllContributions
);

router.get(
  '/stats',
  generalLimiter,
  contributionController.getStats
);

router.get(
  '/:shortId',
  generalLimiter,
  contributionController.getContributionByShortId
);

module.exports = router;
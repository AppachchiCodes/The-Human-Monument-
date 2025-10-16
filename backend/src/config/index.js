require('dotenv').config();

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  // Database
  databaseUrl: process.env.DATABASE_URL,
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // File upload limits
  maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
  maxAudioSize: parseInt(process.env.MAX_AUDIO_SIZE, 10) || 10 * 1024 * 1024, // 10MB
  maxDrawingSize: parseInt(process.env.MAX_DRAWING_SIZE, 10) || 2 * 1024 * 1024, // 2MB
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 min
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 15,
  
  // Storage
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  
  // AWS S3 (optional, for production)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3Bucket: process.env.AWS_S3_BUCKET,
  },
};

// Validate required environment variables
const requiredVars = ['DATABASE_URL'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

module.exports = config;

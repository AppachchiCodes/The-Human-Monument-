const sharp = require('sharp');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { AppError } = require('../middleware/errorHandler');
const config = require('../config');
const path = require('path');
const crypto = require('crypto');

// Initialize S3 Client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'the-human-monument-files';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT;

class FileService {
  generateFileName(prefix, extension) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}_${timestamp}_${random}${extension}`;
  }

  async uploadToR2(buffer, key, contentType) {
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await s3Client.send(command);
      
      // Return the public URL path
      return `/${key}`;
    } catch (error) {
      console.error('R2 upload error:', error);
      throw new AppError('Failed to upload file to storage', 500);
    }
  }

  async saveImage(file) {
    try {
      // Optimize image with sharp
      const optimized = await sharp(file.buffer)
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      const fileName = this.generateFileName('image', '.jpg');
      const key = `images/${fileName}`;

      return await this.uploadToR2(optimized, key, 'image/jpeg');
    } catch (error) {
      console.error('Image save error:', error);
      throw new AppError('Failed to save image', 500);
    }
  }

  async saveDrawing(dataUrl) {
    try {
      // Extract base64 data
      const matches = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) {
        throw new AppError('Invalid drawing data', 400);
      }

      const buffer = Buffer.from(matches[2], 'base64');
      
      // Optimize with sharp
      const optimized = await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .png({ quality: 80 })
        .toBuffer();

      const fileName = this.generateFileName('drawing', '.png');
      const key = `drawings/${fileName}`;

      return await this.uploadToR2(optimized, key, 'image/png');
    } catch (error) {
      console.error('Drawing save error:', error);
      throw new AppError('Failed to save drawing', 500);
    }
  }

  async saveAudio(file) {
    try {
      if (file.size > config.maxAudioSize) {
        throw new AppError('Audio file too large', 400);
      }

      const ext = path.extname(file.originalname) || '.webm';
      const fileName = this.generateFileName('audio', ext);
      const key = `audio/${fileName}`;

      const contentType = file.mimetype || 'audio/webm';

      return await this.uploadToR2(file.buffer, key, contentType);
    } catch (error) {
      console.error('Audio save error:', error);
      throw new AppError('Failed to save audio', 500);
    }
  }

  async deleteFile(filePath) {
    try {
      if (!filePath) return;

      // Remove leading slash if present
      const key = filePath.startsWith('/') ? filePath.slice(1) : filePath;

      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Delete file error:', error);
      // Don't throw error on delete failures
    }
  }
}

module.exports = new FileService();
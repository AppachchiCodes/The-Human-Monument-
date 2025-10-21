const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');
const config = require('../config');

// Hostinger absolute path
const UPLOAD_BASE_PATH = process.env.NODE_ENV === 'production' 
  ? '/home/u703422712/domains/the-human-monument.space/public_html/uploads'
  : './uploads';

class FileService {
  constructor() {
    this.ensureUploadDirectories();
  }

  async ensureUploadDirectories() {
    const dirs = [
      path.join(UPLOAD_BASE_PATH, 'images'),
      path.join(UPLOAD_BASE_PATH, 'drawings'),
      path.join(UPLOAD_BASE_PATH, 'audio')
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Directory ready: ${dir}`);
      } catch (error) {
        console.error(`Failed to create directory ${dir}:`, error);
      }
    }
  }

  generateFileName(prefix, extension) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}_${timestamp}_${random}${extension}`;
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
      const filePath = path.join(UPLOAD_BASE_PATH, 'images', fileName);

      await fs.writeFile(filePath, optimized);

      // Return web-accessible path
      return `/uploads/images/${fileName}`;
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
      const filePath = path.join(UPLOAD_BASE_PATH, 'drawings', fileName);

      await fs.writeFile(filePath, optimized);

      // Return web-accessible path
      return `/uploads/drawings/${fileName}`;
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
      const filePath = path.join(UPLOAD_BASE_PATH, 'audio', fileName);

      await fs.writeFile(filePath, file.buffer);

      // Return web-accessible path
      return `/uploads/audio/${fileName}`;
    } catch (error) {
      console.error('Audio save error:', error);
      throw new AppError('Failed to save audio', 500);
    }
  }

  async deleteFile(filePath) {
    try {
      if (!filePath) return;

      // Convert web path to absolute path
      const fullPath = path.join(UPLOAD_BASE_PATH, '..', filePath);
      
      await fs.unlink(fullPath);
      console.log(` Deleted file: ${fullPath}`);
    } catch (error) {
      console.error('Delete file error:', error);
      // Don't throw error on delete failures
    }
  }
}

module.exports = new FileService();
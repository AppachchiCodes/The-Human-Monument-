// src/services/fileService.js
// File handling service (upload, compression, deletion)

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const config = require('../config');
const logger = require('../utils/logger');

class FileService {
  constructor() {
    this.uploadPath = config.uploadPath;
  }

  async ensureDirectoryExists(directory) {
    try {
      await fs.access(directory);
    } catch {
      await fs.mkdir(directory, { recursive: true });
    }
  }

  async saveImage(file) {
    const timestamp = Date.now();
    const filename = `image_${timestamp}.jpg`;
    const filepath = path.join(this.uploadPath, 'images', filename);

    await this.ensureDirectoryExists(path.join(this.uploadPath, 'images'));

    // Compress and optimize image
    await sharp(file.buffer)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85, progressive: true })
      .toFile(filepath);

    logger.info(`Image saved: ${filename}`);
    return `/uploads/images/${filename}`;
  }

  async saveDrawing(dataUrl) {
    const timestamp = Date.now();
    const filename = `drawing_${timestamp}.png`;
    const filepath = path.join(this.uploadPath, 'drawings', filename);

    await this.ensureDirectoryExists(path.join(this.uploadPath, 'drawings'));

    // Extract base64 data
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Optimize PNG
    await sharp(buffer)
      .png({ compressionLevel: 9 })
      .toFile(filepath);

    logger.info(`Drawing saved: ${filename}`);
    return `/uploads/drawings/${filename}`;
  }

  async saveAudio(file) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `audio_${timestamp}${ext}`;
    const filepath = path.join(this.uploadPath, 'audio', filename);

    await this.ensureDirectoryExists(path.join(this.uploadPath, 'audio'));

    await fs.writeFile(filepath, file.buffer);

    logger.info(`Audio saved: ${filename}`);
    return `/uploads/audio/${filename}`;
  }

  async deleteFile(filePath) {
    if (!filePath) return;

    try {
      const fullPath = path.join(__dirname, '../..', filePath);
      await fs.unlink(fullPath);
      logger.info(`File deleted: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to delete file: ${filePath}`, error);
    }
  }
}

module.exports = new FileService();
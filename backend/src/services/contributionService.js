const prisma = require('../utils/database');
const { generateContributionId } = require('./idGenerator');
const fileService = require('./fileService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class ContributionService {
  // Spiral positioning algorithm - MUST match frontend exactly
  calculateNextPosition(count) {
    if (count === 0) return { x: 0, y: 0 };

    // FIXED: Match frontend exactly - 150 size + 10 padding = 160 total
    const TILE_SIZE = 150;
    const TILE_PADDING = 10;
    const TILE_TOTAL_SIZE = TILE_SIZE; // 150
    
    let x = 0, y = 0;
    let dx = 0, dy = -1;
    let segment = 1;
    let segmentPassed = 0;

    for (let i = 0; i < count; i++) {
      x += dx * TILE_TOTAL_SIZE;  // Now using 160 like frontend
      y += dy * TILE_TOTAL_SIZE;  // Now using 160 like frontend
      segmentPassed++;

      if (segmentPassed === segment) {
        segmentPassed = 0;
        const temp = dx;
        dx = -dy;
        dy = temp;

        if (dy === 0) {
          segment++;
        }
      }
    }

    return { x, y };
  }

  async createContribution(data, files, ipAddress) {
    const { type, content, drawing } = data;
    const shortId = generateContributionId();

    // Get count of existing contributions to determine next position
    const existingCount = await prisma.contribution.count({
      where: { status: 'APPROVED' }
    });
    
    // Calculate position for this contribution
    const { x, y } = this.calculateNextPosition(existingCount);

    // Prepare contribution data
    const contributionData = {
      shortId,
      x,
      y,
      type,
      ipAddress,
      status: 'APPROVED',
    };

    try {
      // Handle different contribution types
      switch (type) {
        case 'TEXT':
          if (!content || content.trim().length === 0) {
            throw new AppError('Text content is required', 400);
          }
          contributionData.content = content.trim();
          break;

        case 'IMAGE':
          if (!files?.image) {
            throw new AppError('Image file is required', 400);
          }
          contributionData.imagePath = await fileService.saveImage(files.image[0]);
          break;

        case 'DRAWING':
          if (!drawing) {
            throw new AppError('Drawing data is required', 400);
          }
          contributionData.drawingPath = await fileService.saveDrawing(drawing);
          break;

        case 'AUDIO':
          if (!files?.audio) {
            throw new AppError('Audio file is required', 400);
          }
          contributionData.audioPath = await fileService.saveAudio(files.audio[0]);
          break;

        default:
          throw new AppError('Invalid contribution type', 400);
      }

      // Save to database
      const contribution = await prisma.contribution.create({
        data: contributionData,
      });

      logger.info(`Contribution created: ${shortId} (${type}) at position (${x}, ${y})`);

      return {
        id: contribution.id,
        shortId: contribution.shortId,
        x: contribution.x,
        y: contribution.y,
        type: contribution.type,
        createdAt: contribution.createdAt,
      };

    } catch (error) {
      // Cleanup files on error
      if (contributionData.imagePath) await fileService.deleteFile(contributionData.imagePath);
      if (contributionData.drawingPath) await fileService.deleteFile(contributionData.drawingPath);
      if (contributionData.audioPath) await fileService.deleteFile(contributionData.audioPath);

      throw error;
    }
  }

  async getAllContributions(page = 1, limit = 100) {
    const skip = (page - 1) * limit;

    const [contributions, total] = await Promise.all([
      prisma.contribution.findMany({
        where: { status: 'APPROVED' },
        select: {
          id: true,
          shortId: true,
          x: true,
          y: true,
          type: true,
          content: true,
          imagePath: true,
          drawingPath: true,
          audioPath: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' }, // IMPORTANT: Order by creation time
        skip,
        take: limit,
      }),
      prisma.contribution.count({ where: { status: 'APPROVED' } }),
    ]);

    return {
      contributions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getContributionByShortId(shortId) {
    const contribution = await prisma.contribution.findUnique({
      where: { shortId },
      select: {
        id: true,
        shortId: true,
        x: true,
        y: true,
        type: true,
        content: true,
        imagePath: true,
        drawingPath: true,
        audioPath: true,
        createdAt: true,
      },
    });

    if (!contribution) {
      throw new AppError('Contribution not found', 404);
    }

    // Ensure coordinates exist and are numbers
    if (typeof contribution.x !== 'number' || typeof contribution.y !== 'number') {
      logger.error(`Contribution ${shortId} has invalid coordinates: x=${contribution.x}, y=${contribution.y}`);
      throw new AppError('Contribution has invalid position data', 500);
    }

    logger.info(`Found contribution ${shortId} at position (${contribution.x}, ${contribution.y})`);

    return contribution;
  }

  async getStats() {
    const [total, byType] = await Promise.all([
      prisma.contribution.count({ where: { status: 'APPROVED' } }),
      prisma.contribution.groupBy({
        by: ['type'],
        where: { status: 'APPROVED' },
        _count: true,
      }),
    ]);

    return {
      total,
      byType: byType.reduce((acc, item) => {
        acc[item.type.toLowerCase()] = item._count;
        return acc;
      }, {}),
    };
  }
}

module.exports = new ContributionService();
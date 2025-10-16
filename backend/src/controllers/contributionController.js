// Controller layer for handling HTTP requests

const contributionService = require('../services/contributionService');
const logger = require('../utils/logger');

class ContributionController {
  async createContribution(req, res, next) {
    try {
      const { type, content, drawing } = req.body;
      const files = req.files;
      const ipAddress = req.ip;

      const contribution = await contributionService.createContribution(
        { type, content, drawing },
        files,
        ipAddress
      );

      logger.info(`Contribution created successfully: ${contribution.shortId}`);

      res.status(201).json({
        success: true,
        message: 'Contribution created successfully',
        data: contribution,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllContributions(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 100;

      // Validate pagination params
      if (page < 1 || limit < 1 || limit > 500) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pagination parameters',
        });
      }

      const result = await contributionService.getAllContributions(page, limit);

      res.json({
        success: true,
        data: result.contributions,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getContributionByShortId(req, res, next) {
    try {
      const { shortId } = req.params;

      if (!shortId || !shortId.startsWith('HM-')) {
        return res.status(400).json({
          success: false,
          error: 'Invalid contribution ID format',
        });
      }

      const contribution = await contributionService.getContributionByShortId(shortId);

      res.json({
        success: true,
        data: contribution,
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await contributionService.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ContributionController();
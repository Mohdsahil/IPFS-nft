const { logger } = require('../../config/logger');

/**
 * Add logger to all the request
 * @param {HTTP Request} request
 * @param {HTTP Response} response
 * @param {HTTP Next} next
 */
const httpLogger = (request, response, next) => {
  const customLog = logger;
  customLog.defaultMeta = {
    requestId: request.headers['X-Request-Id'],
  };
  request.logger = customLog;
  next();
};

module.exports = { httpLogger };

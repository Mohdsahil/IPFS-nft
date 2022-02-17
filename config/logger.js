const expressWinston = require('express-winston');
const { createLogger, transports, format } = require('winston');
const { DATABASE_URL, DATABASE_NAME } = process.env;
require('winston-mongodb');

/*
  HTTP logger configuration for express-winston
*/

const reqResLogger = expressWinston.logger({
  transports: [
    new transports.MongoDB({
      db: `${DATABASE_URL}/${DATABASE_NAME}`,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      collection: 'admin-api-log',
      level: 'info',
      storeHost: true,
      decolorize: false,
      metaKey: 'meta',
    }),
  ],
  meta: true,
  requestWhitelist: [
    'url',
    'method',
    'httpVersion',
    'originalUrl',
    'route.path',
    'query',
    'params',
    'body',
    'headers',
    'ip',
  ],
  responseWhitelist: ['statusCode', 'body'],
  bodyBlacklist: ['password', 'currentPassword', 'newPassword'],
  headerBlacklist: ['x-auth-token'],
});

const customFormatter = format((info) => {
  const { message } = info;
  const args = info[Symbol.for('splat')];
  const strArgs = (args || []).map((arg) => arg).join(' ');
  info.message = `${message} ${strArgs}`;
  return info;
})();

/*
  Winston logger configuration for console transport
  NOTE: If log method is used then the logLevel need to be mentioned explicitly e.g ('info', 'hello')
*/
const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YYYY HH:mm:ss',
    }),
    format.prettyPrint(),
    format.json(),
    customFormatter,
    format.colorize({ all: true }),
    format.printf((info) => {
      const timestamp = info.timestamp.trim();
      const level = info.level;
      const message = (info.message || '').trim();
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
    }),
  ],
});
module.exports = {
  logger,
  reqResLogger,
};

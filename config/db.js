const mongoose = require('mongoose');
const { logger } = require('./logger');
const { DATABASE_URL, DATABASE_NAME } = process.env;

mongoose.Promise = global.Promise;

// Mongoose connection
mongoose.connect(DATABASE_URL, {
  dbName: DATABASE_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

mongoose.connection.on('error', (err) => {
  logger.error(err);
  logger.info(
    '%s MongoDB connection error. Please make sure MongoDB is running.',
  );
  process.exit();
});

mongoose.connection.on('open', () => {
  logger.info(`Connected to Database`);
});

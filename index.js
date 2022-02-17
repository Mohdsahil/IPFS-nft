const express = require('express');
// const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
// const { createFolder } = require('./src/middlewares/folder');
// const { requestId } = require('./src/middlewares/requestId');
const { httpLogger } = require('./src/middlewares/logger');
// const { reqResLogger } = require('./config/logger');
const Response = require('./src/helpers/response');
const routes = require('./src/routes/index');

const requestIp = require('request-ip');


const { NODE_ENV, BODY_PARSER_LIMIT, URL_ENCODING_LIMIT } = process.env;

if (NODE_ENV !== 'test') {
  //Initialize DB Connection
  require('./config/db');
}

// Initializing express app
const app = express();


//add requestId to all requests
// app.use(requestId);

// Body-parser
app.use(
  express.json({
    limit: BODY_PARSER_LIMIT,
  }),
);
app.use(
  express.urlencoded({
    limit: URL_ENCODING_LIMIT,
    extended: true,
  }),
);

// Enable cors
app.use(cors());

// Reverse proxy
app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc

const limiter = rateLimit({
  windowMs: 1000,
  max: 10,
});

// Rate Limiter
app.use(limiter);

//Log request and response
// app.use(reqResLogger);

// For Logging
app.use(httpLogger);

// File upload
app.use(fileUpload());

app.use(requestIp.mw());


// Router Initialization
app.get('/api', (req, res) => {
  const obj = {
    res,
    status: 200,
    msg: "request to api route.",
  };
  return Response.success(obj);
});

// using routes with appending v1
app.use('/v1', routes);

// Route Not Found - 404
app.use((req, res) => {
  const { logger } = req;
  logger.error(`Requested API route is not available.`);
  const obj = {
    res,
    status: 404,
    msg: "route not found",
  };
  return Response.error(obj);
});

module.exports = app;

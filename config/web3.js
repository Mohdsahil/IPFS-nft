const Web3 = require('web3');
const { INFURA_URL, POLYGON_URL } = process.env;

const ethereumConnectionInstance = new Web3(
  new Web3.providers.WebsocketProvider(INFURA_URL, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 10,
      onTimeout: false,
    },
  }),
);

const polygonConnectionInstance = new Web3(
  new Web3.providers.WebsocketProvider(POLYGON_URL, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 10,
      onTimeout: false,
    },
  }),
);

module.exports = { ethereumConnectionInstance, polygonConnectionInstance };

const dotEnv = require('dotenv');

if (process.env.NODE_ENV !== 'prod') {
  const configFile = `./.env.${process.env.NODE_ENV}`;
  dotEnv.config({ path: configFile });
} else {
  dotEnv.config();
}

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGODB_URI,
  APP_SECRET: process.env.APP_SECRET,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL,
  EXCHANGE_NAME: 'ONLINE_STORE',
  CUSTOMER_BINDING_KEY: 'CUSTOMER_SERVICE',
  QUEUE_NAME: 'CUSTOMER_QUEUE',
  CUSTOMER_SERVICE: 'customer_service',
  SHOPPING_SERVICE: 'shopping_service',
};

const { CUSTOMER_SERVICE } = require('../config');
const ShoppingService = require('../services/shopping-service');
const { SubscribeMessage, PublishMessage } = require('../utils');
const UserAuth = require('./middlewares/auth');

module.exports = (app, channel) => {
  const service = new ShoppingService();
  SubscribeMessage(channel, service);
  app.post('/order', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { txnNumber } = req.body;

    try {
      const { data } = await service.PlaceOrder({ _id, txnNumber });
      const payload = await service.GetOrderPayload(_id, data, 'CREATE_ORDER');

      PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(payload));

      return res.status(200).json(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

  app.get('/orders', UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    try {
      const { data } = await service.GetOrders(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get('/cart', UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    try {
      const { data } = await service.GetCart(_id);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });
};

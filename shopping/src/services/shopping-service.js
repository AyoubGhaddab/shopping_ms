const { ShoppingRepository } = require('../database');
const { FormateData } = require('../utils');

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
  }
  async GetCart(_id) {
    try {
      const cartItems = await this.repository.Cart(_id);
      return FormateData(cartItems);
    } catch (err) {
      throw err;
    }
  }

  async PlaceOrder(userInput) {
    const { _id, txnNumber } = userInput;

    // Verify the txn number with payment logs

    try {
      const orderResult = await this.repository.CreateNewOrder(_id, txnNumber);
      return FormateData(orderResult);
    } catch (err) {
      throw new APIError('Data Not found', err);
    }
  }

  async GetOrders(customerId) {
    try {
      const orders = await this.repository.Orders(customerId);
      return FormateData(orders);
    } catch (err) {
      throw new APIError('Data Not found', err);
    }
  }

  async ManageCart(customerId, item, qty, isRemove) {
    try {
      const cartResult = await this.repository.AddCartItem(
        customerId,
        item,
        qty,
        isRemove
      );
      return FormateData(cartResult);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Gère les événements abonnés et exécute les actions correspondantes en fonction du type d'événement.
   *
   * @async
   * @function SubscribeEvents
   * @param {Object} payload - Les données de l'événement.
   * @param {string} payload.event - Le type d'événement (par exemple, 'ADD_TO_WISHLIST', 'REMOVE_FROM_CART', etc.).
   * @param {Object} payload.data - Les données associées à l'événement.
   * @param {string} payload.data.userId - L'identifiant de l'utilisateur.
   * @param {Object} [payload.data.product] - Les informations sur le produit (facultatif, selon l'événement).
   * @param {Object} [payload.data.order] - Les informations sur la commande (facultatif, selon l'événement).
   * @param {number} [payload.data.qty] - La quantité du produit (facultatif, selon l'événement).
   * @returns {Promise<void>} - Une promesse qui se résout une fois l'événement traité.
   */
  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, product, qty } = data;

    switch (event) {
      case 'ADD_TO_CART':
        this.ManageCart(userId, product, qty, false);
        break;
      case 'REMOVE_FROM_CART':
        this.ManageCart(userId, product, qty, true);
        break;
      default:
        break;
    }
  }
  async GetOrderPayload(userId, order, event) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };
      return FormateData(payload);
    } else {
      return FormateData({
        error: 'Order not found',
      });
    }
  }
}

module.exports = ShoppingService;

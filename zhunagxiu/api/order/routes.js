const proxyWeb = require('express-http-proxy');
const Backbone = require('backbone');

module.exports = (api) => {

  api.route('/api-order/p-trade-oc-web/orderApi/cApp/jz/order/detail/999')
    .get((req, res) => {
      const fixture = require('./deco-order');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
};

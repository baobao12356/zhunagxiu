const proxyWeb = require('express-http-proxy');
const Backbone = require('backbone');

module.exports = (api) => {

  api.route('/api-jiazhuang/c/hxapp/article')
    .get((req, res) => {
      const fixture = require('./data');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
};



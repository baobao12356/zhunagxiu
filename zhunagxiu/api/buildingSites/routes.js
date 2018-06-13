const proxyWeb = require('express-http-proxy');
const Backbone = require('backbone');

module.exports = (api) => {
  api.route('/api-jiazhuang/c/hxapp/buildSites')
    .get((req, res) => {
      const fixture = require('./data');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });

  api.route('/api-jiazhuang/c/hxapp/construct/decorationCompany')
    .get((req, res) => {
      const fixture = require('./volumeRoom-data');
      const model = new Backbone.Model(fixture());
      setTimeout(() => {
        res.status(200).json(model);
      }, 1000)
    });
  api.route('/api-jiazhuang/c/hxapp/construct/summary/:constructId/:nodeId')
    .get((req, res) => {
      const fixture = require('./completedData');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
  api.route('/api-jiazhuang/c/hxapp/buildSites/completedTwo')
    .get((req, res) => {
      const fixture = require('./completedDataTwo');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
  api.route('/api-jiazhuang/c/hxapp/construct/itemFirst/:id')
    .get((req, res) => {
      const fixture = require('./itemFirstData1');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
  api.route('/api-jiazhuang/c/hxapp/construct/itemFirst/2')
    .get((req, res) => {
      const fixture = require('./itemFirstData2');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
  api.route('/api-jiazhuang/c/hxapp/construct/payment/:constructId/:id')
    .get((req, res) => {
      const fixture = require('./constructPayment');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });
  api.route('/api-jiazhuang/c/hxapp/construct/status')
    .get((req, res) => {
      const fixture = require('./construct_status_data');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });

  api.route('/api-jiazhuang/c/hxapp/construct/info/:id')
    .get((req, res) => {
      const fixture = require('./construct_info_data');
      const model = new Backbone.Model(fixture());
      res.status(200).json(model);
    });

  api.route('/api-jiazhuang/c/hxapp/construct/itemSecond/:id')
    .get((req, res) => {
      const fixture = require('./constructitemSecond');
      const model = new Backbone.Model(fixture());
      setTimeout(() => {
        res.status(200).json(model);
      }, 1000)
    });

  api.route('/api-jiazhuang/c/hxapp/construct/itemThird/:id')
    .get((req, res) => {
      const fixture = require('./constructitemThird');
      const model = new Backbone.Model(fixture());
      setTimeout(() => {
        res.status(200).json(model);
      }, 1500)
    });


};

const _ = require('lodash');
const env = require('wnd-env');
const { MongoDb } = require('wnd-mongodb');

const dbs = {
  mongo: 'MONGO',
  auth: 'AUTH',
  billing: 'BILLING',
  contentplayer: 'CONTENTPLAYER',
  dataExtract: 'DATA_EXTRACT',
  dvp: 'DVP',
  ecommerce: 'ECOMMERCE',
  hiring: 'HIRING',
  hiringconnector: 'HIRING_CONNECTOR',
  integrationAcquireTm: 'INTEGRATION_ACQUIRETM',
  integrationApplicantPro: 'INTEGRATION_APPLICANTPRO',
  integrationBizMerlin: 'INTEGRATION_BIZMERLIN',
  integrationHiringThing: 'INTEGRATION_HIRINGTHING',
  integrationIcims: 'INTEGRATION_ICIMS',
  integrationJobma: 'INTEGRATION_JOBMA',
  integrationNewton: 'INTEGRATION_NEWTON',
  integrationGreenhouse: 'INTEGRATION_GREENHOUSE',
  integrationIcims_v2: 'INTEGRATION_ICIMS_V2',
  itemBank: 'ITEM_BANK',
  jobdirectory: 'JOB_DIRECTORY',
  notification: 'NOTIFICATION',
  unifiedAccount: 'UNIFIED_ACCOUNT',
  wonderliconlineconnector: 'WONDERLIC_ONLINE_CONNECTOR',
  wonscore: 'WONSCORE',
  wonscoreIntegration: 'WONSCORE_INTEGRATION',
  workflowengine: 'WORKFLOW_ENGINE',
  wonlink: 'WONLINK',
};

const database = function (token) {
  const _conns = {};

  return {
    getConnection: function (type) {
      type = type || 'Normal';
      let conn = _conns[type];
      if (!conn) {
        const mongoUrl = _getMongoUrl(type);
        conn = new MongoDb(mongoUrl, { unsetTimestamp: true }); // 'true' by default to trigger redshift update on backfills/devops tickets
        _conns[type] = conn;
      }
      return conn;
    },
    closeConnections: function () {
      _.forOwn(_conns, function (conn) {
        conn.close();
      });
    },
  };

  function _getMongoUrl(type) {
    switch (type) {
      case 'ReadOnly':
        return env.get(token + '_MONGO_RO_URL');
      case 'Root':
        return env.get(token + '_MONGO_ROOT_URL');
      default:
        return env.get(token + '_MONGO_URL');
    }
  }
};

const databases = {};

_.forOwn(dbs, function (token, key) {
  databases[key] = database(token);
});

databases.close = function () {
  _.forOwn(dbs, function (token, key) {
    databases[key].closeConnections();
  });
};

module.exports = databases;

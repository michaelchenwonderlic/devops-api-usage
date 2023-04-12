const env = require('wnd-env');
const SwaggerV3ApiClient = require('../helpers/swaggerV3ApiClient');
const apiClient = new SwaggerV3ApiClient(env.get('API_DVP_URL'), 'dvp.system');

module.exports.addNewAccount = async (newAccount) => {
  return apiClient.request({
    operationId: 'addNewAccount',
    requestBody: newAccount,
  });
};

module.exports.addUser = async (accountId, newUser) => {
  return apiClient.request({
    operationId: 'addUser',
    parameters: {accountId},
    requestBody: newUser,
  });
};

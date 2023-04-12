const env = require('wnd-env');
const SwaggerV3ApiClient = require('../helpers/swaggerV3ApiClient');
const apiClient = new SwaggerV3ApiClient(env.get('API_BILLING_URL'), 'billing.system');

module.exports.scheduleSubscriptionUpdate = async (accountId, subscriptionId, planOptionId) => {
  return apiClient.request({
    operationId: 'scheduleSubscriptionUpdate',
    parameters: {accountId, subscriptionId},
    requestBody: {planOptionId},
  });
};

module.exports.getAccountById = async (accountId) => {
  return apiClient.request({
    operationId: 'getAccountById',
    parameters: {accountId},
  });
};

module.exports.listPlans = async () => {
  return apiClient.request({
    operationId: 'listPlans',
  });
};

module.exports.updateAccountRestrictions = async (accountId, restrictions) => {
  return apiClient.request({
    operationId: 'updateAccountRestrictions',
    parameters: {accountId},
    requestBody: restrictions,
  });
};

module.exports.updateAccountCart = async (accountId, cartItems) => {
  return apiClient.request({
    operationId: 'updateAccountCart',
    parameters: {accountId},
    requestBody: cartItems,
  });
};

module.exports.createSubscription = async (accountId, newSubscription) => {
  return apiClient.request({
    operationId: 'createSubscription',
    parameters: {accountId},
    requestBody: newSubscription,
  });
};

const env = require('wnd-env');
const SwaggerV3ApiClient = require('../helpers/swaggerV3ApiClient');
const apiClient = new SwaggerV3ApiClient(
  env.get('API_UNIFIED_ACCOUNT_URL'),
  'unified-account.system'
);

module.exports.getUnifiedAccountById = async (unifiedAccountId) => {
  return apiClient.request({
    operationId: 'getUnifiedAccountById',
    parameters: {unifiedAccountId},
  });
};

module.exports.addProductAccount = async (unifiedAccountId, newProductAccount) => {
  return apiClient.request({
    operationId: 'addProductAccount',
    parameters: {unifiedAccountId},
    requestBody: newProductAccount,
  });
};

module.exports.addUserToProductAccount = async (
  authUserId,
  unifiedAccountId,
  newProductAccount
) => {
  return apiClient.request({
    operationId: 'addUserToProductAccount',
    parameters: {authUserId, unifiedAccountId},
    requestBody: newProductAccount,
  });
};

module.exports.updateProductUserPending = async (
  authUserId,
  unifiedAccountId,
  productAccountId,
  userPending
) => {
  return apiClient.request({
    operationId: 'updateProductUserPending',
    parameters: {authUserId, unifiedAccountId, productAccountId},
    requestBody: userPending,
  });
};

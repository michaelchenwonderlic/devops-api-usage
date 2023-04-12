const env = require('wnd-env');
const SwaggerV1Client = require('../helpers/swaggerV1ApiClient');

const apiUrl = env.get('API_WONSCORE_URL') + '/api-docs';
const apiClient = new SwaggerV1Client(apiUrl, 'wonscore.system');

function WonscoreApiClient() {}

WonscoreApiClient.prototype.setAccountToV2Billing = function(accountId) {
  return apiClient.request('accounts', 'setAccountToV2Billing', {accountId});
};

WonscoreApiClient.prototype.getAccountById = function(accountId) {
  return apiClient.request('accounts', 'getAccountById', {accountId});
};

WonscoreApiClient.prototype.addAccountUser = function(accountId, user) {
  return apiClient.request('accounts', 'addAccountUser', {accountId, user});
};

WonscoreApiClient.prototype.updateSelectionStatus = function(candidateId, body) {
  return apiClient.request('candidates', 'updateSelectionStatus', {candidateId, body});
};

module.exports = new WonscoreApiClient();

const env = require('wnd-env');
const SwaggerV1Client = require('../helpers/swaggerV1ApiClient');

const apiUrl = env.get('API_ECOMMERCE_URL') + '/api-docs';
const apiClient = new SwaggerV1Client(apiUrl, 'ecommerce.system');

function EcommerceApiClient() {}

EcommerceApiClient.prototype.signup = function(body) {
  return apiClient.request('signup', 'signup', body);
};

EcommerceApiClient.prototype.verify = function(masterAccountId, body) {
  return apiClient.request('masterAccounts', 'updateAccountApproval', {masterAccountId, body});
};

module.exports = new EcommerceApiClient();

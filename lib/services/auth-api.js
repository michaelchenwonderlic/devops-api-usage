const env = require('wnd-env');
const SwaggerV1Client = require('../helpers/swaggerV1ApiClient');

const apiUrl = env.get('API_AUTH_URL') + '/api-docs';
const apiClient = new SwaggerV1Client(apiUrl, 'auth.system');

function AuthApiClient() {}

AuthApiClient.prototype.getUserByEmail = function(emailAddress) {
  return apiClient.request('users', 'getUserByEmail', {emailAddress}).catch(function(err) {
    if (err.code === 404) {
      return null;
    }
    throw err;
  });
};

AuthApiClient.prototype.createUser = function(newUser) {
  return apiClient.request('users', 'createUser', {body: newUser});
};

AuthApiClient.prototype.verifyUser = function(userId, verifyHash) {
  return apiClient.request('users', 'verifyUser', {userId, verifyHash});
};

module.exports = new AuthApiClient();

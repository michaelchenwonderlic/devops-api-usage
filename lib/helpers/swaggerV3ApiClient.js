const security = require('wnd-security');
const Swagger = require('swagger-client');

class SwaggerV3ApiClient {
  constructor(url, defaultScope) {
    this.url = url;
    this.defaultScope = defaultScope;
  }

  async request(options) {
    const {operationId, parameters, requestBody, scope} = options;
    await this.cacheClient();

    return security.oAuthClient.makeSecureRequest(
      scope || this.defaultScope,
      async (accessToken) => {
        const response = await this.client.execute({
          operationId,
          parameters,
          requestBody,
          securities: {authorized: {OAuth2: {token: {access_token: accessToken}}}},
          server: this.url,
        });
        return response.body;
      }
    );
  }

  async cacheClient() {
    if (!this.client) {
      // The 'Swagger' function makes a request for the swagger spec.
      // The serverVariables are used to replace the variables in the swagger spec under the 'servers' section.
      this.client = await Swagger({url: `${this.url}/api-docs`});
    }
  }
}

module.exports = SwaggerV3ApiClient;

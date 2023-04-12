const SwaggerClient = require('wnd-swagger-client');
const security = require('wnd-security');

class SwaggerV1Client {
  constructor(url, defaultScope) {
    this.swaggerClient = new SwaggerClient(url);
    this.defaultScope = defaultScope;
  }

  request(entity, method, params, scope) {
    return security.oAuthClient.makeSecureRequest(
      scope || this.defaultScope,
      async (accessToken) => {
        const client = await this.swaggerClient.getClient();
        return client[entity][method](params, {accessToken});
      }
    );
  }
}

module.exports = SwaggerV1Client;

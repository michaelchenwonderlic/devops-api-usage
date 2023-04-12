# devops-api-usage

To run the script:

- Make sure ../env/tokens.json is pointing to the environment you need to run
- Run `pnpm start`

The script follows:

- Obtaining apiUsage data from database
- Update xlsx file
- Publish this weeks usage data to confluence
- Building usage line chart based on historical data and publish to confluence

Critical files:

- xls/integrationapis.xlsx -- all historical data are stored here.
- lib/confluence/credentials.js -- credentials for confluence publish
  - username: login username
  - token: login token
  - baseUrl: confluence base Url
  - getContentPath: path to get confluence content
  - spaceKey: the space to publish into
  - parentPageId: publish weekly usage under this page

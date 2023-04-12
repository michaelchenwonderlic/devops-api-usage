const credential = require('./credential');
const axios = require('axios');

const apiHeaders = {
  headers: {
    Authorization: `Basic ${new Buffer.from(
      `${credential.username}:${credential.token}`,
      'utf8'
    ).toString('base64')}`,
    'Content-Type': 'application/json',
    'user-agent': 'Mozilla/5.0',
  },
};

function Confluence() {}

Confluence.prototype.findPage = async function (title) {
  const getPageUrl = `${credential.baseUrl}/${credential.getContentPath}?spaceKey=${credential.spaceKey}&title=${title}&expand=body.storage,version`;
  try {
    const response = await axios.get(getPageUrl, apiHeaders);
    return response.data.results[0];
  } catch (e) {
    return undefined;
  }
};

Confluence.prototype.publishContent = async function (content) {
  const originalPageContent = await this.findPage(content.pageTitle);
  if (originalPageContent) {
    const updateBody = {
      type: 'page',
      title: originalPageContent.title,
      version: {
        number: originalPageContent.version.number + 1,
      },
      body: {
        storage: {
          value: content.pageContent,
          representation: originalPageContent.body.storage.representation,
        },
      },
    };
    const updateContentUrl = `${credential.baseUrl}/${credential.getContentPath}/${originalPageContent.id}?expand=body.storage`;
    try {
      await axios.put(updateContentUrl, updateBody, apiHeaders);
    } catch (e) {
      console.log(
        `ERROR updating page ${originalPageContent.id} ${e.response.data.message}`
      );
    }
  } else {
    const newPageContent = {
      type: 'page',
      title: content.pageTitle,
      ancestors: [
        {
          id: credential.parentPageId,
        },
      ],
      space: {
        key: credential.spaceKey,
      },
      body: {
        storage: {
          value: content.pageContent,
          representation: 'storage',
        },
      },
    };
    const updateContentUrl = `${credential.baseUrl}/${credential.getContentPath}`;
    try {
      await axios.post(updateContentUrl, newPageContent, apiHeaders);
    } catch (e) {
      console.log(`ERROR updating: ${e.response.data.message}`);
    }
  }
};

module.exports = new Confluence();

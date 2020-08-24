
const { v4: uuidv4 } = require('uuid');

const { client } = require('../../helpers/dynamodb');
const providers = require('../../helpers/social');
const wrapper = require('../wrapper');
const { generateCallbackUrl } = require('../../helpers/auth');

const signinHandler = async (event) => {
  const provider = event.pathParameters['provider'].toLowerCase();
  const providerInstance = providers[provider];

  if (!providerInstance) {
    throw new Error('Unknown provider');
  }

  const state = uuidv4();
  const redirectUrl = generateCallbackUrl(provider);
  const loginUri = providerInstance.generateAuthUrl(redirectUrl, state);

  // Cache state token
  await client.put({
    TableName: process.env.AUTH_CACHE_TABLE,
    Item: {
      token: state,
      provider,
      ttl: Date.now() + (60 * 60 * 1000) // 1 hour in seconds
    }
  });

  return {
    statusCode: 301,
    headers: {
      'Cache-Control': 'max-age=0, no-cache, no-store, must-revalidate',
      Location: loginUri
    }
  };

};

module.exports.handler = wrapper({
  handler: signinHandler,
});

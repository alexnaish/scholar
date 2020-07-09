
const { v4: uuidv4 } = require('uuid');

const { onAws } = require('../../helpers/aws');
const { client } = require('../../helpers/dynamodb');
const providers = require('../../helpers/social');
const wrapper = require('../wrapper');

const signinHandler = async (event) => {
  const provider = event.pathParameters['provider'].toLowerCase();
  const providerInstance = providers[provider];

  if (!providerInstance) {
    throw new Error('Unknown provider');
  }

  const state = uuidv4();
  const redirect_uri = onAws ? 'https://naish.io/something/something' : `http://localhost:3000/auth/${provider}/callback`;
  const loginUri = providerInstance.generateAuthUrl(redirect_uri, state);

  // Cache state token
  await client.put({
    TableName: process.env.AUTH_CACHE_TABLE,
    Item: {
      token: state,
      provider,
      ttl: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour in seconds
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

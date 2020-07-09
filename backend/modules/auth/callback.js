const { client } = require('../../helpers/dynamodb');
const { register, generateAccessToken } = require('../../helpers/user');
const wrapper = require('../wrapper');
const { onAws } = require('../../helpers/aws');
const providers = require('../../helpers/social');

const callbackHandler = async (event, context, { logger }) => {

  const provider = event.pathParameters['provider'].toLowerCase();
  const providerInstance = providers[provider];

  if (!providerInstance) {
    logger.error('Invalid provider specified');
    throw new Error('Invalid provider specified.');
  }

  const { state, code, error } = event.queryStringParameters || {};

  if (!state || !code) {
    logger.error('Missing required parameters');
    throw new Error('Missing required parameters.');
  }

  if (error) {
    logger.error(error);
    throw new Error('Callback had error param.');
  }

  const authCache = await client.get({ TableName: process.env.AUTH_CACHE_TABLE, Key: { token: state } });
  if (!authCache) {
    logger.error('Invalid state token');
    throw new Error('Invalid state token.');
  }
  const redirect_uri = onAws ? 'https://naish.io/something/something' : `http://localhost:3000/auth/${provider}/callback`;
  const { email, name } = await providerInstance.authorise(code, redirect_uri);

  await client.delete({ TableName: process.env.AUTH_CACHE_TABLE, Key: { token: state } });
  let user = await client.get({ TableName: process.env.USERS_TABLE, Key: { email } });

  if (!user) {
    logger.info('registering new user %o', { provider, email });
    user = await register({ email, name, socialProvider: provider });
  }

  const accessToken = await generateAccessToken({ email, name, refresh_token: user.refresh_token });

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      accessToken
    }),
  };
};

module.exports.handler = wrapper({
  handler: callbackHandler,
});

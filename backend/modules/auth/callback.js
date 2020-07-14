const { onAws } = require('../../helpers/aws');
const { client } = require('../../helpers/dynamodb');
const providers = require('../../helpers/social');
const { register, generateAccessToken } = require('../../helpers/user');

const wrapper = require('../wrapper');

const template = require('./template');

const callbackHandler = async (event, context, { logger }) => {

  const provider = event.pathParameters['provider'].toLowerCase();
  const providerInstance = providers[provider];
  try {

    if (!providerInstance) {
      throw new Error('Invalid provider specified.');
    }

    const { state, code, error } = event.queryStringParameters || {};

    if (!state || !code) {
      throw new Error('Missing required parameters.');
    }

    if (error) {
      throw new Error('Callback had error param.');
    }

    const authCache = await client.get({ TableName: process.env.AUTH_CACHE_TABLE, Key: { token: state } });
    if (!authCache) {
      logger.error('Invalid state token');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html'
        },
        body: template.fulfilled,
      };
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
      headers: {
        'Content-Type': 'text/html'
      },
      body: template.success({ accessToken, name }),
    };
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html'
      },
      body: template.error,
    };
  }
};

module.exports.handler = wrapper({
  handler: callbackHandler,
});

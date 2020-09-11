const pino = require('pino');
const { getAuthToken } = require('../../helpers/auth');
const { validateAccessToken } = require('../../helpers/user');

const newTokenHeader = 'x-access-token';

module.exports = ({ handler, requiresAccessToken, requireBodyParams }) => async (event, context) => {
  const logger = pino({
    traceId: process.env._X_AMZN_TRACE_ID,
    awsRequestId: context.awsRequestId,
    redact: {
      paths: ['email', 'refresh_token', 'user.email', 'user.refresh_token', 'api_key', 'team.api_key', 'team.users'],
      remove: true
    }
  });

  const additionalHeaders = {};

  // Lowercase all headers
  const headers = Object.keys(event.headers);
  for (const key of headers) {
    event.headers[key.toLowerCase()] = event.headers[key];
  }

  try {
    if (requiresAccessToken) {
      const token = getAuthToken(event.headers);
      const { user, newToken, error } = await validateAccessToken(token);

      // Something went wrong with validating token
      if (error) {
        logger.error(error);
        return {
          statusCode: 401,
          body: JSON.stringify({
            error: 'Unauthorized'
          })
        };
      }
      // Token has been refreshed
      if (newToken) {
        additionalHeaders[newTokenHeader] = newToken;
        additionalHeaders['access-control-expose-headers'] = newTokenHeader;
      }
      // Augment context with decoded token
      context.user = user;
    }

    if (requireBodyParams) {
      const body = JSON.parse(event.body);
      const missingProperties = requireBodyParams.filter(param => body[param] === undefined);
      if (missingProperties.length) {
        logger.error(`missing properties, expected ${requireBodyParams}, missing ${missingProperties}`);
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Missing required properties'
          })
        };
      }
      event.payload = body;
    }

    const result = await handler(event, context, { logger });

    // If its a HTTP response, attach additional headers
    if (result.statusCode) {
      result.headers = Object.assign({}, result.headers, additionalHeaders);
    }

    return result;
  } catch (error) {
    logger.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error'
      })
    };
  }

};

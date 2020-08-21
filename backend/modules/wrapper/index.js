const pino = require('pino');
const { validateAccessToken } = require('../../helpers/user');

module.exports = ({ handler, requiresAccessToken, requireBodyParams }) => async (event, context) => {
  const logger = pino({
    traceId: process.env._X_AMZN_TRACE_ID,
    awsRequestId: context.awsRequestId,
  });

  const additionalHeaders = {};

  try {
    if (requiresAccessToken) {
      console.log('event.headers', event.headers);

      const token = (event.headers['authorization'] || '').split(' ')[1];
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
        const newTokenHeader = 'x-access-token';
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

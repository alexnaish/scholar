const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const { client } = require('./dynamodb');

const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

async function generateAccessToken({ email, name, refresh_token }) {
  return await sign({ email, name, refresh_token }, process.env.JWT_SIGNING_SECRET, { expiresIn: '20m' });
}

async function revokeRefreshToken(email) {
  const newRefreshToken = uuidv4();
  await client.update({
    TableName: process.env.USERS_TABLE,
    Key: { email },
    UpdateExpression: 'SET refresh_token = :refresh_token',
    ExpressionAttributeValues: {
      ':refresh_token': newRefreshToken,
    }
  });
  return newRefreshToken;
}

async function refreshAccessToken(token) {
  const { email, refresh_token } = jwt.decode(token);
  const user = await client.get({
    TableName: process.env.USERS_TABLE,
    Key: { email }
  });

  if (!user || user.refresh_token !== refresh_token) {
    // Either:
    // the user account is gone
    // the token is old and has an old refresh_token
    // the refresh_token has been manually updated to revoke all sessions
    throw new Error('Unable to refresh access token');
  }

  // Expire old token by updating user's refresh_token
  const newRefreshToken = await revokeRefreshToken(email);

  // Generate a token with the new refresh_token
  return generateAccessToken({ email, name: user.name, refresh_token: newRefreshToken });
}

async function validateAccessToken(token) {
  const result = {};
  try {
    const verifiedToken = await verify(token, process.env.JWT_SIGNING_SECRET);
    return result.user = verifiedToken;
  } catch (error) {
    result.error = error;
  }

  if (result.error && result.error.name === 'TokenExpiredError') {
    try {
      result.newToken = await refreshAccessToken(token);
      result.user = jwt.decode(result.newToken);
      delete result.error;
    } catch (error) {
      result.error = error;
    }
  }

  return result;
}

module.exports = {
  register: async ({ email, password = null, name, social_provider = null }) => {
    const today = new Date();
    const Item = {
      email,
      password,
      name,
      social_provider,
      refresh_token: uuidv4(),
      created: today,
      last_login: today
    };
    await client.put({
      TableName: process.env.USERS_TABLE,
      Item
    });
    return Item;

  },
  revokeRefreshToken,
  generateAccessToken,
  validateAccessToken,
  refreshAccessToken
};

const { client } = require('../../helpers/dynamodb');
const apiGateway = require('../../helpers/apigateway');
const wrapper = require('../wrapper');
const dynamodb = require('../../helpers/dynamodb');

const handler = async (event, context, { logger }) => {
  const { team_id, email } = context.user;

  const team = await client.get({
    TableName: process.env.TEAMS_TABLE,
    Key: { id: team_id }
  });

  if (!team || team.api_key) {
    const message = !team ? 'team not found' : 'team already has api key assigned';
    logger.error({ user: context.user, team }, message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error'
      })
    };
  }

  const createdKey = await apiGateway.createApiKey({
    name: `${team_id} key`,
    description: `Created by ${email} on ${new Date().toLocaleString()}`,
    enabled: true,
    tags: {
      service: 'scholar'
    }
  });
  // create key
  logger.info({ createdKey, team, user: context.user }, 'key created');
  // assign to usagePlan
  // save key

  const updatedTeam = await dynamodb.update({
    TableName: process.env.TEAMS_TABLE,
    Key: { id: team_id },
    UpdateExpression: 'SET api_key = :api_key, api_key_id = :api_key_id',
    ExpressionAttributeValues: {
      ':api_key': createdKey.value,
      ':api_key_id': createdKey.id,
    }
  });

  // Just return relevant properties
  return {
    statusCode: 201,
    body: JSON.stringify({
      data: updatedTeam
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

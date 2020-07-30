const wrapper = require('../wrapper');
const { client } = require('../../helpers/dynamodb');
const { getRawId } = require('../../helpers/snapshot');

const snapshotListHandler = async (event, context, { logger }) => {
  logger.error('starting!');

  const { cursor } = event.queryStringParameters || {};
  const { team_id } = context.user;

  const { Count, Items, LastEvaluatedKey } = await client.query({
    TableName: process.env.SNAPSHOTS_TABLE,
    KeyConditionExpression: 'team_id = :team and begins_with(id, :selector)',
    ProjectionExpression: 'id',
    ExclusiveStartKey: cursor ? {
      team_id,
      id: `main#${cursor}`
    } : undefined,
    Limit: 20,
    ExpressionAttributeValues: {
      ':team': team_id,
      ':selector': 'main'
    }
  });

  let lastKey = LastEvaluatedKey && getRawId(LastEvaluatedKey.id);

  return {
    statusCode: 200,
    body: JSON.stringify({
      count: Count,
      data: Items.map(item => ({ id: getRawId(item.id) })),
      cursor: lastKey
    }),
  };
};

module.exports.handler = wrapper({
  handler: snapshotListHandler,
  requiresAccessToken: true
});

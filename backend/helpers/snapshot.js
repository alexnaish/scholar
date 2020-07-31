const { client } = require('./dynamodb');

const getRawId = key => key.split('#')[1];

module.exports = {
  getRawId,
  getCount: ({ team_id, selector }) => {
    return client.query({
      TableName: process.env.SNAPSHOTS_TABLE,
      KeyConditionExpression: 'team_id = :team and begins_with(id, :selector)',
      Select: 'COUNT',
      ExpressionAttributeValues: {
        ':team': team_id,
        ':selector': selector
      }
    }).then(res => res.Count);
  },
  getImage: ({ team_id, id, projection }) => {
    return client.get({
      TableName: process.env.SNAPSHOTS_TABLE,
      Key: { team_id, id },
      ProjectionExpression: projection
    });
  },
  fetchImages: async ({ team_id, selector, cursor, projection, limit = 20 }) => {
    const { Count, Items, LastEvaluatedKey } = await client.query({
      TableName: process.env.SNAPSHOTS_TABLE,
      KeyConditionExpression: 'team_id = :team and begins_with(id, :selector)',
      ProjectionExpression: projection,
      ExclusiveStartKey: cursor ? {
        team_id: team_id,
        id: cursor
      } : undefined,
      Limit: limit,
      ExpressionAttributeValues: {
        ':team': team_id,
        ':selector': selector
      }
    });

    return {
      count: Count,
      lastKey: LastEvaluatedKey && getRawId(LastEvaluatedKey.id),
      results: Items
    };

  }
};

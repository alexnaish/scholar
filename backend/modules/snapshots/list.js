const wrapper = require('../wrapper');
const { getRawId, fetchImages } = require('../../helpers/snapshot');

const snapshotListHandler = async (event, context) => {
  const { cursor } = event.queryStringParameters || {};
  const { team_id } = context.user;

  const { count, results, lastKey } = await fetchImages({
    team_id,
    selector: 'main',
    cursor: cursor && `main#${cursor}`,
    projection: 'id, image_url',
    limit: 4
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      count,
      data: results.map(item => ({ id: getRawId(item.id), image_url: item.image_url })),
      cursor: lastKey
    }),
  };
};

module.exports.handler = wrapper({
  handler: snapshotListHandler,
  requiresAccessToken: true
});

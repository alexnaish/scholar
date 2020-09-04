const wrapper = require('../wrapper');
const { getImage, fetchImages } = require('../../helpers/snapshot');

const handler = async (event, context) => {
  const id = event.pathParameters['id'].toLowerCase();
  const { team_id } = context.user;

  const main = await getImage({
    team_id,
    id: `main#${id}`,
    projection: 'dimensions, image_url'
  });
  const { count, results, lastKey } = await fetchImages({
    team_id,
    selector: `candidate#${id}`
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      count,
      main,
      data: results,
      cursor: lastKey
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

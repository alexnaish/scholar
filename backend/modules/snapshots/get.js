const wrapper = require('../wrapper');
const { getImage, fetchImages } = require('../../helpers/snapshot');

const handler = async (event, context) => {
  const id = event.pathParameters['id'].toLowerCase();
  const { team_id } = context.user;

  const main = await getImage({
    team_id,
    id: `main#${id}`,
    projection: 'image_url, version, approval_date'
  });

  const { results } = await fetchImages({
    team_id,
    selector: `version#${id}`,
    projection: 'id, image_url'
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      main,
      history: results
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

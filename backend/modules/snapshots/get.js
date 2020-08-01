const wrapper = require('../wrapper');
const { getImage, fetchImages } = require('../../helpers/snapshot');

const handler = async (event, context) => {
  const id = event.pathParameters['id'].toLowerCase();
  const { team_id } = context.user;

  const [main, { results: history }, { results: candidates }] = await Promise.all([
    getImage({ team_id, id: `main#${id}`,
      projection: 'image_url, version, approval_date'
    }),
    fetchImages({ team_id, selector: `version#${id}`,
      projection: 'id, image_url, approval_date, version'
    }),
    fetchImages({ team_id, selector: `candidate#${id}`,
      projection: 'id, image_url, diff_image_url, creation_date'
    })
  ]) ;

  return {
    statusCode: 200,
    body: JSON.stringify({
      main,
      history: history.sort((a,b) => b.version - a.version),
      candidates
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

const wrapper = require('../wrapper');
const { getCount, fetchImages, getUniqueIds } = require('../../helpers/snapshot');

const handler = async (event, context) => {
  const { team_id } = context.user;

  const [approved, candidates] = await Promise.all([
    getCount({ team_id, selector: 'main' }),
    fetchImages({ team_id, selector: 'candidate', projection: 'id' })
  ]);

  const outstanding = getUniqueIds(candidates.results);

  return {
    statusCode: 200,
    body: JSON.stringify({
      approved,
      candidates: candidates.count,
      outstanding
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

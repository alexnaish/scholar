const wrapper = require('../wrapper');
const { getCount } = require('../../helpers/snapshot');

const handler = async (event, context) => {
  const { team_id } = context.user;

  const [approved, candidates] = await Promise.all([
    getCount({ team_id, selector: 'main' }),
    getCount({ team_id, selector: 'candidate' })
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify({
      approved, candidates
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

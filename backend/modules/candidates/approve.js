const wrapper = require('../wrapper');

const handler = async (event, context) => {
  const id = event.pathParameters['id'].toLowerCase();
  const { team_id } = context.user;
  const { candidate_id } = event.payload;

  // Lookup Candidate
  // Create a new version record with previous version number
  // Use Candidate details to create new Main
  // Nuke all outstanding Candidates

  return {
    statusCode: 200,
    body: JSON.stringify({
      id,
      team_id,
      candidate_id
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true,
  requireBodyParams: ['candidate_id']
});

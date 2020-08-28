const { client } = require('../../helpers/dynamodb');
const wrapper = require('../wrapper');

const handler = async (event, context) => {
  const { email, team_id } = context.user;

  const [user, team] = await Promise.all([
    client.get({
      TableName: process.env.USERS_TABLE,
      Key: { email }
    }),
    client.get({
      TableName: process.env.TEAMS_TABLE,
      Key: { id: team_id }
    })
  ]);

  team.plan = team.plan || 'Free';

  // Just return relevant properties
  return {
    statusCode: 200,
    body: JSON.stringify({
      user: {
        name: user.name,
        email: user.email,
        created: user.created
      },
      team: {
        name: team.name,
        plan: team.plan,
        users: team.users
      }
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requiresAccessToken: true
});

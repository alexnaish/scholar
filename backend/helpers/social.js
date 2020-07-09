const { URLSearchParams } = require('url');
const { decode } = require('jsonwebtoken');
const fetch = require('node-fetch');

const config = {
  google: {
    client_id: '1011728256302-kbvpisa32oadh7udiniea5gks5cmqsqj.apps.googleusercontent.com',
    client_secret: process.env.GOOGLE_SECRET,
    authorisation_uri: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    response_type: 'code',
    scope: 'openid email profile'
  },
  github: {
    client_id: 'c86eca8cd3719af6e6f7',
    client_secret: process.env.GITHUB_SECRET,
    authorisation_uri: 'https://github.com/login/oauth/authorize',
    token_uri: 'https://github.com/login/oauth/access_token',
    response_type: 'code',
    scope: 'read:user user:email'
  }
};

class Provider {

  constructor(config, fetchDataFunction) {
    this.config = config;
    this.fetchDataFunction = fetchDataFunction;
  }

  generateAuthUrl(redirect_uri, state) {
    const { authorisation_uri, client_id, response_type, scope } = this.config;
    return `${authorisation_uri}?${new URLSearchParams({ state, client_id, response_type, scope, redirect_uri }).toString()}`;
  }

  async authorise(code, redirect_uri) {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', this.config.client_id);
    params.append('client_secret', this.config.client_secret);
    params.append('redirect_uri', redirect_uri);
    params.append('grant_type', 'authorization_code');

    const result = await fetch(this.config.token_uri, {
      method: 'POST', headers: {
        Accept: 'application/json'
      }, body: params
    }).then(res => res.json());

    return this.fetchDataFunction(result);
  }
}

module.exports = {
  google: new Provider(config.google, (authResponse) => {
    const result = decode(authResponse.id_token);
    return {
      email: result.email,
      name: result.given_name
    };
  }),
  github: new Provider(config.github, async ({ access_token }) => {
    const result = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `token ${access_token}`
      }
    }).then(res => res.json());

    return {
      email: result.email,
      name: result.name
    };
  }),
};

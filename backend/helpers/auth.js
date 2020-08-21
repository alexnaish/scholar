const { onAws } = require('./aws');

module.exports = {
  generateCallbackUrl: (provider) => {
    const redirectUrl = onAws ? process.env.API_URL : 'http://localhost:3000';
    return `${redirectUrl}/auth/${provider}/callback`;
  }
};

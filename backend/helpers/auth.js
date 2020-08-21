const { onAws } = require('./aws');

module.exports = {
  getAuthToken: (headers) => {
    const headerValue = headers['authorization'] || headers['Authorization'];
    return (headerValue || '').split(' ')[1];
  },
  generateCallbackUrl: (provider) => {
    const redirectUrl = onAws ? process.env.API_URL : 'http://localhost:3000';
    return `${redirectUrl}/auth/${provider}/callback`;
  }
};

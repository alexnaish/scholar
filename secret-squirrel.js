module.exports = {
  files: {
    allow: [
      '.eslintrc',
      '.huskyrc',
      'LICENSE.txt',
      'app/.babelrc',
      'app/src/robots.txt',
      'app/.browserlistrc',
      'app/.eslintrc'
    ],
    allowOverrides: []
  },
  strings: {
    deny: [],
    denyOverrides: [
      'alex@naish\\.io', // app/src/pages/Privacy/index.js:75, backend/offline/seed/teams.json:5, backend/offline/seed/users.json:3
      'kbvpisa32oadh7udiniea5gks5cmqsqj', // backend/helpers/social.js:7|7
      '5eb01fa9-cc80-4357-8d64-7c4f4d5ad511' // backend/offline/seed/snapshots.json:3|10|17|24|31|38|45|52|59|66|73, backend/offline/seed/teams.json:3, backend/offline/seed/users.json:5
    ]
  }
};

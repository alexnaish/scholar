---
title: Self Host
---

## Assumptions

It is possible to host your own version of Scholar. However, it has currently been architected with certain assumptions such as:

1. The code will be deployed to GitHub and as such, the CI / CD pipeline is built with GitHub Actions.
1. The frontend will be deployed to Netlify.
1. The backend will be deployed to AWS.
1. Images are deployed to S3.
1. The database is DynamoDB.
1. There may be additional manual configuration required in order to have all required components communicating properly (configuring the API to have a specific API Gateway domain etc and then updating the `netlify.toml` file).

## Configuration

Both the frontend and the API tiers takes their configuration from environment variables. The minimum requirements are as follows:


```
# Mandatory
TEAMS_TABLE=scholar-teams
TEAM_KEYS_TABLE=scholar-team-keys
USERS_TABLE=scholar-users
AUTH_CACHE_TABLE=scholar-auth
SNAPSHOTS_TABLE=scholar-snapshots
S3_BUCKET=scholar-snapshots
JWT_SIGNING_SECRET=my_access_token_signing_key
AUTH_GOOGLE_SECRET=my_google_app_secret
AUTH_GITHUB_SECRET=my_github_app_secret
API_URL=http://localhost:3000

# Optional extras
NEWRELIC_APP_ID=your_newrelic_app_id
NEWRELIC_LICENCE_KEY=your_newrelic_key
GOOGLE_ANALYTICS_KEY=your_google_analytics_key
```

By default, Github Actions does not automatically expose all Secrets as environment variables and as such you'll need to manually specify them under the `env` property for the required job. There are examples of this already in `.github/workflows/deploy.yml`.

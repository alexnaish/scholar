---
title: Monitoring
---

By default, Scholar is configured to include both Google Analytics and New Relic application monitoring.

## New Relic

In order to use your own New Relic configuration, make the following environment variables available in the build / deployment process:

```
NEWRELIC_APP_ID=12345678
NEWRELIC_LICENCE_KEY=NRJS-12345678abcdefg
```

## Google Analytics

To use your own Google Analytics, update the `GOOGLE_ANALYTICS_KEY` environment variable to reference your own property.

## Removal

If you do not require any of the above, you can remove the relevant script tags in `app/src/index.html`.

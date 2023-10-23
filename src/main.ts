import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as Sentry from "@sentry/capacitor";
import * as SentrySibling from "@sentry/angular-ivy";

if (environment.production) {
  enableProdMode();
}

Sentry.init({
  dsn: "https://e7bea9ebf687aa1b1dce0bdc66effb91@o4506101050507264.ingest.sentry.io/4506101066170368",
  // To set your release and dist versions
  release: "push-notifications-troikap@" + "v1.0",
  dist: "1",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  integrations: [
    new SentrySibling.BrowserTracing({
      tracePropagationTargets: [
        "localhost",
        "https://g2f0hhh3-9000.brs.devtunnels.ms/api" ,
      ],
      routingInstrumentation: SentrySibling.routingInstrumentation,
    }),
  ],
},
// Forward the init method to the sibling Framework.
SentrySibling.init
);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://72cde724fd0cad52dad649888716ac89@o4509423859138560.ingest.us.sentry.io/4509423891054592",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});

const { conf } = require("./Config");
const msal = require("@azure/msal-node");

const config = {
  auth: {
    clientId: conf.appId,
    authority: conf.authority,
    clientSecret: "urU7Q~Ol5nfGoUUXk3BqrXdVBu4HKWmFdi3iB",
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

const msalConfig = {
  auth: {
    clientId: conf.appId,
    authority: conf.authority,
    clientSecret: "PcZ7Q~bL8GrstKNTl7aSrVlw2A00Xebh7vfV2",
    redirect: "http://localhost:3000/",

    system: {
      loggerOptions: {
        loggerCallback(loglevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Verbose,
      },
    },
  },
};

module.exports = { config, msalConfig };

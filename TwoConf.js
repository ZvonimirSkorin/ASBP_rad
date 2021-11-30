const { conf } = require("./Config");
const msal = require("@azure/msal-node");

const config = {
  auth: {
    clientId: conf.appId,
    authority: conf.authority,
    clientSecret: "",
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
    clientSecret: "",
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

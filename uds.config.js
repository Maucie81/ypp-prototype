// Yahoo UDS tokens configuration.
// Override font.sans so UDS typography tokens resolve to "Yahoo Sans" (local)
// instead of "yas" (YA Sans VF, CDN).

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { defaultTokensConfig } = require("@yahoo/uds/defaultTokensConfig");

module.exports = {
  ...defaultTokensConfig,
  font: {
    ...defaultTokensConfig.font,
    sans: "yahoo-sans",
  },
};


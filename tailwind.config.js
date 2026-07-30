/* eslint-disable @typescript-eslint/no-require-imports */
const { tailwindPlugin, getUDSContent } = require("@yahoo/uds/tailwind/plugin");
const udsConfig = require("./uds.config.js");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ...getUDSContent(),
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "yahoo-sans": ["Yahoo Sans", "sans-serif"],
        "yahoo-product-sans": ["Yahoo_Product_Sans_VF", "sans-serif"],
      },
    },
  },
  plugins: [
    tailwindPlugin({
      config: udsConfig,
    }),
  ],
};



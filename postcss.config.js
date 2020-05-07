const stylelint = require('stylelint');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const cssMqpacker = require('css-mqpacker');

module.exports = {
  plugins: [
    postcssImport({
      plugins: [
        stylelint,
      ],
    }),
    postcssPresetEnv({
      stage: 0,
    }),
    tailwindcss,
    autoprefixer,
    cssMqpacker,
  ],
};

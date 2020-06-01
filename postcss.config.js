const stylelint = require('stylelint');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const sortMediaQueries = require('postcss-sort-media-queries');

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
    sortMediaQueries,
    autoprefixer,
  ],
};

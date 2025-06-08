const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/*', 'entry.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'import/no-named-as-default': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
]);

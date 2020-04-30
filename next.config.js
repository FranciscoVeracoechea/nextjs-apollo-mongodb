const withGraphql = require('next-plugin-graphql');
const withPlugins = require('next-compose-plugins');
const sass = require('@zeit/next-sass');
const nextEnv = require('next-env');

const withNextEnv = nextEnv();  

module.exports = withPlugins([
  [
    sass,
    // withGraphql,
    nextEnv(),
  ],
  {
    cssModules: true,
  }
])

const withGraphql = require('next-plugin-graphql');
const withPlugins = require('next-compose-plugins');
const nextEnv = require('next-env');
const optimizedImages = require('next-optimized-images');

const withNextEnv = nextEnv();  

module.exports = withPlugins([
  [
    [withGraphql],
    [nextEnv()],
    [optimizedImages],
  ],
])

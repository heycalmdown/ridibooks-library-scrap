let config = {};
try {
  config = require('../config.local.json');
} catch (e) {}

export default config;

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const channels = require('../../config/channels.json');

(async () => {
  const run = require('./file');
  await run({ channels, folder: './channels' });
  process.exit(0);
})();
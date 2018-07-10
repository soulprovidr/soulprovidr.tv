require('dotenv').config();

const fs = require('fs');
const path = require('path');
const program = require('commander');

program
  .version('1.0.0')
  .option(
    '-c, --channels [path]',
    'Path to channels JSON [./config/channels.json]',
    './config/channels.json'
  )
  .option('--debug', 'Use "debug" mode (save files locally)')
  .parse(process.argv);

if (!program.channels) {
  console.error('No channels file specified! Exiting...');
  process.exit(1);
}

let channels = null;
try {
  channels = JSON.parse(
    fs.readFileSync(path.resolve(program.channels), 'utf8')
  );
} catch (e) {
  console.error('Invalid channels file specified.');
  process.exit(1);
}

(async () => {

  if (program.debug) {
    console.log('Debug mode enabled.');
    const run = require('./file');
    await run({ channels, folder: './channels' });
    process.exit(0);
  }

  else {
    console.log('Production mode enabled.');
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    if (!bucket) {
      console.error('No S3 bucket specified! Exiting...');
      process.exit(1);
    }
    const run = require('./s3');
    await run({ bucket, channels, folder: program.folder });
    process.exit(0);
  }
  

})();
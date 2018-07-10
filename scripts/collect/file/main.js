const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const FileVideoCollector = require('./collector');

module.exports = async function({ channels, folder }) {
  
  // Ensure videos folder exists.
  try {
    fse.ensureDirSync(path.resolve(folder));
  } catch (e) {
    console.error('Error creating videos folder! Exiting...');
    process.exit(1);
  }

  // Collect videos for each channel, sequentially.
  let videos = [];
  for (let i = 0; i < channels.length; i++) {
    videos.push(
      await new FileVideoCollector(folder, channels[i]).run()
    );
  }

  // Flatten results.
  videos = [].concat.apply([], videos);
  console.log(`Saved ${videos.length} new videos.`);
  process.exit(0);
};
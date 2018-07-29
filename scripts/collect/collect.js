const path = require('path');

const config = require('../../config.json');

const createFolder = require('./create-folder');
const downloadPlaylist = require('./download-playlist');
const saveJSON = require('./save-json');

async function collect() {

  const rootDir = path.resolve(config.videosFolder);

  // Ensure channels folder exists.
  createFolder(rootDir);

  // Collect videos for each channel, sequentially.
  let channels = [];
  for (let i = 0; i < config.channels.length; i++) {
    const channel = config.channels[i];

    // Download channel's videos.
    console.log(`Downloading videos for ${channel.name} (${channel.slug})...`);
    await downloadPlaylist(
      channel.playlistId,
      path.resolve(path.join(rootDir, channel.slug))
    );

    // Update index with channel data.
    const { slug, name } = channel;
    channels.push({ slug, name });
    saveJSON(path.join(rootDir, 'index.json'), channels);
  }

  process.exit(0);

};

module.exports = collect;
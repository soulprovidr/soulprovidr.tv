require('dotenv').config();

const AWS = require('aws-sdk');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const ytdl = require('youtube-dl');

const Lambda = new AWS.Lambda();
const publicDir = path.resolve('./public');
fse.ensureDirSync(publicDir);

(async () => {

  let channels = require('../channels.json');
  for (let i = 0; i < channels.length; i++) {

    channels[i].videos = [];

    let playlistItems = null;
    try {
      playlistItems = await getPlaylistInfo(channels[i].playlistId);
    } catch (e) {
      continue;
    }


    try {
      console.log(`Downloading videos for ${channels[i].slug}...`);
      const results = await Promise.all(playlistItems.map(({ id }) => saveVideo(id)));
      results.forEach(r => {
        try {
          const response = JSON.parse(r.Payload);
          if (typeof response === 'object' && response.success) {
            channels[i].videos.push(response.videoId);
            saveJSON(path.join(publicDir, 'channels.json'), channels);
          }
        } catch (e) {
          console.error(e);
        }
      });  
    } catch (e) {
      continue;  
    }
  }

  process.exit(0);

})();

/*********************************************************/


/**
 * Get info for playlist or video.
 *
 * @param {*} url
 * @returns
 */
function getPlaylistInfo(url) {
  return new Promise((resolve, reject) => {
    console.log('Fetching playlist info...');
    ytdl.getInfo(url, [
      '-j',
      '--flat-playlist'
    ], (err, info) => {
      if (err) {
        return reject(err);
      }
      return resolve(info);
    });
  });
}

/**
 * Write JSON data to specified location.
 *
 * @param {String} filePath Path to JSON file.
 * @param {*} data
 */
function saveJSON(filePath, data) {
  fs.writeFileSync(
    path.resolve(filePath),
    JSON.stringify(data, null, 4),
    'utf8'
  );
}

/**
 * Invoke the `saveVideo` Lambda function.
 *
 * @param {String} videoId
 * @returns
 */
function saveVideo(videoId) {
  console.log('Fetching ' + videoId + '...');
  return Lambda.invoke({
    FunctionName: process.env.AWS_FUNCTION_NAME + '-production',
    Payload: JSON.stringify({ videoId })
  }).promise();
}
require('dotenv').config();

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const ytdl = require('youtube-dl');

const Lambda = new AWS.Lambda();
const publicDir = path.resolve('./public');

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

    console.log(`Downloading videos for ${channels[i].slug}...`);

    for (let j = 0; j < playlistItems.length; j++) {
      try {
        const response = await saveYouTubeVideoToS3(playlistItems[j].id);
        console.log(response);
        if (response.StatusCode == 200) {
          channels[i].videos.push(JSON.parse(response.Payload));
          saveJSON(path.join(publicDir, 'channels.json'), channels);
        }
      } catch (e) {
        console.error(e);
        continue;
      }
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
 * Invoke the `saveYouTubeVideoToS3` Lambda function.
 *
 * @param {String} videoId
 * @returns
 */
function saveYouTubeVideoToS3(videoId) {
  return Lambda.invoke({
    FunctionName: process.env.AWS_LAMBDA_ARN,
    Payload: JSON.stringify({ videoId })
  }).promise();
}
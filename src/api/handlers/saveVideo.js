const AWS = require('aws-sdk');
const fs = require('fs');
const ytdl = require('ytdl-core');

/**
 * Download video to a temporary location, then resolve promise with file contents.
 *
 * @param {String} videoId
 * @returns
 */
function getVideo(videoId) {
  return new Promise((resolve, reject) => {
    const tmp = `/tmp/${videoId}`;
    const download = ytdl(videoId, {
      filter: format => format.container === 'mp4'
    });
    download.on('info', () => download.pipe(fs.createWriteStream(tmp)));
    download.on('end', () => resolve(fs.readFileSync(tmp)));
    download.on('error', reject);
  });
}

/**
* Saves a specified YouTube video to an S3 bucket.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports = async (event, context, callback) => {

  const Bucket = process.env.S3_BUCKET;
  const S3 = new AWS.S3();

  try {
    const videoId = event.videoId;
    const ACL = 'public-read';
    const Key = `videos/${videoId}.mp4`;
    const Body = await getVideo(videoId);
    await S3.upload({ ACL, Bucket, Key, Body }).promise();
    return callback(null, 'Successfully saved ' + videoId + '.');
  } catch (e) {
    return callback(e);
  }
};
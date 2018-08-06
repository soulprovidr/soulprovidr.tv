'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const ytdl = require('ytdl-core');

const Bucket = process.env.S3_BUCKET;
const S3 = new AWS.S3();

/**
 * Get the specified `Key` from the S3 bucket.
 *
 * @param {*} Key
 * @returns
 */
async function getObject(Key) {
  return new Promise((resolve, reject) => {
    S3.getObject({ Bucket, Key }).promise()
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Download video to a temporary location, then resolve promise with file contents.
 *
 * @param {*} videoId
 * @param {*} location
 * @returns
 */
function downloadVideo(videoId) {
  return new Promise((resolve, reject) => {
    const tmp = `/tmp/${videoId}`;
    const download = ytdl('http://youtube.com/watch?v=' + videoId, {
      filter: format => format.container === 'mp4'
    });
    download.on('info', () => download.pipe(fs.createWriteStream(tmp)));
    download.on('end', () => resolve(fs.readFileSync(tmp)));
    download.on('error', reject);
  });
}

/**
 * Save the specified `Body` to the specified `Key` in S3 bucket.
 *
 * @param {*} Key
 * @param {*} Body
 * @returns
 */
async function putObject(Key, Body) {
  const ACL = 'public-read';
  return new Promise((resolve, reject) => {
    S3.upload({ ACL, Bucket, Key, Body }).promise()
      .then(resolve)
      .catch(reject);
  });
}

function saveVideoDuplicate(videoId, callback) {
  return callback(null, { success: true, skipped: true, videoId });
}

function saveVideoError(err, callback) {
  return callback(err);
}

function saveVideoSuccess(videoId, callback) {
  return callback(null, { success: true, videoId });
}


module.exports.getChannel = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};

module.exports.getChannels = (event, context, callback) => {

};

module.exports.saveChannel = (event, context, callback) => {

};

/**
* Saves a specified YouTube video to an S3 bucket.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports.saveVideo = async (event, context, callback) => {

  const videoId = event.videoId;
  const Key = `videos/${videoId}.mp4`;

  try {
    await getObject(Key);
    return saveVideoDuplicate(videoId, callback);
  } catch (e) {
    console.log('Video does not exist, beginning download...');
  }

  try {
    const Body = await downloadVideo(videoId);
    await putObject(Key, Body);
    return saveVideoSuccess(videoId, callback);
  } catch (e) {
    return saveVideoError(e, callback);
  }
}
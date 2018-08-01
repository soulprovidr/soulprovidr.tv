const AWS = require('aws-sdk');
const fs = require('fs');
const ytdl = require('youtube-dl');

const Bucket = process.env.AWS_S3_BUCKET_NAME;
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
    const download = ytdl(videoId);
    const tmp = `/tmp/${videoId}`;
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
  return new Promise((resolve, reject) => {
    S3.putObject({ Bucket, Key, Body }).promise()
      .then(resolve)
      .catch(reject);
  });
}

/**
 * Saves a specified YouTube video to an S3 bucket.
 *
 * @param {*} event
 * @param {*} context
 * @param {*} callback
 */
async function saveVideo(event, context, callback) {

  const videoId = event.videoId;
  const Key = `videos/${videoId}.mp4`;

  try {
    await getObject(Key);
    return callback(null, videoId);
  } catch (e) {
    console.log('Video does not exist, beginning download...');
  }

  try {
    const Body = await downloadVideo(videoId);
    await putObject(Key, Body);
    return callback(null, videoId);
  } catch (e) {
    return callback(e);
  }

};

exports.handler = saveVideo;
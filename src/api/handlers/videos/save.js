const AWS = require('aws-sdk');
const fs = require('fs');
const ytdl = require('ytdl-core');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});
const S3 = new AWS.S3();

const Bucket = process.env.S3_BUCKET;
const channelsTable = process.env.CHANNELS_TABLE;
const videosTable = process.env.VIDEOS_TABLE;

/**
 * Get the video's S3 key.
 *
 * @param {String} videoId
 * @returns
 */
function getKey(videoId) {
  return `videos/${videoId}.mp4`;
}

/**
 * Store video in S3 bucket.
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
    // Pipe file to temporary location.
    download.on('info', () => download.pipe(fs.createWriteStream(tmp)));
    // Save video to S3.
    download.on('end', async () => {
      await S3.upload({
        Bucket,
        ACL: 'public-read',
        Key: getKey(videoId),
        Body: fs.readFileSync(tmp)
      }).promise();
      return resolve();
    });
    // Reject on error.
    download.on('error', reject);
  });
}

/**
 * Add the video to the `videos` table.
 *
 * @param {*} videoId
 * @returns
 */
function save(videoId) {
  return DB.put({
    TableName: videosTable,
    Item: {
      id: videoId,
      artist: '',
      title: '',
      location: getKey()
    }
  }).promise();
}

/**
 * Add the video the channel's `videos` set.
 *
 * @param {*} videoId
 * @param {*} slug
 * @returns
 */
function saveToChannel(videoId, channelSlug) {
  return DB.update({
    TableName: channelsTable,
    Key: { slug: channelSlug },
    UpdateExpression: 'SET videos = list_append(videos, :videos)',
    ConditionExpression: 'not(contains(videos, :videoId))',
    ExpressionAttributeValues: {
      ':videoId': videoId,
      ':videos': [videoId]
    },
    ReturnValues: 'UPDATED_NEW'
  }).promise();
}

/**
* Saves a specified YouTube video to an S3 bucket.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports = async (event, context, callback) => {
  try {
    const channelSlug = event.channelSlug;
    const videoId = event.videoId;

    // Download the video.
    await getVideo(videoId);

    // Create record in `videos` table.
    await save(videoId);

    // Add `videoId` to channel.
    await saveToChannel(videoId, channelSlug);

    return callback(null, `Successfully saved ${videoId} to ${channelSlug}.`);
  } catch (e) {
    return callback(e);
  }
};
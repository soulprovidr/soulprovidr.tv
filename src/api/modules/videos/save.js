const AWS = require('aws-sdk');
const fs = require('fs');
const ytdl = require('ytdl-core');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});
const S3 = new AWS.S3();
const SQS = new AWS.SQS();

const Bucket = process.env.S3_BUCKET_NAME;
const QueueUrl = process.env.VIDEOS_QUEUE_URL;

/**
 * Store video in S3 bucket.
 *
 * @param {String} videoId
 * @returns
 */
function downloadVideo(videoId) {
  return new Promise((resolve, reject) => {
    const Key = `videos/${videoId}.mp4`;
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
        Key,
        Body: fs.readFileSync(tmp)
      }).promise();
      // Remove temporary file.
      fs.unlinkSync(tmp);
      return resolve(Key);
    });
    // Reject on error.
    download.on('error', reject);
  });
}

/**
 * Add the video the channel's `videos` set.
 *
 * @param {*} videoId
 * @param {*} slug
 * @returns
 */
function updateChannel(channelSlug, videoId) {
  return DB.update({
    TableName: process.env.CHANNELS_TABLE,
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

/*******************************************************************/

/**
* Saves a specified YouTube video to a channel.
*/
module.exports = async (event, context, callback) => {
  const QueueItem = event.Records[0];
  try {
    const { channelSlug, video } = JSON.parse(QueueItem.body);
    const location = await downloadVideo(video.id);
    const Item = {
      id: video.id,
      artist: '',
      title: video.title,
      thumbnail: video.thumbnail,
      location
    };
    await DB.put({ TableName: process.env.VIDEOS_TABLE, Item }).promise();
    await updateChannel(channelSlug, video.id);
    await SQS.deleteMessage({ QueueUrl, ReceiptHandle }).promise();
    return callback(null, `Successfully saved ${video.id} to ${channelSlug}.`);
  } catch (e) {
    await SQS.deleteMessage({ QueueUrl, ReceiptHandle }).promise();
    return callback(e);
  }
};
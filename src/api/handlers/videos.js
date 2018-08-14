const AWS = require('aws-sdk');
const fs = require('fs');
const ytdl = require('ytdl-core');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});
const S3 = new AWS.S3();
const SQS = new AWS.SQS();

const Bucket = process.env.S3_BUCKET_NAME;
const channelsTable = process.env.CHANNELS_TABLE;
const QueueUrl = process.env.VIDEOS_QUEUE_URL;
const videosTable = process.env.VIDEOS_TABLE;

/**
 * Remove the SQS event from the queue.
 *
 * @param {*} ReceiptHandle
 * @returns
 */
function deleteMessage(ReceiptHandle) {
  return SQS.deleteMessage({
    QueueUrl,
    ReceiptHandle
  }).promise();
}

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
function downloadVideo(videoId) {
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
      fs.unlinkSync(tmp);
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
function putItem(Item) {
  return DB.put({
    TableName: videosTable,
    Item
  }).promise();
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

/*******************************************************************/

/**
* Query videos in DB.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports.get = async (event, context, callback) => {

};

/**
* List videos in database.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports.list = async (event, context, callback) => {
  try {
    const result = await DB.scan({
      TableName: videosTable
    }).promise();
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
    return callback(null, response);
  } catch (e) {
    return callback(e);
  }
};

/**
* Saves a specified YouTube video to an S3 bucket.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports.save = async (event, context, callback) => {
  const Message = event.Records[0];
  try {
    const { channelSlug, video } = JSON.parse(Message.body);
    await downloadVideo(video.id);
    const Item = {
      id: video.id,
      artist: '',
      title: video.title,
      thumbnail: video.thumbnail,
      location: getKey(video.id)
    };
    await putItem(Item);
    await updateChannel(channelSlug, video.id);
    await deleteMessage(Message.receiptHandle);

    return callback(null, `Successfully saved ${video.id} to ${channelSlug}.`);
  } catch (e) {
    await deleteMessage(Message.receiptHandle);
    return callback(e);
  }
};
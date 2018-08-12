const AWS = require('aws-sdk');
const ytpl = require('ytpl');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});
const SQS = new AWS.SQS();

const TableName = process.env.CHANNELS_TABLE;
const QueueUrl = process.env.VIDEOS_QUEUE_URL;

/**
 * Download the video and add it to the specified channel.
 *
 * @param {String} channelSlug
 * @param {String} videoId
 */
function enqueueVideo(channelSlug, video) {
  return SQS.sendMessage({
    DelaySeconds: 0,
    MessageBody: JSON.stringify({ channelSlug, video }),
    QueueUrl
  }).promise();
}

/**
 * Get items for playlist.
 *
 * @param {*} url
 * @returns
 */
function getPlaylistItems(playlistId) {
  return new Promise((resolve, reject) => {
    ytpl(playlistId, (err, playlist) => {
      if (err) {
        return reject(err);
      }
      return resolve(playlist.items);
    });
  });
}

/**
 * Create a record in the `channels` table.
 *
 * @param {*} Item
 * @returns
 */
function putItem(Item) {
  return DB.put({
    TableName,
    Item,
    ConditionExpression: 'attribute_not_exists(slug)'
  }).promise();
}

/**
* List channels in the database.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports.list = async (event, context, callback) => {
  try {
    const result = await DB.scan({ TableName }).promise();
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
* Saves a channel to the database.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports.save = async (event, context, callback) => {
  for (let i = 0; i < event.channels.length; i++) {
    const Item = Object.assign({}, event.channels[i], { videos: [] });
    try {
      await putItem(Item);
    } catch (e) {
      return callback(e);
    }
    const videos = await getPlaylistItems(Item.playlistId);
    videos.forEach(v => enqueueVideo(Item.slug, v));
  }
  return callback(null, event.channels.length + ' channels saved.');
};
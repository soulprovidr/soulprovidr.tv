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

  const DB = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
  });
  const S3 = new AWS.S3();

  const Bucket = process.env.S3_BUCKET;
  const channelsTable = process.env.CHANNELS_TABLE;
  const videosTable = process.env.VIDEOS_TABLE;

  try {
    const channelSlug = event.channelSlug;
    const videoId = event.videoId;

    // Download video.
    const Body = await getVideo(videoId);

    // Save video to S3.
    const ACL = 'public-read';
    const Key = `videos/${videoId}.mp4`;
    await S3.upload({ ACL, Bucket, Key, Body }).promise();

    // Create record in `videos` table.
    const Item = { id: videoId, artist: '', title: '', location: Key };
    await DB.put({ TableName: videosTable, Item }).promise();

    // Add `videoId` to channel.
    await DB.put({
      TableName: channelsTable,
      Key: { slug: channelSlug },
      UpdateExpression: 'SET videos = list_append(videos, :videos)'
    });

    return callback(null, 'Successfully saved ' + videoId + '.');
  } catch (e) {
    return callback(e);
  }
};
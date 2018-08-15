const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});

function getChannel(slug) {
  return DB.get({
    TableName: process.env.CHANNELS_TABLE,
    Key: { slug }
  }).promise();
}

function getVideos() {
  return DB.scan({
    TableName: process.env.VIDEOS_TABLE
  }).promise();
}

async function getVideosForChannel(slug) {
  const { Item } = await getChannel(slug);
  return DB.batchGet({
    RequestItems: {
      [process.env.VIDEOS_TABLE]: {
        Keys: Item.videos.map(id => ({ id }))
      }
    }
  }).promise();
}

/*******************************************************************/

module.exports = async (event, context, callback) => {
  let videos = [];
  try {
    if (event.queryStringParameters && event.queryStringParameters.channel) {
      const { Responses } = await getVideosForChannel(event.queryStringParameters.channel);
      videos = Responses.videos;
    } else {
      const { Items } = await getVideos();
      videos = Items;
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(videos),
      headers: {
        'Access-Control-Allow-Origin' : '*'
      }
    });
  } catch (e) {
    return callback(e);
  }
};
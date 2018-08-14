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

function getVideos(ids) {
  const params = {
    RequestItems: {
      [process.env.VIDEOS_TABLE]: {
        Keys: ids.map(
          id => ({ id })
        )
      }
    }
  };
  return DB.batchGet(params).promise();
}

/*******************************************************************/

/**
 * Return the channel associated with the specified slug.
 */
module.exports = async (event, context, callback) => {
  try {
    const { Item } = await getChannel(event.pathParameters.slug);
    const { Responses } = await getVideos(Item.videos);
    Item.videos = Responses.videos;
    const response = {
      statusCode: 200,
      body: JSON.stringify(Item)
    };
    return callback(null, response);
  } catch (e) {
    return callback(e);
  }
};
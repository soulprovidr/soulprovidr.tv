const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});
const TableName = process.env.VIDEOS_TABLE;

/**
* List videos in database.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports = async (event, context, callback) => {
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
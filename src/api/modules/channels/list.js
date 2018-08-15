const AWS = require('aws-sdk');
const ytpl = require('ytpl');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});

const TableName = process.env.CHANNELS_TABLE;

/**
* List channels in the database.
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
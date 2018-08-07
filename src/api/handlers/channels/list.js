const AWS = require('aws-sdk');

module.exports = async (event, context, callback) => {
  const DB = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
  });

  const TableName = process.env.CHANNELS_TABLE;

  try {
    const result = await DB.scan({ TableName }).promise();
    return callback(null, result.Items);
  } catch (e) {
    return callback(e);
  }
};
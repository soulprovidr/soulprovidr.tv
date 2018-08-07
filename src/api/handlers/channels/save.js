const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient({
  convertEmptyValues: true
});

const TableName = process.env.CHANNELS_TABLE;

/**
 * Create a record in the `channels` table.
 *
 * @param {*} Item
 * @returns
 */
function save(Item) {
  return DB.put({
    TableName,
    Item,
    ConditionExpression: 'attribute_not_exists(slug)'
  }).promise();
}

/**
* Saves a channel to the database.
*
* @param {*} event
* @param {*} context
* @param {*} callback
*/
module.exports = async (event, context, callback) => {
  const Item = Object.assign({}, event.channel, { videos: [] });
  try {
    await save(Item);
    return callback(null, Item.slug + ' added to database.');
  } catch (e) {
    return callback(e);
  }
};
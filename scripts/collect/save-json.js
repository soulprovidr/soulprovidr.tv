const fs = require('fs');
const path = require('path');

/**
 * Write JSON data to specified location.
 *
 * @param {String} filePath Path to JSON file.
 * @param {*} data
 */
function saveJSON(filePath, data) {
  fs.writeFileSync(
    path.resolve(filePath),
    JSON.stringify(data),
    'utf8'
  );
}

module.exports = saveJSON;
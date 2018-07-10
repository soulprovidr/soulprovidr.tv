const fs = require('fs');
const path = require('path');

/**
 * Write JSON data to specified location.
 *
 * @param {*} folder
 * @param {*} filename
 * @param {*} data
 */
function saveJSON(folder, filename, data) {
  fs.writeFileSync(
    path.join(folder, filename),
    JSON.stringify(data),
    'utf8'
  );
}

module.exports = saveJSON;
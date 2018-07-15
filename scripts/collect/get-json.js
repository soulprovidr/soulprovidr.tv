const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const exit = require('./exit');

/**
 * Get or create the specified JSON file in the specified folder.
 *
 * @param {String} filePath Path to JSON file
 * @returns {JSON} JSON contents of file
 */
function getJSON(filePath, defaultValue = {}) {
  // Create file.
  try {
    console.log(`Ensuring ${filePath} exists...`);
    fse.ensureFileSync(path.resolve(filePath));
  } catch (e) {
    exit(e);
  }
  // Parse file.
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    // Create blank file if JSON cannot be parsed.
    fs.openSync(filePath, 'w');
    return defaultValue;
  }
}

module.exports = getJSON;
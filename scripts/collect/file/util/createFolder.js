const fse = require('fs-extra');
const exit = require('./exit');

/**
 * Create the specifed folder.
 *
 * @param {*} folder
 * @returns
 */
function createFolder(folder) {
  try {
    console.log(`Ensuring ${folder} exists...`);
    return fse.ensureDirSync(folder);
  } catch (e) {
    exit(e);
  }
}

module.exports = createFolder;
const ytdl = require('youtube-dl');

/**
 * Get info for playlist or video.
 *
 * @param {*} url
 * @returns
 */
function getInfo(url) {
  return new Promise(resolve => {
    console.log(`Fetching playlist info...`);
    ytdl.getInfo(url, [
      '-j',
      '--flat-playlist'
    ], (err, info) => {
      if (err) {
        return reject(err);
      }
      return resolve(info);
    });
  });
}

module.exports = getInfo;
const fs = require('fs');
const path = require('path');
const ytdl = require('youtube-dl');

/**
 * Download the specified 
 *
 * @param {*} video
 * @param {*} location
 * @returns
 */
function getVideo(video, location) {
  return new Promise(resolve => {
    const download = ytdl(video.url);
    const filename = video.id + '.mp4';
    let pos = size = 0;

    console.log(`Starting download of ${video.title}...`);

    // When download encounters an error...
    download.on('error', err => {
      console.error(err);
      return resolve(null);
    });

    // When download starts...
    download.on('info', () => {
      console.log('Retrieved video info.');
      // Save video.
      download.pipe(
        fs.createWriteStream(path.join(location, filename))
      );
    });

    // When we receive some data...
    download.on('data', chunk => {
      pos += chunk.length;
      // `size` should not be 0 here.
      if (size) {
        var percent = (pos / size * 100).toFixed(2);
        console.log(`${percent}% done.`);
    }
    });

    // When download is complete...
    download.on('end', () => {
      const item = {
        id: video.id,
        artist: '',
        title: video.title,
        filename
      };
      console.log(`Completed download of ${video.url} (${video.title}).\n`);
      return resolve(item);
    });
  });
}

module.exports = getVideo;
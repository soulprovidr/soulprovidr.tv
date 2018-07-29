const path = require('path');

const createFolder = require('./create-folder');
const getPlaylistInfo = require('./get-playlist-info');
const getJSON = require('./get-json');
const saveJSON = require('./save-json');
const getVideo = require('./get-video');

/**
   * Downloads & indexes all the videos in the specified YouTube playlist.
   * 
   * @param {String} playlistId ID of the YouTube playlist.
   * @param {String} folder Absolute or relative path to destination folder
   */
async function downloadPlaylist(playlistId, folder) {

  folder = path.resolve(folder);
  createFolder(folder);

  const indexPath = path.join(folder, 'videos.json');
  const savedVideos = getJSON(indexPath, []);

  const playlistItems = await getPlaylistInfo(playlistId);
  for (let i = 0; i < playlistItems.length; i++) {
    const metadata = await downloadVideo(playlistItems[i]);
    if (metadata) {
      saveVideoMetadata(metadata);
    }
  }
  return true;

  function exists(videoId) {
    return savedVideos.some(video => video.id === videoId);
  }

  async function downloadVideo(playlistItem) {
    if (exists(playlistItem.id)) {
      console.log(`Video ${playlistItem.id} already exists. Skipping...`);
      return false;
    }
    return await getVideo(playlistItem, folder);
  }

  function saveVideoMetadata(metadata) {
    savedVideos.push(metadata);
    saveJSON(indexPath, savedVideos);
  }
}


module.exports = downloadPlaylist;
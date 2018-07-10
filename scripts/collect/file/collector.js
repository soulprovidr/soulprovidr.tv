const path = require('path');

const createFolder = require('./util/createFolder');
const getInfo = require('./util/getInfo');
const getJSON = require('./util/getJSON');
const saveJSON = require('./util/saveJSON');
const getVideo = require('./util/getVideo');

const INDEX_FILE = 'channel.json';

class FileVideoCollector {

  /**
   * Creates an instance of FileVideoCollector.
   * @param {Channel} { name, playlistId, slug }
   * @param {String} baseDir Relative path to 
   * @memberof FileVideoCollector
   */
  constructor(baseDir, { description, name, playlistId, slug }) {

    this.baseDir = baseDir;
    this.playlistId = playlistId;
    this.slug = slug;

    createFolder(this.getPath());

    this.channel = getJSON(
      path.join(this.getPath(), INDEX_FILE),
      { name, slug, description, videos: [] }
    );

    this.getVideo = this.getVideo.bind(this);
    this.getVideos = this.getVideos.bind(this);
  }

  /**
   * Returns `true` if video with specified ID has already been saved.
   *
   * @param {*} videoId
   * @returns
   * @memberof FileVideoCollector
   */
  exists(videoId) {
    return this.channel.videos.some(video => video.id === videoId);
  }

  /**
   * Return the path to the folder for the current channel.
   *
   * @returns
   * @memberof FileVideoCollector
   */
  getPath() {
    return path.resolve(
      path.join(this.baseDir, this.slug)
    );
  }

  /**
   * Download video and update JSON file.
   *
   * @param {*} videoUrl
   * @returns
   * @memberof FileVideoCollector
   */
  async getVideo(playlistItem) {
    if (this.exists(playlistItem.id)) {
      console.log(`Video ${playlistItem.id} already exists. Skipping...`);
      return false;
    }
    const video = await getVideo(playlistItem, this.getPath());
    this.updateIndex(video);
    return video;
  }

  /**
   * Download the playlist's videos in series.
   * Resolves with an array of the newly-added items.
   *
   * @param {*} playlistItems
   * @returns
   * @memberof FileVideoCollector
   */
  async getVideos(playlistItems) {
    let videos = [];
    for (let i = 0; i < playlistItems.length; i++) {
      const video = await this.getVideo(playlistItems[i]);
      if (video) {
        videos.push(video);
      }
    }
    return videos;
  }

  /**
   * Get list of playlist's videos, then download them in series.
   *
   * @returns
   * @memberof FileVideoCollector
   */
  async run() {
    console.log(`Collecting videos for ${this.channel.name} (${this.channel.slug})...`);
    const playlistItems = await getInfo(this.playlistId);
    return await this.getVideos(playlistItems);
  }

  /**
   * Add a new entry to the videos.json
   *
   * @param {*} video
   * @memberof FileVideoCollector
   */
  updateIndex(video) {
    this.channel.videos.push(video);
    saveJSON(this.getPath(), INDEX_FILE, this.channel);
  }
}

module.exports = FileVideoCollector;
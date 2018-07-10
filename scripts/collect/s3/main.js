require('dotenv').config();

const AWS = require('aws-sdk');

class S3VideoCollector {

  constructor({ s3, channels }) {
    this.config = config;
    this.S3 = new AWS.S3({ params: { Bucket: s3.bucket } });
  }

  async createRootDir() {
    try {
      console.log('Attempting to create root directory.')
      return await S3.headObject({
        Bucket: S3_BUCKET,
        Key: S3_FOLDER
      }).promise();
    } catch (e) {
      console.log('Folder does not exist. Creating now...');
    }
  }

  async run() {

  }
}

const createFolder = async () => {
  try {
    console.log('Attempting to ')
    const head = await S3.headObject({
      Bucket: S3_BUCKET,
      Key: S3_FOLDER
    }).promise();
  } catch (e) {
    console.log('Folder does not exist. Creating now...');
  }
};

// Ensure configuration file has been provided.
if (process.argv.length < 1) {
  console.warn('No configuration file specified.');
  return 22;
}

// Attempt to parse configuration file.
let channels = null;
try {
  channels = JSON.parse(
    fs.readFileSync(process.argv[2], 'utf8')
  );
} catch (e) {
  console.error(e);
  console.warn('Invalid configuration file provided.');
  return 2;
}

module.exports = async (config) => {
  const videoCollector = new S3VideoCollector()
};

(async () => {
  const collector 
  await createFolder();
})()
  .then(([ videos ]) => {
    videos = [].concat.apply([], videos);
    console.log(`Saved ${videos.length} new videos.`);
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
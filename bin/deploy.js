require('dotenv').config();

const s3EasyDeploy = require('s3-easy-deploy');
const config = require('../deploy.json');

s3EasyDeploy.deploy(config)
  .then(result => {
    console.log(result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
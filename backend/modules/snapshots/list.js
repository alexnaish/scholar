const AWS = require('aws-sdk');
const wrapper = require('../wrapper');

// const S3 = new AWS.S3({
//   s3ForcePathStyle: true,
//   endpoint: new AWS.Endpoint('http://localhost:8000'),
//   accessKeyId: 'S3RVER',
// });

const snapshotListHandler = async (event, context, { logger }) => {
  logger.error('starting!');

  // await S3.putObject({
  //   Bucket: 'scholar-snapshots',
  //   Key: 'lol',
  //   Body: Buffer.from('this is a tést'),
  // }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      event,
      context
    }),
  };
};

module.exports.handler = wrapper({
  handler: snapshotListHandler,
  requiresAccessToken: true
});

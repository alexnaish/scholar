const AWS = require('aws-sdk');
const { onAws } = require('./aws');

const httpOptions = {
  timeout: 5000
};

const localUrl = 'http://localhost:8080';

const credentials = !onAws ? {
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER', // This specific key is required when working offline
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint(localUrl),
} : { httpOptions };

const S3 = new AWS.S3(credentials);
const client = {
  getObject: (params) => S3.getObject(params).promise(),
  putObject: (params) => S3.putObject(params).promise(),
  deleteObject: (params) => S3.deleteObject(params).promise()
};

module.exports = {
  client,
  url : onAws ? `https://${process.env.S3_BUCKET}.s3.eu-west-2.amazonaws.com` : `${localUrl}/${process.env.S3_BUCKET}`
};

const AWS = require('aws-sdk');
const { onAws } = require('./aws');

const httpOptions = {
  timeout: 5000
};

const credentials = !onAws ? {
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
  httpOptions
} : { httpOptions };

const DynamoDB = new AWS.DynamoDB.DocumentClient(credentials);
const DynamoDBClient = {
  get: (params) => DynamoDB.get(params).promise().then(res => res.Item),
  put: (params) => DynamoDB.put(params).promise(),
  update: (params) => DynamoDB.update(params).promise(),
  delete: (params) => DynamoDB.delete(params).promise()
};

module.exports = {
  client: DynamoDBClient
};

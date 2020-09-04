const pixelmatch = require('pixelmatch');
const PNG = require('pngjs').PNG;

const { client, url } = require('../../helpers/s3');
const { client: dynamodb } = require('../../helpers/dynamodb');
const { getImage, saveImage } = require('../../helpers/snapshot');

const wrapper = require('../wrapper');

const handler = async (event, context, { logger }) => {

  const { payload, headers } = event;
  const { name, dimensions, snapshot, type = 'png' } = payload;

  const keyRecord = await dynamodb.get({
    TableName: process.env.TEAM_KEYS_TABLE,
    Key: { key: headers['x-api-key'] }
  });

  if (!keyRecord) {
    logger.info({ error: 'sync issue - key valid for gateway but missing in db', apiKey: headers['x-api-key'] });
    throw new Error('Missing API Key record.');
  }

  const { team_id } = keyRecord;
  const main = await getImage({ team_id, id: `main#${name}`,
    projection: 'image_url'
  });

  const imageKey = `${team_id}/${name}.${type}`;
  if (!main) {
    await Promise.all([
      client.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: imageKey,
        Body: Buffer.from(snapshot.data)
      }),
      saveImage({
        team_id,
        id: `main#${name}`,
        approval_date: Date.now(),
        version: 1,
        image_url: `${url}/${imageKey}`,
        dimensions
      })
    ]);
    return {
      statusCode: 200,
      body: JSON.stringify({}),
    };
  }

  const { Body } = await client.getObject({
    Bucket: process.env.S3_BUCKET,
    Key: imageKey
  });

  const mainImage = PNG.sync.read(Body);
  const newImage = PNG.sync.read(Buffer.from(snapshot.data));
  const diff = new PNG(dimensions);
  const difference = pixelmatch(mainImage.data, newImage.data, diff.data, dimensions.width, dimensions.height, { threshold: 0.1 });
  const compatibility = (100 - ((difference / (dimensions.width * dimensions.height)) * 100)).toFixed(2);

  if (compatibility < 99) {
    const now = Date.now();
    const candidateKey = `${team_id}/${name}-candidate-${now}.${type}`;
    const diffKey = `${team_id}/${name}-diff-${now}.${type}`;
    await Promise.all([
      client.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: candidateKey,
        Body: PNG.sync.write(newImage)
      }),
      client.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: diffKey,
        Body: PNG.sync.write(diff)
      }),
      saveImage({
        team_id,
        id: `candidate#${name}#${now}`,
        creation_date: now,
        image_url: `${url}/${candidateKey}`,
        diff_image_url: `${url}/${diffKey}`
      })
    ]);
  }

  return {
    statusCode: compatibility < 99 ? 409 : 200,
    body: JSON.stringify({
      total: dimensions.width * dimensions.height,
      difference,
      compatibility
    }),
  };
};

module.exports.handler = wrapper({
  handler,
  requireBodyParams: ['name', 'dimensions', 'snapshot']
});

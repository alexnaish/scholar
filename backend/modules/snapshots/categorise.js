const wrapper = require('../wrapper');

const snapshotCategorisationHandler = async (event, context, { logger }) => {
  logger.error('categorising');

  logger.info(event);
  logger.info(context);
  logger.info(process.env);
};

module.exports.handler = wrapper({
  handler: snapshotCategorisationHandler,
});

var screenshotSchema = {
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    meta: {
      browser: {
        type: String
      },
      resolution: {
        type: String
      },
      labels: {
        type: [String]
      },
      lastUpdated: {
        type: Date
      },
      lastUpdatedBy: {
        type: String
      }
    }
};

module.exports = {
    schema: screenshotSchema
};

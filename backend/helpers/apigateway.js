const AWS = require('aws-sdk');
const apiGateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });

const PLANS = {
  PRO: 'Professional',
  ADVANCED: 'Advanced',
  FREE: 'Free'
};

module.exports = {
  PLANS,
  createApiKey: (params) => apiGateway.createApiKey(params).promise(),
  createUsagePlanKey: (params) => apiGateway.createUsagePlanKey(params).promise(),
  getUsage: (params) => apiGateway.getUsage(params).promise(),
  getPlanId: (teamPlanName) => {
    switch (teamPlanName) {
      case PLANS.PRO:
        return process.env.PROFESSIONAL_PLAN_ID;
      case PLANS.ADVANCED:
        return process.env.ADVANCED_PLAN_ID;
      default:
        return process.env.FREE_PLAN_ID;
    }
  }
};

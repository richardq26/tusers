'use strict';
const app = require("./app");
module.exports.Server = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return await app.run(event, context, callback);

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

const headers = require("./headers");
const buildMessage = (code, message) => {
  if (code == 200 || code == 201) {
    return message;
  }
  return {
    errors: {
      message,
    },
  };
};
// .cors({origin: '*'})

module.exports = (res, statusCode, response) => {
  return headers(res)
    .status(statusCode)
    .json(buildMessage(statusCode, response));
};

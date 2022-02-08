const options = {
    abortEarly: false, // include all errors
    allowUnknown: false, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };
  const { response } = require("../helpers");
  const validationBody = (schema) => (req, res, next) => {
    const { value, error } = schema.validate(req.body, options);
    if (error) {
      console.log(error);
      response(res, 400, error);
    }
    req.body = value;
    next();
  };
  
  module.exports = validationBody;

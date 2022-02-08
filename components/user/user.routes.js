const userController = require("./user.controller");

module.exports = (api, opts) => {
  api.post("/", userController.createUser);
};

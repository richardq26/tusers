const userService = require("./crud");
const {
  Registersdk,
  assignId,
  deleteUser,
} = require("../../lib/cognito.service");
const { response } = require("../../helpers");


exports.createUser = async (req, res) => {

  console.log("owowowo");
  return "XD";
  if (!req.body.username) {
    req.body.username = req.body.email;
  }

  let cognitoUser = await Registersdk({
    email: req.body.email,
    name: req.body.name,
    lastnames: req.body.lastnames,
  });
  if (cognitoUser.error) {
    if(cognitoUser.error.message.code=="UsernameExistsException"){
      return response(res, cognitoUser.error.code, "Nombre de usuario ya registrado.");
    }else{
      return response(res, cognitoUser.error.code, cognitoUser.error.message.message);
    }
    
  }
  req.body.sub = cognitoUser.User.Attributes.find((obj) => {
    return obj.Name == "sub";
  }).Value;


  return response(res, 200, cognitoUser);
};
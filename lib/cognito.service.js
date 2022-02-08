const { USER_POOL_ID, POOL_REGION } = require("../config");
const { CognitoIdentityServiceProvider } = require("aws-sdk");
const { namesRoles } = require("../helpers");

const cognitoProvider = new CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18",
  region: POOL_REGION,
});

exports.Registersdk = async ({email, name, lastname = null}) => {
  var attributes = [
    {
      Name: "name",
      Value: name,
    },
    {
      Name: "email",
      Value: email,
    },
    {
      Name: "family_name",
      Value: lastname,
    },
    {
      Name: "email_verified",
      Value: "true",
    },
  ];

  let params = {
    UserPoolId: USER_POOL_ID,
    Username: email,
    //TemporaryPassword : "xxxxxx", //si no se especifica, cognito lo crea
    UserAttributes: attributes,
  };

  const user = await new Promise((resolve, reject) => {
    cognitoProvider.adminCreateUser(params, function (err, data) {
      if (err) {
        // reject(err);
        return resolve({
          error: {
            code: 406,
            message: String(err),
          },
        });
      } else {
        return resolve(data);
      }
    });
  });

  return user;
};

exports.disableUser = async (username) => {
  let params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };

  return await new Promise((resolve, reject) => {
    cognitoProvider.adminDisableUser(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        return resolve({
          error: {
            code: 406,
            message: String(err),
          },
        });
      } else {
        console.log("Usuario deshabilitado");
        return resolve(data);
      }
    });
  });
};

exports.enableUser = async (username) => {
  let params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };

  return await new Promise((resolve, reject) => {
    cognitoProvider.adminEnableUser(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        return resolve({
          error: {
            code: 406,
            message: String(err),
          },
        });
      } else {
        console.log("Usuario habilitado");
        return resolve(data);
      }
    });
  });
};

exports.updateAttributes = async (username, data) => {
  var attributes = [];
  if (data.names) {
    attributes.push({ Name: "name", Value: data.names });
  }
  if (data.lastnames) {
    attributes.push({ Name: "family_name", Value: data.lastnames });
  }

  if (data.email) {
    attributes.push({ Name: "email", Value: data.email });
  }

  if (attributes.length > 0) {
    var params = {
      UserAttributes: attributes,
      UserPoolId: USER_POOL_ID,
      Username: username,
    };
    return await new Promise((resolve, reject) => {
      cognitoProvider.adminUpdateUserAttributes(params, function (err, data) {
        if (err) {
          console.log("Error al actualizar cognito");
          console.log(err);
          return resolve({
            error: {
              code: 406,
              message: String(err),
            },
          });
        } else {
          console.log("Actualizado en cognito");
          return resolve(data);
        }
      });
    });
  } else {
    console.log("Nada que actualizar");
  }
};

exports.globalSignOut = async (username) => {
  const cognitoService = new CognitoIdentityServiceProvider({
    apiVersion: "2016-04-18",
    region: POOL_REGION,
  });
  let params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  return await new Promise((resolve, reject) => {
    cognitoService.adminUserGlobalSignOut(params, (err, data) => {
      if (err) {
        console.log(err);
        return resolve({
          error: {
            code: 409,
            message: err,
          },
        });
      }
      console.log("Se cerró sesion de cognito.");
      return resolve({
        data,
      });
    });
  });
};

exports.setPassword = async (username, pass) => {
  var paramsPas = {
    Password: pass,
    UserPoolId: USER_POOL_ID,
    Username: username,
    Permanent: true,
  };
  let resp = {};
  return new Promise((resolve, reject) => {
    cognitoProvider.adminSetUserPassword(paramsPas, (err, data) => {
      if (err) {
        resp.error = err;
        resp.msg = "Error en password";
        console.log(resp.msg);
        reject(error);
      } else {
        resp.msg = "Password setada";
        console.log(resp.msg);
        resolve(resp);
      }
    });
  });
};

exports.deleteUser = async (username) => {
  var params = {
    UserPoolId: USER_POOL_ID,
    Username: username,
  };
  return await new Promise((resolve, reject) => {
    cognitoProvider.adminDeleteUser(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        console.log("Error al borrar usuario");
        resolve({
          error: {
            code: 406,
            message: String(err),
          },
        });
      } else {
        console.log("Usuario " + username + " borrado");
        resolve(data);
      }
    });
  });
};

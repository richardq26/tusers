const { ALLOW_WEB_ORIGINS } = require("../config");

module.exports = (res) => {
  var weborigin = ALLOW_WEB_ORIGINS;
  if (weborigin == "*") {
    console.log("En *");
    res = res.header("Access-Control-Allow-Origin", "*");
  } else {
    const permitedOrigins = weborigin.split(",");
    const origin = res._request.headers.origin;
    if (permitedOrigins.includes(origin)) {
      res = res.header("Access-Control-Allow-Origin", origin);
    }
  }

  return (
    res
      .header("X-XSS-Protection", "1; mode=block")
      .header("X-Content-Type-Options", "nosniff")
      .header("Referrer-Policy", "no-referrer-when-downgrade")
      .header("X-Frame-Options", "SAMEORIGIN")
      // .header("Access-Control-Allow-Credentials", true)
      .header(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      )
      .header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS,PATCH"
      )
      .header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
      )
  );
};

class App {
  constructor() {
    this.app = require("lambda-api")();
    this.setRoutes();
  }
  setRoutes() {
    this.app.register(require("./components/user/user.routes"), { prefix: "/user" });

    /**
     * Global error catcher.
     */
    this.app.use((err, req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      if (err.name == "RouteError" || err.name == "MethodError") {
        // Ruta no válida o method not allowed
        res.status(403);
        res.json({
          errors: {
            message: "Not route"
          },
        });
      } else {
        res.status(err.status || 500);
        res.json({
          errors: {
            message: err.message,
          },
        });
      }

      return next();
    });

    this.app.options("/*", (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Token, Content-Length, X-Requested-With"
      );
      res.status(200).send({});
    });
  }
}

const Aplication = new App();
module.exports = Aplication.app;

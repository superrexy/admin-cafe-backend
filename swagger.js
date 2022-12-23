const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./src/routes/api.route.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "Admin Cafe REST API",
  },
  host: "adm-cafe-api.rexy.my.id",
  basePath: "/",
  schemes: ["https"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Please enter a valid token to test the requests below...",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);

const express = require("express");
const swaggerUi = require("`swagger-ui-express`");
const swaggerFile = require("./swagger_output.json");

// Import Routes
const api = require("./src/routes/api.route");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routing
app.use(api);

// Swagger
app.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    swaggerOptions: { persistAuthorization: true },
  })
);

// Static File
app.use("/public", express.static("public"));

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "PAGE_NOT_FOUND",
  });
});

module.exports = app;

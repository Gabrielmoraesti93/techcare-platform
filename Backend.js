const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const clienteRoutes = require("./routes/clienteRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TechCare API",
      version: "1.0.0",
      description: "Documentação da API TechCare Platform"
    }
  },
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)










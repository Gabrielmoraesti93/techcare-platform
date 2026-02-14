const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const clienteRoutes = require("./routes/clienteRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express(); // ✅ Primeiro cria o app

// Middlewares
app.use(cors({ origin: "*" })); // Libera todas origens temporariamente
app.use(express.json());

// Swagger config
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
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "TechCare API está online 🚀",
    docs: "/api/docs"
  });
});

// Rot









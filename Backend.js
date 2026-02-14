const cors = require("cors");

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const clienteRoutes = require("./routes/clienteRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();
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
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz (opcional, mas profissional)
app.get("/", (req, res) => {
  res.json({
    message: "TechCare API está online 🚀",
    docs: "/api/docs"
  });
});

// Rotas
app.use("/clientes", clienteRoutes);

// Middleware de erro
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});








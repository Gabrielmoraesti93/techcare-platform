const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();
app.use(express.json());

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TechCare API",
      version: "1.0.0",
      description: "Documentação da API TechCare Platform"
    }
  },
  apis: ["./src/app.js"]
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROTAS
app.get("/clientes", (req, res) => {
  res.json([]);
});

app.post("/clientes", (req, res) => {
  const cliente = req.body;
  res.json({ status: "ok", cliente });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
const clienteRoutes = require("./routes/clienteRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

app.use("/clientes", clienteRoutes);

app.use(errorHandler);







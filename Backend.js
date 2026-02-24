const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const clienteRoutes = require("./routes/clienteRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();


// CORS
app.use(cors({
  origin: "*"
}));


// JSON
app.use(express.json());



// Swagger config

const options = {

  definition: {

    openapi: "3.0.0",

    info: {

      title: "TechCare API",

      version: "1.0.0",

      description: "API TechCare Platform"

    }

  },

  apis: ["./routes/*.js"]

};


const swaggerSpec = swaggerJsdoc(options);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));




// ROOT

app.get("/", (req,res)=>{

  res.json({

    status:"online",

    docs:"/api/docs"

  });

});




// ROTAS

app.use("/clientes", clienteRoutes);




// ERROR

app.use(errorHandler);




// PORT

const PORT = process.env.PORT || 3000;



// START SERVER

app.listen(PORT, ()=>{

  console.log("Servidor rodando na porta", PORT);

const chamadoRoutes = require("./routes/chamadoRoutes");

app.use("/chamados", chamadoRoutes);
});










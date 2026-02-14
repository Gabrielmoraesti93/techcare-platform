const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", clienteController.listarClientes);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 */
router.post("/", clienteController.criarCliente);

module.exports = router;

module.exports = router;

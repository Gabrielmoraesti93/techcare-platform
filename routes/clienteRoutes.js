const express = require("express");
const router = express.Router();

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", (req, res) => {
  res.json([]);
});

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Cria um novo cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: João
 *             telefone: 99999-9999
 *     responses:
 *       200:
 *         description: Cliente criado com sucesso
 */
router.post("/", (req, res) => {
  const cliente = req.body;
  res.json({ status: "ok", cliente });
});

module.exports = router;

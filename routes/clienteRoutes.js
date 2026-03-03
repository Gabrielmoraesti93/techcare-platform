const express = require("express");
const router = express.Router();
const db = require("../database");
const { authMiddleware } = require("../middlewares/authMiddleware");

// LISTAR clientes (somente da empresa do usuário)
router.get("/", authMiddleware, (req, res) => {
  const empresa_id = req.user.empresa_id;

  db.all(
    "SELECT * FROM clientes WHERE empresa_id = ? ORDER BY id DESC",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao listar clientes." });
      res.json(rows);
    }
  );
});

// CRIAR cliente (na empresa do usuário)
router.post("/", authMiddleware, (req, res) => {
  const empresa_id = req.user.empresa_id;
  const { nome, telefone } = req.body;

  if (!nome || !telefone) {
    return res.status(400).json({ error: "Preencha nome e telefone." });
  }

  db.run(
    "INSERT INTO clientes (empresa_id, nome, telefone) VALUES (?, ?, ?)",
    [empresa_id, nome, telefone],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao criar cliente." });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

module.exports = router;
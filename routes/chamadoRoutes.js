const express = require("express");
const router = express.Router();
const db = require("../database");
const { authMiddleware } = require("../middlewares/authMiddleware");

// LISTAR
router.get("/", authMiddleware, (req, res) => {
  const empresa_id = req.user.empresa_id;

  db.all(
    "SELECT * FROM chamados WHERE empresa_id = ? ORDER BY id DESC",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao listar chamados." });
      res.json(rows);
    }
  );
});

// CRIAR
router.post("/", authMiddleware, (req, res) => {
  const empresa_id = req.user.empresa_id;
  const { cliente, problema } = req.body;

  if (!cliente || !problema) {
    return res.status(400).json({ error: "Preencha cliente e problema." });
  }

  db.run(
    "INSERT INTO chamados (empresa_id, cliente, problema) VALUES (?, ?, ?)",
    [empresa_id, cliente, problema],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao criar chamado." });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

module.exports = router;
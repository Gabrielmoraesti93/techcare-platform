const express = require("express");
const db = require("../database");

const router = express.Router();

// GET /clientes  (lista só da empresa do usuário logado)
router.get("/", (req, res) => {
  const empresa_id = req.user.empresa_id;

  db.all(
    "SELECT id, nome, telefone, criado_em FROM clientes WHERE empresa_id = ? ORDER BY id DESC",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao listar clientes." });
      res.json(rows);
    }
  );
});

// POST /clientes  (cria na empresa do usuário logado)
router.post("/", (req, res) => {
  const empresa_id = req.user.empresa_id;
  const { nome, telefone } = req.body;

  db.run(
    "INSERT INTO clientes (empresa_id, nome, telefone) VALUES (?, ?, ?)",
    [empresa_id, nome || "", telefone || ""],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao salvar cliente." });
      res.json({ ok: true, id: this.lastID });
    }
  );
});

module.exports = router;
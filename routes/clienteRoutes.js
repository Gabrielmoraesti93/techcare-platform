const express = require("express");
const router = express.Router();
const db = require("../database");

// GET /clientes  -> lista clientes da empresa logada
router.get("/", (req, res) => {
  const empresa_id = req.user?.empresa_id;

  if (!empresa_id) {
    return res.status(401).json({ error: "Empresa não identificada no token." });
  }

  db.all(
    "SELECT id, nome, telefone, criado_em FROM clientes WHERE empresa_id = ? ORDER BY id DESC",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao listar clientes." });
      res.json(rows);
    }
  );
});

// GET /clientes/:id -> pega 1 cliente (da mesma empresa)
router.get("/:id", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const id = Number(req.params.id);

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!id) return res.status(400).json({ error: "ID inválido." });

  db.get(
    "SELECT id, nome, telefone, criado_em FROM clientes WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar cliente." });
      if (!row) return res.status(404).json({ error: "Cliente não encontrado." });
      res.json(row);
    }
  );
});

// POST /clientes -> cria cliente na empresa logada
router.post("/", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const { nome, telefone } = req.body || {};

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!nome || !telefone) return res.status(400).json({ error: "Preencha nome e telefone." });

  db.run(
    "INSERT INTO clientes (empresa_id, nome, telefone) VALUES (?, ?, ?)",
    [empresa_id, nome, telefone],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao criar cliente." });
      res.status(201).json({ ok: true, id: this.lastID, nome, telefone });
    }
  );
});

// PUT /clientes/:id -> atualiza cliente (somente se for da empresa)
router.put("/:id", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const id = Number(req.params.id);
  const { nome, telefone } = req.body || {};

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!id) return res.status(400).json({ error: "ID inválido." });
  if (!nome || !telefone) return res.status(400).json({ error: "Preencha nome e telefone." });

  db.run(
    "UPDATE clientes SET nome = ?, telefone = ? WHERE id = ? AND empresa_id = ?",
    [nome, telefone, id, empresa_id],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao atualizar cliente." });
      if (this.changes === 0) return res.status(404).json({ error: "Cliente não encontrado." });
      res.json({ ok: true });
    }
  );
});

// DELETE /clientes/:id -> remove cliente (somente se for da empresa)
router.delete("/:id", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const id = Number(req.params.id);

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!id) return res.status(400).json({ error: "ID inválido." });

  db.run(
    "DELETE FROM clientes WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao remover cliente." });
      if (this.changes === 0) return res.status(404).json({ error: "Cliente não encontrado." });
      res.json({ ok: true });
    }
  );
});

module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../database");

// GET /chamados -> lista chamados da empresa logada
router.get("/", (req, res) => {
  const empresa_id = req.user?.empresa_id;

  if (!empresa_id) {
    return res.status(401).json({ error: "Empresa não identificada no token." });
  }

  db.all(
    "SELECT id, cliente, problema, status, data FROM chamados WHERE empresa_id = ? ORDER BY id DESC",
    [empresa_id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Erro ao listar chamados." });
      res.json(rows);
    }
  );
});

// GET /chamados/:id -> pega 1 chamado da empresa
router.get("/:id", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const id = Number(req.params.id);

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!id) return res.status(400).json({ error: "ID inválido." });

  db.get(
    "SELECT id, cliente, problema, status, data FROM chamados WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar chamado." });
      if (!row) return res.status(404).json({ error: "Chamado não encontrado." });
      res.json(row);
    }
  );
});

// POST /chamados -> cria chamado na empresa
router.post("/", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const { cliente, problema } = req.body || {};

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!cliente || !problema) {
    return res.status(400).json({ error: "Preencha cliente e problema." });
  }

  db.run(
    "INSERT INTO chamados (empresa_id, cliente, problema) VALUES (?, ?, ?)",
    [empresa_id, cliente, problema],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao criar chamado." });
      res.status(201).json({ ok: true, id: this.lastID });
    }
  );
});

// PUT /chamados/:id -> atualiza (cliente/problema/status) somente da empresa
router.put("/:id", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const id = Number(req.params.id);
  const { cliente, problema, status } = req.body || {};

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!id) return res.status(400).json({ error: "ID inválido." });

  // status opcional, mas se vier, valida
  const allowedStatus = ["aberto", "em_andamento", "finalizado"];
  if (status && !allowedStatus.includes(status)) {
    return res.status(400).json({ error: `Status inválido. Use: ${allowedStatus.join(", ")}` });
  }

  // Monta update dinâmico (atualiza só o que veio)
  const fields = [];
  const values = [];

  if (cliente) { fields.push("cliente = ?"); values.push(cliente); }
  if (problema) { fields.push("problema = ?"); values.push(problema); }
  if (status) { fields.push("status = ?"); values.push(status); }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Envie ao menos um campo para atualizar." });
  }

  values.push(id, empresa_id);

  db.run(
    `UPDATE chamados SET ${fields.join(", ")} WHERE id = ? AND empresa_id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao atualizar chamado." });
      if (this.changes === 0) return res.status(404).json({ error: "Chamado não encontrado." });
      res.json({ ok: true });
    }
  );
});

// DELETE /chamados/:id -> remove chamado somente da empresa
router.delete("/:id", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  const id = Number(req.params.id);

  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });
  if (!id) return res.status(400).json({ error: "ID inválido." });

  db.run(
    "DELETE FROM chamados WHERE id = ? AND empresa_id = ?",
    [id, empresa_id],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao remover chamado." });
      if (this.changes === 0) return res.status(404).json({ error: "Chamado não encontrado." });
      res.json({ ok: true });
    }
  );
});

module.exports = router;
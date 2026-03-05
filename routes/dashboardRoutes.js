const express = require("express");
const router = express.Router();
const db = require("../database");

// GET /dashboard  -> métricas reais da empresa
router.get("/", (req, res) => {
  const empresa_id = req.user?.empresa_id;
  if (!empresa_id) return res.status(401).json({ error: "Empresa não identificada no token." });

  const sqlClientes = `SELECT COUNT(*) as total FROM clientes WHERE empresa_id = ?`;
  const sqlChamados = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'aberto' THEN 1 ELSE 0 END) as abertos,
      SUM(CASE WHEN status = 'finalizado' THEN 1 ELSE 0 END) as finalizados
    FROM chamados
    WHERE empresa_id = ?
  `;

  const sqlUltimosClientes = `
    SELECT id, nome, telefone, criado_em
    FROM clientes
    WHERE empresa_id = ?
    ORDER BY id DESC
    LIMIT 5
  `;

  const sqlUltimosChamados = `
    SELECT id, cliente, problema, status, data
    FROM chamados
    WHERE empresa_id = ?
    ORDER BY id DESC
    LIMIT 5
  `;

  db.get(sqlClientes, [empresa_id], (errC, clientes) => {
    if (errC) return res.status(500).json({ error: "Erro ao carregar clientes." });

    db.get(sqlChamados, [empresa_id], (errCh, chamados) => {
      if (errCh) return res.status(500).json({ error: "Erro ao carregar chamados." });

      db.all(sqlUltimosClientes, [empresa_id], (errLC, ultClientes) => {
        if (errLC) return res.status(500).json({ error: "Erro ao carregar últimos clientes." });

        db.all(sqlUltimosChamados, [empresa_id], (errLCh, ultChamados) => {
          if (errLCh) return res.status(500).json({ error: "Erro ao carregar últimos chamados." });

          res.json({
            ok: true,
            cards: {
              total_clientes: clientes?.total || 0,
              total_chamados: chamados?.total || 0,
              chamados_abertos: chamados?.abertos || 0,
              chamados_finalizados: chamados?.finalizados || 0,
            },
            ultimos: {
              clientes: ultClientes || [],
              chamados: ultChamados || [],
            },
          });
        });
      });
    });
  });
});

module.exports = router;
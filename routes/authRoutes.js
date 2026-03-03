const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_mude_isso";

/**
 * POST /auth/register
 * body: { empresa_nome, nome, email, senha }
 */
router.post("/register", (req, res) => {
  const { empresa_nome, nome, email, senha } = req.body;

  if (!empresa_nome || !nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha empresa_nome, nome, email e senha." });
  }

  const senha_hash = bcrypt.hashSync(senha, 10);

  // 1) cria empresa
  db.run(
    `INSERT INTO empresas (nome) VALUES (?)`,
    [empresa_nome],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao criar empresa." });

      const empresa_id = this.lastID;

      // 2) cria usuário admin vinculado à empresa
      db.run(
        `INSERT INTO usuarios (empresa_id, nome, email, senha_hash) VALUES (?, ?, ?, ?)`,
        [empresa_id, nome, email, senha_hash],
        function (err2) {
          if (err2) {
            // Se email duplicado, apaga a empresa criada (rollback simples)
            if (String(err2).includes("UNIQUE")) {
              db.run(`DELETE FROM empresas WHERE id = ?`, [empresa_id]);
              return res.status(409).json({ error: "Email já cadastrado." });
            }
            return res.status(500).json({ error: "Erro ao cadastrar usuário." });
          }

          return res.json({ ok: true, empresa_id, user_id: this.lastID });
        }
      );
    }
  );
});

/**
 * POST /auth/login
 * body: { email, senha }
 */
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha email e senha." });
  }

  db.get(
    `SELECT id, empresa_id, nome, email, senha_hash FROM usuarios WHERE email = ?`,
    [email],
    (err, user) => {
      if (err) return res.status(500).json({ error: "Erro no servidor." });
      if (!user) return res.status(401).json({ error: "Credenciais inválidas." });

      const ok = bcrypt.compareSync(senha, user.senha_hash);
      if (!ok) return res.status(401).json({ error: "Credenciais inválidas." });

      const token = jwt.sign(
        { id: user.id, empresa_id: user.empresa_id, email: user.email, nome: user.nome },
        JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.json({
        ok: true,
        token,
        user: { id: user.id, empresa_id: user.empresa_id, nome: user.nome, email: user.email }
      });
    }
  );
});

module.exports = router;
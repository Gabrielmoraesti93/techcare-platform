const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database");

// use uma env no Render: JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_mude_isso";

// garante que a tabela existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// REGISTER (criar usuário)
router.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Preencha nome, email e senha." });
  }

  const senha_hash = bcrypt.hashSync(senha, 10);

  db.run(
    "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)",
    [nome, email, senha_hash],
    function (err) {
      if (err) {
        if (String(err).includes("UNIQUE")) {
          return res.status(409).json({ error: "Email já cadastrado." });
        }
        return res.status(500).json({ error: "Erro ao cadastrar usuário." });
      }

      return res.json({ ok: true, id: this.lastID });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Preencha email e senha." });
  }

  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (!user) return res.status(401).json({ error: "Credenciais inválidas." });

    const ok = bcrypt.compareSync(senha, user.senha_hash);
    if (!ok) return res.status(401).json({ error: "Credenciais inválidas." });

    const token = jwt.sign(
      { id: user.id, email: user.email, nome: user.nome },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      ok: true,
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  });
});

module.exports = router;
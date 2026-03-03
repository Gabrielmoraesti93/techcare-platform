const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./techcare.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS empresas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      senha_hash TEXT NOT NULL,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);

  // opcional: evitar email repetido na mesma empresa
  db.run(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_empresa_email
    ON usuarios(empresa_id, email)
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      nome TEXT NOT NULL,
      telefone TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS chamados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      empresa_id INTEGER NOT NULL,
      cliente TEXT NOT NULL,
      problema TEXT NOT NULL,
      status TEXT DEFAULT 'aberto',
      data DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (empresa_id) REFERENCES empresas(id)
    )
  `);
});

module.exports = db;
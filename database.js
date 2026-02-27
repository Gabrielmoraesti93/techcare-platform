const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./techcare.db");


db.serialize(()=>{


db.run(`

CREATE TABLE IF NOT EXISTS users(

id INTEGER PRIMARY KEY AUTOINCREMENT,

email TEXT UNIQUE,

password TEXT

)

`);



db.run(`

CREATE TABLE IF NOT EXISTS clientes(

id INTEGER PRIMARY KEY AUTOINCREMENT,

nome TEXT,

telefone TEXT

)

`);



db.run(`
CREATE TABLE IF NOT EXISTS chamados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente TEXT,
  problema TEXT,
  status TEXT DEFAULT 'aberto',
  data DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);


});


module.exports=db;

db.run(`
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

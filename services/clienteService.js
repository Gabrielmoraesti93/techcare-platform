const db = require("../database");

exports.listar = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM clientes", [], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

exports.criar = (cliente) => {
  return new Promise((resolve, reject) => {
    const { nome, telefone } = cliente;

    db.run(
      "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
      [nome, telefone],
      function (err) {
        if (err) reject(err);
        resolve({
          id: this.lastID,
          nome,
          telefone
        });
      }
    );
  });
};

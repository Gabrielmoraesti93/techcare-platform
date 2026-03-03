const db = require("./database");

db.serialize(() => {
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;",
    (err, rows) => {
      if (err) {
        console.error("Erro:", err);
        process.exit(1);
      }

      console.log("Tabelas no banco:");
      rows.forEach(r => console.log("-", r.name));
      process.exit(0);
    }
  );
});

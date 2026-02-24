const express = require("express");
const router = express.Router();
const db = require("../database");


// listar
router.get("/", (req, res) => {

  db.all("SELECT * FROM chamados", [], (err, rows) => {

    if (err) return res.status(500).json(err);

    res.json(rows);

  });

});


// criar
router.post("/", (req, res) => {

  const { cliente, problema } = req.body;

  db.run(

    "INSERT INTO chamados (cliente, problema) VALUES (?, ?)",

    [cliente, problema],

    function(err) {

      if (err) return res.status(500).json(err);

      res.json({ id: this.lastID });

    }

  );

});


module.exports = router;
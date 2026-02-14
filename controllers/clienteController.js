const clienteService = require("../services/clienteService");

exports.listarClientes = (req, res) => {
  const clientes = clienteService.listar();
  res.json(clientes);
};

exports.criarCliente = (req, res) => {
  const cliente = clienteService.criar(req.body);
  res.json({ status: "ok", cliente });
};

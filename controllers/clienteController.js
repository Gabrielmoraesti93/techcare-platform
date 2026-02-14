const clienteService = require("../services/clienteService");

exports.listarClientes = async (req, res, next) => {
  try {
    const clientes = await clienteService.listar();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
};

exports.criarCliente = async (req, res, next) => {
  try {
    const cliente = await clienteService.criar(req.body);
    res.json({ status: "ok", cliente });
  } catch (error) {
    next(error);
  }
};


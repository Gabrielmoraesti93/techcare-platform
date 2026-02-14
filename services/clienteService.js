let clientes = [];

exports.listar = () => {
  return clientes;
};

exports.criar = (cliente) => {
  clientes.push(cliente);
  return cliente;
};


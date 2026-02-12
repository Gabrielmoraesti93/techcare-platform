function salvarCliente() {
  fetch("http://localhost:3000/clientes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: "João",
      telefone: "99999-9999"
    })
  })
  .then(res => res.json())
  .then(data => alert("Cliente salvo!"));
}

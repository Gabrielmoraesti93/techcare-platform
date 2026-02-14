const API_URL = "https://moraes-tech.onrender.com";

function salvarCliente() {
  fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: "João",
      telefone: "99999-9999"
    })
  })
    .then(res => res.json())
    .then(data => alert("Cliente salvo!"))
    .catch(err => console.error("Erro:", err));
}

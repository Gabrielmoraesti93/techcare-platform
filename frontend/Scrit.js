function salvarCliente() {
  console.log("Botão clicado");
  
  fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: document.querySelector("input[placeholder='Nome']").value,
      telefone: document.querySelector("input[placeholder='Telefone']").value
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      alert("Cliente salvo!");
    })
    .catch(err => console.error("Erro:", err));
}


const API_URL = "https://moraes-tech.onrender.com";

function salvarCliente() {

  const nome = document.querySelector('input[placeholder="Nome"]').value;
  const telefone = document.querySelector('input[placeholder="Telefone"]').value;

  console.log("Enviando:", nome, telefone);

  fetch(`${API_URL}/clientes`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      nome,
      telefone
    })

  })
  .then(res => res.json())
  .then(data => {

    console.log(data);

    alert("Cliente salvo com sucesso");

    listarClientes();

  })
  .catch(err => {

    console.error(err);

    alert("Erro ao salvar");

  });

}



async function listarClientes(){

  const response = await fetch(`${API_URL}/clientes`);

  const clientes = await response.json();

  const lista = document.getElementById("lista-clientes");

  if(!lista) return;

  lista.innerHTML = "";

  clientes.forEach(cliente => {

    const li = document.createElement("li");

    li.textContent = `${cliente.nome} - ${cliente.telefone}`;

    lista.appendChild(li);

  });

}


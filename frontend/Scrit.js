const API_URL = "https://moraes-tech.onrender.com";


// SALVAR CLIENTE
function salvarCliente() {

console.log("Botão clicado");

fetch(`${API_URL}/clientes`, {

method: "POST",

headers: {

"Content-Type": "application/json"

},

body: JSON.stringify({

nome: document.querySelector('input[placeholder="Nome"]').value,

telefone: document.querySelector('input[placeholder="Telefone"]').value

})

})

.then(res => res.json())

.then(data => {

console.log(data);

alert("Cliente salvo com sucesso!");

listarClientes();

})

.catch(err => console.error("Erro:", err));

}



// LISTAR CLIENTES

async function listarClientes() {

const response = await fetch(`${API_URL}/clientes`);

const clientes = await response.json();

const lista = document.getElementById("lista-clientes");

lista.innerHTML = "";

clientes.forEach(cliente => {

const li = document.createElement("li");

li.textContent = `${cliente.nome} - ${cliente.telefone}`;

lista.appendChild(li);

});

}



// CARREGAR AO INICIAR

window.onload = listarClientes;

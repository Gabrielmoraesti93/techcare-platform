const API_URL = "https://moraes-tech.onrender.com";



/* DASHBOARD */

function mostrarDashboard() {

document.getElementById("conteudo").innerHTML = `

<h1>Dashboard</h1>

<p>Bem vindo ao sistema Moraes Tech</p>

`;

}



/* FORM CADASTRO */

function mostrarCadastro() {

document.getElementById("conteudo").innerHTML = `

<h2>Cadastrar Cliente</h2>

<input id="nome" placeholder="Nome"><br><br>

<input id="telefone" placeholder="Telefone"><br><br>

<button onclick="salvarCliente()">Salvar</button>

`;

}



/* SALVAR CLIENTE */

function salvarCliente() {

const nome = document.getElementById("nome").value;

const telefone = document.getElementById("telefone").value;



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

alert("Cliente salvo com sucesso");

mostrarClientes();

})

.catch(err => console.error(err));

}



/* LISTAR CLIENTES */

function mostrarClientes() {

fetch(`${API_URL}/clientes`)

.then(res => res.json())

.then(clientes => {

let html = `

<h2>Lista de Clientes</h2>

<ul>

`;

clientes.forEach(cliente => {

html += `

<li>

${cliente.nome} - ${cliente.telefone}

</li>

`;

});

html += "</ul>";

document.getElementById("conteudo").innerHTML = html;

})

.catch(err => console.error(err));

}



/* INICIAR */

mostrarDashboard();



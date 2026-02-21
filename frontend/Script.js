/* =========================================
   MORAES TECH SaaS
   Script principal Frontend
========================================= */


/* =========================================
   CONFIG API
========================================= */

const API_URL = "https://moraes-tech.onrender.com";

console.log("✅ Script.js carregado com sucesso");



/* =========================================
   DASHBOARD
========================================= */

function mostrarDashboard() {

  console.log("Abrindo Dashboard");

  document.getElementById("conteudo").innerHTML = `

    <h1>Dashboard</h1>

    <p>Bem vindo ao sistema Moraes Tech</p>

    <p>Sistema SaaS profissional em funcionamento.</p>

  `;

}



/* =========================================
   FORM CADASTRO
========================================= */

function mostrarCadastro() {

  console.log("Abrindo Cadastro");

  document.getElementById("conteudo").innerHTML = `

    <h2>Cadastrar Cliente</h2>

    <input id="nome" placeholder="Nome"><br><br>

    <input id="telefone" placeholder="Telefone"><br><br>

    <button onclick="salvarCliente()">Salvar Cliente</button>

  `;

}



/* =========================================
   SALVAR CLIENTE
========================================= */

function salvarCliente() {

  console.log("Salvando cliente...");

  const nome = document.getElementById("nome").value;

  const telefone = document.getElementById("telefone").value;


  if (!nome || !telefone) {

    alert("Preencha todos os campos");

    return;

  }


  fetch(`${API_URL}/clientes`, {

    method: "POST",

    headers: {

      "Content-Type": "application/json"

    },

    body: JSON.stringify({

      nome: nome,

      telefone: telefone

    })

  })

  .then(response => response.json())

  .then(data => {

    console.log("Cliente salvo:", data);

    alert("Cliente salvo com sucesso!");

    mostrarClientes();

  })

  .catch(error => {

    console.error("Erro ao salvar cliente:", error);

    alert("Erro ao salvar cliente");

  });

}



/* =========================================
   LISTAR CLIENTES
========================================= */

function mostrarClientes() {

  console.log("Listando clientes");

  fetch(`${API_URL}/clientes`)

  .then(response => response.json())

  .then(clientes => {

    console.log("Clientes recebidos:", clientes);


    let html = `

      <h2>Lista de Clientes</h2>

      <button onclick="mostrarCadastro()">

        Novo Cliente

      </button>

      <br><br>

      <ul>

    `;


    clientes.forEach(cliente => {

      html += `

        <li>

          ${cliente.nome} — ${cliente.telefone}

        </li>

      `;

    });


    html += "</ul>";


    document.getElementById("conteudo").innerHTML = html;

  })

  .catch(error => {

    console.error("Erro ao buscar clientes:", error);

    alert("Erro ao carregar clientes");

  });

}



/* =========================================
   INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  console.log("Sistema Moraes Tech iniciado");

  mostrarDashboard();

});



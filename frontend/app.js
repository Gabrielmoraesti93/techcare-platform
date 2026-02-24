// frontend/js/app.js
const API_URL = "https://moraes-tech.onrender.com"; // ajuste para seu backend (Render)

function setConteudo(html) {
  const el = document.getElementById("conteudo");
  if (!el) {
    console.error("Elemento #conteudo não existe no HTML");
    return;
  }
  el.innerHTML = html;
}

/* DASHBOARD */
function mostrarDashboard(e) {
  if (e) e.preventDefault();

  setConteudo(`
    <h1>Dashboard</h1>
    <p>Bem-vindo ao sistema Moraes Tech</p>
  `);
}

/* FORM CADASTRO */
function mostrarCadastro(e) {
  if (e) e.preventDefault();

  setConteudo(`
    <h2>Cadastrar Cliente</h2>

    <label>Nome</label><br />
    <input id="nome" placeholder="Nome" /><br /><br />

    <label>Telefone</label><br />
    <input id="telefone" placeholder="Telefone" /><br /><br />

    <button id="btn-salvar">Salvar</button>
    <p id="msg" style="margin-top:12px;"></p>
  `);

  // liga o botão ao evento (mais confiável do que onclick no HTML)
  const btn = document.getElementById("btn-salvar");
  btn.addEventListener("click", salvarCliente);
}

/* SALVAR CLIENTE */
async function salvarCliente() {
  const nome = document.getElementById("nome")?.value?.trim();
  const telefone = document.getElementById("telefone")?.value?.trim();
  const msg = document.getElementById("msg");

  if (!nome || !telefone) {
    if (msg) msg.textContent = "Preencha nome e telefone.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone }),
    });

    // se backend retornar erro, mostrar
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro ${res.status}: ${text}`);
    }

    await res.json().catch(() => ({})); // caso backend não retorne json certinho

    alert("Cliente salvo com sucesso!");
    mostrarClientes();
  } catch (err) {
    console.error(err);
    alert("Falha ao salvar. Veja o console (F12).");
  }
}

/* LISTAR CLIENTES */
async function mostrarClientes(e) {
  if (e) e.preventDefault();

  setConteudo(`<h2>Lista de Clientes</h2><p>Carregando...</p>`);

  try {
    const res = await fetch(`${API_URL}/clientes`);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro ${res.status}: ${text}`);
    }

    const clientes = await res.json();

    let html = `
      <h2>Lista de Clientes</h2>
      <ul id="lista-clientes"></ul>
    `;

    setConteudo(html);

    const ul = document.getElementById("lista-clientes");
    ul.innerHTML = "";

    clientes.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = `${c.nome} - ${c.telefone}`;
      ul.appendChild(li);
    });
  } catch (err) {
    console.error(err);
    setConteudo(`
      <h2>Lista de Clientes</h2>
      <p>Erro ao carregar clientes. Abra o console (F12) para ver detalhes.</p>
    `);
  }
}

/* EXPORTAR PARA O HTML (para funcionar onclick="...") */
window.mostrarDashboard = mostrarDashboard;
window.mostrarCadastro = mostrarCadastro;
window.mostrarClientes = mostrarClientes;

/* INICIAR */
window.addEventListener("load", () => {
  mostrarDashboard();

  function mostrarNovoChamado(event){

if(event) event.preventDefault();

setHeader("Novo Chamado","Abrir chamado técnico");

setConteudo(`

<input id="cliente" placeholder="Cliente"><br><br>

<textarea id="problema" placeholder="Problema"></textarea><br><br>

<button onclick="salvarChamado()">Salvar</button>

`);

}

function salvarChamado(){

const cliente = document.getElementById("cliente").value;

const problema = document.getElementById("problema").value;

fetch(`${API_URL}/chamados`,{

method:"POST",

headers:{"Content-Type":"application/json"},

body:JSON.stringify({cliente,problema})

})

.then(()=>{

alert("Chamado criado");

mostrarChamados();

});

}

function mostrarChamados(event){

if(event) event.preventDefault();

fetch(`${API_URL}/chamados`)

.then(res=>res.json())

.then(data=>{

let html="<h2>Chamados</h2>";

data.forEach(c=>{

html+=`<p>${c.cliente} - ${c.problema} - ${c.status}</p>`;

});

setConteudo(html);

});

}
});

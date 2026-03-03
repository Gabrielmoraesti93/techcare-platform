const API_URL = "https://moraes-tech.onrender.com";

// Protege o painel
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  };
}

function setConteudo(html) {
  document.getElementById("conteudo").innerHTML = html;
}

/* DASHBOARD */
function mostrarDashboard(event) {
  if (event) event.preventDefault();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  setConteudo(`
    <h1>Dashboard</h1>
    <p>Bem vindo ao sistema Moraes Tech</p>
    <p><b>Usuário:</b> ${user?.email || "desconhecido"}</p>
  `);
}

/* FORM CADASTRO */
function mostrarCadastro(event) {
  if (event) event.preventDefault();

  setConteudo(`
    <h2>Cadastrar Cliente</h2>
    <input id="nome" placeholder="Nome"><br><br>
    <input id="telefone" placeholder="Telefone"><br><br>
    <button onclick="salvarCliente()">Salvar</button>
  `);
}

/* SALVAR CLIENTE */
async function salvarCliente() {
  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();

  if (!nome || !telefone) {
    alert("Preencha nome e telefone.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ nome, telefone })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data?.error || "Erro ao salvar cliente.");
      return;
    }

    alert("Cliente salvo com sucesso!");
    mostrarClientes();
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
  }
}

/* LISTAR CLIENTES */
async function mostrarClientes(event) {
  if (event) event.preventDefault();

  try {
    const res = await fetch(`${API_URL}/clientes`, {
      headers: authHeaders()
    });

    const clientes = await res.json();

    if (!res.ok) {
      setConteudo(`<p>Erro ao carregar clientes: ${clientes?.error || "desconhecido"}</p>`);
      return;
    }

    let html = `<h2>Lista de Clientes</h2><ul>`;
    clientes.forEach(c => {
      html += `<li>${c.nome} - ${c.telefone}</li>`;
    });
    html += `</ul>`;

    setConteudo(html);
  } catch (err) {
    console.error(err);
    setConteudo(`<p>Erro de conexão ao carregar clientes.</p>`);
  }
}

/* LOGOUT */
function logout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

/* INICIAR */
mostrarDashboard();

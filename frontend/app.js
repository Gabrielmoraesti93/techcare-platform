// === CONFIG ===
const API_URL = "https://moraes-tech.onrender.com"; // produção (Render)
// Se estiver testando local, troque para:
// const API_URL = "http://localhost:10000";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // tenta ler json mesmo em erro
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error || `Erro (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

// === UI HELPERS ===
function setContent(html) {
  const el = document.getElementById("conteudo");
  if (el) el.innerHTML = html;
}

function showToast(msg) {
  alert(msg);
}

// === AUTH UI ===
function mostrarLogin() {
  setContent(`
    <h1>Login</h1>
    <p>Acesse o painel Moraes Tech</p>

    <div style="max-width: 380px;">
      <label>Email</label><br>
      <input id="login_email" type="email" placeholder="email@empresa.com" style="width:100%; padding:10px; margin:6px 0;"><br>

      <label>Senha</label><br>
      <input id="login_senha" type="password" placeholder="********" style="width:100%; padding:10px; margin:6px 0;"><br>

      <button id="btnLogin" style="padding:10px 14px; cursor:pointer;">Entrar</button>
    </div>
  `);

  const btn = document.getElementById("btnLogin");
  btn?.addEventListener("click", login);
}

async function login() {
  const email = document.getElementById("login_email")?.value?.trim();
  const senha = document.getElementById("login_senha")?.value;

  if (!email || !senha) return showToast("Preencha email e senha.");

  try {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });

    setToken(data.token);
    await mostrarDashboard();
  } catch (err) {
    showToast(err.message);
  }
}

function logout() {
  clearToken();
  mostrarLogin();
}

// === DASHBOARD (real) ===
async function mostrarDashboard(event) {
  if (event) event.preventDefault();

  try {
    const me = await apiFetch("/auth/me", { method: "GET" });
    const dash = await apiFetch("/dashboard", { method: "GET" });

    setContent(`
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h1>Dashboard</h1>
          <p>Olá, <b>${me.user?.nome || "Usuário"}</b> — Empresa ID: <b>${me.user?.empresa_id}</b></p>
        </div>
        <button id="btnSair" style="padding:10px 14px; cursor:pointer;">Sair</button>
      </div>

      <div style="display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:12px; margin-top:16px;">
        <div class="card"><h3>Total Clientes</h3><p class="num">${dash.cards.total_clientes}</p></div>
        <div class="card"><h3>Total Chamados</h3><p class="num">${dash.cards.total_chamados}</p></div>
        <div class="card"><h3>Chamados Abertos</h3><p class="num">${dash.cards.chamados_abertos}</p></div>
        <div class="card"><h3>Finalizados</h3><p class="num">${dash.cards.chamados_finalizados}</p></div>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:18px;">
        <div class="card">
          <h3>Últimos Clientes</h3>
          <ul>
            ${(dash.ultimos.clientes || []).map(c => `<li>${c.nome} — ${c.telefone || "-"}</li>`).join("") || "<li>Nenhum cliente ainda.</li>"}
          </ul>
        </div>

        <div class="card">
          <h3>Últimos Chamados</h3>
          <ul>
            ${(dash.ultimos.chamados || []).map(ch => `<li><b>${ch.status}</b> — ${ch.cliente}: ${ch.problema}</li>`).join("") || "<li>Nenhum chamado ainda.</li>"}
          </ul>
        </div>
      </div>
    `);

    document.getElementById("btnSair")?.addEventListener("click", logout);
  } catch (err) {
    // token inválido/expirado
    clearToken();
    mostrarLogin();
  }
}

// === CLIENTES ===
async function mostrarClientes(event) {
  if (event) event.preventDefault();

  try {
    const clientes = await apiFetch("/clientes", { method: "GET" });

    const list = clientes.length
      ? clientes.map(c => `<li>${c.nome} — ${c.telefone || "-"}</li>`).join("")
      : "<li>Nenhum cliente cadastrado.</li>";

    setContent(`
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1>Clientes</h1>
        <button id="btnNovoCliente" style="padding:10px 14px; cursor:pointer;">Cadastrar</button>
      </div>

      <div class="card" style="margin-top:12px;">
        <ul>${list}</ul>
      </div>
    `);

    document.getElementById("btnNovoCliente")?.addEventListener("click", mostrarCadastroCliente);
  } catch (err) {
    showToast(err.message);
  }
}

function mostrarCadastroCliente(event) {
  if (event) event.preventDefault();

  setContent(`
    <h1>Cadastrar Cliente</h1>

    <div style="max-width: 420px;">
      <label>Nome</label><br>
      <input id="nome" placeholder="Nome do cliente" style="width:100%; padding:10px; margin:6px 0;"><br>

      <label>Telefone</label><br>
      <input id="telefone" placeholder="(11) 99999-9999" style="width:100%; padding:10px; margin:6px 0;"><br>

      <button id="btnSalvarCliente" style="padding:10px 14px; cursor:pointer;">Salvar</button>
      <button id="btnVoltarClientes" style="padding:10px 14px; cursor:pointer; margin-left:8px;">Voltar</button>
    </div>
  `);

  document.getElementById("btnSalvarCliente")?.addEventListener("click", salvarCliente);
  document.getElementById("btnVoltarClientes")?.addEventListener("click", mostrarClientes);
}

async function salvarCliente() {
  const nome = document.getElementById("nome")?.value?.trim();
  const telefone = document.getElementById("telefone")?.value?.trim();

  if (!nome || !telefone) return showToast("Preencha nome e telefone.");

  try {
    await apiFetch("/clientes", {
      method: "POST",
      body: JSON.stringify({ nome, telefone }),
    });

    showToast("Cliente salvo com sucesso!");
    await mostrarClientes();
  } catch (err) {
    showToast(err.message);
  }
}

// === CHAMADOS ===
async function mostrarChamados(event) {
  if (event) event.preventDefault();

  try {
    const chamados = await apiFetch("/chamados", { method: "GET" });

    const list = chamados.length
      ? chamados.map(ch => `<li><b>${ch.status}</b> — ${ch.cliente}: ${ch.problema}</li>`).join("")
      : "<li>Nenhum chamado ainda.</li>";

    setContent(`
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h1>Chamados</h1>
        <button id="btnNovoChamado" style="padding:10px 14px; cursor:pointer;">Abrir Chamado</button>
      </div>

      <div class="card" style="margin-top:12px;">
        <ul>${list}</ul>
      </div>
    `);

    document.getElementById("btnNovoChamado")?.addEventListener("click", mostrarCadastroChamado);
  } catch (err) {
    showToast(err.message);
  }
}

function mostrarCadastroChamado(event) {
  if (event) event.preventDefault();

  setContent(`
    <h1>Abrir Chamado</h1>

    <div style="max-width: 520px;">
      <label>Cliente</label><br>
      <input id="ch_cliente" placeholder="Nome do cliente" style="width:100%; padding:10px; margin:6px 0;"><br>

      <label>Problema</label><br>
      <textarea id="ch_problema" placeholder="Descreva o problema..." style="width:100%; padding:10px; margin:6px 0; height:110px;"></textarea><br>

      <button id="btnSalvarChamado" style="padding:10px 14px; cursor:pointer;">Salvar</button>
      <button id="btnVoltarChamados" style="padding:10px 14px; cursor:pointer; margin-left:8px;">Voltar</button>
    </div>
  `);

  document.getElementById("btnSalvarChamado")?.addEventListener("click", salvarChamado);
  document.getElementById("btnVoltarChamados")?.addEventListener("click", mostrarChamados);
}

async function salvarChamado() {
  const cliente = document.getElementById("ch_cliente")?.value?.trim();
  const problema = document.getElementById("ch_problema")?.value?.trim();

  if (!cliente || !problema) return showToast("Preencha cliente e problema.");

  try {
    await apiFetch("/chamados", {
      method: "POST",
      body: JSON.stringify({ cliente, problema }),
    });

    showToast("Chamado aberto com sucesso!");
    await mostrarChamados();
  } catch (err) {
    showToast(err.message);
  }
}

// === SIDEBAR LINKS ===
// Use isso no HTML: onclick="navDashboard(event)" etc.
function navDashboard(event) { if (event) event.preventDefault(); mostrarDashboard(); }
function navClientes(event) { if (event) event.preventDefault(); mostrarClientes(); }
function navCadastrarCliente(event) { if (event) event.preventDefault(); mostrarCadastroCliente(); }
function navChamados(event) { if (event) event.preventDefault(); mostrarChamados(); }

// === INIT ===
(function init() {
  if (getToken()) {
    mostrarDashboard();
  } else {
    mostrarLogin();
  }
})();

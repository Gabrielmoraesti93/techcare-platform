// ./assets/js/app.js

const API_URL = "https://moraes-tech.onrender.com";

// =============================
// AUTH / TOKEN
// =============================
function getToken() {
  return localStorage.getItem("token");
}

function authHeaders(extra = {}) {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

function logout(event) {
  if (event) event.preventDefault();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// =============================
// HELPERS
// =============================
function setHeader(title, subtitle) {
  const t = document.getElementById("page-title");
  const s = document.getElementById("page-subtitle");
  if (t) t.textContent = title;
  if (s) s.textContent = subtitle;
}

function setConteudo(html) {
  const el = document.getElementById("conteudo");
  if (!el) return console.error("Elemento #conteudo não encontrado no HTML");
  el.innerHTML = html;
}

function renderErro(msg, err) {
  console.error(msg, err);
  setConteudo(`
    <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
      <h2>Ops... deu erro 😕</h2>
      <p>${msg}</p>
      <small style="opacity:.8">Veja o Console (F12) para detalhes.</small>
    </div>
  `);
}

// =============================
// NAVEGAÇÃO
// =============================
function navDashboard(event) {
  if (event) event.preventDefault();
  mostrarDashboard();
}

function navClientes(event) {
  if (event) event.preventDefault();
  mostrarClientes();
}

function navCadastrarCliente(event) {
  if (event) event.preventDefault();
  mostrarCadastroCliente();
}

function navChamados(event) {
  if (event) event.preventDefault();
  mostrarChamados();
}

function navKanban(event) {
  if (event) event.preventDefault();
  mostrarKanbanChamados();
}

// =============================
// DASHBOARD
// =============================
function mostrarDashboard(event) {
  if (event) event.preventDefault();

  setHeader("Dashboard", "Visão geral do sistema");

  setConteudo(`
    <h2>Bem-vindo ao sistema Moraes Tech</h2>
    <p>Sistema profissional de atendimento técnico</p>

    <div style="margin-top:16px;display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));">
      <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
        <h3>Clientes</h3>
        <p style="opacity:.8">Gerencie seus clientes</p>
        <button onclick="mostrarClientes()" style="padding:10px 14px;">Ver clientes</button>
      </div>

      <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
        <h3>Novo Cliente</h3>
        <p style="opacity:.8">Cadastre rapidamente</p>
        <button onclick="mostrarCadastroCliente()" style="padding:10px 14px;">Cadastrar</button>
      </div>

      <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
        <h3>Chamados</h3>
        <p style="opacity:.8">Acompanhe os atendimentos</p>
        <button onclick="mostrarChamados()" style="padding:10px 14px;">Ver chamados</button>
      </div>

      <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
        <h3>Kanban</h3>
        <p style="opacity:.8">Organize os chamados por status</p>
        <button onclick="mostrarKanbanChamados()" style="padding:10px 14px;">Abrir kanban</button>
      </div>
    </div>
  `);
}

// =============================
// CLIENTES
// =============================
function mostrarCadastroCliente(event) {
  if (event) event.preventDefault();

  setHeader("Cadastrar Cliente", "Cadastro rápido");

  setConteudo(`
    <h2>Cadastrar Cliente</h2>

    <div style="max-width:420px;margin-top:12px;">
      <label>Nome</label><br/>
      <input id="nome" placeholder="Nome" style="width:100%;padding:10px;margin:6px 0 12px 0;" />

      <label>Telefone</label><br/>
      <input id="telefone" placeholder="Telefone" style="width:100%;padding:10px;margin:6px 0 12px 0;" />

      <button onclick="salvarCliente()" style="padding:10px 14px;">Salvar</button>
      <span id="msg" style="margin-left:10px;opacity:.85;"></span>
    </div>
  `);
}

async function salvarCliente() {
  try {
    const nome = document.getElementById("nome")?.value?.trim();
    const telefone = document.getElementById("telefone")?.value?.trim();
    const msg = document.getElementById("msg");

    if (!nome || !telefone) {
      if (msg) msg.textContent = "Preencha nome e telefone.";
      return;
    }

    if (msg) msg.textContent = "Salvando...";

    const res = await fetch(`${API_URL}/clientes`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ nome, telefone })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    await res.json().catch(() => null);

    if (msg) msg.textContent = "✅ Cliente salvo!";
    mostrarClientes();
  } catch (err) {
    renderErro("Não foi possível salvar o cliente.", err);
  }
}

async function mostrarClientes(event) {
  if (event) event.preventDefault();

  setHeader("Clientes", "Lista de clientes cadastrados");

  try {
    setConteudo(`<p>Carregando clientes...</p>`);

    const res = await fetch(`${API_URL}/clientes`, {
      headers: authHeaders()
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    const clientes = await res.json();

    let html = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <h2>Lista de Clientes</h2>
          <p style="opacity:.85">Total: <b>${Array.isArray(clientes) ? clientes.length : 0}</b></p>
        </div>
        <button onclick="mostrarCadastroCliente()" style="padding:10px 14px;">Novo cliente</button>
      </div>
      <ul id="lista-clientes" style="margin-top:10px;line-height:1.9;"></ul>
    `;

    setConteudo(html);

    const ul = document.getElementById("lista-clientes");
    if (!ul) return;

    if (!Array.isArray(clientes) || clientes.length === 0) {
      ul.innerHTML = `<li>Nenhum cliente cadastrado ainda.</li>`;
      return;
    }

    ul.innerHTML = clientes
      .map(c => `<li>${c.nome ?? "-"} — ${c.telefone ?? "-"}</li>`)
      .join("");
  } catch (err) {
    renderErro("Não foi possível carregar os clientes.", err);
  }
}

// =============================
// CHAMADOS
// =============================
function mostrarCadastroChamado(event) {
  if (event) event.preventDefault();

  setHeader("Novo Chamado", "Abra um novo atendimento");

  setConteudo(`
    <h2>Abrir Chamado</h2>

    <div style="max-width:520px;margin-top:12px;">
      <label>Cliente</label><br/>
      <input id="chamado_cliente" placeholder="Nome do cliente" style="width:100%;padding:10px;margin:6px 0 12px 0;" />

      <label>Problema</label><br/>
      <textarea id="chamado_problema" placeholder="Descreva o problema" style="width:100%;padding:10px;margin:6px 0 12px 0;min-height:110px;"></textarea>

      <button onclick="salvarChamado()" style="padding:10px 14px;">Salvar</button>
      <span id="msgChamado" style="margin-left:10px;opacity:.85;"></span>
    </div>
  `);
}

async function salvarChamado() {
  try {
    const cliente = document.getElementById("chamado_cliente")?.value?.trim();
    const problema = document.getElementById("chamado_problema")?.value?.trim();
    const msg = document.getElementById("msgChamado");

    if (!cliente || !problema) {
      if (msg) msg.textContent = "Preencha cliente e problema.";
      return;
    }

    if (msg) msg.textContent = "Salvando...";

    const res = await fetch(`${API_URL}/chamados`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ cliente, problema })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    await res.json().catch(() => null);

    if (msg) msg.textContent = "✅ Chamado criado!";
    mostrarChamados();
  } catch (err) {
    renderErro("Não foi possível criar o chamado.", err);
  }
}

async function mostrarChamados(event) {
  if (event) event.preventDefault();

  setHeader("Chamados", "Lista de chamados da empresa");

  try {
    setConteudo(`<p>Carregando chamados...</p>`);

    const res = await fetch(`${API_URL}/chamados`, {
      headers: authHeaders()
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    const chamados = await res.json();

    const html = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <h2>Lista de Chamados</h2>
          <p style="opacity:.85">Total: <b>${Array.isArray(chamados) ? chamados.length : 0}</b></p>
        </div>
        <div style="display:flex;gap:8px;">
          <button onclick="mostrarCadastroChamado()" style="padding:10px 14px;">Novo chamado</button>
          <button onclick="mostrarKanbanChamados()" style="padding:10px 14px;">Ver kanban</button>
        </div>
      </div>

      <div style="margin-top:14px;display:grid;gap:12px;">
        ${
          Array.isArray(chamados) && chamados.length
            ? chamados.map(ch => `
              <div style="padding:14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;">
                <h3 style="margin:0 0 6px 0;">${ch.cliente ?? "-"}</h3>
                <p style="margin:0 0 8px 0;opacity:.9;">${ch.problema ?? "-"}</p>
                <small style="opacity:.75;">Status: <b>${ch.status ?? "-"}</b></small>
              </div>
            `).join("")
            : `<div style="padding:14px;border:1px solid rgba(255,255,255,.12);border-radius:12px;">Nenhum chamado cadastrado.</div>`
        }
      </div>
    `;

    setConteudo(html);
  } catch (err) {
    renderErro("Não foi possível carregar os chamados.", err);
  }
}

// =============================
// KANBAN
// =============================
async function mostrarKanbanChamados(event) {
  if (event) event.preventDefault();

  setHeader("Kanban de Chamados", "Organize os chamados por status");

  try {
    setConteudo(`<p>Carregando kanban...</p>`);

    const res = await fetch(`${API_URL}/chamados`, {
      headers: authHeaders()
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    const chamados = await res.json();

    const abertos = chamados.filter(ch => ch.status === "aberto");
    const andamento = chamados.filter(ch => ch.status === "em_andamento");
    const finalizados = chamados.filter(ch => ch.status === "finalizado");

    const renderCards = (lista, proximoStatus) => {
      if (!lista.length) {
        return `<div class="kanban-empty">Nenhum chamado</div>`;
      }

      return lista.map(ch => `
        <div class="kanban-card">
          <h4>${ch.cliente}</h4>
          <p>${ch.problema}</p>
          <small>Status: ${ch.status}</small>
          <div class="kanban-actions">
            ${proximoStatus ? `<button onclick="mudarStatusChamado(${ch.id}, '${proximoStatus}')">Mover</button>` : ""}
          </div>
        </div>
      `).join("");
    };

    setConteudo(`
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
          <h2>Kanban de Chamados</h2>
          <p style="opacity:.85;">Acompanhe o fluxo dos atendimentos</p>
        </div>
        <button onclick="mostrarCadastroChamado()" style="padding:10px 14px;">Novo chamado</button>
      </div>

      <div class="kanban-board">
        <div class="kanban-column">
          <div class="kanban-header">Aberto</div>
          ${renderCards(abertos, "em_andamento")}
        </div>

        <div class="kanban-column">
          <div class="kanban-header">Em andamento</div>
          ${renderCards(andamento, "finalizado")}
        </div>

        <div class="kanban-column">
          <div class="kanban-header">Finalizado</div>
          ${renderCards(finalizados, null)}
        </div>
      </div>
    `);
  } catch (err) {
    renderErro("Não foi possível carregar o kanban.", err);
  }
}

async function mudarStatusChamado(id, novoStatus) {
  try {
    const res = await fetch(`${API_URL}/chamados/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ status: novoStatus })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    await res.json().catch(() => null);
    mostrarKanbanChamados();
  } catch (err) {
    renderErro("Não foi possível atualizar o status do chamado.", err);
  }
}

// =============================
// AUTO START
// =============================
window.addEventListener("load", () => {
  const token = getToken();

  if (!token) {
    setHeader("Login necessário", "Acesse sua conta para continuar");
    setConteudo(`
      <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
        <h2>Você não está logado</h2>
        <p>Faça login para acessar o painel.</p>
        <a href="login.html" style="display:inline-block;margin-top:10px;">Ir para login</a>
      </div>
    `);
    return;
  }

  mostrarDashboard();
});
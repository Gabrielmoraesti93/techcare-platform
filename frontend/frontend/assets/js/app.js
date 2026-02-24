// ./assets/js/app.js

// 1) Ajuste sua API aqui:
const API_URL = "https://moraes-tech.onrender.com";

// Helpers
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
        <button onclick="mostrarClientes()">Ver clientes</button>
      </div>

      <div style="padding:16px;border:1px solid rgba(255,255,255,.15);border-radius:12px;">
        <h3>Novo Cliente</h3>
        <p style="opacity:.8">Cadastre rapidamente</p>
        <button onclick="mostrarCadastro()">Cadastrar</button>
      </div>
    </div>
  `);
}

// =============================
// CADASTRO
// =============================
function mostrarCadastro(event) {
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

// =============================
// SALVAR CLIENTE (POST)
// =============================
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    // Se a API retornar JSON, ok:
    await res.json().catch(() => null);

    if (msg) msg.textContent = "✅ Cliente salvo!";
    // Após salvar, mostra lista
    mostrarClientes();
  } catch (err) {
    renderErro("Não foi possível salvar o cliente. Verifique se a API está online e com CORS ok.", err);
  }
}

// =============================
// LISTAR CLIENTES (GET)
// =============================
async function mostrarClientes(event) {
  if (event) event.preventDefault();

  setHeader("Clientes", "Lista de clientes cadastrados");

  try {
    setConteudo(`<p>Carregando clientes...</p>`);

    const res = await fetch(`${API_URL}/clientes`);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`API respondeu ${res.status}: ${text}`);
    }

    const clientes = await res.json();

    let html = `
      <h2>Lista de Clientes</h2>
      <p style="opacity:.85">Total: <b>${Array.isArray(clientes) ? clientes.length : 0}</b></p>
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
    renderErro("Não foi possível carregar os clientes. Verifique se a API está online e se o endpoint /clientes responde.", err);
  }
}

// =============================
// AUTO START
// =============================
window.addEventListener("load", () => {
  mostrarDashboard();
});
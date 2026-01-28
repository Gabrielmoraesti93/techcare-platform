function mostrarCadastro() {
  document.getElementById("conteudo").innerHTML = `
    <h3>Cadastrar Cliente</h3>
    <input placeholder="Nome"><br><br>
    <input placeholder="Telefone"><br><br>
    <button>Salvar</button>
  `;
}

function mostrarChamado() {
  document.getElementById("conteudo").innerHTML = `
    <h3>Abrir Chamado</h3>
    <input placeholder="Problema"><br><br>
    <textarea placeholder="Descrição"></textarea><br><br>
    <button>Abrir</button>
  `;
}

function listarChamados() {
  document.getElementById("conteudo").innerHTML = `
    <h3>Lista de Chamados</h3>
    <p>Cliente: João - Status: Em andamento</p>
    <p>Cliente: Maria - Status: Finalizado</p>
  `;
}

// CRM
function cadastrarLead() {
  document.getElementById("conteudo").innerHTML = `
    <h3>Cadastrar Lead</h3>
    <input placeholder="Nome"><br><br>
    <input placeholder="Telefone"><br><br>
    <button>Salvar</button>
  `;
}

function simularMensagem() {
  alert("Mensagem enviada para o cliente via WhatsApp!");
}

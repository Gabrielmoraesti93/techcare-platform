const API_URL = "https://moraes-tech.onrender.com";

document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const msg = document.getElementById("msg");

  msg.textContent = "";

  if (!email || !senha) {
    msg.textContent = "Preencha email e senha.";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      msg.textContent = data?.error || "Erro ao logar.";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
    msg.textContent = "Erro de conexão com o servidor.";
  }
});
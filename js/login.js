document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const userInput = document.getElementById("usuario");   // <input id="user">
  const passInput = document.getElementById("contraseña");   // <input id="pass">

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = userInput.value.trim();
    const password = passInput.value;

    if (!username || !password) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      // IMPORTANTE: con barra: /login
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      // Intentamos leer el JSON aunque sea error
      let data = null;
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        // Si el servidor mandó un mensaje de error, lo mostramos
        alert((data && data.error) || `Error de login (status ${res.status})`);
        return;
      }

      // Si llegó acá, login OK -> guardar token
      localStorage.setItem("token", data.token);
      sessionStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("usuario", username);

      // Ir a index
      window.location.href = "index.html";
    } catch (err) {
      console.error("Error de red en login:", err);
      alert("No se pudo conectar con el servidor. ¿Está corriendo `node server.js`?");
    }
  });
});

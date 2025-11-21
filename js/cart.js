document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.querySelector("main .container");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let porcentajeEnvio = 0.05; 
  
  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <div class="alert alert-info text-center" role="alert">
        No hay ningún producto en el carrito.
      </div>`;
    return;
  }

  renderizarCarrito();
  actualizarCostos();

  function renderizarCarrito() {
    contenedor.innerHTML = `
      <div id="listaCarrito" class="mt-4"></div>
    
      </div>`;

    const lista = document.getElementById("listaCarrito");

    carrito.forEach((p, i) => {
      const item = document.createElement("div");
      item.className = "producto-item";
      item.innerHTML = `
        <div class="carrito-producto-info">
          <div class="d-flex align-items-center">
            <img id="imagen-producto-carrito" src="${p.imagen}">
            <div>
              <p><strong>${p.nombre}</strong></p>
              <p>Precio: ${p.costo} ${p.moneda}</p>
              <p>
                Cantidad: 
                <input class="cant form-control w-50 d-inline-block" type="number" min="1" value="${p.cantidad}" data-i="${i}">
              </p>
              <p>Subtotal: <span class="subtotal">${p.subtotal.toFixed(2)}</span> ${p.moneda}</p>
            </div>
          </div>
          <button class="btn-eliminar" data-i="${i}">Eliminar</button>
        </div>`;
      lista.appendChild(item);
    });

    document.querySelectorAll(".cant").forEach(input => {
      input.addEventListener("input", e => {
        const i = e.target.dataset.i;
        carrito[i].cantidad = parseInt(e.target.value) || 1;
        carrito[i].subtotal = carrito[i].costo * carrito[i].cantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        e.target.closest(".carrito-producto-info").querySelector(".subtotal").textContent = carrito[i].subtotal.toFixed(2);
        actualizarCostos();
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", e => {
        carrito.splice(e.target.dataset.i, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        renderizarCarrito();
        actualizarCostos();
      });
    });
  }

  function actualizarCostos() {
    const subtotal = carrito.reduce((acc, p) => acc + p.subtotal, 0);
    const costoEnvio = subtotal * porcentajeEnvio;
    const total = subtotal + costoEnvio;

    document.getElementById("subtotalGeneral").textContent = subtotal.toFixed(2);
    document.getElementById("costoEnvio").textContent = costoEnvio.toFixed(2);
    document.getElementById("totalFinal").textContent = total.toFixed(2);
  }

  document.getElementById("guardarEnvio").addEventListener("click", () => {
    porcentajeEnvio = parseFloat(document.getElementById("tipoEnvio").value);
    actualizarCostos();
  });

  document.querySelector(".btn-finalizar").addEventListener("click", () => {
    const departamento = document.getElementById("departamento").value.trim();
    const localidad = document.getElementById("localidad").value.trim();
    const calle = document.getElementById("calle").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const esquina = document.getElementById("esquina").value.trim();
    
    const formaPago = document.querySelector('input[name="pago"]:checked');
    
    let cantidadesValidas = true;
    carrito.forEach(p => {
      if (!p.cantidad || p.cantidad <= 0) {
        cantidadesValidas = false;
      }
    });

    if (!departamento || !localidad || !calle || !numero || !esquina) {
      alert("Por favor complete todos los campos de dirección");
    } else if (!cantidadesValidas) {
      alert("Todas las cantidades deben ser mayores a 0");
    } else if (!formaPago) {
      alert("Debe seleccionar una forma de pago");
    } else {
      alert("¡Compra finalizada con éxito!");
      localStorage.removeItem("carrito");
      location.reload();
    }
  });
});
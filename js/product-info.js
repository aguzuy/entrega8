document.addEventListener("DOMContentLoaded", () => {
    const prodID = localStorage.getItem("productID");
    const contenedor = document.getElementById("contenedor-prin");
    const contenedorRecs = document.getElementById("contenedor-prin-recs");
    const contenedorComs = document.getElementById("contenedor-prin-comentarios");
    const contenedorAgregarComs = document.getElementById("contenedor-prin-agregar-comentarios");
    let comNuevos= JSON.parse(sessionStorage.getItem("arrayComsNuevos") || "[]");
    let union = [];

    fetch ("https://japceibal.github.io/emercado-api/products/" + prodID + ".json")
    .then (response => {
        if(!response.ok){
            throw new Error("network response was not ok" + response.statusText)
        }
        return response.json();
    })
  
.then(data => {
  mostrarProducto(data);
  mostrarRecomendados(data);
});

window.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
});

window.addEventListener("pageshow", () => {
  actualizarContador();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {
    const nombre = document.getElementById("nombreProducto").textContent;
    const costo = parseFloat(document.getElementById("precio").textContent);
    const moneda = document.getElementById("precio").textContent.split(" ")[1];
    const imagen = document.querySelector(".carousel-slide.active img").src;

    const producto = {
      nombre,
      imagen,
      costo,
      moneda,
      cantidad: 1,
      subtotal: costo
    };

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));

    actualizarContador();
    alert("Producto agregado al carrito correctamente");
  }
});

function actualizarContador() {
  const contador = document.getElementById("contador-carrito");
  if (!contador) return;
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  contador.textContent = carrito.length;
}



    function mostrarProducto(data){
        const caja= document.createElement("div");
        caja.className = "contenedor-producto";
        caja.innerHTML=`
            <div class="cont-carrusel">
                ${data.images.map((imgSrc, index) => `
                <div class="carousel-slide ${index === 0 ? 'active' : ''}">
                    <img src="${imgSrc}" alt="${data.name} - Imagen ${index + 1}">
                </div>
                `).join('')}
                <button type="button" class="carousel-btn anterior text-3xl p-4 rounded-full"><i class="fas fa-chevron-left"></i></button>
                <button type="button" class="carousel-btn siguiente text-3xl p-4 rounded-full"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="contenedorDerecha">
                <div class="contenedorDerechaArriba">
                    <p id="categoria">Categoría: ${data.category}</p>
                    <h1 id="nombreProducto">${data.name}</h1>
                </div>
                <div class="contenedorDerechaAbajo">
                    <h1 id="precio">${data.cost} ${data.currency}</h1>
                    <p id="cantVendidos">Vendidos: ${data.soldCount}</p>
                    <button class="btn btn-agregar">Comprar</button>
                </div>
            </div>
            <div class="contenedorInferior">
                <p class="descripcionProducto">${data.description}</p>
            </div>
        ` 
        contenedor.appendChild(caja);

        // carrusel logica
        const c = caja.querySelector('.cont-carrusel');
        const slides = c.querySelectorAll('.carousel-slide');
        let i = 0;

        function mostrar(n){
            slides[i].classList.remove('active');
            i = (n + slides.length) % slides.length;
            slides[i].classList.add('active');
        }

        c.querySelector('.anterior').addEventListener('click', () => mostrar(i - 1));
        c.querySelector('.siguiente').addEventListener('click', () => mostrar(i + 1));
    }
    
    function mostrarRecomendados(data){
        contenedorRecs.innerHTML = "";
        data.relatedProducts.forEach(item => {
        const caja= document.createElement("div");

            caja.className = "contenedor-tarjeta-recomendados";
            caja.dataset.id = item.id;
            caja.innerHTML=`
            <div class="card recomendados" style="width: 18rem;">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <div class="titulo-recomendados">
                        <h5 class="card-title">${item.name}</h5>
                        <a href="#" class="btn btn-primary btn-sm btnAgregarRec" data-id="${item.id}">Más info</a>
                    </div>
                </div>
            </div>
            `
            contenedorRecs.appendChild(caja);
        })
    }

    contenedorRecs.addEventListener('click', (e) => {
        const link = e.target.closest('a.btnAgregarRec');
        if (!link || !contenedorRecs.contains(link)) return;

        const caja = link.closest('.contenedor-tarjeta-recomendados');
        const productoId = caja?.dataset.id ?? link.dataset.id;

        localStorage.setItem("productID", String(productoId));

        window.location.href = "product-info.html";
    });

    const isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const userDiv = document.getElementById("botonLogin");
    const botonReg = document.getElementById("botonRegistro");
    
    if (isLoggedIn) {
        userDiv.innerHTML = `${localStorage.getItem("usuario")}
        <img class="imagenUsuario" src="img/usuarioPerfil.png" alt="Imagen Usuario">
        `; //muestra el nombre y la imagen
        userDiv.href= "my-profile.html"; 
        botonReg.style.display= "none"; //esconde btn registro
    }
    


    //aca comentarios
    fetch ("https://japceibal.github.io/emercado-api/products_comments/" + prodID + ".json")
    .then (response => {
        if(!response.ok){
            throw new Error("network response was not ok" + response.statusText)
        }
        return response.json();
    })
    .then (comments=>{
        const arrayComs = sessionStorage.getItem("arrayComsNuevos");
        union = comments.concat(JSON.parse(arrayComs || "[]")).filter(c => String(c.product) === String(prodID));;
        if (isLoggedIn) {
            agregarComentario();
        } else {
            errorAgregarUsuario();
        }
        mostrarComentarios(union);
        escuchar();
    })

    function mostrarComentarios(comentarios){
        contenedorComs.innerHTML = ``;
        comentarios.forEach(com => {
        const caja= document.createElement("div");

            caja.className = "contenedor-comentarios";
            caja.innerHTML=`
            <div class="cont-usuario">
                <p class="com-usuario">${com.user}</p>
            </div>    
            <div class="cont-fecha">
                <p class="com-fecha">${com.dateTime}</p>
            </div>
            <div class="cont-contenido-comentario">
                <p class="com-contenido">${com.description}</p>
            </div>
            <div class="cont-rating">
            </div>
            `
            const max = 5;
            // Convierte a número y acota a 0..5
            const val = Math.max(0, Math.min(Number(com.score) || 0, max));
            const contEstrellas = caja.querySelector(".cont-rating");
            contEstrellas.innerHTML=
            `<i class="bi bi-star-fill"></i>`.repeat(val) +
            `<i class="bi bi-star"></i>`.repeat(max - val);

            contenedorComs.appendChild(caja);
        })
    }

    function errorAgregarUsuario(){
        const caja= document.createElement("div");
        caja.className = "contenedor-error";
        caja.innerHTML=`
        <h5 class="aviso-loggeo">Necesitas estar loggeado para dejar un comentario.</h5>
        <a id="irLogin" href="login.html">Login</a>
        `
        contenedorAgregarComs.appendChild(caja);
    }
    function agregarComentario(){
        const caja= document.createElement("div");
        caja.className = "contenedor-agregar-comentarios";
        caja.innerHTML=`
        <form id="form-agregar-comentarios">
            <div id="cont-nuevo-usuario">
                <label id=nombreUsuario>Nombre: ${sessionStorage.getItem("usuario")}</label>
            </div>
            <div id="cont-nuevo-contenido">
                <label id=contenidoComentario>Comentario:</label>
                <textarea id="contenido" type="text" required minlength="1" placeholder="Escribe aquí tu comentario..."></textarea>
            </div>
            <div id="cont-nuevo-rating">
                <label id=nuevoRating>Tu calificación:</label>
                <input id="rating" type="number" min="0" max="5" step="1" required />
            </div>
            <div id="cont-enviar">
                <button id="enviar">Publicar</button>
            </div>
        </form>    
        `
        contenedorAgregarComs.appendChild(caja);
    }
    function escuchar(){
        if (isLoggedIn) {
            const formEnviar = document.getElementById("form-agregar-comentarios");
                
            formEnviar.addEventListener("submit", (e) => {
                e.preventDefault();
                const contenidoNuevo = document.getElementById("contenido").value.toString().trim();
                const calificacionNueva = document.getElementById("rating").value;
                const tiempo = new Date(new Date() - new Date().getTimezoneOffset()*60000).toISOString().slice(0,19).replace('T',' ');

                comNuevos.push({
                    product: prodID,
                    score: calificacionNueva,
                    description: contenidoNuevo,
                    user: sessionStorage.getItem("usuario"),
                    dateTime: tiempo
                });
                sessionStorage.setItem("arrayComsNuevos", JSON.stringify(comNuevos));
                alert("¡Comentario publicado con exito!");
                window.location.href="product-info.html";
            })
            mostrarComentarios(union);
        }
    }
 })
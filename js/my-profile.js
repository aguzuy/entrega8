const email = localStorage.getItem("usuario");
const usuarioEmail = document.getElementById("usuarioEmail");
const usuarioNombre = document.getElementById("usuarioNombre");
const usuarioApellido = document.getElementById("usuarioApellido");
const usuarioTelefono = document.getElementById("usuarioTelefono");

function mostrarEmail() {
    usuarioEmail.innerText = email;
};

function guardarCambios() {
    localStorage.setItem("usuarioNombre", usuarioNombre.value.trim());
    localStorage.setItem("usuarioApellido", usuarioApellido.value.trim());
    localStorage.setItem("usuarioTelefono", usuarioTelefono.value.trim());
};

document.addEventListener("DOMContentLoaded", () => {
    const nombre = localStorage.getItem("usuarioNombre");
    const apellido = localStorage.getItem("usuarioApellido");
    const telefono = localStorage.getItem("usuarioTelefono");
    mostrarEmail();
    if (nombre) usuarioNombre.placeholder = nombre;
    if (apellido) usuarioApellido.placeholder = apellido;
    if (telefono) usuarioTelefono.placeholder = telefono;
});

document.getElementById("botonActualizarCambios").addEventListener("click", () => {
    guardarCambios();
});

document.addEventListener("DOMContentLoaded", function() {
    var foto = document.querySelector(".fotoDePerfil");
    var boton = document.getElementById("botonActualizarFoto");

    foto.src = localStorage.getItem("fotoPerfil") || "img/FotoPerfil.png";

    boton.addEventListener("click", function() {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", function(e) {
            var archivo = e.target.files[0];
            if(!archivo) return;
            var lector = new FileReader();
            lector.onload = function() {
                foto.src = lector.result;
                localStorage.setItem("fotoPerfil", lector.result);
            };
            lector.readAsDataURL(archivo);
        });

        input.click();
    });
});

const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";


//funcionalidad del modo oscuro y su botón

document.addEventListener("DOMContentLoaded", () => {
  const botonModo = document.getElementById("botonModo");

  if(localStorage.getItem("modo") === "dark") {
    cambiarTema("dark");
  } else {
    cambiarTema("light");
  }

  if (botonModo) {
    botonModo.addEventListener("click", () => {
      if (localStorage.getItem("modo") === "dark") {
        localStorage.setItem("modo", "light");
        cambiarTema("light")
      } else {
        localStorage.setItem("modo", "dark");
        cambiarTema("dark")
      }
    })
  }

})

/*función para cambiar los colores del style a modo claro/oscuro con las variables,
recibe el tema al que va a cambiar*/

function cambiarTema(tema) {
  if (tema === "light") {
    document.documentElement.style.setProperty("--card-background", "#FEDFC3");
    document.documentElement.style.setProperty("--main-background", "white");
    document.documentElement.style.setProperty("--main-orange", "#E98119");
    document.documentElement.style.setProperty("--medium-orange", "#F7A350");
    document.documentElement.style.setProperty("--card-border", "#7D4600");
    document.documentElement.style.setProperty("--text-color", "#000000");
    document.documentElement.style.setProperty("--input-color", "#D9D9D9");
    document.documentElement.style.setProperty("--card-main", "#f58f29");
  } else {
    document.documentElement.style.setProperty("--card-background", "#2E2E2E");
    document.documentElement.style.setProperty("--main-background", "#121212");
    document.documentElement.style.setProperty("--main-orange", "#9f5615");
    document.documentElement.style.setProperty("--medium-orange", "#9f5615");
    document.documentElement.style.setProperty("--card-border", "#2E2E2E");
    document.documentElement.style.setProperty("--text-color", "white");
    document.documentElement.style.setProperty("--input-color", "#8E8E8E");
    document.documentElement.style.setProperty("--card-main", "#1e1e1e");
  }
}

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

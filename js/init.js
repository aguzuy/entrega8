const API_BASE_URL = "http://localhost:3000";

const CATEGORIES_URL = API_BASE_URL + "/cats/cat.json";
const PUBLISH_PRODUCT_URL = API_BASE_URL + "/sell/publish.json";
const PRODUCTS_URL = API_BASE_URL + "/cats_products/";
const PRODUCT_INFO_URL = API_BASE_URL + "/products/";
const PRODUCT_INFO_COMMENTS_URL = API_BASE_URL + "/products_comments/";
const CART_INFO_URL = API_BASE_URL + "/user_cart/";
const CART_BUY_URL = API_BASE_URL + "/cart/buy.json";
const EXT_TYPE = ".json";

document.addEventListener("DOMContentLoaded", () => {
  const botonModo = document.getElementById("botonModo");

  if (localStorage.getItem("modo") === "dark") {
    cambiarTema("dark");
  } else {
    cambiarTema("light");
  }

  if (botonModo) {
    botonModo.addEventListener("click", () => {
      if (localStorage.getItem("modo") === "dark") {
        localStorage.setItem("modo", "light");
        cambiarTema("light");
      } else {
        localStorage.setItem("modo", "dark");
        cambiarTema("dark");
      }
    });
  }
});

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
  const sp = document.getElementById("spinner-wrapper");
  if (sp) sp.style.display = "block";
};

let hideSpinner = function () {
  const sp = document.getElementById("spinner-wrapper");
  if (sp) sp.style.display = "none";
};

let getJSONData = function (url) {
  let result = {};
  const token = localStorage.getItem("token");

  const options = {};
  if (token) {
    options.headers = {
      "Authorization": "Bearer " + token
    };
  }

  showSpinner();
  return fetch(url, options)
    .then(response => {
      // Si el backend dice 401, limpiamos token y mandamos a login
      if (response.status === 401) {
        console.error("No autorizado, redirigiendo a login...");
        localStorage.removeItem("token");
        window.location.href = "login.html";
        throw new Error("Unauthorized");
      }

      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText || response.status);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      console.error("Error en getJSONData:", error);
      hideSpinner();
      return result;
    });
};

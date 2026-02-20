// import { loadNav } from '/Frontend/src/Components/Nav/nav.js';
import { initLoginRegister } from '/Frontend/src/assets/js/loginRegister.js';
export async function initAuthNav() {
  const token = localStorage.getItem("token");
  if (!token) {
    loadNav();
    initLoginRegister();
    return;
  }
  console.log(token)
  await loadLoginNav();
}
let cart = JSON.parse(localStorage.getItem("cart")) || [];

export async function loadNav() {
  try {
    const response = await axios.get('/Frontend/src/Components/Nav/nav.html');
    const styleNav = document.createElement("link");
    styleNav.rel = "stylesheet"
    styleNav.href = "/Frontend/src/Components/Nav/nav.css";
    document.head.appendChild(styleNav);
    document.getElementById('nav-container').innerHTML = response.data;
    const cartNumber = document.querySelector(".cart-number");
    const toggleScript = document.createElement('script');
    toggleScript.src = "/Frontend/src/assets/js/toggleHome.js";
    document.body.appendChild(toggleScript);

    const modalScript = document.createElement('script');
    modalScript.src = "/Frontend/src/assets/js/modalLogin.js";
    document.body.appendChild(modalScript);
    if(cart.length > 0){
      cartNumber.style.display = "flex";
      cartNumber.textContent = cart.length;
    }
  } catch (error) {
    console.log(error)
  }
}

async function loadLoginNav() {
  try {
    const response = await axios.get('/Frontend/src/Components/LoginNav/loginNav.html');
    document.getElementById('nav-container').innerHTML = response.data;

    const btnLogout = document.querySelectorAll("#btn-logout");
    if (btnLogout) {
      btnLogout.forEach((btn) => {
        btn.addEventListener("click", () => {
          localStorage.removeItem("token");
          window.location.reload();
        });
      });
    }
    const toggleScript = document.createElement('script');
    toggleScript.src = "/Frontend/src/assets/js/toggleHome.js";
    document.body.appendChild(toggleScript);
    const cartNumber = document.querySelector(".cart-number");
    if(cart.length > 0){
      cartNumber.style.display = "flex";
      cartNumber.textContent = cart.length;
    }

  } catch (error) {
    console.log(error);
  }
}

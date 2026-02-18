let cart = JSON.parse(localStorage.getItem("cart")) || [];

export async function loadNav() {
  try {
    const response = await axios.get('/Frontend/src/Components/Nav/nav.html');
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
const addToggleNav = () => {
  const js = [
    "/Frontend/src/assets/js/modalLogin.js",
    "/Frontend/src/assets/js/logout.js",
     "/Frontend/src/assets/js/toggleHome.js"
  ]
  js.forEach(path => {
    const script = document.createElement("script");
    script.src = path;
    script.defer = true;
    document.body.appendChild(script);
  });
}


const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const imgElement = document.getElementById("plant-img");
const nameElement = document.querySelector(".product-title");
const priceElement = document.querySelector(".product-price");
const descriptionElement = document.querySelector(".product-description");
const categoryElement = document.querySelector(".product-category");
const wideElement = document.querySelector(".product-wide");
const highElement = document.querySelector(".product-high");
const amountElement = document.querySelector(".product-amount");

const qtyArea = document.querySelector('.quantity-area');
const textArea = document.querySelector('.text-area')
export async function searchProduct() {
  try {
    const response = await axios.get(`http://localhost:8000/api/product_id/${id}`)
    const data = response.data;
    const btn = document.createElement(button);
    btn.className = 'btn add-cart';
    btn.textContent = 'Add to cart';
    const {
      name, price, amount, description, img, light_type_id: category, wide, high
    } = response.data;
    imgElement.src = "/Backend/server/uploads/" + img;
    nameElement.textContent = name;
    priceElement.textContent = price + "THB";
    descriptionElement.textContent = description;
    categoryElement.textContent = category;
    wideElement.textContent = wide + `"`;
    highElement.textContent = high + `"`;
    amountElement.textContent = amount + ` remaining`;
    qtyArea.appendChild(btn);
    btn.dataset.id = plant_id;
    btn.dataset.stock = amount;
  } catch (error) {
      console.log(`error`+error)
  }

}


textArea.addEventListener('click',(e)=>{
  const btn = e.target.closest('.add-cart');
  if(!btn) return;
  console.log(`id=`+id)
    componentCart.addTocart(id,stock);
})

import {componentCart} from '/Frontend/src/assets/js/addTocart.js';

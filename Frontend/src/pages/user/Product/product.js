import {componentCart} from '/Frontend/src/assets/js/addTocart.js';

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
const componentnElement = {
  "img" : document.getElementById("plant-img"),
  "name" : document.querySelector(".product-title"),
  "price" : document.querySelector(".product-price"),
   "description" : document.querySelector(".product-description"),
 "category" : document.querySelector(".product-category"),
 "wide" : document.querySelector(".product-wide"),
 "height" : document.querySelector(".product-high"),
 "amount" : document.querySelector(".product-amount"),

}
const btn = document.createElement('button');
const qtyArea = document.querySelector('.quantity-area');
const textArea = document.querySelector('.text-area')

export async function searchProduct() {
  try {
    const response = await axios.get(`http://localhost:8000/api/product_id/${id}`)
    const data = response.data;
    
    btn.className = 'btn add-cart';
    btn.textContent = 'Add to cart';
    const {
      name, price, amount, description, img, light_type_id: category, wide, high
    } = response.data;
    qtyArea.dataset.stock = amount;
    componentnElement.img.src = "/Backend/server/uploads/" + img;
    componentnElement.name.textContent = name;
    componentnElement.price.textContent = price + "THB";
    componentnElement.description.textContent = description;
    componentnElement.category.textContent = category;
    componentnElement.wide.textContent = wide + `"`;
    componentnElement.height.textContent = high + `"`;
    componentnElement.amount.textContent = amount + ` remaining`;
    qtyArea.appendChild(btn);
    componentCart.qtyControl()
    
  } catch (error) {
      console.log(`error`+error)
  }

}


textArea.addEventListener('click',(e)=>{
  const btn = e.target.closest('.add-cart');
  if(!btn) return;
  const qty = Number(document.querySelector('.qty-number').value);
  componentCart.productAdd(id,qty);
})



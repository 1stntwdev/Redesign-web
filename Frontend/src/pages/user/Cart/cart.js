import { componentCart } from '/Frontend/src/assets/js/addTocart.js';

const cartArea = document.querySelector('.cart-area');

let cart = getCart();
const ids = cart.map(item => Number(item.id)) // convert {id} to API req

cartArea.addEventListener('click', (e) => {
  const productItem = e.target.closest('.item');
  if (!productItem) return;
  const id = productItem.dataset.id;
  const maxStock = productItem.dataset.amount;
  const qtyLabel = productItem.querySelector('.qty-number');

  if (e.target.classList.contains('plus')) {
    let currentQty = Number(qtyLabel.value);
    if (currentQty >= maxStock) {
      alert('สินค้าไม่พอ');
      return;
    }
    currentQty++
    qtyLabel.value = currentQty;
    updateQty(id, currentQty);
    orderSummary();

  }
  if (e.target.classList.contains('minus')) {
    let currentQty = Number(qtyLabel.value);
    if (currentQty > 1) {
      currentQty--;
      qtyLabel.value = currentQty;
      updateQty(id, currentQty);
      orderSummary();

    }
  }
})


// call dom
const listItem = document.querySelector('.list-item');
const delBtnall = document.createElement("button");
delBtnall.innerText = "Delete All";
delBtnall.classList.add("delCartall");
listItem.appendChild(delBtnall);

listItem.addEventListener('click', handleCartClick)
function handleCartClick(e) {
  const delitem = e.target.closest('.del-item');
  const delAll = e.target.closest('.delCartall'); 
  if (delitem) {
    removeItem(delitem.dataset.id)
  }
  if (delAll) {
    removeAll();
  }
}
function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart));
  componentCart.setStyle();
  renderCart();
  if(cart.length >= 1) listItem.appendChild(delBtnall);
}
function removeAll() {
  localStorage.removeItem("cart");
  componentCart.setStyle();
  renderCart();
  
}

const orderArea = document.querySelector('.order-area');
function checkEmptyCart(){
 let cart = getCart();
  const cartContainer = document.querySelector('.cart-area');
  if (cart.length === 0) {
    //Change Style
    orderArea.style.display = "none";
    cartContainer.style.gridTemplateColumns = "1fr";
    const createImg = document.createElement("img");
    createImg.src = "/Frontend/src/assets/img/empty-cart.png";
    createImg.style.width = "150px";
    createImg.style.height = "150px";
    listItem.innerHTML = `
    <div style="
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
"> 
    <img src="/Frontend/src/assets/img/empty-cart.png" width="250" height="250">
    <p>Your cart is Empty</p>
    </div>
    `;

    return;
  }
}
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  listItem.innerHTML = "";
  checkEmptyCart();
  const array = []
  cart.forEach(element => {
    array.push(element.id)
  })
  const id = array.map(id => Number(id))
  displayItem(id);
}
const displayItem = async (ids) => {
  checkEmptyCart();
  try {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    // fill id to API
    
    const response = await axios.post('http://localhost:8000/api/getProducts', { id: ids })
    const data = response.data;

    if (data.length >= 1) {
      delBtnall.style.display = "block";
    }
    // loop api
    data.forEach(element => {
      const foundItem = currentCart.find(
        // value cart = [{id:'15',qty:1}[]
        item => Number(item.id) === element.plant_id
      );
      const qtyValue = foundItem.qty ? foundItem.qty : 1;
      const row =
        `<div class="item" data-id="${element.plant_id}" data-amount="${element.amount}">
            <img src="/Backend/server/uploads/${element.img}" alt="" width="150" height="150" >
            <div class="product-info">
              <div class="name"><p>name: <span>${element.name}</span></p></div>
              <div class="cat"><p>category: <span>${element.light_type_id}</span></p></div>
              <div class="price"><p>price: <span>${element.price} THB</span></p></div>
            </div>
            <div class="quantity-box">
              <button class="qty-btn minus">-</button>
              <input type="number" class="qty-number"  value="${qtyValue}" min=1 max=5>
              <button class="qty-btn plus">+</button> 
              </div>
              <a class="del-item" data-id="${element.plant_id}"><img src="/Frontend/src/assets/icons/delete.png" alt="" width="32" height="32" ></a>
          </div>`
      listItem.innerHTML += row;
    });
    
  } catch (error) {
    console.log(`some thing error`, error)
  }
}
const updateQty = (id, newQty) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  // check id in array
  const index = cart.findIndex(item => item.id === id);
  // Not found product in cart
  if (index !== -1) {
    cart[index].qty = newQty;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  componentCart.setStyle();
}

displayItem(ids)


// ดึงข้อมูล ราคา จำนวน 
// คำนวณ
// แทนค่า

function getCart(){
  return JSON.parse(localStorage.getItem("cart")) || [];
}
const totalNum = document.querySelector('.subTotal-number');
const totalPayment = document.querySelector('.total-payment');
const vat = document.querySelector('.vat-number');
let shipping = 200;

const orderSummary = async () =>{
  let localcart = getCart();
 
 
    const response = await axios.post('http://localhost:8000/api/getProducts', { id: ids })
    const data = response.data;
    
    
    let total = 0;
    data.forEach(product =>{
      const foundItem  = localcart.find(
        item => Number(item.id) === product.plant_id
      )
      if(foundItem){
        total += product.price * foundItem.qty
      }
    })
    vat.textContent = Math.round((total*0.07)) + " THB";
   totalNum.textContent = total +" THB";
   totalPayment.textContent = (total*0.07) + shipping + total +' THB';
  
  console.log(total);
  }
orderSummary();
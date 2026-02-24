import {componentCart} from '/Frontend/src/assets/js/addTocart.js';

const cartArea = document.querySelector('.cart-area');
const cart = JSON.parse(localStorage.getItem("cart")) || [];
const ids = cart.map(item => Number(item.id)) // convert {id} to API req

cartArea.addEventListener('click',(e)=>{
  const productItem = e.target.closest('.item');
  if(!productItem) return;
  const id = productItem.dataset.id;
  const maxStock = productItem.dataset.amount;
  const qtyLabel = productItem.querySelector('.qty-number');
  
  if(e.target.classList.contains('plus')){
     let currentQty = Number(qtyLabel.value);
   if(currentQty >= maxStock) {
    alert('สินค้าไม่พอ');
    return;
   }
   currentQty++
   qtyLabel.value = currentQty;
   updateQty(id, currentQty); 
  
  }
  if(e.target.classList.contains('minus')){
    let currentQty = Number(qtyLabel.value);
    if(currentQty > 1){
      currentQty--;
      qtyLabel.value = currentQty;
      updateQty(id, currentQty); 
    }
  }
})
// call dom
const listItem = document.querySelector('.list-item');
// get id in cart
const displayItem = async (ids) => {
  try {
    // fill id to API
    const response = await axios.post('http://localhost:8000/api/getProducts', { id: ids })
    const data = response.data;
    
    // loop api
    data.forEach(element => {
    const foundItem = cart.find(
    // value cart = [{id:'15',qty:1}[]
    item => Number(item.id) === element.plant_id
  );
 const qtyValue = foundItem.qty ? foundItem.qty : 1;

 const row =
        `<div class="item" data-id="${element.plant_id}" data-amount="${element.amount}">
            <img src="/Backend/server/uploads/${element.img}" alt="" width="150" height="150" >
            <div class="product-info">
              <div class="name"><p>name: <span>${element.name}</span></p></div>
              <div class="cat"><p>category: <span>${element.category}</span></p></div>
              <div class="price"><p>price: <span>${element.price} THB</span></p></div>
            </div>
            <div class="quantity-box">
              <button class="qty-btn minus">-</button>
              <input type="number" class="qty-number"  value="${qtyValue}" min=1 max=5>
              <button class="qty-btn plus">+</button> 
            </div>
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
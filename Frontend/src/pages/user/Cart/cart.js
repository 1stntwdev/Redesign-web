const cartArea = document.querySelector('.cart-area');
const cart = JSON.parse(localStorage.getItem("cart")) || [];

const ids = cart.map(item => Number(item.id)) // convert {id} to API req
console.log(ids);

cartArea.addEventListener('click', (e) => {
  if (e.target.classList.contains('plus')) {
    const productItem = e.target.closest('.item');
    const maxStock = Number(productItem.dataset.amount)

    const qty = productItem.querySelector('.qty-number');
    if(qty.value >= maxStock){
      alert('สินค้าไม่พอ')
    }else{
      qty.value = Number(qty.value) + 1;
    }

  }
  if (e.target.classList.contains('minus')) {
    const productItem = e.target.closest('.item');
    const qty = productItem.querySelector('.qty-number');
    qty.value = Number(qty.value) - 1;
    console.log(typeof (qty.value))
    if (Number(qty.value) <= 1) {
      qty.value = 1;
    }
  }
})
// call dom
const img = document.querySelector('.item-img');
const name = document.querySelector('.item-name');
const category = document.querySelector('.item-category');
const price = document.querySelector('.item-price');
const listItem = document.querySelector('.list-item');

// get id in cart
const displayItem = async (ids) => {
  try {
    // fill id to API
    const response = await axios.post('http://localhost:8000/api/getProducts', { id: ids })
    const data = response.data;
    console.log(data)

    // loop api
    data.forEach(element => {
    const foundItem = cart.find(
      // value cart = [{id:'15',qty:1}[]
    item => Number(item.id) === element.plant_id
  );
  console.log('found',foundItem)
 const qtyValue = foundItem.qty ? foundItem.qty : 1;

      const row =
        `<div class="item" data-amount="${element.amount}">
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
    console.log(`qty`+foundItem)
      listItem.innerHTML += row;
    });
  } catch (error) {
    console.log(`some thing error`, error)
  }
}


displayItem(ids)
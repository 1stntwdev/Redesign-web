
export const componentCart = {
  addTocart: (id, stock) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    // check id in array
    const index = cart.findIndex(item => item.id === id);
    // Not found product in cart
    if (index === -1) {
      if (stock > 0) {
        cart.push({
          "id": id,
          "qty": 1
        })
      } else {
        alert('สินค้าหมด');
        return;
      }
      // found product in cart qty+1
    } else {
      if (cart[index].qty + 1 <= stock) {
        cart[index].qty += 1;
      } else {
        alert('สินค้าหมด');
        return;
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    componentCart.setStyle();
    console.log(cart)
  },
  setStyle: () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartNumber = document.querySelector(".cart-number");
    if (!cartNumber) return;
    cartNumber.style.display = "flex";
    const totalQty = cart.reduce((sum, item) => {
      return sum + item.qty;
    }, 0);
    cartNumber.textContent = totalQty;
    if (cart.length === 0){
      cartNumber.style.display = "none";
    }
  },

  // Feat for product.html
  qtyControl: () => {
    const qtyArea = document.querySelector('.quantity-area');

    qtyArea.addEventListener('click', (e) => {

      let maxStock = Number(qtyArea.dataset.stock);
      const qtyLabel = qtyArea.querySelector('.qty-number');

      if (e.target.classList.contains('plus')) {
        let currentQty = Number(qtyLabel.value);
        if (currentQty >= maxStock) {
          alert('สินค้าไม่พอ');
          return;
        }
        currentQty++
        qtyLabel.value = currentQty;
      }
      if (e.target.classList.contains('minus')) {
        let currentQty = Number(qtyLabel.value);
        if (currentQty > 1) {
          currentQty--;
          qtyLabel.value = currentQty;
        }
      };
    })
  },
  // Feat for product.html
  productAdd: (id, qty) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(item => item.id === id);
    // product not in cart
    if (index === -1) {
      cart.push({
        id: id,
        qty: qty
      });
      // product in cart already set qty
    } else {
      cart[index].qty = qty;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}









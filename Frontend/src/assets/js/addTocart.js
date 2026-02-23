export const componentCart = {
  addTocart: (id, stock) => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(`cart = ${cart}`)
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
  componentCart.setStyle(cart.length);
  console.log(cart)
},
setStyle: (length)=>{
   const cartNumber = document.querySelector(".cart-number");
  if(!cartNumber) return;
  cartNumber.style.display = "flex";
  cartNumber.textContent = length;
}
}









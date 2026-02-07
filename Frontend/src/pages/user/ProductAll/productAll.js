export async function loadNav() {
  try {

    const response = await axios.get('/Frontend/src/Components/Nav/nav.html');

    document.getElementById('nav-container').innerHTML = response.data;
    const toggleScript = document.createElement('script');
    toggleScript.src = "/Frontend/src/assets/js/toggleHome.js";
    document.body.appendChild(toggleScript);

    const modalScript = document.createElement('script');
    modalScript.src = "/Frontend/src/assets/js/modalLogin.js";
    document.body.appendChild(modalScript);
  } catch (error) {
    console.log(error)
  }
}

let currentPage = 1;
let totalPages = 1;
// get

export async function selectShow(){
  
  const viewList = document.getElementById("viewList");
  viewList.addEventListener('change', async (event)=>{
  const productShow = event.target.value;
  // API fetch dynamic follow productShow;
  try {
    await loadProduct(1,productShow);
  } catch (error) {
  }
})
}


  // ส่ง api

  // loadProduct
export async function loadProduct(page = currentPage,productShow = 6) {
 

  const content = document.getElementById('product-display');

  try {
    console.log('เริ่ม function loadProduct')
    
    const response = await axios.get('http://localhost:8000/api/productPagination', {
      params: {
        page: page,
        product: productShow
      }
    });
    const result = response.data;
    const data = result.data;
    totalPages = result.totalPages;
    currentPage = result.currentPage;

    if(data.length === 0){
      currentPage --
      return;
    }
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; 
    let description ='';
    let nameDiv;
    data.forEach(element => {
      if(element.description.length > 60){
        let descriptionCut = element.description.slice(0, 50);
        description = `<div class="description"><span>${descriptionCut}... </span></div>`;
      }else{
        description = `<div class="description"><span>${element.description}</span></div>`;
      }
      const nameDiv = element.name.length >= 20 ? 
      element.name.slice(0,19)+"..." :
      element.name
      
      const row = `<div class="card-grid-container">
      <div class="card-area">
      <div class="img-card">
        <img src="/Backend/server/uploads/${element.img}" width=50px>
      </div>
       <div class="name"><p>${nameDiv}</p></div>
       
       ${description}
       <div class="name"><span>${element.price} THB</span>
       <button class="add-to-cart" data-id="${element.plant_id}"> <i class="fa-solid fa-cart-plus"></i>
       </button>
       </div>
       </div>
  </div>`
  productContainer.innerHTML += row;
});
renderPaginationNumbers();    
  } 
  catch (error) {
    console.log(error)
  }
}

const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');

function renderPaginationNumbers(){
  const runNumber = document.querySelector('.run-number');
  // ดักตอนฟังชันก์ทำงาน ให้รีเซ็ทปุ่ม 1 2 3 ค่อยใส่ใหม่
  runNumber.innerHTML = '';
// สร้างปุ่ม 
  for (let i = 1; i <= totalPages; i++) {
    const btnNumber = document.createElement("button");
    btnNumber.textContent = i;
    runNumber.append(btnNumber);
    if(i === currentPage) {
      btnNumber.classList.add("activeNumberBtn");
    }
    btnNumber.addEventListener("click",()=>{
      currentPage = i;
      loadProduct(currentPage);
    })
  }
}
export function setupPagination() {
  nextBtn.addEventListener('click', () => {
    currentPage++
    loadProduct(currentPage);
  });
  prevBtn.addEventListener('click', () => {
    currentPage--
    if (currentPage <= 0) {
      currentPage = 1;
    }
    loadProduct(currentPage);
  });
}

const productContainer = document.getElementById('product-container');
productContainer.addEventListener('click',(e)=>{
  const btn = e.target.closest('.add-to-cart');
  if(!btn) return;
  const plantId = btn.dataset.id; 
  addTocart(plantId);
})
let cart = [];
function addTocart(plantId){
  console.log(`add`,plantId);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (!cart.includes(plantId)) {
    cart.push(plantId);
  }else{
    // ถ้ามีสินค้า ให้เพิ่มจำนวนแทน data id ของจำนวน
    
    console.log(`add qyt`)
  }
  console.log(cart);
}
window.loadProduct = loadProduct; 
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
export async function loadProduct(page = 1) {

  const content = document.getElementById('product-display');

  try {
    console.log('เริ่ม function onload')
    const response = await axios.get('http://localhost:8000/api/productPagination', {
      params: {
        page: page,
      }
    });
    const data = response.data
    if(data.length === 0){
      currentPage --
      return;
    }
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; 
    data.forEach(element => {
      const row = `<div class="card-grid-container">
    <div class="card-area">
      <div class="img-card">
        <img src="/Backend/server/uploads/${element.img}" width=50px>
      </div>
       <div class="name"><h4>name : ${element.name}</h4></div>
       <div class="name"><h4>price : ${element.price}</h4></div>
       </div>
  </div>`
      productContainer.innerHTML += row;
    });
    console.log(`response `, response.data)

  } catch (error) {
    console.log(error)
  }
}
export function setupPagination() {
  const nextBtn = document.getElementById('btn-next')

  nextBtn.addEventListener('click', () => {
    currentPage++
    loadProduct(currentPage);
    // count range
  });

  const prevBtn = document.getElementById('btn-prev')
  prevBtn.addEventListener('click', () => {
    currentPage--
    if (currentPage <= 0) {
      currentPage = 1;
    }
    loadProduct(currentPage);
  });
}
window.loadProduct = loadProduct; 
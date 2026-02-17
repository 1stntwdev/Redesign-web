export const components = {
  loadNav: async () => {
    try {
      const navElement = document.getElementById("nav-container");
      const response = await axios.get("/Frontend/src/Components/Nav/nav.html");
      navElement.innerHTML = response.data;
      addToggleNav()
      addStyleNav();
      
    } catch (error) {
      console.error(`somethinh erro loadNav`, error)
    }
  }
}
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
function addStyleNav() {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/Frontend/src/Components/Nav/nav.css";

  const linkModal = document.createElement("link");
  linkModal.rel = "stylesheet";
  linkModal.href = "/Frontend/src/assets/css/myLoginModal.css";

  document.head.appendChild(link);
  document.head.appendChild(linkModal);
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

export async function searchProduct(){
  const response = await axios.get(`http://localhost:8000/api/product_id/${id}`)
  const data = response.data;
  
  const {
    name ,price,amount , description ,img ,light_type_id:category,wide,high
  }  = response.data ;
  imgElement.src = "/Backend/server/uploads/"+img;
  nameElement.textContent = name;
  priceElement.textContent = price + "THB";
  descriptionElement.textContent = description;
  categoryElement.textContent = category;
  wideElement.textContent = wide +`"`;
  highElement.textContent = high+`"`;
  
}
  

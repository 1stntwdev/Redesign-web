import { loadProducts } from './fetchProduct.js';
import { initInsertProduct } from './insertAPI.js';

const route = (event) => {
    event.preventDefault(); 
    window.history.pushState({}, "", event.currentTarget.href);     // เปลี่ยน URL บนแถบ Address bar
    handleLocation(); 
};

const routes = {
    "/": "/src/pages/admin/dashboard_content/dashboard_content.html",
    "/manageProduct": "/src/pages/admin/Insert/insert.html",
    "/fetch": "/src/pages/admin/Product/product.html",
    "/edit":"/src/pages/admin/Edit/edit.html",
    "404": "/src/pages/admin/ErrorPage/errorPage.html",
};

export const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];

    try{
        const response = await fetch(route);
        const html = await response.text();
        const main = document.getElementById("main-content");
        main.innerHTML = html;
       switch (path) {
      case '/fetch':
        await loadProducts();
        break;

      case '/manageProduct':
        initInsertProduct();
        break;

      default:
        break;
    }
       
    }catch(error){
        console.error("Fetch error:", error);
    }
}

// window.loadProducts = loadProducts; 
window.onpopstate = handleLocation; // รองรับการกดปุ่ม Back/Forward ของ Browser
window.route = route;
handleLocation();

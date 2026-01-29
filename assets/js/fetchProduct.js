export const loadProducts = async () => {
    try {
        // console.log('เริ่ม function onload')
        const response = await fetch('/api/fetchAll');
        const products = await response.json();

        const tableBody = document.getElementById('product-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';

        products.forEach(pd => {
            const row = `
                <tr>
                    <td><img src="/uploads/${pd.img}" width="50"></td>
                    <td>${pd.name}</td>
                    <td>${pd.price} บาท</td>
                    <td>
                        <button onclick="editProduct(${pd.plant_id})" href="/edit">Edit</button>
                        <button onclick="deleteProduct(${pd.plant_id})">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Fetch error:", error);
    }
};
const deleteProduct = async(id)=>{
    try{
        const respone = await fetch(`/api/delete/${id}`,{
            method:"DELETE"
        });
        if(respone.ok) {
            alert('Product has been delete');
            location.reload();
        }
    }catch(error){
        console.error('something wrong',error)
    }
}

async function editProduct(id){
    
    try {
        const routes = {"/edit":"/src/pages/admin/Edit/edit.html"};
        const route = routes["/edit"];
        
        window.history.pushState({}, "", `/edit/${id}`);
        
        // ส่งไอดีไปหน้า edit.html
        const responseRoute = await fetch(route);
        const html = await responseRoute.text();
        document.getElementById("main-content").innerHTML = html;
        const nameDetail = document.querySelector(".naming-details");
        const priceDetail = document.querySelector(".pricing-details");
        const mediaDetail = document.querySelector(".media-details");
        const categoryElement = document.getElementById("category");
        
        // รับไอดี
        const response = await fetch(`/api/product_id/${id}`);
        const products = await response.json();
        nameDetail.innerHTML = '';
        categoryElement.value = products.light_type_id;

        console.log('product',products)
        // เรียกข้อมูลปัจจุบันใส่ฟอร์ม + รูปภาพ
       
            nameDetail.innerHTML = 
            ` <h3>Insert General Information</h3>
      <label for="name" >Product Name<input type="text" name="name" value="${products.name}" id="name"></label>
      <label for="description" >Description<input type="text" id="description" name="description" value="${products.description}"></label>
      <label for="high">high size<input type="text" name="high" id="high"  value="${products.high}"></label>
      <label for="high">high size<input type="text" name="wide" id="wide" value="${products.wide}"></label>`;
      priceDetail.innerHTML =
      ` <h3>Price</h3>
      <label for="price">Base Price<input type="text" id="price" name="price" value=${products.price}></label>`;
      
if (mediaDetail) {
    mediaDetail.innerHTML = `
        <h3>Product Media</h3>
        <div class="current-image">
            <label>รูปภาพปัจจุบัน:</label>
            <img src="/uploads/${products.img}" 
                 alt="${products.name}" 
                 style="max-width: 200px; display: block; margin: 10px 0; border: 1px solid #ddd; padding: 5px;">
            <p style="color: #666; font-size: 14px; margin: 5px 0;">
                📁 ไฟล์: <code>${products.img}</code>
            </p>
        </div>
        <div class="img-details" style="margin-top: 15px;">
            <label for="product_pic" style="font-weight: bold;">
                เปลี่ยนรูปภาพ (ถ้าต้องการ)
            </label>
            <small style="display: block; color: #666; margin: 5px 0;">
                หากไม่เลือกไฟล์ใหม่ จะใช้รูปเดิม
            </small>
            <input type="file" 
                   id="product_pic"
                   name="photo"
                   accept=".jpg, .jpeg, .png, .webp">
            <input type="hidden" name="current_img" value="${products.img}">
        </div>
    `;
}
    } catch (error) {
        console.error('error',error)
    }
}
async function updateProduct(event) {
    event.preventDefault(); 
    const form = event.target;
    console.log('eveent target = ',form);
    const formData = new FormData(form);
    console.log('new formData = ',formData);
    // ดึงไอดีด้วย path/id
    const path = window.location.pathname; 
    const id = path.split('/')[2];
    
    try {
        const response = await fetch(`/api/update/${id}`, {
            method: 'PUT',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('อัปเดทสำเร็จ!');
            window.history.pushState({}, "", "/fetch");
            window.location.href = '/fetch';
        } else {
            alert(data.error || 'เกิดข้อผิดพลาด');
        }
        
    } catch (error) {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
       
    }
}

window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;


export const components ={
  loadNav : async()=>{
    const navElement = document.getElementById("nav-container");
    console.log("work")
    const response = await axios.get("/Frontend/src/Components/Nav/nav.html");
    navElement.innerHTML = response.data;
    addStyleNav();
  }
}
function addStyleNav(){
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/Frontend/src/Components/Nav/nav.css";
  document.head.appendChild(link);
}
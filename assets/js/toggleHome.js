const barElemet = document.querySelector(".toggle-icon");
const mobileMenu = document.querySelector(".mobile-menu");
const toggleBar = document.querySelector("#toggle-bar");

console.log(barElemet)
barElemet.addEventListener("click",()=> {
  mobileMenu.classList.toggle('active');

  if(mobileMenu.classList.contains('active')){
    // เปลี่ยน แฮมเบอเกอร์ไอคอนเป็น X class="fa-solid fa-bars" -> fa-times
      toggleBar.classList.remove('fa-bars');
      toggleBar.classList.add('fa-times');
    }
    else{
      toggleBar.classList.remove('fa-times');
      toggleBar.classList.add('fa-bars');
    }
});


function toggleNav(){
  
}
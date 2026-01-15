 var swiper = new Swiper(".mySwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      breakpoints: {
    // เมื่อหน้าจอกว้าง >= 480px
   
   
    650: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
     1024:{
      slidesPerView: 4,
      spaceBetween: 20,
    },
  }

    });
const modalRegister = document.getElementById('myRegisterModal');
const registerBtn = document.getElementById('btn-register');

const modalLogin = document.getElementById('myLoginModal');
const loginBtn = document.getElementById('btn-login');

const btnClose = document.querySelectorAll('.closeBtn');

const loginBtnMobile = document.getElementById('btn-login-mobile');
const registerBtnMobile = document.getElementById('btn-register-mobile');

const signUp = document.getElementById('signUp');
signUp.onclick = () =>{
  modalLogin.close();
  modalRegister.showModal();
}
registerBtn.onclick = () => modalRegister.showModal();
loginBtn.onclick = () => modalLogin.showModal();

loginBtnMobile.onclick = () => {
  modalLogin.showModal();
  closeNavMobile();
}
registerBtnMobile.onclick = () => {
  modalRegister.showModal();
  closeNavMobile();
}

modalRegister.onclick =(event)=>{
  if (event.target === modalRegister){
    modalRegister.close();
  }
};
const navMobile = document.querySelector('.mobile-menu');
function closeNavMobile(){
  if(navMobile){
    navMobile.classList.remove('active')
  }
}

modalLogin.onclick = (event)=>{
  event.target === modalLogin?modalLogin.close():"";
}
 
btnClose.forEach(btn => {
  btn.onclick = () => {
    modalRegister.close();
    modalLogin.close();
  };
});
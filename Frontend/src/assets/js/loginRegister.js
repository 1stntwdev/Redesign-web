
export function initLoginRegister(){

 console.log("INIT RUNNING", Date.now());
  document.addEventListener("submit",(e)=>{
    if(e.target.id === "registerForm" || e.target.id === "btn-register-mobile")  {
      register(e)
      e.preventDefault()
      // console.log(e)
      // console.log("inject submit");
    }
    if(e.target.id === "loginForm"|| e.target.id === "btn-login-mobile"){
      e.preventDefault()
      // console.log("login submit");
      login(e)
    }
  })
}

let errrMsg = document.getElementById('loginError');
 async function login(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.querySelector('input[name=username]').value;
  const password = form.querySelector('input[name=password]').value;
  try {
    const response = await axios.post('http://localhost:8000/login', {
      username: username,
      password: password
    });

    console.log('Response status:', response.status);
    if (response.status === 200) {
      alert('Login successful!');

      document.getElementById('myLoginModal').close();

      localStorage.setItem('token', response.data.token);

      window.location.replace('/Frontend/src/pages/user/Home/index.html');
  //  loadLoginNav();
     
    }
  } catch (error) {
    if (error.response) {
      // show status
      console.log(error.response)
      const messageError = error.response.data.message;
      errrMsg.style.display = "inline-block";
      errrMsg.querySelector('.msg').textContent = messageError;
    }
  }
}
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);

}
function checkPasswordmatch(pwd, confirmPwd, displaypwdInvalid) {
  if (pwd === confirmPwd) {
    displaypwdInvalid.style.display = "none";  // ✅ ซ่อน error ถ้าตรงกัน
    return true;  // ✅ เปลี่ยนเป็น true แทน pwd
  } else {
    displaypwdInvalid.style.display = "block";
    return false;
  }
}
 async function register(event) {
  event.preventDefault();
  const nameElent = document.querySelector('[name="name"]');
  const name = document.querySelector('[name="name"]').value;
  const email = document.querySelector('[name="email"]').value;
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirmPassword').value;

  // css change
  const emailInput = document.querySelector('#input-email');
  const nameInput = document.querySelector('#input-name');
  const displayemailInvalid = document.querySelector('.email-invalid');
  const displaypwdInvalid = document.querySelector('.pwd-invalid');

  const validEmail = validateEmail(email);
  const isPasswordMatch = checkPasswordmatch(password, confirmPassword, displaypwdInvalid);
  const modalRegister = document.getElementById('myRegisterModal');
  if (!validEmail) {
    displayemailInvalid.style.display = "block";
    emailInput.classList.add("input-error");
    return;
  }
  if (!isPasswordMatch) {
    console.log('Password not match');
    return;
  }
  try {
    const response = await axios.post('http://localhost:8000/register',
      {
        username: name,
        email: email,
        password: password
      });
    console.log("res =", response)
    if (response.status === 201) {
      alert('Register Success');
      event.target.reset();
      modalRegister.close();
    }
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    if (status === 409) { //  error status 409/5xx axios throw to catch 

      nameElent.style.color = "red";
      nameElent.classList.add("input-error");
      nameElent.value = message;
    }
    else {
      console.log('Unexpected error:', error);
    }
  }
}


// export async function loadLoginNav() {
//   try {
//     const response = await axios.get('/Frontend/src/Components/LoginNav/loginNav.html');
//     document.getElementById('nav-container').innerHTML = response.data;
   
    
//   } catch (error) {
//     console.log(error)
//   }
// }
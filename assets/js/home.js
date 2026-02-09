document
  .getElementById('loginForm')
  .addEventListener('submit', login);

async function login(event) {
  event.preventDefault();
  const form = event.target;
  const username = form.querySelector('input[name=username]').value;
  const password = form.querySelector('input[name=password]').value;
 console.log('LOGIN SEND:', { username, password });
  try {
    const response = await axios.post('http://localhost:8000/login', {
      username: username,
      password: password
    });
    
    console.log('Response status:', response.status);
    if (response.status === 200) {
      alert('Login successful!');
      // ปิด modal
      document.getElementById('myLoginModal').close();

      localStorage.setItem('token', response.data.token);

      window.location.replace('./Home/index.html');
    } 
  } catch (error) {
    console.log('error', error)
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
    const errorUser = response.data.message;
    console.log("res =",response)
    if (response.status === 201) {
      alert('Register Success');
      event.target.reset();
      modalRegister.close();
    } else if (response.status === 409) {

      nameElent.style.color = "red";
      nameElent.value = errorUser;
    }
    else if (response.status === 202) {
      nameElent.style.color = "red";
      nameElent.value = errorUser;
      nameInput.classList.add("input-error");
      setTimeout(() => {
        nameElent.style.color = "black";
        nameElent.value = ""
      }, 2000);
    }
  } catch (error) {
    console.log(`error`, error);
  }
}

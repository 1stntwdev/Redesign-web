
async function login() {
  const usernameInput = document.querySelector('input[name=username]');
  const passwordInput = document.querySelector('input[name=password]');
  const username = usernameInput.value;
  const password = passwordInput.value;
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

      console.log('Current URL:', window.location.href);
      localStorage.setItem('token', response.data.token);
      // redirect 
      // window.location.replace('http://127.0.0.1:5500/Frontend/src/pages/user/Home/index.html');
      window.location.replace('./Home/index.html');
    } else {
      alert(data.message || 'Login failed');
    }
    console.log('Response:', response.data);


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

  const displayemailInvalid = document.querySelector('.email-invalid');
  const displaypwdInvalid = document.querySelector('.pwd-invalid');

  const validEmail = validateEmail(email);
  const isPasswordMatch = checkPasswordmatch(password, confirmPassword, displaypwdInvalid);
  const modalRegister = document.getElementById('myRegisterModal');
  if (!validEmail) {
    displayemailInvalid.style.display = "block";
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
      setTimeout(() => {
        nameElent.style.color = "black";
        nameElent.value = ""
      }, 2000);
    }
  } catch (error) {
    console.log(`error`, error);
  }
}

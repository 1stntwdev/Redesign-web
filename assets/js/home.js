
async function login() {
  const usernameInput = document.querySelector('input[name=username]');
  const passwordInput = document.querySelector('input[name=password]');
  const username = usernameInput.value;
  const password = passwordInput.value;
  try{
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
      localStorage.setItem('token',response.data.token);
      // redirect 
      // window.location.replace('http://127.0.0.1:5500/Frontend/src/pages/user/Home/index.html');
      window.location.replace('./Home/index.html');
    } else {
      alert(data.message || 'Login failed');
    }
    console.log('Response:', response.data);
    
    
  }catch(error){
    console.log('error',error)
  }

}

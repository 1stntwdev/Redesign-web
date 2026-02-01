function logout(){
  console.log('starting ...')
  localStorage.removeItem('token');
  window.location.href = 'http://127.0.0.1:5500/Frontend/src/pages/user/Home.html';
}
function getToken(){
  const token = localStorage.getItem('token');
  console.log(token)
}
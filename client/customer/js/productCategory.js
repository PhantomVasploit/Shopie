const logoutBtn = document.querySelector('#logout')

logoutBtn.addEventListener('click', ()=>{
    localStorage.user = ''
    localStorage.token = ''
    window.location.href = '../../auth/html/login.html'
})
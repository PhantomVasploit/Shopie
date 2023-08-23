//  sticky navigation   //
//////////////////////////
const nav = document.querySelector('.navbar');

const scrollThreshold = 120; 

window.addEventListener('scroll', () => {
    if (window.scrollY >= scrollThreshold) {
        nav.classList.add('sticky');
    } else {
        nav.classList.remove('sticky');
    }
});
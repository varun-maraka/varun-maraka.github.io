const hamburger = document.getElementById('hamburger');
const menuList = document.getElementById('menuList');
const menuLinks = Array.from(document.querySelectorAll('.menu-link'));

function closeMenu() {
    hamburger.classList.remove('active');
    menuList.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
    const isOpen = menuList.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
        menuLinks.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
        closeMenu();
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});

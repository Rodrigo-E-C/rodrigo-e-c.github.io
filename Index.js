document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.close-btn');
    const menu = document.querySelector('.menu');

    menuBtn.addEventListener('click', function () {
        menu.classList.toggle('menu-open');
        menuBtn.style.display = 'none';
        closeBtn.style.display = 'block';
    });

    closeBtn.addEventListener('click', function () {
        menu.classList.toggle('menu-open');
        menuBtn.style.display = 'block';
        closeBtn.style.display = 'none';
    });
});

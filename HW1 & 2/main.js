const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

function toggleMenu() {
  const open = menu.classList.toggle('open');
  btn.setAttribute('aria-expanded', open);
}

btn.addEventListener('click', toggleMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menu.classList.contains('open')) {
    toggleMenu();
    btn.focus();
  }
});

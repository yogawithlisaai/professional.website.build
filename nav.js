(function () {
  var btn = document.querySelector('.hamburger-btn');
  var dropdown = document.getElementById('nav-dropdown');
  if (!btn || !dropdown) return;

  function openMenu() {
    btn.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('open');
    dropdown.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('open');
    dropdown.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', function () {
    btn.classList.contains('open') ? closeMenu() : openMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  dropdown.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
})();

import { tr } from './i18n.js';

export function initNavigation() {
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = [...document.querySelectorAll('main .section')];
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('active', isActive);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    { threshold: [0.3, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));

  if (menuToggle && navMenu) {
    const closeMenu = (restoreFocus = false) => {
      navMenu.classList.remove('mobile-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', tr('Мәзірді ашу'));
      if (restoreFocus) menuToggle.focus();
    };

    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', tr(isOpen ? 'Мәзірді жабу' : 'Мәзірді ашу'));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('pointerdown', (event) => {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        closeMenu(true);
      }
    });

    window.addEventListener('rentsafe:languagechange', () => {
      const isOpen = navMenu.classList.contains('mobile-open');
      menuToggle.setAttribute('aria-label', tr(isOpen ? 'Мәзірді жабу' : 'Мәзірді ашу'));
    });
  }
}

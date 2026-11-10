export function initAnimations() {
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add('visible'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0 }
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  let framePending = false;

  const updateScrollProgress = () => {
    framePending = false;
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const width = max > 0 ? (scrollTop / max) * 100 : 0;
    const bar = document.querySelector('.scroll-progress span');
    if (bar) {
      bar.style.width = `${width}%`;
    }

  };

  const scheduleUpdate = () => {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateScrollProgress);
    }
  };

  updateScrollProgress();
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
}

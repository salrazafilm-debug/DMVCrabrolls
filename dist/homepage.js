(() => {
  const header = document.querySelector('.site-header');
  const toggle = header.querySelector('.nav-toggle');
  const nav = header.querySelector('nav');
  const mobile = matchMedia('(max-width: 800px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobile.matches && nav.classList.contains('open')) {
      toggle.click();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (mobile.matches && nav.classList.contains('open') && !header.contains(event.target)) toggle.click();
  });
  const grid = document.querySelector('#lineup-cards');
  const controls = document.querySelector('.lineup-controls');
  const [prev, next] = controls.querySelectorAll('button');
  const count = controls.querySelector('span');
  const cards = Array.from(grid.children);
  let index = 0;
  const stops = () => cards.map(card => Math.min(grid.scrollWidth - grid.clientWidth, card.offsetLeft - cards[0].offsetLeft));
  function update() {
    const positions = stops();
    index = positions.reduce((best, position, i) => Math.abs(position - grid.scrollLeft) < Math.abs(positions[best] - grid.scrollLeft) ? i : best, 0);
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    count.textContent = `0${index + 1} / 0${cards.length}`;
  }
  function go(step) {
    const target = Math.min(cards.length - 1, Math.max(0, index + step));
    grid.scrollTo({left: stops()[target], behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  grid.addEventListener('scroll', update, {passive:true});
  const resize = () => {
    controls.hidden = !mobile.matches || grid.scrollWidth <= grid.clientWidth;
    grid.tabIndex = controls.hidden ? -1 : 0;
    update();
  };
  mobile.addEventListener('change', () => {
    if (!mobile.matches && nav.classList.contains('open')) toggle.click();
    resize();
  });
  window.addEventListener('resize', resize, {passive:true});
  resize();
  if (mobile.matches && !reduced.matches && 'IntersectionObserver' in window) {
    const title = document.querySelector('#menu-title');
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      if (window.scrollY > 0 && !location.hash) title.closest('section').classList.add('reveal-lineup');
      observer.disconnect();
    }, {threshold: .15});
    observer.observe(title);
  }
})();

(() => {
  const section = document.querySelector('#entry-pass');
  if (!section) return;
  const link = section.querySelector('.entry-pass-link');
  const ticket = section.querySelector('.entry-pass-ticket');
  const motionButton = section.querySelector('.entry-pass-motion');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let frame = 0;
  let latestX = 0;
  let latestY = 0;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    ticket.style.setProperty('--ticket-rx', '0deg');
    ticket.style.setProperty('--ticket-ry', '0deg');
  };
  link.addEventListener('pointermove', event => {
    if (paused || reducedMotion.matches || event.pointerType === 'touch') return;
    const bounds = link.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    latestX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    latestY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      ticket.style.setProperty('--ticket-rx', `${(-latestY * 4).toFixed(2)}deg`);
      ticket.style.setProperty('--ticket-ry', `${(latestX * 7).toFixed(2)}deg`);
    });
  });
  link.addEventListener('pointerleave', reset);
  link.addEventListener('pointercancel', reset);
  link.addEventListener('blur', reset);
  motionButton.addEventListener('click', () => {
    paused = !paused;
    section.classList.toggle('is-still', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.textContent = paused ? 'Resume motion' : 'Pause motion';
    reset();
  });
  reducedMotion.addEventListener('change', reset);
})();

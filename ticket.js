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

/* Tilt the ticket with the phone's gyroscope (touch screens only; iPhones ask for permission first) */
(() => {
  const section = document.querySelector('#entry-pass');
  if (!section) return;
  const ticket = section.querySelector('.entry-pass-ticket');
  const tiltButton = section.querySelector('.entry-pass-tilt');
  const motionButton = section.querySelector('.entry-pass-motion');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (value, limit) => Math.max(-limit, Math.min(limit, value));
  let listening = false;
  let paused = false;
  // Measure from wherever the phone is held when tilt starts, so any comfortable angle works.
  let base = null;
  const onTilt = event => {
    if (paused || reducedMotion.matches || event.gamma == null) return;
    if (!base) base = { beta: event.beta, gamma: event.gamma };
    const ry = clamp((event.gamma - base.gamma) * 0.45, 14);
    const rx = clamp((event.beta - base.beta) * -0.35, 12);
    ticket.style.setProperty('--ticket-rx', `${rx.toFixed(2)}deg`);
    ticket.style.setProperty('--ticket-ry', `${ry.toFixed(2)}deg`);
  };
  const listen = () => {
    if (listening) return;
    listening = true;
    window.addEventListener('deviceorientation', onTilt);
    if (tiltButton) tiltButton.hidden = true;
  };
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    if (tiltButton && matchMedia('(hover: none)').matches) {
      tiltButton.hidden = false;
      tiltButton.addEventListener('click', async () => {
        try {
          if (await DeviceOrientationEvent.requestPermission() === 'granted') listen();
        } catch { /* permission not available here; the ticket stays still */ }
      });
    }
  } else if ('DeviceOrientationEvent' in window && matchMedia('(hover: none)').matches) {
    listen();
  }
  motionButton.addEventListener('click', () => {
    paused = motionButton.getAttribute('aria-pressed') === 'true';
    if (paused) { ticket.style.setProperty('--ticket-rx', '0deg'); ticket.style.setProperty('--ticket-ry', '0deg'); }
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) { ticket.style.setProperty('--ticket-rx', '0deg'); ticket.style.setProperty('--ticket-ry', '0deg'); } });
})();

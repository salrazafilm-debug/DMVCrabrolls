const $ = s => document.querySelector(s);
$('#year').textContent = new Date().getFullYear();
const toggle = $('.nav-toggle'), nav = $('#navigation');
toggle.addEventListener('click', () => { const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation'); }));
const dialogs = [...document.querySelectorAll('dialog')];
function showDialog(dialog) { dialogs.forEach(d => { if (d.open) d.close(); }); dialog.showModal(); document.body.classList.add('modal-open'); }
function closeDialog(dialog) { dialog.close(); }
dialogs.forEach(d => { d.addEventListener('close', () => document.body.classList.toggle('modal-open', dialogs.some(dialog => dialog.open))); d.querySelector('[data-close]').addEventListener('click', () => closeDialog(d)); d.addEventListener('click', e => { const r = d.getBoundingClientRect(); if (e.target === d && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) closeDialog(d); }); });
document.querySelectorAll('[data-dish]').forEach(b => b.addEventListener('click', () => { const card = b.closest('.food-card'); $('#dish-title').textContent = card.querySelector('h3').innerText; $('#dish-body').textContent = card.querySelector('.food-description p').textContent; showDialog($('#dish-dialog')); }));
document.querySelectorAll('[data-order]').forEach(b => b.addEventListener('click', () => showDialog($('#order-dialog'))));
document.querySelectorAll('[data-catering]').forEach(b => b.addEventListener('click', () => showDialog($('#catering-dialog'))));
document.querySelectorAll('[data-find]').forEach(b => b.addEventListener('click', () => { closeDialog(b.closest('dialog')); $('#find-us').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); }));
$('[data-go-catering]').addEventListener('click', () => showDialog($('#catering-dialog')));
const localDate = new Date(); localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); $('[name=date]').min = localDate.toISOString().slice(0,10);
let inquiry = '';
$('#catering-form').addEventListener('submit', e => { e.preventDefault(); const form = e.currentTarget; if (!form.reportValidity()) return; const d = new FormData(form); inquiry = `DMV CRABROLLS — CATERING INQUIRY\n\nName: ${d.get('name')}\nEmail: ${d.get('email')}\nEvent date: ${d.get('date')}\nEstimated guests: ${d.get('guests')}\nLocation: ${d.get('location')}\n\nEvent details:\n${d.get('details') || 'To be discussed'}\n\nPlease let me know about availability, menu options, and pricing.`; $('#inquiry-text').textContent = inquiry; form.hidden = true; $('#inquiry-result').hidden = false; $('#copy-status').textContent = ''; });
$('#edit-inquiry').addEventListener('click', () => { $('#inquiry-result').hidden = true; $('#catering-form').hidden = false; $('[name=name]').focus(); });
$('#copy-inquiry').addEventListener('click', async () => { try { await navigator.clipboard.writeText(inquiry); $('#copy-status').textContent = 'Copied. Ready to share with the team.'; } catch { const range = document.createRange(); range.selectNodeContents($('#inquiry-text')); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); $('#copy-status').textContent = 'Select Copy in your browser, or download the details below.'; } });
$('#download-inquiry').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([inquiry], {type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href = url; a.download = 'DMV-Crabrolls-Catering-Inquiry.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); });
if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { entries.forEach(e => { if(e.isIntersecting) { nav.querySelectorAll('a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); } }); }, {rootMargin:'-15% 0px -55% 0px'}); document.querySelectorAll('main section[id]').forEach(s => observer.observe(s)); }
const photoButtons = [...document.querySelectorAll('[data-photo]')];
let photoIndex = 0;
function displayPhoto(index) {
  photoIndex = (index + photoButtons.length) % photoButtons.length;
  const photo = photoButtons[photoIndex];
  $('#photo-image').src = photo.dataset.photo;
  $('#photo-image').alt = photo.querySelector('img').alt;
  $('#photo-caption').textContent = photo.dataset.caption;
  $('#photo-counter').textContent = `${photoIndex + 1} / ${photoButtons.length}`;
}
photoButtons.forEach((button,index) => button.addEventListener('click', () => { displayPhoto(index); showDialog($('#photo-dialog')); }));
$('#previous-photo').addEventListener('click', () => displayPhoto(photoIndex - 1));
$('#next-photo').addEventListener('click', () => displayPhoto(photoIndex + 1));
$('#photo-dialog').addEventListener('keydown', event => { if(event.key === 'ArrowLeft') { event.preventDefault(); displayPhoto(photoIndex - 1); } if(event.key === 'ArrowRight') { event.preventDefault(); displayPhoto(photoIndex + 1); } });


/* Round 3: scroll fade, next home game, schedule highlight, Big 3 spotlight */
(() => {
  const hero = document.querySelector('#home');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const fade = () => {
    frame = 0;
    const distance = Math.max(1, hero.offsetHeight * 0.6);
    const amount = Math.min(1, Math.max(0, window.scrollY / distance));
    hero.style.setProperty('--fade', amount.toFixed(3));
    hero.classList.toggle('is-faded', amount > 0.5);
  };
  const queueFade = () => { if (!frame) frame = requestAnimationFrame(fade); };
  window.addEventListener('scroll', queueFade, { passive: true });
  window.addEventListener('resize', queueFade);
  fade();

  const now = new Date();
  const games = [...document.querySelectorAll('.game-list li[data-date]')];
  let next = null;
  games.forEach(li => {
    const [y, m, d] = li.dataset.date.split('-').map(Number);
    // A game stops being "next" once it kicks off; with no set time it lasts through that day.
    const t = /(\d+):(\d+)\s*(AM|PM)/i.exec(li.dataset.time || '');
    const start = t ? new Date(y, m - 1, d, (Number(t[1]) % 12) + (/pm/i.test(t[3]) ? 12 : 0), Number(t[2])) : new Date(y, m - 1, d + 1);
    const past = start <= now;
    li.classList.toggle('is-past', past);
    if (!past && !next) next = li;
  });
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  if (next) {
    const [, nm, nd] = next.dataset.date.split('-').map(Number);
    const label = `${MONTHS[nm - 1]} ${ordinal(nd)} ${next.dataset.opp}`.toUpperCase();
    document.querySelectorAll('.pride-next').forEach(el => { el.textContent = label; });
  }
  games.forEach(li => { if (li !== next) li.classList.add('later'); });
  const toggle = document.querySelector('.schedule-toggle'), list = document.querySelector('#game-list');
  if (toggle && list) toggle.addEventListener('click', () => {
    const open = !list.classList.contains('expanded');
    list.classList.toggle('expanded', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('span').textContent = open ? '↑' : '↓';
    toggle.firstChild.textContent = open ? 'Show next game only ' : 'See all games ';
  });
  if (next) next.classList.add('is-next');
  const findDate = document.querySelector('#find-next-date'), findOpp = document.querySelector('#find-next-opp');
  if (next && findDate && findOpp) {
    findDate.textContent = next.querySelector('time').textContent;
    findOpp.textContent = `${next.dataset.opp} · ${next.dataset.time}`;
  }

})();

/* Fun fact: a tab pokes out at the bottom of the owner section and opens as you scroll to it */
(() => {
  const banner = document.querySelector('#fact-banner');
  if (!banner) return;
  const tab = banner.querySelector('.fact-tab');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setOpen = open => { banner.classList.toggle('is-open', open); tab.setAttribute('aria-expanded', String(open)); };
  banner.classList.add('peek');
  setOpen(false);
  tab.addEventListener('click', () => { banner.dataset.manual = '1'; setOpen(!banner.classList.contains('is-open')); });
  if (reduced || !('IntersectionObserver' in window)) { setOpen(true); return; }
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !banner.dataset.manual) setOpen(true);
  }, { rootMargin: '0px 0px -38% 0px', threshold: 0.2 }).observe(banner);
})();

/* Intro video: autoplays on every visit, holds on its last frame, and the site is visible from the start */
(() => {
  const video = document.querySelector('.intro-video');
  const skip = document.querySelector('.intro-skip');
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  const hold = () => { if (video.duration) { video.pause(); video.currentTime = Math.max(0, video.duration - 0.04); } };
  const finishNow = () => { if (video.readyState >= 1) hold(); else video.addEventListener('loadedmetadata', hold, { once: true }); };
  if (skip) skip.addEventListener('click', finishNow);
  video.addEventListener('ended', hold);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finishNow(); return; }
  // If the browser holds back autoplay, start the video on the visitor's first touch, click or scroll. No button.
  const play = () => {
    const attempt = video.play();
    if (attempt && attempt.catch) attempt.catch(() => {
      const start = () => { video.play().catch(() => {}); ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(t => removeEventListener(t, start, true)); };
      ['pointerdown', 'touchstart', 'scroll', 'keydown'].forEach(t => addEventListener(t, start, { capture: true, passive: true, once: true }));
    });
  };
  if (video.readyState >= 2) play(); else video.addEventListener('canplay', play, { once: true });
})();

/* Find us: live next home game from the schedule, updated every minute; food slides crossfade every 5 seconds */
(() => {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
  const games = [...document.querySelectorAll('.game-list li[data-date]')];
  const dateEl = document.querySelector('#find-next-date'), oppEl = document.querySelector('#find-next-opp'), timeEl = document.querySelector('#find-next-time');
  const pride = document.querySelectorAll('.pride-next');
  const startOf = li => {
    const [y, m, d] = li.dataset.date.split('-').map(Number);
    const t = /(\d+):(\d+)\s*(AM|PM)/i.exec(li.dataset.time || '');
    return t ? new Date(y, m - 1, d, (Number(t[1]) % 12) + (/pm/i.test(t[3]) ? 12 : 0), Number(t[2])) : new Date(y, m - 1, d + 1);
  };
  const refresh = () => {
    const now = new Date();
    const next = games.find(li => startOf(li) > now) || null;
    if (!next) return;
    const [, nm, nd] = next.dataset.date.split('-').map(Number);
    document.querySelectorAll('.fn-date').forEach(el => { el.textContent = next.querySelector('time').textContent; });
    document.querySelectorAll('.fn-opp').forEach(el => { el.textContent = next.dataset.opp; });
    document.querySelectorAll('.fn-time').forEach(el => { el.textContent = next.dataset.time; });
    const label = `${MONTHS[nm - 1]} ${ordinal(nd)} ${next.dataset.opp}`.toUpperCase();
    pride.forEach(el => { el.textContent = label; });
  };
  refresh();
  setInterval(refresh, 60000);

})();


/* Moments: show the first four photos, "Show more" reveals the rest */
(() => {
  const toggle = document.querySelector('.moments-toggle');
  const extra = [...document.querySelectorAll('.moment-more')];
  if (!toggle || !extra.length) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    extra.forEach(el => { el.hidden = !open; });
    toggle.setAttribute('aria-expanded', String(open));
    toggle.firstChild.textContent = open ? 'Show less ' : 'Show more ';
    toggle.querySelector('span').textContent = open ? '↑' : '↓';
  });
})();

/* Section 141 food photos: crossfade every 5 seconds, one shared timer for desktop and phone */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const boxes = [...document.querySelectorAll('.fs-food')];
  if (!boxes.length) return;
  let i = 0;
  setInterval(() => {
    i = (i + 1) % 2;
    boxes.forEach(box => {
      const slides = [...box.querySelectorAll('.fs-slide')];
      slides.forEach((s, k) => s.classList.toggle('on', k === i));
    });
  }, 5000);
})();


/* Header: clear over the hero photo, solid as soon as the visitor starts scrolling */
(() => {
  const header = document.querySelector('header');
  if (!header) return;
  let frame = 0;
  const update = () => { frame = 0; header.classList.toggle('is-solid', window.scrollY > 60); };
  window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(update); }, { passive: true });
  update();
})();

/* Homepage: the headline animates in on load, the hero drifts as you scroll, and the Big 3 comes in once it is on screen */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.home-d');
  if (hero && !reduced) {
    // Split the headline into words and letters; desktop sweeps and flickers each line, phone waves each letter in
    let i = 0;
    hero.querySelectorAll('.hd-a,.hd-b,.hd-c').forEach(part => {
      const words = part.textContent.trim().split(/\s+/);
      part.textContent = '';
      words.forEach((word, n) => {
        const w = document.createElement('span'); w.className = 'w';
        const inner = document.createElement('span'); inner.className = 'wi';
        [...word].forEach(c => { const ch = document.createElement('span'); ch.className = 'ch'; ch.textContent = c; ch.style.setProperty('--i', i++); inner.appendChild(ch); });
        w.appendChild(inner); part.appendChild(w);
        if (n < words.length - 1) part.appendChild(document.createTextNode(' '));
      });
    });
    hero.classList.add('hd-wait');
    const fontsReady = document.fonts && document.fonts.load ? document.fonts.load('400 1em "Bowlby One"') : Promise.resolve();
    Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(() => {
      hero.classList.add('hd-go');
      hero.classList.remove('hd-wait');
    });
  }
  if (hero && !reduced) {
    let frame = 0;
    const drift = () => {
      frame = 0;
      const h = hero.offsetHeight || 1;
      if (window.scrollY > h * 1.2) return;
      hero.style.setProperty('--hp', Math.min(1, Math.max(0, window.scrollY / h)).toFixed(3));
    };
    window.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(drift); }, { passive: true });
    drift();
  }
  const menu = document.getElementById('menu');
  if (menu && !reduced && 'IntersectionObserver' in window) {
    menu.classList.add('js-reveal');
    new IntersectionObserver((entries, io) => {
      if (entries[0].isIntersecting) { menu.classList.add('is-in'); io.disconnect(); }
    }, matchMedia('(max-width: 800px)').matches ? { threshold: 0 } : { rootMargin: '0px 0px -18% 0px', threshold: 0.05 }).observe(menu);
  }
})();

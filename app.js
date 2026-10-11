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

const banner = document.querySelector(".pride-strip"), bannerPause = document.querySelector(".pride-pause");
bannerPause.addEventListener("click", () => { const paused = banner.classList.toggle("is-paused"); bannerPause.setAttribute("aria-pressed", String(paused)); bannerPause.setAttribute("aria-label", paused ? "Play banner" : "Pause banner"); bannerPause.textContent = paused ? "▶" : "Ⅱ"; });

/* Round 3: scroll fade, next home game, schedule highlight, Big 3 spotlight */
(() => {
  const hero = document.querySelector('.hero');
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

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const games = [...document.querySelectorAll('.game-list li[data-date]')];
  let next = null;
  games.forEach(li => {
    const [y, m, d] = li.dataset.date.split('-').map(Number);
    const when = new Date(y, m - 1, d);
    const past = when < today;
    li.classList.toggle('is-past', past);
    if (!past && !next) next = li;
  });
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

  const track = document.querySelector('.menu .food-grid');
  if (!track) return;
  const cards = [...track.querySelectorAll('.food-card')];
  const phone = matchMedia('(max-width: 600px)');
  const pause = document.querySelector('.carousel-pause');
  const interval = 4800;
  let timer = 0, index = 0, stopped = false, onScreen = false;

  const mark = () => {
    const mid = track.getBoundingClientRect().left + track.clientWidth / 2;
    let best = 0, bestGap = Infinity;
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const gap = Math.abs(rect.left + rect.width / 2 - mid);
      if (gap < bestGap) { bestGap = gap; best = i; }
    });
    index = best;
    cards.forEach((card, i) => card.classList.toggle('is-center', i === best));
  };
  const go = i => {
    index = (i + cards.length) % cards.length;
    const card = cards[index];
    const left = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  const halt = () => { clearInterval(timer); timer = 0; };
  const start = () => {
    if (timer || stopped || !onScreen || !phone.matches || reduced.matches) return;
    timer = setInterval(() => go(index + 1), interval);
  };
  const setPause = isStopped => {
    stopped = isStopped;
    if (stopped) halt(); else start();
    if (pause) {
      pause.setAttribute('aria-pressed', String(stopped));
      pause.textContent = stopped ? 'Play the spotlight' : 'Pause the spotlight';
    }
  };

  let scrollFrame = 0;
  track.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; mark(); }); }, { passive: true });
  track.addEventListener('pointerdown', () => { if (!stopped) setPause(true); });
  if (pause) pause.addEventListener('click', () => setPause(!stopped));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start(); else halt();
    }, { threshold: 0.6 }).observe(track);
  }
  phone.addEventListener('change', () => { halt(); if (phone.matches) start(); });
  mark();
  window.addEventListener('resize', mark);
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

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

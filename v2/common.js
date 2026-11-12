/* Shared helpers for the AI Literacy games (v2). No external dependencies. */
const qs = new URLSearchParams(location.search);
let LANG = qs.get('lang') || (location.hash === '#sl' ? 'sl' : location.hash === '#en' ? 'en' : null);
if (!['en', 'sl'].includes(LANG)) LANG = (navigator.language || 'en').toLowerCase().startsWith('sl') ? 'sl' : 'en';
document.documentElement.lang = LANG;
const L = o => (o && typeof o === 'object' && ('en' in o)) ? (o[LANG] ?? o.en) : o;
const $ = s => document.querySelector(s);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const COMMON = {
  start: { en: "Let's go!", sl: 'Začnimo!' }, next: { en: 'Next', sl: 'Naprej' }, again: { en: 'Play again', sl: 'Igraj znova' },
  finish: { en: 'Finish', sl: 'Konec' }, all: { en: 'All games', sl: 'Vse igre' }, card: { en: 'CARD', sl: 'KARTICA' },
  big: { en: 'Big idea', sl: 'Ključna misel' },
  credit: { en: 'Created by Pablo Sandri in collaboration with PiNA · CC BY-NC-SA 4.0', sl: 'Avtor: Pablo Sandri, v sodelovanju z društvom PiNA · CC BY-NC-SA 4.0' },
};

function shell(cfg) {
  document.documentElement.style.setProperty('--c', cfg.color);
  document.documentElement.style.setProperty('--t', cfg.tint);
  document.title = L(cfg.title) + ' · AI Literacy';
  const link = l => { const u = new URL(location.href); u.searchParams.set('lang', l); u.hash = l; return u.pathname + u.search + u.hash; };
  document.body.innerHTML = `<div class="wrap">
  <header class="top"><span class="pill">${L(COMMON.card)} ${String(cfg.n).padStart(2, '0')}</span><span class="ttl">${esc(L(cfg.title))}</span>
  <nav class="lang"><a href="${link('en')}" class="${LANG === 'en' ? 'on' : ''}">EN</a><a href="${link('sl')}" class="${LANG === 'sl' ? 'on' : ''}">SL</a></nav></header>
  <div class="dots" id="dots"></div><main id="app" class="screen"></main>
  <p class="foot">${esc(L(COMMON.credit))} · <a href="index.html?lang=${LANG}#${LANG}">${L(COMMON.all)}</a></p></div>`;
}
function dots(n, k) { $('#dots').innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i <= k ? 'on' : ''}"></i>`).join(''); }
function show(html) { const a = $('#app'); a.classList.remove('screen'); void a.offsetWidth; a.classList.add('screen'); a.innerHTML = html; window.scrollTo({ top: 0, behavior: 'smooth' }); }
function confetti() {
  const c = document.createElement('div'); c.className = 'confetti';
  const cols = ['#2F7BEA', '#F2711C', '#7B4FE0', '#E63E62', '#0FA36B', '#FFC94A'];
  c.innerHTML = Array.from({ length: 60 }, () => `<i style="left:${Math.random() * 100}%;background:${cols[Math.floor(Math.random() * 6)]};animation-delay:${Math.random() * .5}s;animation-duration:${1.2 + Math.random()}s"></i>`).join('');
  document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
}
function bigIdea(txt) { return `<div class="big"><small>${L(COMMON.big)}</small>${esc(L(txt))}</div>`; }

/* ---------- art ---------- */
const INK = '#1E2340', SKIN = ['#F2C4A0', '#C98E62', '#8D5B3E', '#F5D2B5'];
const svg = (w, h, b, extra = '') => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" ${extra}>${b}</svg>`;
function robot(x, y, s = 1, color = '#7B4FE0', face = 'happy') {
  const mouth = { happy: `<path d="M-9 8 Q0 15 9 8" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`, o: `<circle cx="0" cy="10" r="3.2" fill="${INK}"/>`, flat: `<line x1="-8" y1="10" x2="8" y2="10" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`, sad: `<path d="M-8 12 Q0 6 8 12" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` }[face];
  return `<g transform="translate(${x},${y}) scale(${s})"><line x1="0" y1="-38" x2="0" y2="-26" stroke="${INK}" stroke-width="2.5"/><circle cx="0" cy="-40" r="5" fill="${color}" stroke="${INK}" stroke-width="2.2"/>
<rect x="-26" y="-26" width="52" height="44" rx="12" fill="#fff" stroke="${INK}" stroke-width="2.6"/><rect x="-19" y="-18" width="38" height="20" rx="8" fill="${color}" opacity=".18"/>
<circle cx="-9" cy="-8" r="4.2" fill="${INK}"/><circle cx="9" cy="-8" r="4.2" fill="${INK}"/><circle cx="-7.6" cy="-9.6" r="1.3" fill="#fff"/><circle cx="10.4" cy="-9.6" r="1.3" fill="#fff"/>${mouth}
<rect x="-30" y="-10" width="5" height="12" rx="2" fill="${color}" stroke="${INK}" stroke-width="2"/><rect x="25" y="-10" width="5" height="12" rx="2" fill="${color}" stroke="${INK}" stroke-width="2"/>
<rect x="-20" y="21" width="40" height="30" rx="9" fill="${color}" stroke="${INK}" stroke-width="2.6"/><circle cx="0" cy="34" r="5" fill="#fff" stroke="${INK}" stroke-width="2"/></g>`;
}
function kid(x, y, s = 1, skin = SKIN[1], shirt = '#2F7BEA', hair = INK, arm = 'down') {
  const arms = { down: '<path d="M-15 24 Q-24 40 -20 52"/><path d="M15 24 Q24 40 20 52"/>', phone: '<path d="M-15 24 Q-24 40 -20 52"/><path d="M15 26 Q26 30 24 16"/>', up: '<path d="M-15 24 Q-30 12 -30 -2"/><path d="M15 24 Q30 12 30 -2"/>' }[arm];
  return `<g transform="translate(${x},${y}) scale(${s})"><g stroke="${skin}" stroke-width="7" stroke-linecap="round" fill="none">${arms}</g>
<rect x="-17" y="18" width="34" height="38" rx="13" fill="${shirt}" stroke="${INK}" stroke-width="2.4"/><rect x="-13" y="54" width="10" height="20" rx="4" fill="${INK}"/><rect x="3" y="54" width="10" height="20" rx="4" fill="${INK}"/>
<circle cx="0" cy="0" r="19" fill="${skin}" stroke="${INK}" stroke-width="2.4"/><path d="M-19 -2 Q-20 -22 0 -22 Q20 -22 19 -2 Q12 -12 0 -13 Q-10 -13 -19 -2Z" fill="${hair}"/>
<circle cx="-6.5" cy="2" r="2.6" fill="${INK}"/><circle cx="6.5" cy="2" r="2.6" fill="${INK}"/><path d="M-6 9 Q0 14 6 9" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<circle cx="-12" cy="8" r="3" fill="#F27A7A" opacity=".35"/><circle cx="12" cy="8" r="3" fill="#F27A7A" opacity=".35"/></g>`;
}
const cloud = (x, y, s, fill = '#fff', stroke = INK) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-46 18 Q-62 18 -60 2 Q-58 -12 -42 -10 Q-40 -32 -16 -30 Q-4 -46 16 -34 Q36 -40 42 -18 Q62 -16 58 4 Q58 18 42 18 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.6" stroke-linejoin="round"/></g>`;
const sparkle = (x, y, s, c) => `<path transform="translate(${x},${y}) scale(${s})" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill="${c}"/>`;
const phone = (x, y, s, c) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-12" y="-20" width="24" height="40" rx="5" fill="${INK}"/><rect x="-9" y="-15" width="18" height="28" rx="2" fill="${c}" opacity=".9"/><rect x="-6" y="-11" width="12" height="3" rx="1.5" fill="#fff"/><rect x="-6" y="-5" width="9" height="3" rx="1.5" fill="#fff" opacity=".8"/><circle cx="0" cy="16.5" r="1.6" fill="#fff"/></g>`;
function datacentre(x, y, s, c) {
  let r = ''; for (let i = 0; i < 4; i++) { const rx = -38 + i * 20; let l = ''; for (let j = 0; j < 5; j++) l += `<circle class="blink" style="animation-delay:${(i * 5 + j) * .13}s" cx="${rx + 5}" cy="${-22 + j * 9}" r="1.6" fill="${c}"/><rect x="${rx + 9}" y="${-23.5 + j * 9}" width="6" height="3" rx="1" fill="#fff" opacity=".6"/>`; r += `<rect x="${rx}" y="-30" width="16" height="48" rx="2.5" fill="${INK}"/>${l}`; }
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M-50 -38 L0 -56 L50 -38 Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><rect x="-46" y="-38" width="92" height="62" rx="4" fill="#fff" stroke="${INK}" stroke-width="2.6"/>${r}<rect x="-50" y="22" width="100" height="5" rx="2" fill="${INK}"/></g>`;
}
function cat(x, y, s = 1, o = {}) {
  const fur = o.fur || '#F4F1EA', eyes = o.eyes || '#4CAF50';
  const st = o.stripe ? `<path d="M-6 -24 l2 8 M0 -26 l0 9 M6 -24 l-2 8" stroke="${o.stripe}" stroke-width="3" stroke-linecap="round"/>` : '';
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M18 30 Q42 30 38 6" stroke="${INK}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M18 30 Q42 30 38 6" stroke="${fur}" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="0" cy="22" rx="20" ry="16" fill="${fur}" stroke="${INK}" stroke-width="2.4"/><path d="M-20 -14 L-17 -36 L-4 -22Z M20 -14 L17 -36 L4 -22Z" fill="${fur}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M-16 -18 L-15 -30 L-8 -22Z M16 -18 L15 -30 L8 -22Z" fill="#F5A3B5"/><circle cx="0" cy="-8" r="21" fill="${fur}" stroke="${INK}" stroke-width="2.4"/>${st}
<ellipse cx="-8" cy="-10" rx="3.6" ry="4.6" fill="${eyes}"/><ellipse cx="8" cy="-10" rx="3.6" ry="4.6" fill="${eyes}"/><ellipse cx="-8" cy="-10" rx="1.3" ry="3.6" fill="${INK}"/><ellipse cx="8" cy="-10" rx="1.3" ry="3.6" fill="${INK}"/>
<path d="M-3 -1 L3 -1 L0 2Z" fill="#F07A93"/><path d="M0 2 Q-4 6 -7 4 M0 2 Q4 6 7 4" stroke="${INK}" stroke-width="1.5" fill="none"/>
<g stroke="${o.fur === '#2C2C34' ? '#9A9AA8' : INK}" stroke-width="1.1"><line x1="-10" y1="0" x2="-26" y2="-3"/><line x1="-10" y1="3" x2="-26" y2="5"/><line x1="10" y1="0" x2="26" y2="-3"/><line x1="10" y1="3" x2="26" y2="5"/></g></g>`;
}
function dog(x, y, s = 1, o = {}) {
  const fur = o.fur || '#B8824E', ear = o.ear || '#7A4E2A';
  const ears = o.pointy ? `<path d="M-18 -16 L-20 -40 L-4 -26Z M18 -16 L20 -40 L4 -26Z" fill="${ear}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>` : `<path d="M-16 -22 Q-34 -22 -30 4 Q-26 12 -18 2Z M16 -22 Q34 -22 30 4 Q26 12 18 2Z" fill="${ear}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
  const sp = o.spot ? `<ellipse cx="9" cy="-14" rx="8" ry="7" fill="${o.spot}"/>` : '';
  return `<g transform="translate(${x},${y}) scale(${s})"><path d="M20 22 Q36 18 34 2" stroke="${INK}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 22 Q36 18 34 2" stroke="${fur}" stroke-width="4" fill="none" stroke-linecap="round"/>
<ellipse cx="0" cy="24" rx="22" ry="15" fill="${fur}" stroke="${INK}" stroke-width="2.4"/><rect x="-21" y="-30" width="42" height="40" rx="18" fill="${fur}" stroke="${INK}" stroke-width="2.4"/>${sp}${ears}
<circle cx="-8" cy="-12" r="3.4" fill="${o.fur === '#2C2C34' ? '#fff' : INK}"/><circle cx="8" cy="-12" r="3.4" fill="${o.fur === '#2C2C34' ? '#fff' : INK}"/><ellipse cx="0" cy="0" rx="11" ry="8" fill="#F3E2CC" stroke="${INK}" stroke-width="2"/>
<ellipse cx="0" cy="-3" rx="4.5" ry="3.2" fill="${INK}"/><path d="M0 0 L0 4 M-4 6 Q0 9 4 6" stroke="${INK}" stroke-width="1.6" fill="none"/><path d="M-3 8 Q0 14 3 8" fill="#F07A93"/></g>`;
}
const blinkCSS = '<style>.blink{animation:bl 1.2s infinite alternate}@keyframes bl{from{opacity:.25}to{opacity:1}}</style>';

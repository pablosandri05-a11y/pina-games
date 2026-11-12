/* Data-driven game engine for cards 6+. Needs common.js and window.GAME. */
(function () {
  const G = window.GAME;
  const T = {
    good: { en: 'Great!', sl: 'Odlično!' }, meh: { en: 'Interesting choice!', sl: 'Zanimiva izbira!' }, bad: { en: 'Not quite.', sl: 'Ne čisto.' },
    most: { en: 'Many people would say:', sl: 'Veliko ljudi bi reklo:' }, opinion: { en: 'Interesting view!', sl: 'Zanimivo mnenje!' },
    score: { en: 'Your score', sl: 'Tvoj rezultat' }, done: { en: 'Well done!', sl: 'Bravo!' }, ask: { en: 'Talk about it', sl: 'Pogovorite se' },
    wrongOrder: { en: 'Not yet! What comes first?', sl: 'Še ne! Kaj pride najprej?' }, yourOrder: { en: 'Your order', sl: 'Tvoj vrstni red' }, realOrder: { en: 'The answer', sl: 'Rešitev' },
    check: { en: 'Check', sl: 'Preveri' }, chosen: { en: 'chosen', sl: 'izbranih' }, again: { en: 'Choose again', sl: 'Izberi znova' }, tryRule: { en: 'Try another rule, or go on.', sl: 'Preizkusi drugo pravilo ali nadaljuj.' },
    stars: { en: 'Prompt quality', sl: 'Kakovost navodila' }, answer: { en: 'AI answer', sl: 'Odgovor UI' }, prompt: { en: 'Your prompt', sl: 'Tvoje navodilo' }, stickers: { en: 'stickers', sl: 'nalepk' },
    terms: { en: 'Show the terms', sl: 'Pokaži pogoje' }
  };
  let si = 0, got = 0, max = 0;
  const C = G.color;
  shell({ n: G.n, color: G.color, tint: G.tint, title: G.title });
  const N = G.steps.length + 1;
  const nextBtn = (fn, label) => `<button class="btn" onclick="${fn}">${label || L(COMMON.next)}</button>`;
  window._G = {};

  function intro() {
    dots(N, -1);
    show(`<h1>${esc(L(G.game))}</h1><p class="lead">${esc(L(G.q))}</p><div class="art">${G.art}</div><div class="spacer"></div>${nextBtn('_G.step()', L(COMMON.start))}`);
  }
  _G.step = function () {
    if (si >= G.steps.length) return end();
    dots(N, si);
    const s = G.steps[si];
    ({ sort, choice, order, build, pick, share, info })[s.type](s);
  };
  _G.next = function () { si++; _G.step(); };
  const head = (s, k, n) => `${n ? `<span class="tag">${k + 1}/${n}</span>` : ''}<h2>${esc(L(s.title))}</h2>${L(s.text) ? `<p class="lead">${esc(L(s.text))}</p>` : ''}`;

  /* ---------- info ---------- */
  function info(s) { show(`${head(s)}<div class="box" style="${s.mono ? 'white-space:pre-line;font-weight:600' : ''}">${esc(L(s.text)).replace(/\n/g, '<br>')}</div>`.replace(`<p class="lead">${esc(L(s.text))}</p>`, '') + `<div class="spacer"></div>${nextBtn('_G.next()')}`); }

  /* ---------- sort ---------- */
  function sort(s) {
    const items = s._o || (s._o = shuffle(s.items)); let k = 0;
    const cols = s.buckets.length === 2 ? 'two' : '';
    const draw = () => {
      if (k >= items.length) return _G.next();
      const it = items[k];
      show(`${head(s, k, items.length)}<div class="task">${esc(L(it.t))}</div>
      <div class="choices ${cols}" style="${s.buckets.length === 3 ? 'grid-template-columns:1fr 1fr 1fr' : ''}">${s.buckets.map((b, i) => `<button class="choice" style="font-size:${s.buckets.length === 3 ? 15 : 17}px" id="b${i}">${esc(L(b))}</button>`).join('')}</div><div id="fb"></div>`);
      s.buckets.forEach((_, i) => $('#b' + i).onclick = () => {
        const ok = it.a.includes(i); max++; if (ok) got++;
        s.buckets.forEach((_, j) => { const b = $('#b' + j); b.onclick = null; b.classList.add(it.a.includes(j) ? 'ok' : 'dim'); });
        if (!ok) $('#b' + i).style.borderStyle = 'dashed';
        const best = it.a.map(j => L(s.buckets[j])).join(' / ');
        $('#fb').innerHTML = `<div class="fb ${ok ? 'good' : 'meh'}"><b>${L(ok ? T.good : T.meh)}</b>${ok ? '' : esc(L(T.most)) + ' <b style="display:inline;font-size:inherit">' + esc(best) + '</b>. '}${esc(L(it.why))}</div>${nextBtn('_G.k()')}`;
      });
    };
    _G.k = () => { k++; draw(); }; draw();
  }

  /* ---------- choice ---------- */
  function choice(s) {
    let k = 0;
    const draw = () => {
      if (k >= s.items.length) return _G.next();
      const it = s.items[k], opinion = it.opts.every(o => o.ok === null || o.ok === undefined);
      const terms = s.show_terms ? `<details class="box" style="margin:6px 0"><summary style="font-weight:800;cursor:pointer">${L(T.terms)}</summary><div style="white-space:pre-line;margin-top:6px;font-size:15px">${esc(L(s.show_terms))}</div></details>` : '';
      show(`${head(s, k, s.items.length)}${terms}${L(it.q) ? `<h3 style="margin:8px 0 2px">${esc(L(it.q))}</h3>` : ''}${L(it.ctx) ? `<div class="task" style="font-size:19px;font-family:Nunito;font-weight:700;text-align:left">${esc(L(it.ctx))}</div>` : ''}
      <div class="choices">${it.opts.map((o, i) => `<button class="choice" style="font-size:17px" id="o${i}">${esc(L(o.t))}</button>`).join('')}</div><div id="fb"></div>`);
      it.opts.forEach((o, i) => $('#o' + i).onclick = () => {
        let cls, ttl;
        if (opinion) { cls = 'meh'; ttl = T.opinion; }
        else { max++; if (o.ok === true) { got++; cls = 'good'; ttl = T.good; } else if (o.ok === false) { cls = 'bad'; ttl = T.bad; } else { cls = 'meh'; ttl = T.meh; } }
        it.opts.forEach((p, j) => { const b = $('#o' + j); b.onclick = null; if (!opinion) b.classList.add(p.ok === true ? 'ok' : (j === i && p.ok === false ? 'no' : 'dim')); else b.classList.add(j === i ? 'ok' : 'dim'); });
        $('#fb').innerHTML = `<div class="fb ${cls}"><b>${L(ttl)}</b>${esc(L(o.fb))}</div>${nextBtn('_G.k()')}`;
      });
    };
    _G.k = () => { k++; draw(); }; draw();
  }

  /* ---------- order ---------- */
  function order(s) {
    const n = s.items.length; const deck = shuffle([...Array(n).keys()]); let seq = [];
    const draw = (msg = '') => {
      show(`${head(s)}<div class="choices">${deck.map(i => { const pos = seq.indexOf(i); return `<button class="choice" style="flex-direction:row;justify-content:flex-start;text-align:left;font-size:17px;${pos >= 0 ? 'background:var(--t);border-color:var(--c)' : ''}" id="r${i}"><b style="width:26px;color:var(--c);font-size:22px">${pos >= 0 ? pos + 1 : ''}</b>${esc(L(s.items[i]))}</button>`; }).join('')}</div><div id="fb">${msg}</div>`);
      deck.forEach(i => $('#r' + i).onclick = () => {
        if (seq.includes(i)) { if (s.score) { seq = seq.filter(x => x !== i); draw(); } return; }
        if (!s.score && i !== seq.length) { const b = $('#r' + i); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); $('#fb').innerHTML = `<div class="fb meh"><b>${L(T.wrongOrder)}</b></div>`; return; }
        seq.push(i);
        if (seq.length === n) return s.score ? reveal() : (confetti(), setTimeout(_G.next, 900), draw());
        draw();
      });
    };
    const reveal = () => {
      let right = 0; seq.forEach((v, p) => { if (v === p) right++; }); got += right; max += n;
      show(`${head(s)}<div class="box"><h3>${L(T.realOrder)}</h3>${s.items.map((t, i) => `<div style="display:flex;gap:10px;margin:8px 0;align-items:flex-start"><b style="font-family:'Baloo 2';font-size:22px;color:var(--c);width:22px">${i + 1}</b><div><b>${esc(L(t))}</b> ${seq[i] === i ? '✓' : `<span style="color:#8A8EA8;font-size:14px">(${L(T.yourOrder)}: ${seq.indexOf(i) + 1})</span>`}<div style="font-size:15px;color:var(--muted)">${esc(L(s.info[i]))}</div></div></div>`).join('')}</div>
      ${s.note ? `<div class="fb meh">${esc(L(s.note))}</div>` : ''}<div class="score" style="font-size:44px">${right}/${n}</div>${nextBtn('_G.next()')}`);
      if (right >= n - 1) confetti();
    };
    draw();
  }

  /* ---------- build ---------- */
  function build(s) {
    const on = new Set();
    const draw = () => {
      const k = on.size, stars = Math.round(k / s.chips.length * 4) + 1;
      const prompt = L(s.base) + ' ' + s.chips.map((c, i) => on.has(i) ? L(c) : null).filter(Boolean).join(' ');
      show(`${head(s)}<div class="box"><span class="tag">${L(T.prompt)}</span><p style="font-family:'Baloo 2';font-weight:700;font-size:20px;line-height:1.2;margin-top:6px">“${esc(prompt.trim())}.”</p></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${s.chips.map((c, i) => `<button class="choice" style="font-size:15px;padding:8px 12px;${on.has(i) ? 'background:var(--t);border-color:var(--c)' : ''}" id="c${i}">${on.has(i) ? '✓ ' : '+ '}${esc(L(c))}</button>`).join('')}</div>
      <div class="box" style="border:3px solid var(--c)"><span class="tag">${L(T.answer)}</span><p style="margin-top:6px;font-weight:600">${esc(L(s.outs[k]))}</p>
      <div style="margin-top:8px;font-size:13px;font-weight:800;color:var(--muted)">${L(T.stars)}: <span style="color:#F5B83D;font-size:20px;letter-spacing:2px">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span></div></div>
      ${nextBtn('_G.next()')}`);
      s.chips.forEach((_, i) => $('#c' + i).onclick = () => { on.has(i) ? on.delete(i) : on.add(i); const y = scrollY; draw(); scrollTo(0, y); if (on.size === s.chips.length) confetti(); });
    };
    draw();
  }

  /* ---------- pick ---------- */
  function pick(s) {
    let sel = [];
    const draw = () => {
      show(`${head(s)}<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${s.pool.map((p, i) => `<button class="choice" style="padding:2px;${sel.includes(i) ? 'background:var(--t);border-color:var(--c);box-shadow:0 0 0 3px var(--c) inset' : ''}" id="p${i}">${p.svg.replace('<svg', '<svg style="width:100%;height:auto"')}</button>`).join('')}</div>
      <p style="text-align:center;font-family:'Baloo 2';font-weight:800;font-size:18px;margin-top:8px">${sel.length}/${s.n} ${L(T.chosen)}</p>
      <button class="btn" ${sel.length === s.n ? '' : 'disabled'} onclick="_G.eval()">${L(T.check)}</button>`);
      s.pool.forEach((_, i) => $('#p' + i).onclick = () => { const j = sel.indexOf(i); if (j >= 0) sel.splice(j, 1); else if (sel.length < s.n) sel.push(i); const y = scrollY; draw(); scrollTo(0, y); });
    };
    _G.eval = () => {
      const same = []; let bars = '';
      s.dims.forEach((d, di) => {
        const c = [0, 0]; sel.forEach(i => c[s.pool[i].v[di]]++);
        if (c[0] === 0 || c[1] === 0) same.push(L(d.n) + ': ' + L(d.v[c[0] ? 0 : 1]));
        bars += `<div style="margin:8px 0"><b>${esc(L(d.n))}</b><div style="display:flex;height:22px;border-radius:8px;overflow:hidden;margin-top:4px"><div style="width:${c[0] / s.n * 100}%;background:var(--c);color:#fff;font-size:12px;font-weight:800;padding-left:6px;line-height:22px">${c[0] ? esc(L(d.v[0])) + ' ' + c[0] : ''}</div><div style="flex:1;background:#7B4FE0;color:#fff;font-size:12px;font-weight:800;text-align:right;padding-right:6px;line-height:22px">${c[1] ? esc(L(d.v[1])) + ' ' + c[1] : ''}</div></div></div>`;
      });
      const ok = same.length === 0; max++; if (ok) { got++; confetti(); }
      show(`${head(s)}<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px">${sel.map(i => s.pool[i].svg.replace('<svg', '<svg style="width:100%;height:auto;background:#fff;border-radius:8px"')).join('')}</div>
      <div class="box">${bars}</div><div class="fb ${ok ? 'good' : 'bad'}"><b>${L(ok ? T.good : T.bad)}</b>${esc(ok ? L(s.good) : L(s.bad).replace('{dims}', same.join(', ')))}</div>
      <button class="btn ghost" onclick="_G.re()">${L(T.again)}</button>${nextBtn('_G.next()')}`);
    };
    _G.re = () => { sel = []; max--; draw(); };
    draw();
  }

  /* ---------- share (fairness) ---------- */
  function share(s) {
    let r = -1; const tried = new Set();
    const draw = () => {
      const d = r >= 0 ? s.rules[r].d : [0, 0, 0];
      const people = s.people.map((p, i) => `<div style="text-align:center;flex:1">${svg(80, 80, kid(40, 30, .8, [SKIN[0], SKIN[2], SKIN[1]][i], ['#36B37E', '#2F7BEA', '#F2711C'][i]))}<b style="font-family:'Baloo 2';font-size:18px">${esc(L(p))}</b>
        <div style="display:flex;flex-wrap:wrap;gap:3px;justify-content:center;min-height:40px;margin-top:4px">${Array.from({ length: d[i] }, () => `<i style="width:14px;height:14px;border-radius:50%;background:var(--c);border:2px solid #1E2340;display:block"></i>`).join('')}</div><div style="font-weight:800">${r >= 0 ? d[i] : ''}</div></div>`).join('');
      show(`${head(s)}<div class="box" style="display:flex">${people}</div><div class="choices">${s.rules.map((x, i) => `<button class="choice" style="font-size:17px;${i === r ? 'background:var(--t);border-color:var(--c)' : ''}" id="u${i}">${esc(L(x.t))}</button>`).join('')}</div>
      ${r >= 0 ? `<div class="fb meh">${esc(L(s.rules[r].fb))}</div>` : ''}${tried.size >= 2 ? `<div class="fb good">${esc(L(s.end))}</div>` : (r >= 0 ? `<p style="margin-top:8px;font-weight:700;color:var(--muted)">${L(T.tryRule)}</p>` : '')}
      ${r >= 0 ? nextBtn('_G.next()') : ''}`);
      s.rules.forEach((_, i) => $('#u' + i).onclick = () => { r = i; tried.add(i); draw(); });
    };
    draw();
  }

  /* ---------- end ---------- */
  function end() {
    dots(N, N); confetti();
    show(`<h1>${L(T.done)}</h1>${max ? `<p style="text-align:center;font-weight:800">${L(T.score)}</p><div class="score">${got}/${max}</div>` : ''}
    <div class="art">${G.art}</div>${bigIdea(G.big)}<div class="box"><h3>${L(T.ask)}</h3><ul style="margin:6px 0 0 20px">${L(G.ask).map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>
    <button class="btn ghost" onclick="location.reload()">${L(COMMON.again)}</button>`);
  }
  intro();
})();

/* CS Degree Quest — app engine (vanilla JS, no build step) */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app');
  const UNITS = CQ.units;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ============ state ============ */
  const KEY = 'cq.v1';
  const DEFAULT = {
    name: '', goal: 50, xp: 0, theme: 'auto', sound: true, haptics: true,
    streak: { count: 0, best: 0, last: null, freezes: 0 },
    days: {},            // 'YYYY-MM-DD' -> xp earned that day
    done: {},            // 'unit/lesson' -> { acc, times, at }
    missed: {},          // 'unit/lesson/step' -> misses
    badges: {},          // id -> iso date
    stats: { perfect: 0, reviews: 0, correct: 0, answered: 0, widgets: 0, goalDays: 0, lessons: 0 },
    created: null, lastVisit: null
  };
  let S = load();
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw) return structuredClone(DEFAULT);
      return deepMerge(structuredClone(DEFAULT), raw);
    } catch { return structuredClone(DEFAULT); }
  }
  function deepMerge(a, b) {
    for (const k in b) a[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') ? deepMerge(a[k], b[k]) : b[k];
    return a;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }

  const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
  const todayXP = () => S.days[dayKey()] || 0;

  /* ============ theme ============ */
  function applyTheme() {
    let t = S.theme;
    if (t === 'auto') t = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    $('meta[name=theme-color]').content = t === 'light' ? '#f4f5ff' : '#0f1020';
  }
  applyTheme();

  /* ============ levels ============ */
  const LEVELS = [
    [0, 'Curious Coder', '🐣'], [100, 'Freshman', '📗'], [300, 'Sophomore', '📘'], [650, 'Junior', '📙'],
    [1100, 'Senior', '🎒'], [1700, 'Bachelor of Science', '🎓'], [2500, "Master's Student", '🔬'],
    [3500, 'Master of Science', '🧪'], [4800, 'PhD Candidate', '📜'], [6500, 'Doctor of CS', '👩‍🔬'],
    [9000, 'Professor', '🧑‍🏫'], [13000, 'Turing Laureate', '🏆']
  ];
  function levelInfo(xp = S.xp) {
    let i = 0;
    while (i + 1 < LEVELS.length && xp >= LEVELS[i + 1][0]) i++;
    const [base, title, icon] = LEVELS[i];
    const next = LEVELS[i + 1];
    return { n: i + 1, title, icon, base, next: next ? next[0] : null, nextTitle: next ? next[1] : null, pct: next ? (xp - base) / (next[0] - base) : 1 };
  }

  /* ============ curriculum helpers ============ */
  const unitById = id => UNITS.find(u => u.id === id);
  const isDone = (u, l) => !!S.done[`${u.id}/${l.id}`];
  const unitDoneCount = u => u.lessons.filter(l => isDone(u, l)).length;
  const unitComplete = u => unitDoneCount(u) === u.lessons.length;
  const totalLessons = () => UNITS.reduce((n, u) => n + u.lessons.length, 0);
  const doneLessons = () => UNITS.reduce((n, u) => n + unitDoneCount(u), 0);
  function nextLesson() {
    for (const u of UNITS) for (const l of u.lessons) if (!isDone(u, l)) return { u, l };
    return null;
  }
  const lessonUnlocked = (u, idx) => idx === 0 || isDone(u, u.lessons[idx - 1]) || isDone(u, u.lessons[idx]);
  function allFacts() {
    const out = [];
    for (const u of UNITS) for (const l of u.lessons) for (const s of l.steps) {
      const m = (s.html || '').match(/<div class="fun">([\s\S]*?)<\/div>/g);
      // only self-contained facts (short ones usually refer back to the lesson text)
      if (m) m.forEach(f => { const html = f.replace(/<\/?div[^>]*>/g, ''); if (html.replace(/<[^>]+>/g, '').length >= 80) out.push({ u, html }); });
    }
    return out;
  }

  /* ============ sound & haptics ============ */
  let actx;
  function tone(freqs, dur = .12, type = 'sine', gap = .09, vol = .14) {
    if (!S.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * gap;
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + dur);
        o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + .02);
      });
    } catch {}
  }
  const sfx = {
    right: () => tone([660, 990], .14, 'triangle'),
    wrong: () => tone([220, 180], .18, 'sawtooth', .1, .06),
    tap: () => tone([520], .05, 'sine', 0, .05),
    win: () => tone([523, 659, 784, 1047, 1319], .22, 'triangle', .1),
    badge: () => tone([784, 988, 1175, 1568], .25, 'square', .08, .06)
  };
  const buzz = p => { if (S.haptics && navigator.vibrate) try { navigator.vibrate(p); } catch {} };

  /* ============ confetti ============ */
  const cv = $('#confetti'), cx = cv.getContext('2d');
  let parts = [], raf = null;
  function confetti(n = 140, emoji) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cv.width = innerWidth * devicePixelRatio; cv.height = innerHeight * devicePixelRatio;
    const colors = ['#7c5cff', '#00d4ff', '#2ee59d', '#ffc83d', '#ff5c7a', '#ff8a3d', '#ffffff'];
    for (let i = 0; i < n; i++) parts.push({
      x: innerWidth / 2 + (Math.random() - .5) * 80, y: innerHeight * .35,
      vx: (Math.random() - .5) * 16, vy: -Math.random() * 15 - 4, r: Math.random() * 6 + 4,
      c: colors[i % colors.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 0,
      e: emoji && Math.random() < .25 ? emoji : null
    });
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    cx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.y < innerHeight + 40 && p.life < 260);
    for (const p of parts) {
      p.vy += .38; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
      if (p.e) { cx.font = '22px serif'; cx.fillText(p.e, -11, 8); }
      else { cx.fillStyle = p.c; cx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); }
      cx.restore();
    }
    raf = parts.length ? requestAnimationFrame(tick) : (cx.clearRect(0, 0, innerWidth, innerHeight), null);
  }

  /* ============ toasts & modals ============ */
  function toast(icon, title, name) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<div class="ti">${icon}</div><div><div class="tt">${esc(title)}</div><div class="tn">${esc(name)}</div></div>`;
    $('#toasts').appendChild(t);
    setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 400); }, 3200);
  }
  function modal(html, buttons) {
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal">${html}<div class="btns"></div></div>`;
    const box = $('.btns', bg);
    buttons.forEach(b => {
      const el = document.createElement('button');
      el.className = 'btn ' + (b.cls || '');
      el.textContent = b.label;
      el.onclick = () => { bg.remove(); b.onClick && b.onClick(); };
      box.appendChild(el);
    });
    document.body.appendChild(bg);
  }

  /* ============ achievements ============ */
  const hour = () => new Date().getHours();
  const BADGES = [
    { id: 'hello', icon: '👋', name: 'Hello, World!', desc: 'Finish your first lesson', test: () => S.stats.lessons >= 1 },
    { id: 'flawless', icon: '💎', name: 'Flawless', desc: 'A lesson with 100% accuracy', test: () => S.stats.perfect >= 1 },
    { id: 'zerobugs', icon: '🐛', name: 'Zero Bugs', desc: '10 perfect lessons', test: () => S.stats.perfect >= 10 },
    { id: 'streak3', icon: '🔥', name: 'On Fire', desc: '3-day streak', test: () => S.streak.best >= 3 },
    { id: 'streak7', icon: '📅', name: 'Week Warrior', desc: '7-day streak', test: () => S.streak.best >= 7 },
    { id: 'streak30', icon: '🟢', name: '30 Days Uptime', desc: '30-day streak — five nines of grit', test: () => S.streak.best >= 30 },
    { id: 'streak100', icon: '💯', name: 'SLA Legend', desc: '100-day streak', test: () => S.streak.best >= 100 },
    { id: 'goal', icon: '🎯', name: 'Goal Getter', desc: 'Hit your daily goal', test: () => S.stats.goalDays >= 1 },
    { id: 'goal10', icon: '🏹', name: 'Sharpshooter', desc: 'Hit your daily goal on 10 days', test: () => S.stats.goalDays >= 10 },
    { id: 'xp1k', icon: '⚡', name: '1K Club', desc: 'Earn 1,000 XP', test: () => S.xp >= 1000 },
    { id: 'xp5k', icon: '🚀', name: 'High Throughput', desc: 'Earn 5,000 XP', test: () => S.xp >= 5000 },
    { id: 'lessons10', icon: '📚', name: 'Bookworm', desc: 'Finish 10 lessons', test: () => S.stats.lessons >= 10 },
    { id: 'lessons50', icon: '🧠', name: 'Big Brain', desc: 'Finish 50 lessons', test: () => S.stats.lessons >= 50 },
    { id: 'unit1', icon: '🚢', name: 'Shipped It', desc: 'Complete a whole unit', test: () => UNITS.some(unitComplete) },
    { id: 'half', icon: '⛰️', name: 'Halfway There', desc: 'Complete half of all units', test: () => UNITS.length && UNITS.filter(unitComplete).length >= Math.ceil(UNITS.length / 2) },
    { id: 'review', icon: '🔁', name: 'Spaced Out', desc: 'Finish a review session', test: () => S.stats.reviews >= 1 },
    { id: 'review10', icon: '🏛️', name: 'Memory Palace', desc: '10 review sessions', test: () => S.stats.reviews >= 10 },
    { id: 'hands', icon: '🕹️', name: 'Hands-On', desc: 'Play with 5 interactive labs', test: () => S.stats.widgets >= 5 },
    { id: 'owl', icon: '🦉', name: 'Night Owl', desc: 'Learn between midnight and 5am', test: fin => fin && hour() < 5 },
    { id: 'bird', icon: '🐦', name: 'Early Bird', desc: 'Learn between 5am and 8am', test: fin => fin && hour() >= 5 && hour() < 8 },
    { id: 'combo', icon: '🌪️', name: 'Combo Breaker', desc: '10 correct answers in a row', test: () => (S.stats.bestCombo || 0) >= 10 },
    { id: 'comeback', icon: '🩹', name: 'Incident Resolved', desc: 'Come back after 3+ days away', test: () => !!S.stats.comeback },
    { id: 'grad', icon: '🎓', name: 'Graduated!', desc: 'Complete every unit', test: () => UNITS.length && UNITS.every(unitComplete) }
  ];
  function checkBadges(fin) {
    const fresh = [];
    for (const b of BADGES) if (!S.badges[b.id] && b.test(fin)) { S.badges[b.id] = new Date().toISOString(); fresh.push(b); }
    // per-unit course badges
    for (const u of UNITS) {
      const id = 'unit:' + u.id;
      if (!S.badges[id] && unitComplete(u)) { S.badges[id] = new Date().toISOString(); fresh.push({ icon: u.emoji, name: u.title + ' — passed!' }); }
    }
    if (fresh.length) {
      save();
      fresh.forEach((b, i) => setTimeout(() => { toast(b.icon, 'Achievement unlocked', b.name); sfx.badge(); buzz([30, 40, 30]); confetti(60, b.icon); }, 700 + i * 1100));
    }
    return fresh;
  }

  /* ============ XP & streak ============ */
  function addXP(n) {
    const before = levelInfo(), hadGoal = todayXP() >= S.goal;
    S.xp += n;
    const d = dayKey();
    S.days[d] = (S.days[d] || 0) + n;
    // streak
    const st = S.streak;
    if (st.last !== d) {
      const gap = st.last ? daysBetween(st.last, d) : 1;
      if (gap === 1) st.count++;
      else if (gap === 2 && st.freezes > 0) { st.freezes--; st.count++; setTimeout(() => toast('🧊', 'Streak freeze used', 'Your streak survived yesterday!'), 1500); }
      else st.count = 1;
      st.last = d;
      if (st.count % 7 === 0 && st.freezes < 2) { st.freezes++; setTimeout(() => toast('🧊', 'Earned a streak freeze', 'Protects your streak if you miss a day'), 2600); }
      st.best = Math.max(st.best, st.count);
    }
    if (!hadGoal && todayXP() >= S.goal) { S.stats.goalDays++; S._goalJustHit = true; }
    const after = levelInfo();
    if (after.n > before.n) S._levelUp = after;
    save();
  }
  function streakAlive() {
    if (!S.streak.last) return false;
    const gap = daysBetween(S.streak.last, dayKey());
    return gap <= 1 || (gap === 2 && S.streak.freezes > 0);
  }
  const streakNow = () => streakAlive() ? S.streak.count : 0;
  const learnedToday = () => S.streak.last === dayKey();

  /* ============ shared UI bits ============ */
  function ring(pct, label, color = 'var(--good)', size = 64) {
    const r = 26, c = 2 * Math.PI * r;
    return `<svg class="ring" viewBox="0 0 64 64" style="width:${size}px;height:${size}px"><circle class="bg" cx="32" cy="32" r="${r}"/><circle class="fg" cx="32" cy="32" r="${r}" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, pct))}"/><text x="32" y="37" text-anchor="middle">${label}</text></svg>`;
  }
  function topbar() {
    const s = streakNow();
    return `<div class="topbar">
      <div class="brand"><img class="logo" src="icons/icon.svg" alt="">CS Quest</div>
      <span class="chip fire ${learnedToday() ? '' : 'cold'}" title="Day streak">🔥 ${s}</span>
      <span class="chip xp" title="Total XP">⚡ ${S.xp.toLocaleString()}</span>
    </div>`;
  }
  function nav(active) {
    const items = [['#/', '🗺️', 'Learn', 'home'], ['#/review', '🔁', 'Review', 'review'], ['#/badges', '🏅', 'Badges', 'badges'], ['#/profile', '🎓', 'Me', 'profile']];
    return `<nav class="nav"><div class="nav-inner">${items.map(([h, i, l, k]) => `<a href="${h}" class="${k === active ? 'active' : ''}"><span class="ico">${i}</span>${l}</a>`).join('')}</div></nav>`;
  }
  const greet = () => { const h = hour(); return h < 5 ? 'Burning the midnight oil' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };

  /* ============ screens ============ */
  function viewOnboard(step = 0) {
    if (step === 0) {
      app.innerHTML = `<div class="onboard screen">
        <div class="big-emoji">🎓</div>
        <h1>The <span>CS degree</span><br>you never took.</h1>
        <p class="muted">Logic, bits, Big-O, data structures, algorithms, graphs, calculus, theory of computation — in 5-minute lessons built for engineers who learned on the job.</p>
        <p class="small muted">13 units · ${totalLessons()} lessons · interactive labs · a real-looking diploma 😎</p>
        <button class="btn pulse" id="go">Let's go</button>
      </div>`;
      $('#go').onclick = () => { sfx.tap(); viewOnboard(1); };
    } else if (step === 1) {
      app.innerHTML = `<div class="onboard screen">
        <div class="big-emoji">👋</div>
        <h1>What should we<br>call you?</h1>
        <p class="muted">It goes on your diploma.</p>
        <input class="answer-input" id="nm" maxlength="40" placeholder="Your name" autocomplete="given-name" value="${esc(S.name)}">
        <button class="btn" id="go">Continue</button>
      </div>`;
      const go = () => { S.name = $('#nm').value.trim() || 'Engineer'; save(); sfx.tap(); viewOnboard(2); };
      $('#go').onclick = go;
      $('#nm').onkeydown = e => e.key === 'Enter' && go();
      setTimeout(() => $('#nm').focus(), 300);
    } else {
      const opts = [[30, '☕', 'Casual', '~5 min a day'], [50, '🚶', 'Regular', '~10 min a day'], [100, '🏃', 'Serious', '~20 min a day'], [200, '🚀', 'Insane', 'cramming for finals']];
      app.innerHTML = `<div class="onboard screen">
        <div class="big-emoji">🎯</div>
        <h1>Pick a daily goal</h1>
        <p class="muted">Small and daily beats big and rare. You can change it anytime.</p>
        <div class="goal-opts">${opts.map(([x, i, n, d]) => `<button class="choice ${S.goal === x ? 'sel' : ''}" data-x="${x}"><span style="font-size:28px">${i}</span><span class="grow"><b>${n}</b><br><span class="small muted">${d}</span></span><b class="small">${x} XP</b></button>`).join('')}</div>
        <button class="btn" id="go">Start learning</button>
      </div>`;
      app.querySelectorAll('[data-x]').forEach(b => b.onclick = () => { S.goal = +b.dataset.x; app.querySelectorAll('[data-x]').forEach(x => x.classList.toggle('sel', x === b)); sfx.tap(); });
      $('#go').onclick = () => { S.created = S.created || new Date().toISOString(); save(); sfx.win(); confetti(80); location.hash = '#/'; render(); };
    }
  }

  function viewHome() {
    const nx = nextLesson();
    const lv = levelInfo();
    const tx = todayXP();
    const facts = allFacts();
    const fact = facts.length ? facts[(new Date().getDate() * 7 + new Date().getMonth()) % facts.length] : null;
    const reviewable = reviewPool().length;
    const doneN = doneLessons(), total = totalLessons();
    app.innerHTML = topbar() + `<div class="screen">
      <div class="small muted" style="margin:2px 4px">${greet()}, <b>${esc(S.name || 'Engineer')}</b> ${learnedToday() ? '✅' : '👀'}</div>
      ${nx ? `<div class="card hero">
        <div class="kicker">${doneN ? 'Up next' : 'Start here'} · ${esc(nx.u.title)}</div>
        <h2>${nx.l.emoji} ${esc(nx.l.title)}</h2>
        <p>${learnedToday() ? 'Keep the momentum going!' : streakNow() ? `Keep your ${streakNow()}-day streak alive 🔥` : 'One small lesson. That\'s all it takes.'}</p>
        <button class="btn white" id="cont">${doneN ? 'Continue' : 'Start'} ▶</button>
      </div>` : `<div class="card hero"><div class="kicker">All lessons complete</div><h2>🎓 You did it!</h2><p>Your diploma is ready. Keep sharp with daily reviews.</p><a class="btn white" href="#/diploma">View diploma</a></div>`}

      <div class="card row">
        ${ring(tx / S.goal, tx >= S.goal ? '✓' : Math.round(tx / S.goal * 100) + '%', tx >= S.goal ? 'var(--good)' : 'var(--gold)')}
        <div class="grow"><b>Daily goal</b><div class="small muted">${tx} / ${S.goal} XP today${tx >= S.goal ? ' — crushed it! 🎉' : ''}</div>
          <div class="small" style="margin-top:4px">${lv.icon} Level ${lv.n} · <b>${lv.title}</b></div>
          <div class="bar" style="height:8px;margin-top:4px"><i style="width:${lv.pct * 100}%"></i></div>
        </div>
      </div>

      ${reviewable ? `<a href="#/review" class="card unit-card" style="text-decoration:none"><div class="uemoji" style="background:color-mix(in srgb,var(--accent2) 25%,transparent)">🔁</div><div class="grow"><h3>Daily review</h3><div class="small muted">Spaced repetition keeps it in long-term memory. +bonus XP</div></div><b>›</b></a>` : ''}

      ${fact ? `<div class="card fun" style="margin:14px 0"><b>🤓 Fact of the day</b> <span class="small muted">· ${esc(fact.u.title)}</span><div class="small" style="margin-top:4px">${fact.html.replace(/^\s*🤓\s*(Fun fact:)?\s*/i, '')}</div></div>` : ''}

      <div class="section-title">Your degree · ${doneN}/${total} lessons</div>
      <div class="bar" style="margin:6px 4px 4px"><i style="width:${total ? doneN / total * 100 : 0}%"></i></div>
      ${UNITS.map((u, i) => {
        const d = unitDoneCount(u), n = u.lessons.length;
        return `<a class="card unit-card" href="#/unit/${u.id}">
          <div class="uemoji" style="background:color-mix(in srgb, ${u.color} 28%, transparent)">${u.emoji}</div>
          <div class="grow"><div class="num">Unit ${i + 1}</div><h3>${esc(u.title)}</h3><div class="small muted">${esc(u.tagline)}</div></div>
          ${ring(d / n, `${d}/${n}`, u.color, 52)}
          ${d === n ? '<span class="done-badge">🏅</span>' : ''}
        </a>`;
      }).join('')}
      <a class="card unit-card" href="#/diploma"><div class="uemoji" style="background:color-mix(in srgb, var(--gold) 28%, transparent)">📜</div><div class="grow"><div class="num">Final boss</div><h3>Your Diploma</h3><div class="small muted">Complete all units to graduate</div></div></a>
    </div>` + nav('home');
    if (nx) $('#cont').onclick = () => go(`#/lesson/${nx.u.id}/${nx.l.id}`);
  }

  function viewUnit(id) {
    const u = unitById(id);
    if (!u) return go('#/');
    const firstOpen = u.lessons.findIndex(l => !isDone(u, l));
    app.innerHTML = topbar() + `<div class="screen" style="--uc:${u.color}">
      <a href="#/" class="small muted" style="text-decoration:none">‹ All units</a>
      <div class="unit-head" style="background:linear-gradient(135deg, ${u.color}, color-mix(in srgb, ${u.color} 50%, #000))">
        <div style="font-size:44px">${u.emoji}</div>
        <h1>${esc(u.title)}</h1><p>${esc(u.tagline)}</p>
        <div class="bar" style="margin-top:12px;background:rgba(255,255,255,.2)"><i style="width:${unitDoneCount(u) / u.lessons.length * 100}%"></i></div>
        <div class="small" style="margin-top:4px;opacity:.9">${unitDoneCount(u)} of ${u.lessons.length} lessons</div>
      </div>
      <div class="path">
        ${u.lessons.map((l, i) => {
          const done = isDone(u, l), open = lessonUnlocked(u, i);
          const off = [0, 60, 80, 40, -40, -80, -60][i % 7];
          const acc = done ? S.done[`${u.id}/${l.id}`].acc : 0;
          const stars = done ? '⭐'.repeat(acc >= 1 ? 3 : acc >= .7 ? 2 : 1) : '';
          return `<div class="node-wrap" style="transform:translateX(${off}px)">
            ${i === firstOpen ? `<div class="start-tip">${i === 0 ? 'Start' : 'Next'}</div>` : ''}
            <button class="node ${done ? 'done' : open ? 'open' : 'locked'}" data-i="${i}" aria-label="${esc(l.title)}">${open || done ? l.emoji : '🔒'}<span class="stars">${stars}</span></button>
            <div class="node-label">${esc(l.title)}</div>
          </div>`;
        }).join('')}
        <div class="node-wrap"><div class="node ${unitComplete(u) ? 'done' : 'locked'}" style="font-size:40px">🏆</div><div class="node-label">Unit trophy</div></div>
      </div>
    </div>` + nav('home');
    app.querySelectorAll('.node[data-i]').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if (!lessonUnlocked(u, i)) { buzz(60); toast('🔒', 'Locked', 'Finish the previous lesson first'); return; }
      go(`#/lesson/${u.id}/${u.lessons[i].id}`);
    });
  }

  /* ============ lesson player ============ */
  const PRAISE = ['Nailed it!', 'Correct!', 'Awesome!', 'Big brain!', 'Exactly!', 'Ship it! 🚢', 'LGTM ✅', '200 OK', 'Green build!', 'You got it!', 'Brilliant!', 'Textbook!'];
  const OOPS = ['Not quite', 'Close!', 'Almost', '500: Brain Error', 'Off by one?', 'Rollback!'];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const norm = s => String(s).toLowerCase().normalize('NFKC').replace(/\s+/g, '').replace(/[“”"']/g, '').replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\^n/g, 'ⁿ').replace(/,(?=\d{3}\b)/g, '').replace(/\.$/, '');
  function inputCorrect(given, answer) {
    const answers = Array.isArray(answer) ? answer : [answer];
    const g = norm(given);
    if (!g) return false;
    return answers.some(a => {
      const n = norm(a);
      if (n === g) return true;
      const x = parseFloat(g), y = parseFloat(n);
      return /^-?[\d.]+(e-?\d+)?$/.test(g) && /^-?[\d.]+(e-?\d+)?$/.test(n) && Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(y));
    });
  }
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const isQ = s => ['mcq', 'tf', 'input', 'order'].includes(s.type);

  function viewLesson(uid, lid, reviewItems) {
    let title, queue, u, l, mode;
    if (reviewItems) {
      mode = 'review'; title = 'Daily review';
      queue = reviewItems.map(r => ({ ...r.step, _ref: r.ref, _src: r.u.title }));
    } else {
      u = unitById(uid); l = u && u.lessons.find(x => x.id === lid);
      if (!l) return go('#/');
      mode = 'lesson'; title = l.title;
      queue = l.steps.map((s, i) => ({ ...s, _ref: `${u.id}/${l.id}/${i}` }));
    }
    const totalQ = queue.filter(isQ).length;
    let pos = 0, firstTry = 0, xpEarned = 0, combo = 0, bestCombo = 0, retries = 0;
    const missedOnce = new Set();
    const started = Date.now();

    app.innerHTML = `<div class="player">
      <div class="player-top"><button class="x" id="quit" aria-label="Quit">✕</button><div class="bar"><i id="pbar" style="width:0%"></i></div><div class="combo" id="combo"></div></div>
      <div id="stage"></div>
      <div class="footer" id="foot"><div class="footer-inner" id="footIn"></div></div>
    </div>`;
    $('#quit').onclick = () => {
      if (pos === 0) return history.back();
      modal(`<div class="mi">😢</div><h2>Wait, don't go!</h2><p class="muted">You'll lose your progress in this ${mode}.</p>`,
        [{ label: 'Keep learning', cls: '' }, { label: 'Quit', cls: 'ghost', onClick: () => go(mode === 'review' ? '#/' : `#/unit/${uid}`) }]);
    };

    const setProgress = () => { $('#pbar').style.width = (pos / queue.length * 100) + '%'; };
    const setCombo = () => { $('#combo').textContent = combo >= 3 ? `🔥${combo}` : ''; };

    function footer(state, html, btnLabel, onClick, disabled) {
      const f = $('#foot');
      f.className = 'footer' + (state ? ' ' + state : '');
      $('#footIn').innerHTML = (html || '') + `<button class="btn ${state === 'good' ? 'good' : state === 'bad' ? 'bad' : ''}" id="fbtn" ${disabled ? 'disabled' : ''}>${btnLabel}</button>`;
      $('#fbtn').onclick = onClick;
      return $('#fbtn');
    }

    function show() {
      setProgress(); setCombo();
      if (pos >= queue.length) return finish();
      const s = queue[pos];
      const st = $('#stage');
      st.className = 'stage'; void st.offsetWidth; st.className = 'stage';
      st.scrollTop = 0; window.scrollTo(0, 0);
      const src = s._src ? `<div class="small muted">${esc(s._src)}</div>` : '';
      const retry = s._retry ? '<div class="qlabel" style="color:var(--fire)">↻ Let\'s try that again</div>' : '';

      if (s.type === 'learn') {
        st.innerHTML = `${s.title ? `<h2>${s.title}</h2>` : ''}<div class="learn-body">${s.html}</div>`;
        footer('', '', 'Continue', next);
      } else if (s.type === 'widget') {
        st.innerHTML = `${s.title ? `<h2>${s.title}</h2>` : ''}<div class="learn-body">${s.html || ''}</div><div id="wmount"></div>`;
        const w = CQ.widgets[s.widget];
        if (w) try { w($('#wmount'), s); } catch (e) { console.error(e); }
        S.stats.widgets++; save();
        footer('', '', 'Continue', next);
      } else if (s.type === 'mcq') {
        const order = shuffle(s.choices.map((c, i) => i));
        st.innerHTML = `${retry}${src}<div class="qlabel">Choose the answer</div><h2>${s.q}</h2><div class="choices">${order.map((i, k) => `<button class="choice" data-i="${i}"><span class="key">${k + 1}</span><span>${s.choices[i]}</span></button>`).join('')}</div>`;
        let sel = null;
        const btn = footer('', '', 'Check', () => grade(sel === s.answer, s, () => {
          st.querySelectorAll('.choice').forEach(c => { c.disabled = true; if (+c.dataset.i === s.answer) c.classList.add('right'); else if (+c.dataset.i === sel) c.classList.add('wrong'); });
        }, s.choices[s.answer]), true);
        st.querySelectorAll('.choice').forEach(c => c.onclick = () => { sel = +c.dataset.i; st.querySelectorAll('.choice').forEach(x => x.classList.toggle('sel', x === c)); btn.disabled = false; sfx.tap(); });
      } else if (s.type === 'tf') {
        st.innerHTML = `${retry}${src}<div class="qlabel">True or false?</div><h2>${s.q}</h2><div class="tf"><button class="choice" data-v="1"><span style="font-size:34px">👍</span>True</button><button class="choice" data-v="0"><span style="font-size:34px">👎</span>False</button></div>`;
        let sel = null;
        const btn = footer('', '', 'Check', () => grade(sel === s.answer, s, () => {
          st.querySelectorAll('.choice').forEach(c => { c.disabled = true; const v = c.dataset.v === '1'; if (v === s.answer) c.classList.add('right'); else if (v === sel) c.classList.add('wrong'); });
        }, s.answer ? 'True' : 'False'), true);
        st.querySelectorAll('.choice').forEach(c => c.onclick = () => { sel = c.dataset.v === '1'; st.querySelectorAll('.choice').forEach(x => x.classList.toggle('sel', x === c)); btn.disabled = false; sfx.tap(); });
      } else if (s.type === 'input') {
        st.innerHTML = `${retry}${src}<div class="qlabel">Type the answer</div><h2>${s.q}</h2><input class="answer-input" id="ans" placeholder="${esc(s.placeholder || 'Your answer')}" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        const inp = $('#ans');
        const check = () => {
          if (!inp.value.trim()) return;
          const ok = inputCorrect(inp.value, s.answer);
          grade(ok, s, () => { inp.disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); }, (Array.isArray(s.answer) ? s.answer[0] : s.answer));
        };
        const btn = footer('', '', 'Check', check, true);
        inp.oninput = () => { btn.disabled = !inp.value.trim(); };
        inp.onkeydown = e => { if (e.key === 'Enter' && !btn.disabled && btn.textContent === 'Check') check(); };
        setTimeout(() => inp.focus({ preventScroll: true }), 250);
      } else if (s.type === 'order') {
        const pool = shuffle(s.items.map((t, i) => ({ t, i })));
        if (pool.every((p, k) => p.i === k)) pool.reverse();
        const chosen = [];
        st.innerHTML = `${retry}${src}<div class="qlabel">Put in order</div><h2>${s.q}</h2><div class="order-slots" id="slots"></div><div class="order-pool" id="pool"></div>`;
        const btn = footer('', '', 'Check', () => {
          const ok = chosen.every((p, k) => p.i === k);
          grade(ok, s, () => { $('#slots').classList.add(ok ? 'right' : 'wrong'); st.querySelectorAll('.tok').forEach(t => t.disabled = true); }, s.items.join(' → '));
        }, true);
        const draw = () => {
          $('#slots').innerHTML = chosen.map((p, k) => `<button class="tok" data-k="${k}"><b>${k + 1}</b>${p.t}</button>`).join('');
          $('#pool').innerHTML = pool.filter(p => !chosen.includes(p)).map(p => `<button class="tok" data-i="${p.i}">${p.t}</button>`).join('');
          $('#slots').querySelectorAll('.tok').forEach(b => b.onclick = () => { chosen.splice(+b.dataset.k, 1); sfx.tap(); draw(); });
          $('#pool').querySelectorAll('.tok').forEach(b => b.onclick = () => { chosen.push(pool.find(p => p.i === +b.dataset.i)); sfx.tap(); draw(); });
          btn.disabled = chosen.length !== s.items.length;
        };
        draw();
      }
    }

    function grade(ok, s, mark, correctText) {
      mark();
      S.stats.answered++;
      if (ok) {
        S.stats.correct++;
        combo++; bestCombo = Math.max(bestCombo, combo);
        if (combo > (S.stats.bestCombo || 0)) S.stats.bestCombo = combo;
        if (!s._retry) firstTry++;
        const gain = s._retry ? 5 : 10;
        xpEarned += gain;
        if (S.missed[s._ref]) { S.missed[s._ref]--; if (S.missed[s._ref] <= 0) delete S.missed[s._ref]; }
        sfx.right(); buzz(20);
        if (combo > 0 && combo % 5 === 0) confetti(40, '🔥');
        footer('good', `<div class="fb-head"><span class="big">🎉</span>${pick(PRAISE)} <span class="small" style="margin-left:auto;color:var(--gold)">+${gain} XP</span></div><div class="fb-text">${s.explain || ''}</div>`, 'Continue', next);
      } else {
        combo = 0;
        S.missed[s._ref] = (S.missed[s._ref] || 0) + 1;
        sfx.wrong(); buzz([60, 40, 60]);
        // re-queue so the learner masters it before finishing (max 2 retries per question)
        const key = s._ref;
        const tries = (s._tries || 0) + 1;
        if (tries <= 2) { queue.push({ ...s, _retry: true, _tries: tries }); retries++; }
        missedOnce.add(key);
        footer('bad', `<div class="fb-head"><span class="big">🤔</span>${pick(OOPS)}</div><div class="fb-text"><div class="correct">Answer: ${correctText}</div>${s.explain || ''}${tries <= 2 ? '<div class="small muted" style="margin-top:6px">↻ You\'ll see this one again in a moment.</div>' : ''}</div>`, 'Got it', next);
      }
      save(); setCombo();
    }

    function next() { pos++; show(); }

    function finish() {
      const acc = totalQ ? firstTry / totalQ : 1;
      const perfect = acc >= 1;
      let bonus = 0;
      if (mode === 'lesson') {
        const key = `${u.id}/${l.id}`;
        const prev = S.done[key];
        bonus = prev ? 10 : 25;
        if (perfect) bonus += 15;
        S.done[key] = { acc: Math.max(acc, prev ? prev.acc : 0), times: (prev ? prev.times : 0) + 1, at: new Date().toISOString() };
        S.stats.lessons++;
        if (perfect) S.stats.perfect++;
      } else {
        bonus = 15 + (perfect ? 10 : 0);
        S.stats.reviews++;
      }
      // comeback detection
      if (S.streak.last && daysBetween(S.streak.last, dayKey()) >= 4) S.stats.comeback = true;
      xpEarned += bonus;
      const wasStreak = learnedToday();
      addXP(xpEarned);
      const secs = Math.round((Date.now() - started) / 1000);
      const unitDoneNow = mode === 'lesson' && unitComplete(u) && S.done[`${u.id}/${l.id}`].times === 1;
      const msg = perfect ? pick(['Flawless victory!', 'Perfect run!', 'Zero defects!', '100% test coverage!']) : acc >= .7 ? pick(['Great job!', 'Solid work!', 'Deployed successfully!']) : pick(['Done! Practice makes permanent.', 'Finished — the review will lock it in!']);
      sfx.win(); buzz([40, 60, 40, 60, 80]);
      confetti(perfect ? 220 : 140, perfect ? '💎' : '⭐');
      const fb = mode === 'lesson' ? `${u.emoji} ${esc(l.title)}` : '🔁 Daily review';
      app.innerHTML = `<div class="celebrate screen">
        <div class="trophy">${unitDoneNow ? '🏆' : perfect ? '💎' : mode === 'review' ? '🧠' : '⭐'}</div>
        <h1>${unitDoneNow ? 'Unit complete!' : msg}</h1>
        <div class="muted">${fb}${unitDoneNow ? ` — you finished <b>${esc(u.title)}</b>!` : ''}</div>
        <div class="stats">
          <div class="stat x"><div class="lbl">Total XP</div><div class="val">+${xpEarned}</div></div>
          <div class="stat a"><div class="lbl">Accuracy</div><div class="val">${Math.round(acc * 100)}%</div></div>
          <div class="stat s"><div class="lbl">${wasStreak ? 'Streak' : 'Streak +1'}</div><div class="val">🔥${streakNow()}</div></div>
        </div>
        <div class="small muted">⏱ ${Math.floor(secs / 60)}m ${secs % 60}s · best combo ${bestCombo} · ${totalQ} questions</div>
        <div style="display:flex;flex-direction:column;gap:14px;margin-top:26px">
          <button class="btn" id="nextBtn">Continue</button>
          <button class="btn ghost" id="shareBtn">📣 Share</button>
        </div>
      </div>`;
      $('#shareBtn').onclick = () => share(mode === 'lesson'
        ? `I just ${unitDoneNow ? 'completed the unit "' + u.title + '"' : 'finished "' + l.title + '"'} on CS Degree Quest 🎓 (${Math.round(acc * 100)}% accuracy, 🔥${streakNow()}-day streak). Learning the CS degree I never took!`
        : `Daily CS review done on CS Degree Quest 🧠 🔥${streakNow()}-day streak!`);
      $('#nextBtn').onclick = () => {
        const after = () => {
          const nx = nextLesson();
          if (mode === 'lesson' && !unitDoneNow && nx && nx.u.id === u.id) go(`#/unit/${u.id}`);
          else go('#/');
        };
        const lvl = S._levelUp, goal = S._goalJustHit;
        delete S._levelUp; delete S._goalJustHit; save();
        const chain = [];
        if (goal) chain.push(cb => { sfx.win(); confetti(120, '🎯'); modal(`<div class="mi">🎯</div><h2>Daily goal reached!</h2><p class="muted">${S.goal} XP today. Consistency is the real algorithm.</p>`, [{ label: 'Nice!', onClick: cb }]); });
        if (lvl) chain.push(cb => { sfx.badge(); confetti(200, lvl.icon); modal(`<div class="mi">${lvl.icon}</div><h2>Level ${lvl.n}!</h2><p>You're now a <b>${lvl.title}</b>.</p>${lvl.nextTitle ? `<p class="small muted">Next: ${lvl.nextTitle} at ${lvl.next} XP</p>` : ''}`, [{ label: 'Let\'s gooo', onClick: cb }]); });
        const run = () => chain.length ? chain.shift()(run) : after();
        run();
      };
      checkBadges(true);
    }

    show();
  }

  /* ============ review (spaced repetition lite) ============ */
  function reviewPool() {
    const pool = [];
    for (const u of UNITS) for (const l of u.lessons) {
      if (!isDone(u, l)) continue;
      l.steps.forEach((s, i) => {
        if (!isQ(s)) return;
        const ref = `${u.id}/${l.id}/${i}`;
        const doneAt = new Date(S.done[`${u.id}/${l.id}`].at).getTime();
        const ageDays = (Date.now() - doneAt) / 864e5;
        // weight: missed questions first, then older lessons (forgetting curve)
        const w = (S.missed[ref] || 0) * 5 + Math.min(ageDays, 30) / 3 + Math.random() * 2;
        pool.push({ u, l, step: s, ref, w });
      });
    }
    return pool;
  }
  function viewReview() {
    const pool = reviewPool();
    if (!pool.length) {
      app.innerHTML = topbar() + `<div class="screen center" style="padding-top:30px">
        <div style="font-size:80px">🔁</div><h2>Review unlocks soon</h2>
        <p class="muted">Finish a lesson and its questions will come back here — spaced out over time, with the ones you missed first. That's how stuff moves into long-term memory.</p>
        <a class="btn" href="#/">Go learn something</a></div>` + nav('review');
      return;
    }
    const missed = pool.filter(p => S.missed[p.ref]).length;
    app.innerHTML = topbar() + `<div class="screen">
      <div class="card hero" style="margin-top:8px"><div class="kicker">Spaced repetition</div><h2>🔁 Daily review</h2>
        <p>8 questions from lessons you've finished. ${missed ? `<b>${missed}</b> you previously missed get priority.` : 'Nice — no outstanding misses!'}</p>
        <button class="btn white" id="startR">Start review</button></div>
      <div class="card"><h3>🧠 Why review?</h3><p class="small muted" style="margin:0">The "forgetting curve" (Ebbinghaus, 1885) says we forget ~70% of new info within a day unless we retrieve it. Each recall resets the curve and makes it flatter. It's basically cache warming — for your brain.</p></div>
      <div class="kv">
        <div class="card"><div class="v">${pool.length}</div><div class="k">Questions in pool</div></div>
        <div class="card"><div class="v">${S.stats.reviews}</div><div class="k">Reviews done</div></div>
      </div>
    </div>` + nav('review');
    $('#startR').onclick = () => {
      const picked = pool.sort((a, b) => b.w - a.w).slice(0, 8);
      viewLesson(null, null, shuffle(picked));
    };
  }

  /* ============ badges ============ */
  function viewBadges() {
    const got = BADGES.filter(b => S.badges[b.id]).length + UNITS.filter(u => S.badges['unit:' + u.id]).length;
    const all = BADGES.length + UNITS.length;
    app.innerHTML = topbar() + `<div class="screen">
      <div class="section-title">Achievements · ${got}/${all}</div>
      <div class="bar" style="margin:6px 4px 14px"><i style="width:${got / all * 100}%"></i></div>
      <div class="badges">${BADGES.map(b => `<div class="badge ${S.badges[b.id] ? '' : 'locked'}"><span class="bi">${b.icon}</span><div class="bn">${b.name}</div><div class="bd">${b.desc}</div></div>`).join('')}</div>
      <div class="section-title">Course certificates</div>
      <div class="badges">${UNITS.map(u => `<div class="badge ${S.badges['unit:' + u.id] ? '' : 'locked'}"><span class="bi">${u.emoji}</span><div class="bn">${esc(u.title)}</div><div class="bd">${unitDoneCount(u)}/${u.lessons.length} lessons</div></div>`).join('')}</div>
    </div>` + nav('badges');
  }

  /* ============ profile ============ */
  function viewProfile() {
    const lv = levelInfo();
    const acc = S.stats.answered ? Math.round(S.stats.correct / S.stats.answered * 100) : 0;
    // 8-week heatmap
    const cells = [];
    const today = new Date();
    for (let i = 55; i >= 0; i--) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const x = S.days[dayKey(d)] || 0;
      cells.push(`<i class="${x >= S.goal ? 'l3' : x >= S.goal / 2 ? 'l2' : x > 0 ? 'l1' : ''} ${i === 0 ? 'today' : ''}" title="${dayKey(d)}: ${x} XP"></i>`);
    }
    app.innerHTML = topbar() + `<div class="screen">
      <div class="card row" style="margin-top:8px">
        <div class="level-badge">${lv.icon}</div>
        <div class="grow"><h2 style="margin:0">${esc(S.name || 'Engineer')}</h2>
          <div class="small muted">Level ${lv.n} · <b>${lv.title}</b></div>
          <div class="bar" style="margin-top:6px;height:10px"><i style="width:${lv.pct * 100}%"></i></div>
          <div class="small muted" style="margin-top:2px">${lv.next ? `${lv.next - S.xp} XP to ${lv.nextTitle}` : 'Max level. Legend.'}</div>
        </div>
      </div>
      <div class="kv">
        <div class="card"><div class="v">🔥 ${streakNow()}</div><div class="k">Day streak</div></div>
        <div class="card"><div class="v">🏔️ ${S.streak.best}</div><div class="k">Best streak</div></div>
        <div class="card"><div class="v">⚡ ${S.xp.toLocaleString()}</div><div class="k">Total XP</div></div>
        <div class="card"><div class="v">🎯 ${acc}%</div><div class="k">Accuracy</div></div>
        <div class="card"><div class="v">📚 ${doneLessons()}</div><div class="k">Lessons</div></div>
        <div class="card"><div class="v">🧊 ${S.streak.freezes}</div><div class="k">Streak freezes</div></div>
      </div>
      <div class="card"><b>Last 8 weeks</b><div class="heat">${cells.join('')}</div></div>
      <a class="card unit-card" href="#/diploma"><div class="uemoji" style="background:color-mix(in srgb,var(--gold) 28%,transparent)">📜</div><div class="grow"><h3>Diploma</h3><div class="small muted">${UNITS.filter(unitComplete).length}/${UNITS.length} units complete</div></div><b>›</b></a>

      <div class="section-title">Settings</div>
      <div class="card settings">
        <div class="row"><div class="grow">Name</div><button class="btn sm ghost" id="sName">${esc(S.name || 'Set')}</button></div>
        <div class="row"><div class="grow">Daily goal</div><button class="btn sm ghost" id="sGoal">${S.goal} XP</button></div>
        <div class="row"><div class="grow">Theme</div><button class="btn sm ghost" id="sTheme">${{ auto: '🌗 Auto', dark: '🌙 Dark', light: '☀️ Light' }[S.theme]}</button></div>
        <div class="row"><div class="grow">Sound effects</div><button class="switch ${S.sound ? 'on' : ''}" id="sSound" aria-label="Sound"></button></div>
        <div class="row"><div class="grow">Vibration</div><button class="switch ${S.haptics ? 'on' : ''}" id="sHap" aria-label="Vibration"></button></div>
        <div class="row"><div class="grow">Daily reminder<div class="small muted">Adds a repeating event to your calendar</div></div><button class="btn sm ghost" id="sRem">📅 Add</button></div>
      </div>
      <div class="section-title">Your data</div>
      <div class="card settings">
        <div class="small muted" style="margin-bottom:8px">Progress is stored on this device only. Move it to another device with export/import.</div>
        <div class="row"><div class="grow">Export progress</div><button class="btn sm ghost" id="sExp">⬇️ Export</button></div>
        <div class="row"><div class="grow">Import progress</div><button class="btn sm ghost" id="sImp">⬆️ Import</button></div>
        <div class="row"><div class="grow">Share the app</div><button class="btn sm ghost" id="sShare">📣 Share</button></div>
        <div class="row"><div class="grow" style="color:var(--bad)">Reset everything</div><button class="btn sm bad" id="sReset">Reset</button></div>
      </div>
      <p class="small muted center">Made with ❤️ for engineers who learned on the job.</p>
    </div>` + nav('profile');
    $('#sName').onclick = () => { const n = prompt('Your name (for the diploma):', S.name); if (n != null) { S.name = n.trim() || S.name; save(); viewProfile(); } };
    $('#sGoal').onclick = () => { const g = [30, 50, 100, 200]; S.goal = g[(g.indexOf(S.goal) + 1) % g.length]; save(); viewProfile(); };
    $('#sTheme').onclick = () => { const t = ['auto', 'dark', 'light']; S.theme = t[(t.indexOf(S.theme) + 1) % 3]; save(); applyTheme(); viewProfile(); };
    $('#sSound').onclick = () => { S.sound = !S.sound; save(); sfx.tap(); viewProfile(); };
    $('#sHap').onclick = () => { S.haptics = !S.haptics; save(); buzz(30); viewProfile(); };
    $('#sRem').onclick = reminderICS;
    $('#sExp').onclick = () => download('cs-quest-progress.json', JSON.stringify(S, null, 1), 'application/json');
    $('#sImp').onclick = () => {
      const i = document.createElement('input'); i.type = 'file'; i.accept = 'application/json,.json';
      i.onchange = async () => { try { const d = JSON.parse(await i.files[0].text()); if (typeof d.xp !== 'number') throw 0; S = deepMerge(structuredClone(DEFAULT), d); save(); toast('✅', 'Imported', 'Welcome back!'); viewProfile(); } catch { toast('⚠️', 'Import failed', 'That file doesn\'t look right'); } };
      i.click();
    };
    $('#sShare').onclick = () => share('I\'m learning the CS degree I never took — logic, Big-O, algorithms, graphs, calculus — in 5-minute lessons. Join me on CS Degree Quest 🎓');
    $('#sReset').onclick = () => modal('<div class="mi">💣</div><h2>Reset all progress?</h2><p class="muted">This is the <code>rm -rf</code> of your degree. No undo.</p>',
      [{ label: 'Cancel' }, { label: 'Yes, reset', cls: 'bad', onClick: () => { localStorage.removeItem(KEY); S = structuredClone(DEFAULT); applyTheme(); go('#/'); } }]);
  }

  /* ============ diploma ============ */
  function viewDiploma() {
    const complete = UNITS.length && UNITS.every(unitComplete);
    const date = complete ? new Date(Object.entries(S.badges).filter(([k]) => k.startsWith('unit:')).map(([, v]) => v).sort().pop()) : new Date();
    const n = UNITS.filter(unitComplete).length;
    app.innerHTML = topbar() + `<div class="screen">
      <a href="#/" class="small muted no-print" style="text-decoration:none">‹ Back</a>
      ${complete ? '' : `<div class="card center no-print"><b>🔒 ${n}/${UNITS.length} units complete</b><div class="bar" style="margin-top:8px"><i style="width:${n / UNITS.length * 100}%"></i></div><p class="small muted" style="margin-bottom:0">Finish every unit to unlock your diploma. Here's a sneak peek:</p></div>`}
      <div class="diploma ${complete ? '' : 'locked'}" style="margin-top:14px">
        <div class="seal">🎓</div>
        <div style="letter-spacing:.2em;font-size:12px">CS DEGREE QUEST · SCHOOL OF HARD KNOCKS & SOFTWARE</div>
        <h1>Diploma of Computer Science</h1>
        <div style="font-style:italic">This certifies that</div>
        <div class="name">${esc(S.name || 'Engineer')}</div>
        <div style="font-size:15px;line-height:1.5">has completed ${totalLessons()} lessons across ${UNITS.length} courses, including<br><i>${UNITS.map(u => esc(u.title)).join(' · ')}</i><br>and is hereby recognized as a <b>real engineer</b>, impostor syndrome notwithstanding.</div>
        <div style="display:flex;justify-content:space-between;margin-top:20px;font-size:13px"><div>${date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}<br>—————<br>Date</div><div>⚡ ${S.xp.toLocaleString()} XP<br>—————<br>Honors</div></div>
      </div>
      ${complete ? `<div class="no-print" style="display:flex;flex-direction:column;gap:14px;margin-top:22px"><button class="btn" onclick="print()">🖨️ Print / Save PDF</button><button class="btn ghost" id="dShare">📣 Share</button></div>` : ''}
    </div>` + nav('profile');
    if (complete) {
      confetti(200, '🎓'); sfx.win();
      $('#dShare').onclick = () => share(`🎓 I graduated from CS Degree Quest! ${totalLessons()} lessons across ${UNITS.length} courses — logic, Big-O, algorithms, graphs, calculus & more.`);
    }
  }

  /* ============ utils ============ */
  async function share(text) {
    const url = location.href.split('#')[0];
    try {
      if (navigator.share) { await navigator.share({ title: 'CS Degree Quest', text, url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(`${text} ${url}`); toast('📋', 'Copied', 'Paste it anywhere!'); } catch { prompt('Copy this:', `${text} ${url}`); }
  }
  function download(name, data, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([data], { type }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }
  function reminderICS() {
    const t = prompt('Remind me every day at (HH:MM):', '20:30');
    if (!t || !/^\d{1,2}:\d{2}$/.test(t)) return;
    const [h, m] = t.split(':').map(Number);
    const d = new Date(); d.setHours(h, m, 0, 0);
    const pad = x => String(x).padStart(2, '0');
    const loc = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(h)}${pad(m)}00`;
    const url = location.href.split('#')[0];
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CS Degree Quest//EN', 'BEGIN:VEVENT', `UID:cs-quest-${Date.now()}@cs-quest`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${loc}`, 'DURATION:PT10M', 'RRULE:FREQ=DAILY', 'SUMMARY:🎓 CS Quest — keep your streak!', `DESCRIPTION:10 minutes. One lesson. ${url}`, `URL:${url}`,
      'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', 'DESCRIPTION:CS Quest time!', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    download('cs-quest-reminder.ics', ics, 'text/calendar');
    toast('📅', 'Reminder ready', 'Open the file to add it to your calendar');
  }

  /* ============ router ============ */
  function go(h) { if (location.hash === h) render(); else location.hash = h; }
  function render() {
    window.scrollTo(0, 0);
    if (!S.created) return viewOnboard(0);
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    switch (parts[0]) {
      case 'unit': return viewUnit(parts[1]);
      case 'lesson': return viewLesson(parts[1], parts[2]);
      case 'review': return viewReview();
      case 'badges': return viewBadges();
      case 'profile': return viewProfile();
      case 'diploma': return viewDiploma();
      default: return viewHome();
    }
  }
  addEventListener('hashchange', render);
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => S.theme === 'auto' && applyTheme());

  // welcome-back nudges
  if (S.created) {
    const last = S.lastVisit, today = dayKey();
    if (last && last !== today && S.streak.last && !learnedToday()) {
      const gap = daysBetween(S.streak.last, today);
      setTimeout(() => {
        if (gap === 1) toast('🔥', 'Welcome back!', `Do one lesson to make it ${S.streak.count + 1} days`);
        else if (gap >= 3) toast('🩹', 'Incident resolved?', 'No blame. Let\'s restart the streak today.');
      }, 900);
    }
    S.lastVisit = today; save();
  }
  render();
  checkBadges();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
  CQ.app = { state: () => S, render, confetti };
  CQ._inputCorrect = inputCorrect;
})();

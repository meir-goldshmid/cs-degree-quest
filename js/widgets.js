/* Interactive labs. Each widget: CQ.widgets[name] = (mountEl, step) => void */
(() => {
  'use strict';
  const W = CQ.widgets;
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const box = (el, html) => { el.innerHTML = `<div class="widget">${html}</div>`; return el.firstElementChild; };
  const q = (s, el) => el.querySelector(s);
  const qa = (s, el) => [...el.querySelectorAll(s)];
  const fmt = n => !isFinite(n) ? '∞' : n >= 1e15 ? n.toExponential(2) : n >= 1e6 ? n.toExponential(2) : Math.round(n * 100) / 100 + '';
  function setupCanvas(cv, h) {
    const w = cv.clientWidth || 320, dpr = devicePixelRatio || 1;
    cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
    const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { c, w, h };
  }

  /* ---------- bits ---------- */
  W.bits = el => {
    const b = box(el, `<div class="w-row" id="bits"></div>
      <div class="w-row" style="margin-top:10px"><button class="tbtn" data-a="clr">0</button><button class="tbtn" data-a="inc">+1</button><button class="tbtn" data-a="shl">&lt;&lt; 1</button><button class="tbtn" data-a="not">NOT</button></div>
      <div class="readout" id="ro"></div>`);
    let v = 0b00101010;
    const draw = () => {
      q('#bits', b).innerHTML = [...Array(8)].map((_, i) => { const p = 7 - i; return `<button class="bit ${v >> p & 1 ? 'on' : ''}" data-p="${p}">${v >> p & 1}<small>${1 << p}</small></button>`; }).join('');
      qa('.bit', b).forEach(x => x.onclick = () => { v ^= 1 << +x.dataset.p; draw(); });
      const signed = v & 0x80 ? v - 256 : v;
      const ch = v >= 32 && v < 127 ? `'${String.fromCharCode(v)}'` : '—';
      q('#ro', b).innerHTML = `binary  <b>${v.toString(2).padStart(8, '0')}</b><br>decimal <b>${v}</b> (unsigned)<br>signed  <b>${signed}</b> (two's complement)<br>hex     <b>0x${v.toString(16).toUpperCase().padStart(2, '0')}</b> · octal <b>${v.toString(8)}</b><br>ASCII   <b>${ch}</b>`;
    };
    qa('[data-a]', b).forEach(x => x.onclick = () => {
      const a = x.dataset.a;
      v = a === 'clr' ? 0 : a === 'inc' ? (v + 1) & 255 : a === 'shl' ? (v << 1) & 255 : (~v) & 255;
      draw();
    });
    draw();
  };

  /* ---------- truth ---------- */
  W.truth = el => {
    const b = box(el, `<div class="w-row"><button class="tbtn" id="A">A = 0</button><button class="tbtn" id="B">B = 0</button></div><div class="truth-grid" id="tg"></div>
      <div class="readout small" style="font-size:13px">Tip: find the only row where <b>A → B</b> is false.</div>`);
    let A = false, B = false;
    const ops = [['A ∧ B (AND)', (a, b) => a && b], ['A ∨ B (OR)', (a, b) => a || b], ['A ⊕ B (XOR)', (a, b) => a !== b], ['¬A (NOT A)', a => !a],
      ['A → B (IMPLIES)', (a, b) => !a || b], ['A ↔ B (IFF)', (a, b) => a === b], ['¬(A ∧ B) NAND', (a, b) => !(a && b)], ['¬(A ∨ B) NOR', (a, b) => !(a || b)]];
    const draw = () => {
      q('#A', b).textContent = `A = ${+A}`; q('#A', b).classList.toggle('on', A);
      q('#B', b).textContent = `B = ${+B}`; q('#B', b).classList.toggle('on', B);
      q('#tg', b).innerHTML = ops.map(([n, f]) => { const r = f(A, B); return `<div class="${r ? 't' : ''}"><span>${n}</span><span>${r ? '1' : '0'}</span></div>`; }).join('');
    };
    q('#A', b).onclick = () => { A = !A; draw(); };
    q('#B', b).onclick = () => { B = !B; draw(); };
    draw();
  };

  /* ---------- growth ---------- */
  W.growth = el => {
    const b = box(el, `<div class="row"><b style="font-family:var(--mono)">n =</b><input type="range" min="1" max="100" value="10" id="n" class="grow"><b id="nv" style="font-family:var(--mono);min-width:36px;text-align:right"></b></div>
      <div class="small muted center" style="margin-top:4px">Bar = operations (n² fills the bar). Time column assumes 1 op = 1 µs.</div><div class="gbars" id="gb"></div>`);
    const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
    const fns = [['O(1)', () => 1, '#2ee59d'], ['O(log n)', n => Math.max(1, Math.log2(n)), '#00d4ff'], ['O(n)', n => n, '#7c5cff'], ['O(n log n)', n => n * Math.max(1, Math.log2(n)), '#b44dff'],
      ['O(n²)', n => n * n, '#ffc83d'], ['O(2ⁿ)', n => 2 ** n, '#ff8a3d'], ['O(n!)', fact, '#ff5c7a']];
    const time = us => {
      const s = us / 1e6;
      if (!isFinite(s)) return '∞';
      if (s < 1e-3) return us.toFixed(us < 10 ? 1 : 0) + ' µs';
      if (s < 1) return (s * 1e3).toFixed(1) + ' ms';
      if (s < 60) return s.toFixed(1) + ' s';
      if (s < 3600) return (s / 60).toFixed(1) + ' min';
      if (s < 86400) return (s / 3600).toFixed(1) + ' h';
      if (s < 3.15e7) return (s / 86400).toFixed(1) + ' days';
      const y = s / 3.15e7;
      return y > 1.38e10 ? '> universe 🌌' : y > 1e6 ? y.toExponential(1) + ' yr' : Math.round(y).toLocaleString() + ' yr';
    };
    const draw = () => {
      const n = +q('#n', b).value; q('#nv', b).textContent = n;
      const max = n * n;
      q('#gb', b).innerHTML = fns.map(([l, f, c]) => { const v = f(n); const over = v > max * 1.0001; return `<div class="gbar"><span>${l}</span><div class="track"><div class="fill" style="width:${Math.min(100, v / max * 100)}%;background:${c}"></div></div><span class="num">${over ? '💥 ' : ''}${time(v)}</span></div>`; }).join('');
    };
    q('#n', b).oninput = draw; draw();
  };

  /* ---------- guess (binary search game) ---------- */
  W.guess = el => {
    const b = box(el, `<div class="center"><b>I'm thinking of a number from 1 to 100.</b><div class="small muted">Binary search guarantees ≤ ⌈log₂ 100⌉ = 7 guesses.</div></div>
      <div class="guess-grid" id="gg"></div>
      <div class="w-row"><input class="inline-input" id="gi" type="number" inputmode="numeric" min="1" max="100" placeholder="1–100"><button class="tbtn" id="gb">Guess</button><button class="tbtn" id="ga">🤖 Auto</button><button class="tbtn" id="gr">↺</button></div>
      <div class="readout" id="gro"></div>`);
    let secret, lo, hi, tries, log, timer;
    const reset = () => { clearInterval(timer); secret = 1 + Math.floor(Math.random() * 100); lo = 1; hi = 100; tries = 0; log = []; draw('Range: <b>1..100</b>. Your move!'); };
    const draw = msg => {
      q('#gg', b).innerHTML = [...Array(100)].map((_, i) => { const n = i + 1; return `<i class="${n === secret && lo === hi ? 'hit' : n < lo || n > hi ? 'out' : ''}">${n}</i>`; }).join('');
      q('#gro', b).innerHTML = `${msg}<br>guesses: <b>${tries}</b> · candidates left: <b>${hi - lo + 1}</b>${log.length ? '<br>' + log.join(' → ') : ''}`;
    };
    const guess = g => {
      if (!(g >= 1 && g <= 100) || lo === hi && g === secret) return;
      tries++;
      if (g === secret) { lo = hi = g; log.push(`<b>${g} ✓</b>`); draw(`🎉 Found it in <b>${tries}</b> ${tries === 1 ? 'guess' : 'guesses'}! ${tries <= 7 ? 'Logarithmic legend.' : 'Try halving the range each time.'}`); clearInterval(timer); return; }
      if (g < secret) { lo = Math.max(lo, g + 1); log.push(`${g}↑`); draw(`<b>${g}</b> is too low ⬆️  range now <b>${lo}..${hi}</b>`); }
      else { hi = Math.min(hi, g - 1); log.push(`${g}↓`); draw(`<b>${g}</b> is too high ⬇️  range now <b>${lo}..${hi}</b>`); }
    };
    q('#gb', b).onclick = () => { guess(+q('#gi', b).value); q('#gi', b).value = ''; };
    q('#gi', b).onkeydown = e => { if (e.key === 'Enter') q('#gb', b).click(); };
    q('#gr', b).onclick = reset;
    q('#ga', b).onclick = () => { clearInterval(timer); timer = setInterval(() => { if (lo === hi && log.length && log[log.length - 1].includes('✓')) return clearInterval(timer); guess(Math.floor((lo + hi) / 2)); }, 700); };
    reset();
  };

  /* ---------- sort ---------- */
  W.sort = el => {
    const b = box(el, `<div class="seg" id="alg"><button data-a="bubble" class="on">Bubble</button><button data-a="insertion">Insertion</button><button data-a="merge">Merge</button><button data-a="quick">Quick</button></div>
      <div class="sortbars" id="sb"></div>
      <div class="w-row" style="margin-top:10px"><button class="tbtn" id="play">▶ Play</button><button class="tbtn" id="shuf">🔀 Shuffle</button><button class="tbtn" id="spd">🐢</button></div>
      <div class="readout" id="sro"></div>`);
    const N = 24;
    let arr, alg = 'bubble', gen, timer, cmp, sw, fast = false;
    const fresh = () => { arr = [...Array(N)].map((_, i) => i + 1); for (let i = N - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } };
    const draw = (hl = {}) => {
      q('#sb', b).innerHTML = arr.map((v, i) => `<i style="height:${v / N * 100}%" class="${hl.done ? 'ok' : hl.swp && hl.swp.includes(i) ? 'swp' : hl.cmp && hl.cmp.includes(i) ? 'cmp' : ''}"></i>`).join('');
      const nlogn = Math.round(N * Math.log2(N));
      q('#sro', b).innerHTML = `comparisons <b>${cmp}</b> · writes/swaps <b>${sw}</b><br><span style="color:var(--muted)">n=${N}: n²/2 ≈ ${N * N / 2}, n·log₂n ≈ ${nlogn}</span>`;
    };
    function* bubble(a) { for (let i = 0; i < a.length; i++) { let swapped = false; for (let j = 0; j < a.length - 1 - i; j++) { cmp++; yield { cmp: [j, j + 1] }; if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; sw++; swapped = true; yield { swp: [j, j + 1] }; } } if (!swapped) break; } }
    function* insertion(a) { for (let i = 1; i < a.length; i++) { let j = i; while (j > 0) { cmp++; yield { cmp: [j - 1, j] }; if (a[j - 1] > a[j]) { [a[j - 1], a[j]] = [a[j], a[j - 1]]; sw++; yield { swp: [j - 1, j] }; j--; } else break; } } }
    function* merge(a, lo = 0, hi = a.length) {
      if (hi - lo < 2) return;
      const mid = (lo + hi) >> 1;
      yield* merge(a, lo, mid); yield* merge(a, mid, hi);
      const L = a.slice(lo, mid), R = a.slice(mid, hi); let i = 0, j = 0, k = lo;
      while (i < L.length && j < R.length) { cmp++; yield { cmp: [lo + i, mid + j] }; a[k] = L[i] <= R[j] ? L[i++] : R[j++]; sw++; yield { swp: [k] }; k++; }
      while (i < L.length) { a[k] = L[i++]; sw++; yield { swp: [k++] }; }
      while (j < R.length) { a[k] = R[j++]; sw++; yield { swp: [k++] }; }
    }
    function* quick(a, lo = 0, hi = a.length - 1) {
      if (lo >= hi) return;
      const p = a[hi]; let i = lo;
      for (let j = lo; j < hi; j++) { cmp++; yield { cmp: [j, hi] }; if (a[j] < p) { [a[i], a[j]] = [a[j], a[i]]; sw++; yield { swp: [i, j] }; i++; } }
      [a[i], a[hi]] = [a[hi], a[i]]; sw++; yield { swp: [i, hi] };
      yield* quick(a, lo, i - 1); yield* quick(a, i + 1, hi);
    }
    const algs = { bubble, insertion, merge, quick };
    const stop = () => { clearInterval(timer); timer = null; q('#play', b).textContent = '▶ Play'; };
    const reset = () => { stop(); fresh(); cmp = sw = 0; gen = null; draw(); };
    const step = () => {
      if (!gen) gen = algs[alg](arr);
      const r = gen.next();
      if (r.done) { stop(); draw({ done: true }); return; }
      draw(r.value);
    };
    q('#play', b).onclick = () => {
      if (timer) return stop();
      if (gen === 'done') reset();
      q('#play', b).textContent = '⏸ Pause';
      timer = setInterval(step, fast ? 12 : 60);
    };
    q('#shuf', b).onclick = reset;
    q('#spd', b).onclick = () => { fast = !fast; q('#spd', b).textContent = fast ? '🐇' : '🐢'; if (timer) { stop(); q('#play', b).click(); } };
    qa('#alg button', b).forEach(x => x.onclick = () => { alg = x.dataset.a; qa('#alg button', b).forEach(y => y.classList.toggle('on', y === x)); reset(); });
    reset();
    // stop when element leaves DOM
    const mo = new MutationObserver(() => { if (!document.body.contains(b)) { stop(); mo.disconnect(); } });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  /* ---------- graph (BFS / DFS) ---------- */
  W.graph = el => {
    const nodes = { A: [60, 40], B: [160, 30], C: [270, 50], D: [40, 140], E: [150, 120], F: [250, 150], G: [110, 210], H: [220, 230] };
    const edges = [['A', 'B'], ['A', 'D'], ['A', 'E'], ['B', 'C'], ['B', 'E'], ['C', 'F'], ['D', 'G'], ['E', 'F'], ['E', 'G'], ['F', 'H'], ['G', 'H']];
    const adj = {}; Object.keys(nodes).forEach(k => adj[k] = []);
    edges.forEach(([a, c]) => { adj[a].push(c); adj[c].push(a); });
    Object.values(adj).forEach(l => l.sort());
    const b = box(el, `<div class="seg" id="mode"><button data-m="bfs" class="on">BFS (queue)</button><button data-m="dfs">DFS (stack)</button></div>
      <svg viewBox="0 0 310 260" id="gsvg" style="width:100%;display:block"></svg>
      <div class="w-row"><button class="tbtn" id="gstep">Step ▶</button><button class="tbtn" id="gauto">Auto</button><button class="tbtn" id="greset">↺</button></div>
      <div class="readout" id="gro"></div>`);
    let mode = 'bfs', frontier, visited, order, current, timer, levels;
    const reset = () => { clearInterval(timer); timer = null; frontier = ['A']; visited = new Set(['A']); order = []; current = null; levels = { A: 0 }; draw(); };
    const stepFn = () => {
      if (!frontier.length) { clearInterval(timer); return; }
      if (mode === 'bfs') {
        current = frontier.shift(); order.push(current);
        for (const n of adj[current]) if (!visited.has(n)) { visited.add(n); levels[n] = levels[current] + 1; frontier.push(n); }
      } else {
        current = frontier.pop();
        if (order.includes(current)) return stepFn();
        order.push(current);
        for (const n of [...adj[current]].reverse()) if (!order.includes(n)) frontier.push(n);
      }
      draw();
    };
    const draw = () => {
      const acc = css('--accent'), good = css('--good'), gold = css('--gold'), line = css('--line'), text = css('--text'), card = css('--card2');
      let s = '';
      edges.forEach(([a, c]) => { const [x1, y1] = nodes[a], [x2, y2] = nodes[c]; s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${line}" stroke-width="3"/>`; });
      Object.entries(nodes).forEach(([k, [x, y]]) => {
        const fill = k === current ? gold : order.includes(k) ? good : frontier.includes(k) ? acc : card;
        s += `<circle cx="${x}" cy="${y}" r="18" fill="${fill}" stroke="${text}" stroke-width="${k === current ? 3 : 1}"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-weight="900" font-size="16" fill="${fill === card ? text : '#111'}">${k}</text>`;
        const vi = order.indexOf(k);
        if (vi >= 0) s += `<text x="${x + 18}" y="${y - 14}" font-size="12" font-weight="800" fill="${gold}">${vi + 1}</text>`;
      });
      q('#gsvg', b).innerHTML = s;
      const ds = Object.keys(adj).map(k => `${k}:${adj[k].length}`).join(' ');
      q('#gro', b).innerHTML = `${mode === 'bfs' ? 'queue' : 'stack'} <b>[${frontier.join(', ')}]</b>${mode === 'dfs' ? ' ← top' : ''}<br>visited <b>${order.join(' → ') || '—'}</b>${mode === 'bfs' && order.length ? `<br>hops from A: ${order.map(k => k + '=' + levels[k]).join(' ')}` : ''}<br><span style="color:var(--muted)">degrees ${ds} · Σ=${edges.length * 2} = 2×${edges.length} edges</span>`;
    };
    q('#gstep', b).onclick = stepFn;
    q('#gauto', b).onclick = () => { clearInterval(timer); timer = setInterval(stepFn, 700); };
    q('#greset', b).onclick = reset;
    qa('#mode button', b).forEach(x => x.onclick = () => { mode = x.dataset.m; qa('#mode button', b).forEach(y => y.classList.toggle('on', y === x)); reset(); });
    reset();
  };

  /* ---------- plotting helper ---------- */
  function plot(cv, H, xr, yr, drawFn) {
    const { c, w, h } = setupCanvas(cv, H);
    const X = x => (x - xr[0]) / (xr[1] - xr[0]) * w, Y = y => h - (y - yr[0]) / (yr[1] - yr[0]) * h;
    c.clearRect(0, 0, w, h);
    c.strokeStyle = css('--line'); c.lineWidth = 1;
    c.beginPath(); c.moveTo(X(xr[0]), Y(0)); c.lineTo(X(xr[1]), Y(0)); c.moveTo(X(0), Y(yr[0])); c.lineTo(X(0), Y(yr[1])); c.stroke();
    const fn = (f, color, lw = 3) => { c.strokeStyle = color; c.lineWidth = lw; c.beginPath(); for (let i = 0; i <= 200; i++) { const x = xr[0] + (xr[1] - xr[0]) * i / 200; i ? c.lineTo(X(x), Y(f(x))) : c.moveTo(X(x), Y(f(x))); } c.stroke(); };
    drawFn({ c, X, Y, fn, w, h });
  }

  /* ---------- derivative ---------- */
  W.derivative = el => {
    const b = box(el, `<canvas id="cv"></canvas>
      <div class="row small" style="margin-top:8px"><span style="min-width:62px">x = <b id="xv"></b></span><input type="range" id="x" min="-2" max="2" step="0.1" value="1" class="grow"></div>
      <div class="row small"><span style="min-width:62px">h = <b id="hv"></b></span><input type="range" id="h" min="0" max="100" value="0" class="grow"></div>
      <div class="readout" id="ro"></div>`);
    const f = x => x * x;
    const draw = () => {
      const x = +q('#x', b).value, t = +q('#h', b).value / 100, h = Math.max(0.0001, 2 * (1 - t) ** 3);
      q('#xv', b).textContent = x.toFixed(1); q('#hv', b).textContent = h < 0.001 ? '→0' : h.toFixed(3);
      const slope = (f(x + h) - f(x)) / h;
      plot(q('#cv', b), 220, [-3, 3], [-1, 9], ({ c, X, Y, fn }) => {
        fn(f, css('--accent2'));
        fn(z => f(x) + slope * (z - x), css('--gold'), 2);
        [[x, f(x), css('--good')], [x + h, f(x + h), css('--bad')]].forEach(([px, py, col]) => { c.fillStyle = col; c.beginPath(); c.arc(X(px), Y(py), 6, 0, 7); c.fill(); });
      });
      q('#ro', b).innerHTML = `f(x) = x²<br>secant slope = (f(x+h) − f(x)) / h = <b>${slope.toFixed(4)}</b><br>true derivative f′(x) = 2x = <b>${(2 * x).toFixed(4)}</b>${h < 0.01 ? '<br>✨ as h → 0, the secant becomes the tangent!' : '<br>Drag h toward 0 →'}`;
    };
    q('#x', b).oninput = draw; q('#h', b).oninput = draw;
    requestAnimationFrame(draw);
  };

  /* ---------- integral ---------- */
  W.integral = el => {
    const b = box(el, `<canvas id="cv"></canvas>
      <div class="seg" style="margin-top:8px" id="rule"><button data-r="left" class="on">Left</button><button data-r="mid">Midpoint</button><button data-r="right">Right</button></div>
      <div class="row small"><span style="min-width:80px">N = <b id="nv"></b></span><input type="range" id="n" min="1" max="100" value="4" class="grow"></div>
      <div class="readout" id="ro"></div>`);
    const f = x => x * x, a = 0, z = 2, exact = 8 / 3;
    let rule = 'left';
    const draw = () => {
      const N = +q('#n', b).value; q('#nv', b).textContent = N;
      const dx = (z - a) / N; let sum = 0;
      plot(q('#cv', b), 220, [-0.2, 2.3], [-0.4, 4.6], ({ c, X, Y, fn }) => {
        c.fillStyle = css('--accent') + '88'; c.strokeStyle = css('--accent'); c.lineWidth = 1;
        for (let i = 0; i < N; i++) {
          const x0 = a + i * dx, sx = rule === 'left' ? x0 : rule === 'right' ? x0 + dx : x0 + dx / 2, hgt = f(sx);
          sum += hgt * dx;
          c.fillRect(X(x0), Y(hgt), X(x0 + dx) - X(x0), Y(0) - Y(hgt)); if (N <= 40) c.strokeRect(X(x0), Y(hgt), X(x0 + dx) - X(x0), Y(0) - Y(hgt));
        }
        fn(f, css('--accent2'));
      });
      q('#ro', b).innerHTML = `∫₀² x² dx with <b>${N}</b> rectangles<br>sum ≈ <b>${sum.toFixed(5)}</b><br>exact = 8/3 ≈ <b>${exact.toFixed(5)}</b><br>error = <b>${Math.abs(sum - exact).toFixed(5)}</b>${N >= 50 ? ' — more rectangles → the exact area 🎯' : ''}`;
    };
    q('#n', b).oninput = draw;
    qa('#rule button', b).forEach(x => x.onclick = () => { rule = x.dataset.r; qa('#rule button', b).forEach(y => y.classList.toggle('on', y === x)); draw(); });
    requestAnimationFrame(draw);
  };

  /* ---------- unit circle ---------- */
  W.unitcircle = el => {
    const b = box(el, `<canvas id="cv"></canvas>
      <div class="row small" style="margin-top:8px"><span style="min-width:64px">θ = <b id="dv"></b></span><input type="range" id="d" min="0" max="360" value="30" class="grow"></div>
      <div class="w-row">${[0, 30, 45, 60, 90, 180, 270, 360].map(d => `<button class="tbtn" style="padding:6px 10px;font-size:13px" data-d="${d}">${d}°</button>`).join('')}</div>
      <div class="readout" id="ro"></div>`);
    const piFrac = d => {
      const map = { 0: '0', 30: 'π/6', 45: 'π/4', 60: 'π/3', 90: 'π/2', 120: '2π/3', 135: '3π/4', 150: '5π/6', 180: 'π', 210: '7π/6', 225: '5π/4', 240: '4π/3', 270: '3π/2', 300: '5π/3', 315: '7π/4', 330: '11π/6', 360: '2π' };
      return map[d] ? ` = <b>${map[d]}</b>` : '';
    };
    const draw = () => {
      const d = +q('#d', b).value, r = d * Math.PI / 180, co = Math.cos(r), si = Math.sin(r);
      q('#dv', b).textContent = d + '°';
      const { c, w, h } = setupCanvas(q('#cv', b), 240);
      const R = Math.min(w, h) / 2 - 22, cx = w / 2, cy = h / 2;
      c.strokeStyle = css('--line'); c.lineWidth = 1;
      c.beginPath(); c.moveTo(cx - R - 14, cy); c.lineTo(cx + R + 14, cy); c.moveTo(cx, cy - R - 14); c.lineTo(cx, cy + R + 14); c.stroke();
      c.strokeStyle = css('--muted'); c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke();
      c.strokeStyle = css('--gold'); c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 24, 0, -r, true); c.stroke();
      const px = cx + R * co, py = cy - R * si;
      c.strokeStyle = css('--accent'); c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, py); c.stroke();
      c.strokeStyle = css('--good'); c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, py); c.lineTo(px, cy); c.stroke();
      c.strokeStyle = css('--accent2'); c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, cy); c.stroke(); c.setLineDash([]);
      c.fillStyle = css('--bad'); c.beginPath(); c.arc(px, py, 7, 0, 7); c.fill();
      c.font = 'bold 12px sans-serif'; c.fillStyle = css('--good'); c.fillText('sin', px + 6, (py + cy) / 2);
      c.fillStyle = css('--accent2'); c.fillText('cos', (cx + px) / 2 - 10, cy + (si >= 0 ? 16 : -8));
      const t = Math.abs(co) < 1e-9 ? 'undefined (÷0)' : (si / co).toFixed(3);
      q('#ro', b).innerHTML = `degrees <b>${d}°</b> · radians <b>${r.toFixed(3)}</b>${piFrac(d)}<br><span style="color:var(--accent2)">cos θ</span> = <b>${(Math.abs(co) < 1e-9 ? 0 : co).toFixed(3)}</b> (x)<br><span style="color:var(--good)">sin θ</span> = <b>${(Math.abs(si) < 1e-9 ? 0 : si).toFixed(3)}</b> (y)<br>tan θ = <b>${t}</b><br><span style="color:var(--muted)">cos² + sin² = ${(co * co + si * si).toFixed(3)} always 😎</span>`;
    };
    q('#d', b).oninput = draw;
    qa('[data-d]', b).forEach(x => x.onclick = () => { q('#d', b).value = x.dataset.d; draw(); });
    requestAnimationFrame(draw);
  };

  /* ---------- hash table ---------- */
  W.hash = el => {
    const M = 8;
    const b = box(el, `<div class="w-row"><input class="inline-input" id="hk" placeholder="key" style="width:140px" autocapitalize="off"><button class="tbtn" id="hadd">Insert</button><button class="tbtn" id="hclr">↺</button></div>
      <div class="w-row" style="margin-top:6px">${['alice', 'bob', 'carol', 'dave', 'eve', 'mallory', 'nginx', 'redis', 'kafka'].map(k => `<button class="tbtn" style="padding:4px 8px;font-size:12px" data-k="${k}">${k}</button>`).join('')}</div>
      <div class="buckets" id="hb"></div><div class="readout" id="hro">Insert some keys…</div>`);
    let table;
    const h = s => { let x = 5381; for (const ch of s) x = ((x * 33) ^ ch.charCodeAt(0)) >>> 0; return x; };
    const draw = (last, msg) => {
      q('#hb', b).innerHTML = table.map((l, i) => `<div><b>${i}</b>${l.map(k => `<span class="${l.length > 1 ? 'hot' : ''}">${k}</span>`).join('→')}</div>`).join('');
      const n = table.reduce((s, l) => s + l.length, 0), coll = table.reduce((s, l) => s + Math.max(0, l.length - 1), 0);
      if (msg) q('#hro', b).innerHTML = `${msg}<br>items <b>${n}</b> · buckets <b>${M}</b> · load factor α = <b>${(n / M).toFixed(2)}</b> · collisions <b>${coll}</b>${n / M > 0.75 ? '<br>⚠️ α > 0.75 — real tables would resize (rehash into 2× buckets)' : ''}`;
    };
    const add = k => {
      k = k.trim(); if (!k) return;
      const hv = h(k), i = hv % M;
      if (table[i].includes(k)) return draw(k, `"${k}" already in bucket ${i} — keys are unique (it's an update, O(1))`);
      table[i].push(k);
      draw(k, `hash("${k}") = <b>${hv}</b><br>${hv} mod ${M} = <b>bucket ${i}</b>${table[i].length > 1 ? ' 💥 collision! chained.' : ''}`);
    };
    q('#hadd', b).onclick = () => { add(q('#hk', b).value); q('#hk', b).value = ''; };
    q('#hk', b).onkeydown = e => { if (e.key === 'Enter') q('#hadd', b).click(); };
    q('#hclr', b).onclick = () => { table = [...Array(M)].map(() => []); draw(null, 'Empty table. Insert some keys…'); };
    qa('[data-k]', b).forEach(x => x.onclick = () => add(x.dataset.k));
    q('#hclr', b).click();
  };
})();

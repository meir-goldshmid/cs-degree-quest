CQ.unit({
  id: 'trig-calculus',
  order: 11,
  title: 'Trig, Derivatives & Integrals',
  emoji: '📐',
  color: '#ff7a45',
  tagline: 'Circles, slopes and areas — the math behind rate() and gradient descent',
  lessons: [
    // ───────────────────────────── Lesson 1 ─────────────────────────────
    {
      id: 'angles-radians',
      title: 'Angles: Degrees vs Radians',
      emoji: '📐',
      steps: [
        { type: 'learn', title: 'Angles are just "how much of a turn"', html: `
<p>An angle measures rotation. A full spin is <b>360°</b>, a right angle is <b>90°</b>, a U-turn is <b>180°</b>.</p>
<p>Why 360? No deep reason — the ancient Babylonians liked base-60 math, and 360 divides evenly by 2, 3, 4, 5, 6, 8, 9, 10, 12… It's a <i>convenient</i> unit, not a <i>natural</i> one.</p>
<div class="fun">🤓 Fun fact: 360 having so many divisors is the same reason we have 60 seconds and 60 minutes. Babylonian legacy code, still in production after 4,000 years.</div>` },
        { type: 'learn', title: 'Radians: the "natural" unit', html: `
<p>Take a circle of radius 1. Walk along its edge. The <b>distance you walk</b> is the angle in <b>radians</b>.</p>
<p>The full circumference is 2πr = 2π, so a full turn = <b>2π radians ≈ 6.283</b>.</p>
<div class="formula">360° = 2π rad &nbsp;·&nbsp; 180° = π rad</div>
<div class="callout">1 radian is the angle where the arc length equals the radius — about 57.3°.</div>` },
        { type: 'widget', widget: 'unitcircle', title: 'Spin the unit circle', html: '<p>Drag the slider. Watch degrees and radians move together. Find 90° (π/2 ≈ 1.571) and 180° (π ≈ 3.14).</p>' },
        { type: 'mcq', q: 'What is 90° in radians?', choices: ['π', 'π/2', 'π/4', '2π'], answer: 1,
          explain: '90° is a quarter turn. A full turn is 2π, so a quarter is 2π/4 = π/2 ≈ 1.571.' },
        { type: 'input', q: 'How many degrees is π radians?', answer: ['180', '180°', '180deg', '180 degrees'], placeholder: 'degrees',
          explain: 'π radians is half a turn: half of 360° = 180°.' },
        { type: 'learn', title: 'Converting (and a classic bug)', html: `
<div class="formula">radians = degrees × π / 180</div>
<p>Going back: degrees = radians × 180 / π.</p>
<div class="dev">You already know this bug: <code>Math.sin(90)</code> in JavaScript (and Python's <code>math.sin</code>, Go's <code>math.Sin</code>…) expects <b>radians</b>. It returns ≈ 0.894, not 1. Meanwhile CSS happily accepts <code>rotate(90deg)</code>, <code>rotate(1.5708rad)</code> or <code>rotate(0.25turn)</code> — all the same angle.</div>` },
        { type: 'tf', q: 'In JavaScript, Math.sin(90) returns exactly 1.', answer: false,
          explain: 'Math.sin takes radians. 90 radians is about 14.3 full turns plus change, and sin(90) ≈ 0.894. You want Math.sin(Math.PI / 2).' },
        { type: 'order', q: 'Order these angles from smallest to largest', items: ['π/6', '45°', 'π/2', '2 rad', '180°'],
          explain: 'π/6 = 30°, then 45°, π/2 = 90°, 2 rad ≈ 114.6°, and 180°.' },
        { type: 'mcq', q: 'Roughly how many degrees is 1 radian?', choices: ['1°', '3.14°', '57.3°', '90°'], answer: 2,
          explain: '1 rad = 180°/π ≈ 57.3°. The arc is as long as the radius — a fat slice of pie.' }
      ]
    },
    // ───────────────────────────── Lesson 2 ─────────────────────────────
    {
      id: 'sin-cos-tan',
      title: 'sin, cos, tan & the Unit Circle',
      emoji: '🌀',
      steps: [
        { type: 'learn', title: 'sin and cos are coordinates', html: `
<p>Put a point on the unit circle (radius 1) at angle θ, measured counter-clockwise from the positive x-axis. Its coordinates are:</p>
<div class="formula">(x, y) = (cos θ, sin θ)</div>
<p>That's it. <b>cos</b> = how far right, <b>sin</b> = how far up. Both always stay between −1 and 1.</p>
<svg viewBox="0 0 120 120" width="140" height="140" style="display:block;margin:auto">
  <circle cx="60" cy="60" r="45" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <line x1="5" y1="60" x2="115" y2="60" stroke="currentColor" stroke-width="0.6"/>
  <line x1="60" y1="5" x2="60" y2="115" stroke="currentColor" stroke-width="0.6"/>
  <line x1="60" y1="60" x2="92" y2="28" stroke="var(--accent)" stroke-width="2"/>
  <line x1="92" y1="28" x2="92" y2="60" stroke="var(--accent)" stroke-dasharray="3 2"/>
  <circle cx="92" cy="28" r="3.5" fill="var(--accent)"/>
  <text x="70" y="72" font-size="9" fill="currentColor">cos θ</text>
  <text x="95" y="47" font-size="9" fill="currentColor">sin θ</text>
</svg>` },
        { type: 'widget', widget: 'unitcircle', title: 'Watch sin and cos', html: '<p>Slide the angle around. Notice: at 0° the point is at (1, 0); at 90° it is at (0, 1). sin and cos trade places every quarter turn.</p>' },
        { type: 'mcq', q: 'What is cos(0)?', choices: ['0', '1', '−1', 'undefined'], answer: 1,
          explain: 'At angle 0 the point sits at (1, 0). cos is the x-coordinate, so cos(0) = 1.' },
        { type: 'input', q: 'What is sin(90°)?', answer: ['1', '1.0'], placeholder: 'number',
          explain: 'At 90° the point is straight up at (0, 1). sin is the y-coordinate: 1.' },
        { type: 'learn', title: 'Pythagoras sneaks in, and tan', html: `
<p>The point is always distance 1 from the center, so by a² + b² = c²:</p>
<div class="formula">sin²θ + cos²θ = 1</div>
<p><b>tan θ = sin θ / cos θ</b> — rise over run, i.e. the <b>slope</b> of the line at that angle. At 90°, cos is 0, so tan blows up (a vertical line has no finite slope).</p>
<div class="dev">You already know this: in game dev, moving at speed v in direction θ means <code>dx = v·cos θ</code>, <code>dy = v·sin θ</code>. And <code>Math.atan2(dy, dx)</code> gives you the angle back — that's how a turret "looks at" the player.</div>` },
        { type: 'tf', q: 'sin²θ + cos²θ = 1 for every angle θ.', answer: true,
          explain: 'It is Pythagoras on the unit circle: the point (cos θ, sin θ) is always exactly distance 1 from the origin.' },
        { type: 'mcq', q: 'A game character moves at speed 10 in direction 0° (pointing right). What are (dx, dy)?', choices: ['(0, 10)', '(10, 0)', '(7.07, 7.07)', '(10, 10)'], answer: 1,
          explain: 'dx = 10·cos 0° = 10, dy = 10·sin 0° = 0. Straight right. (7.07, 7.07) would be 45°.' },
        { type: 'learn', title: 'Waves: things that repeat', html: `
<p>Keep spinning past 360° and sin/cos repeat forever: sin(θ + 2π) = sin θ. That makes them the go-to math for anything <b>periodic</b>.</p>
<div class="formula">traffic(t) ≈ base + amp · sin(2π · t / 24)</div>
<div class="dev">You already know this: your Grafana request-rate panel looks like a wave — up during the day, down at night, repeating every 24h, like a cron schedule drawn as a curve. Seasonality in capacity planning, CSS "pulse" animations (<code>scale = 1 + 0.1·sin(t)</code>), audio signals, Wi-Fi radio — all sine waves.</div>` },
        { type: 'mcq', q: 'traffic(t) = 500 + 300·sin(2π·t / 24), with t in hours. How often does the pattern repeat?', choices: ['Every 2π hours', 'Every 12 hours', 'Every 24 hours', 'Every 300 hours'], answer: 2,
          explain: 'The sine completes one cycle when 2π·t/24 grows by 2π, i.e. when t grows by 24. A daily cycle.' },
        { type: 'input', q: 'What is cos(180°)?', answer: ['-1', '−1', '-1.0'], placeholder: 'number',
          explain: 'At 180° the point is at (−1, 0) on the far left. cos is the x-coordinate: −1.' }
      ]
    },
    // ───────────────────────────── Lesson 3 ─────────────────────────────
    {
      id: 'functions-limits',
      title: 'Graphs, Slopes & Limits',
      emoji: '🔭',
      steps: [
        { type: 'learn', title: 'Functions & graphs, a refresher', html: `
<p>A math function is a <b>pure function</b>: same input, same output, no side effects. f(x) = x² takes 3 and returns 9.</p>
<p>A <b>graph</b> plots every (x, f(x)) pair. For a straight line y = mx + b, <b>m is the slope</b>: rise ÷ run, how much y changes per unit of x.</p>
<div class="dev">You already know this: a Grafana time series is a graph of a function, with time as x. A steadily climbing line has a constant slope; a curve that bends upward has a slope that keeps growing.</div>` },
        { type: 'mcq', q: 'What is the slope of y = 3x + 2?', choices: ['2', '3', '5', '3/2'], answer: 1,
          explain: 'In y = mx + b, m is the slope. Each step of 1 in x raises y by 3. The 2 is just where the line crosses the y-axis.' },
        { type: 'input', q: 'f(x) = x². What is f(5)?', answer: ['25'], placeholder: 'number',
          explain: '5² = 5 × 5 = 25.' },
        { type: 'mcq', q: 'On f(x) = x², what is the average slope between the points (1, 1) and (3, 9)?', choices: ['2', '4', '8', '9'], answer: 1,
          explain: 'Slope = rise / run = (9 − 1) / (3 − 1) = 8 / 2 = 4. Hold that thought — derivatives are what happens when those two points get infinitely close.' },
        { type: 'learn', title: 'Limits: sneaking up on a value', html: `
<p>Look at f(x) = (x² − 1) / (x − 1). At x = 1 it's 0/0 — undefined. Crash!</p>
<p>But try x = 0.9 → 1.9, x = 0.99 → 1.99, x = 1.001 → 2.001. The outputs <b>approach 2</b>.</p>
<div class="formula">lim (x→1) of (x² − 1)/(x − 1) = 2</div>
<div class="callout">A limit asks "where is this heading?", not "what is it exactly here?". It can exist even where the function itself is undefined.</div>` },
        { type: 'input', q: 'What is the limit of (x² − 1)/(x − 1) as x → 1?', answer: ['2', '2.0'], placeholder: 'number',
          explain: 'x² − 1 = (x − 1)(x + 1). For x ≠ 1 the (x − 1) cancels, leaving x + 1, which heads to 2.' },
        { type: 'tf', q: 'A limit can exist at a point where the function itself is undefined.', answer: true,
          explain: 'Exactly what we just saw: f(1) is 0/0, but the limit as x → 1 is a perfectly good 2.' },
        { type: 'learn', title: 'Limits at infinity', html: `
<p>As n grows forever, 1/n shrinks toward 0 — it never <i>reaches</i> 0, but gets as close as you like.</p>
<div class="dev">You already know this: adding nines to your SLO. 99% → 99.9% → 99.99% → 99.999%. Availability approaches 100% as the limit, and each step costs roughly 10× more. Also: retry backoff of 1/2 + 1/4 + 1/8 + … seconds never totals more than 1 second — the limit of the sum is exactly 1.</div>` },
        { type: 'mcq', q: 'As n → ∞, what does 1/n approach?', choices: ['1', '0', '∞', 'It oscillates'], answer: 1,
          explain: '1/1000, 1/1000000, … the values shrink toward 0 without ever going negative or bouncing around.' }
      ]
    },
    // ───────────────────────────── Lesson 4 ─────────────────────────────
    {
      id: 'derivatives',
      title: 'Derivatives: Rate of Change',
      emoji: '🚀',
      steps: [
        { type: 'learn', title: 'Speedometer vs odometer', html: `
<p>Your car's odometer is a function: distance(t). The speedometer shows how fast that number is changing <b>right now</b>. That is the <b>derivative</b>.</p>
<p>Geometrically: the slope of the curve at a single point — the slope of the <b>tangent line</b> that just kisses the curve there.</p>
<div class="formula">f′(x) = lim (h→0) [f(x + h) − f(x)] / h</div>
<p>Take the slope between two points (rise/run), then slide them together. The limit is the instantaneous slope.</p>` },
        { type: 'widget', widget: 'derivative', title: 'Shrink h, find the tangent', html: '<p>Drag the point on f(x) = x² and shrink h. The secant (through two points) turns into the tangent. Notice the slope at x is always 2x.</p>' },
        { type: 'input', q: 'For f(x) = x², the derivative is f′(x) = 2x. What is the slope at x = 3?', answer: ['6'], placeholder: 'number',
          explain: 'f′(3) = 2 · 3 = 6. At x = 3 the parabola is climbing 6 units up per unit right.' },
        { type: 'learn', title: 'You use derivatives every day', html: `
<div class="dev">You already know this: <code>http_requests_total</code> is a Prometheus <b>counter</b> — an odometer that only goes up. Nobody graphs it raw. You graph <code>rate(http_requests_total[5m])</code>, which is (approximately) its <b>derivative</b>: requests per second. rate() literally computes Δcount / Δtime over the window — the secant slope — and a shorter window is like a smaller h.</div>
<p>For gauges (things that go up <i>and</i> down, like memory usage), PromQL has <code>deriv()</code>, which fits a slope through the samples.</p>` },
        { type: 'mcq', q: 'A request counter goes from 12,000 to 15,000 over 5 minutes. Roughly what does rate() report?', choices: ['3,000 req/s', '600 req/s', '10 req/s', '50 req/s'], answer: 2,
          explain: 'Δcount = 3,000; Δtime = 5 min = 300 s. 3,000 / 300 = 10 requests per second.' },
        { type: 'learn', title: 'What the sign tells you', html: `
<ul>
<li><b>f′ &gt; 0</b>: rising. <b>f′ &lt; 0</b>: falling.</li>
<li><b>f′ = 0</b>: flat — the top of a hill or bottom of a valley (or a pause).</li>
<li>The derivative of the derivative (f″) is <b>acceleration</b>: is the growth itself speeding up?</li>
</ul>
<div class="dev">You already know this: "memory is growing" (f′ &gt; 0) is a ticket. "Memory growth is <i>accelerating</i>" (f″ &gt; 0) is a page.</div>` },
        { type: 'tf', q: 'At the very top of a smooth hill-shaped curve, the derivative is 0.', answer: true,
          explain: 'At the peak the tangent line is perfectly horizontal: slope 0. This is how calculus finds maxima and minima.' },
        { type: 'mcq', q: 'A disk has 100 GB free and usage grows at a steady +2 GB/hour. When does it fill up?', choices: ['In 2 hours', 'In 50 hours', 'In 98 hours', 'In 200 hours'], answer: 1,
          explain: '100 GB / (2 GB/h) = 50 hours. That is exactly what PromQL predict_linear() does: extrapolate using the derivative.' },
        { type: 'input', q: 'f(x) = 42 (a constant). What is f′(x)?', answer: ['0', 'zero'], placeholder: 'number',
          explain: 'A constant never changes, so its rate of change is 0. A flat line has slope 0.' }
      ]
    },
    // ───────────────────────────── Lesson 5 ─────────────────────────────
    {
      id: 'derivative-rules',
      title: 'Derivative Rules',
      emoji: '🧰',
      steps: [
        { type: 'learn', title: 'The power rule', html: `
<p>You don't compute limits by hand every time. Shortcut #1:</p>
<div class="formula">d/dx xⁿ = n · xⁿ⁻¹</div>
<p>Bring the exponent down front, then subtract 1 from it.</p>
<ul><li>x² → 2x</li><li>x³ → 3x²</li><li>x → 1 (since x = x¹ → 1·x⁰)</li><li>x¹⁰ → 10x⁹</li></ul>` },
        { type: 'input', q: 'What is the derivative of x³?', answer: ['3x²', '3x^2', '3x2', '3*x^2', '3*x²', '3x**2', '3*x**2'], placeholder: 'e.g. 5x^4',
          explain: 'Power rule: bring the 3 down, subtract 1 from the exponent: 3x².' },
        { type: 'learn', title: 'Constants & sums', html: `
<p><b>Constant multiple:</b> d/dx (c·f) = c·f′. Scale a function, scale its slope.</p>
<p><b>Sum rule:</b> d/dx (f + g) = f′ + g′. Differentiate term by term.</p>
<div class="formula">d/dx (3x² + 5x + 7) = 6x + 5</div>
<p>3x² → 6x, 5x → 5, and 7 → 0 (constants vanish).</p>
<div class="dev">You already know this: the total rate of a sum of counters is the sum of their rates. <code>sum(rate(x[5m]))</code> works precisely because derivatives distribute over addition. (And that is why you rate() first, then sum() — not the other way round, because of counter resets.)</div>` },
        { type: 'mcq', q: 'What is the derivative of 4x³ + 2x?', choices: ['12x² + 2', '12x³ + 2', '4x² + 2', '12x²'], answer: 0,
          explain: '4x³ → 4·3x² = 12x², and 2x → 2. Total: 12x² + 2.' },
        { type: 'tf', q: 'The derivative of x² + x² is 4x.', answer: true,
          explain: 'x² + x² = 2x², whose derivative is 4x. Or term by term: 2x + 2x = 4x. Both roads agree.' },
        { type: 'learn', title: 'Chain rule teaser: rates multiply', html: `
<p>For a function inside a function, f(g(x)):</p>
<div class="formula">(f(g(x)))′ = f′(g(x)) · g′(x)</div>
<p>Outer derivative (evaluated at the inner thing) times inner derivative.</p>
<div class="dev">You already know this: fan-out. If the frontend does R req/s, each request makes 3 API calls, and each API call makes 2 DB queries, then DB load = R · 3 · 2. Rates through a pipeline <b>multiply</b>. That's the chain rule.</div>` },
        { type: 'mcq', q: 'Frontend: 100 req/s. Each request makes 3 API calls; each API call makes 2 DB queries. DB queries per second?', choices: ['105', '200', '300', '600'], answer: 3,
          explain: '100 × 3 × 2 = 600 queries/s. Rates along a chain multiply.' },
        { type: 'mcq', q: 'Using the chain rule, what is the derivative of (3x + 1)²?', choices: ['2(3x + 1)', '6(3x + 1)', '(3x + 1) · 3', '9x² + 1'], answer: 1,
          explain: 'Outer: u² → 2u. Inner: 3x + 1 → 3. Multiply: 2(3x + 1) · 3 = 6(3x + 1) = 18x + 6. Check by expanding: 9x² + 6x + 1 → 18x + 6. ✓' },
        { type: 'input', q: 'f(x) = 5x². What is f′(2)?', answer: ['20'], placeholder: 'number',
          explain: 'f′(x) = 10x, so f′(2) = 20.' }
      ]
    },
    // ───────────────────────────── Lesson 6 ─────────────────────────────
    {
      id: 'integrals',
      title: 'Integrals: Area & Accumulation',
      emoji: '🪣',
      steps: [
        { type: 'learn', title: 'The opposite question', html: `
<p>Derivative: "I have the total, how fast is it changing?"<br>Integral: "I have the rate, how much piled up?"</p>
<p>Geometrically, the <b>integral</b> is the <b>area under the curve</b> between two x-values:</p>
<div class="formula">∫ₐᵇ f(x) dx</div>
<div class="dev">You already know this: your network graph shows throughput in MB/s. The total bytes transferred over the hour (the number your cloud bill cares about) is the area under that graph — the integral of throughput over time.</div>` },
        { type: 'mcq', q: 'Throughput is a steady 50 MB/s for 60 seconds. How much data was transferred?', choices: ['110 MB', '50 MB', '3,000 MB', '1.2 MB'], answer: 2,
          explain: 'Area of a rectangle: height 50 MB/s × width 60 s = 3,000 MB (3 GB). Constant rate × time = total.' },
        { type: 'learn', title: 'Rectangles all the way down', html: `
<p>Curvy graph? Chop the area into thin rectangles, add up their areas. That's a <b>Riemann sum</b>.</p>
<p>More, thinner rectangles → closer to the true area. The <b>limit</b> as the width → 0 is the exact integral. (∫ is literally a stretched-out S, for "sum".)</p>
<div class="dev">You already know this: Prometheus scrapes every 15s — your data <i>is</i> rectangles. <code>increase(bytes_total[1h])</code> and <code>sum_over_time()</code> are integrals computed from samples.</div>` },
        { type: 'widget', widget: 'integral', title: 'Add more rectangles', html: '<p>Increase N. Watch the rectangle total close in on the exact area.</p>' },
        { type: 'input', q: 'What is the area under f(x) = 4 from x = 0 to x = 5?', answer: ['20'], placeholder: 'number',
          explain: 'It is a 4-tall, 5-wide rectangle: 4 × 5 = 20.' },
        { type: 'learn', title: 'The Fundamental Theorem of Calculus', html: `
<div class="callout">Derivatives and integrals undo each other.</div>
<p>To integrate f from a to b, find any F whose derivative is f (an <b>antiderivative</b>), then:</p>
<div class="formula">∫ₐᵇ f(x) dx = F(b) − F(a)</div>
<p>Example: the derivative of x³/3 is x², so ∫₀³ x² dx = 3³/3 − 0 = 9.</p>
<div class="dev">You already know this: <code>rate()</code> turns a counter into a per-second rate (derivative). <code>increase()</code> turns it back into "how much over the window" (integral). Indeed increase(x[5m]) ≈ rate(x[5m]) × 300.</div>` },
        { type: 'input', q: 'Using the antiderivative x³/3, compute ∫₀⁶ x² dx.', answer: ['72'], placeholder: 'number',
          explain: 'F(6) − F(0) = 6³/3 − 0 = 216/3 = 72.' },
        { type: 'tf', q: 'If you take the derivative of the running total of a rate, you get the rate back.', answer: true,
          explain: 'That is the Fundamental Theorem: accumulate (integrate), then ask how fast the total changes (differentiate) — you are back where you started.' },
        { type: 'mcq', q: 'Which PromQL pair best mirrors derivative ↔ integral?', choices: ['sum() ↔ avg()', 'rate() ↔ increase()', 'max() ↔ min()', 'histogram_quantile() ↔ count()'], answer: 1,
          explain: 'rate() is a per-second slope (derivative); increase() is the accumulated change over a window (integral of the rate).' }
      ]
    },
    // ───────────────────────────── Lesson 7 ─────────────────────────────
    {
      id: 'gradient-descent',
      title: 'Why It Matters: Gradient Descent',
      emoji: '⛷️',
      steps: [
        { type: 'learn', title: 'Machine learning = finding the bottom', html: `
<p>Training a model means tuning parameters to minimize a <b>loss</b> function — a number measuring "how wrong are we?".</p>
<p>The derivative tells you which way is uphill. So step the other way:</p>
<div class="formula">x ← x − η · f′(x)</div>
<p>η (eta) is the <b>learning rate</b>: how big a step to take. Repeat until the slope is ~0 — you're at the bottom of a valley.</p>
<div class="dev">It's like finding the right replica count by feel in fog: you can't see the whole landscape, but you can feel the slope under your feet.</div>` },
        { type: 'mcq', q: 'f(x) = x² (so f′(x) = 2x). Start at x = 3 with learning rate η = 0.1. Where are you after one step?', choices: ['2.4', '2.9', '3.6', '0'], answer: 0,
          explain: 'f′(3) = 6. x ← 3 − 0.1 × 6 = 3 − 0.6 = 2.4. Downhill toward the minimum at 0.' },
        { type: 'learn', title: 'Tuning the learning rate', html: `
<ul>
<li><b>Too small:</b> correct but painfully slow — millions of tiny steps.</li>
<li><b>Too big:</b> you overshoot the valley, bounce up the other side, and can even <b>diverge</b> to infinity.</li>
</ul>
<div class="dev">You already know this: an HPA (autoscaler) that reacts too aggressively flaps — scale up, scale down, scale up. That's a learning rate that's too big. Stabilization windows are the fix, and ML has its own versions (learning-rate schedules, momentum).</div>` },
        { type: 'tf', q: 'A learning rate that is too large can make gradient descent diverge instead of converge.', answer: true,
          explain: 'For f(x) = x², any η > 1 makes each step land farther from 0 than the last: it ping-pongs outward forever.' },
        { type: 'input', q: 'f(x) = x², start at x = 1, learning rate η = 0.5. Where are you after one step?', answer: ['0', '0.0'], placeholder: 'number',
          explain: 'f′(1) = 2. x ← 1 − 0.5 × 2 = 0. Lucky: landed exactly on the minimum in one step.' },
        { type: 'learn', title: 'Billions of knobs', html: `
<p>Real models have millions or billions of parameters. The <b>gradient</b> is the vector of partial derivatives — the slope along each knob. Gradient descent nudges all of them at once.</p>
<p>Computing that gradient through layers of functions-of-functions is <b>backpropagation</b>: the chain rule, applied at industrial scale, on GPUs.</p>
<div class="fun">🤓 Fun fact: the core update rule behind modern LLM training fits on one line. The "magic" is mostly the chain rule plus a ridiculous amount of compute.</div>` },
        { type: 'order', q: 'Put one iteration of a training loop in order', items: ['Run the model on input (prediction)', 'Compute the loss', 'Compute gradients (backprop)', 'Update parameters: w ← w − η·gradient'],
          explain: 'Forward pass, measure how wrong, find which way is downhill, take a step. Then repeat — thousands to millions of times.' },
        { type: 'mcq', q: 'Backpropagation is mostly an application of which rule?', choices: ['The power rule', 'The chain rule', 'Pythagoras', 'The Fundamental Theorem of Calculus'], answer: 1,
          explain: 'A neural net is functions nested inside functions. The chain rule multiplies the local derivatives back through the layers.' }
      ]
    }
  ]
});

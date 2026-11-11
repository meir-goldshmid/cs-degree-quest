CQ.unit({
  id: 'exp-log',
  order: 4,
  title: 'Exponents & Logarithms',
  emoji: '📈',
  color: '#ff8a3d',
  tagline: 'Doubling, halving, and why everything fast is log n',
  lessons: [
    // ─────────────────────────────────────────────── 1
    {
      id: 'powers',
      title: 'Powers & Exponent Rules',
      emoji: '⚡',
      steps: [
        { type: 'learn', title: 'Repeated multiplication, with a nicer name',
          html: `<p>An <b>exponent</b> is just shorthand for "multiply this by itself a bunch of times".</p>
<div class="formula">2⁵ = 2 · 2 · 2 · 2 · 2 = 32</div>
<p>The <b>2</b> is the <i>base</i>, the <b>5</b> is the <i>exponent</i> (or power). Read it as "two to the fifth".</p>
<div class="dev">You already know this: a /24 subnet leaves 8 host bits, so it has 2⁸ = 256 addresses. Every time you shave one bit off the prefix, the block doubles.</div>` },
        { type: 'input', q: 'What is 2¹⁰?', answer: ['1024'], placeholder: 'number',
          explain: `2¹⁰ = 1024. Burn this one into memory: it is why a KiB is 1024 bytes, and why 2¹⁰ ≈ 10³ (a thousand) is the most useful approximation in computing.` },
        { type: 'learn', title: 'The three rules you actually need',
          html: `<ul>
<li><b>Multiply → add exponents:</b> aᵐ · aⁿ = aᵐ⁺ⁿ<br>(2³ · 2⁴ = 2⁷: three 2s then four more 2s)</li>
<li><b>Divide → subtract:</b> aᵐ / aⁿ = aᵐ⁻ⁿ</li>
<li><b>Power of a power → multiply:</b> (aᵐ)ⁿ = aᵐⁿ<br>((2³)² = 2³ · 2³ = 2⁶)</li>
</ul>
<div class="callout">Every rule comes from counting how many copies of the base are being multiplied. If you forget a rule, expand it and count.</div>` },
        { type: 'mcq', q: 'Simplify 2¹⁰ · 2²⁰', choices: ['2³⁰', '2²⁰⁰', '4³⁰', '2¹⁰'], answer: 0,
          explain: `Same base, multiplying → add exponents: 10 + 20 = 30. (Fun reading: KiB-per-KiB… 2¹⁰ · 2²⁰ = 2³⁰ ≈ one billion — that is a GiB.)` },
        { type: 'mcq', q: 'What is (2⁴)³?', choices: ['2⁷', '2¹²', '2⁶⁴', '6⁴'], answer: 1,
          explain: `Power of a power → multiply: 4 · 3 = 12. Expanded: 2⁴ · 2⁴ · 2⁴ = 2⁴⁺⁴⁺⁴ = 2¹².` },
        { type: 'learn', title: 'Zero, negative and fractional powers',
          html: `<p>Follow the subtract rule and some strange-looking powers fall out naturally:</p>
<ul>
<li><b>a⁰ = 1</b> — because a³ / a³ = a³⁻³ = a⁰, and anything divided by itself is 1.</li>
<li><b>a⁻ⁿ = 1 / aⁿ</b> — so 2⁻³ = 1/8. Negative exponent = "divide instead".</li>
<li><b>a^(1/2) = √a</b> — because (a^(1/2))² = a¹ = a.</li>
</ul>
<div class="dev">10⁻³ is a milli (ms), 10⁻⁶ a micro (µs), 10⁻⁹ a nano (ns). Your latency dashboards speak negative exponents fluently.</div>` },
        { type: 'tf', q: '5⁰ = 0', answer: false,
          explain: `Any non-zero number to the power 0 is 1, not 0. Think of it as "multiply by no copies of 5" — the empty product, like starting a running product at 1.` },
        { type: 'mcq', q: 'What is 2⁻²?', choices: ['-4', '1/4', '-1/4', '4'], answer: 1,
          explain: `A negative exponent means reciprocal: 2⁻² = 1/2² = 1/4. It never makes the result negative.` },
        { type: 'input', q: 'What is 16^(1/2)?', answer: ['4', 'four'], placeholder: 'number',
          explain: `A power of 1/2 is a square root: √16 = 4. Check: 4² = 16.` }
      ]
    },
    // ─────────────────────────────────────────────── 2
    {
      id: 'exp-growth',
      title: 'Exponential Growth & Backoff',
      emoji: '🚀',
      steps: [
        { type: 'learn', title: 'Linear vs exponential',
          html: `<p><b>Linear</b> growth adds the same amount each step: 2, 4, 6, 8, 10…</p>
<p><b>Exponential</b> growth <i>multiplies</i> by the same factor each step: 2, 4, 8, 16, 32…</p>
<p>After 10 steps, linear (+2) is at 20. Exponential (×2) is at 1024. After 30 steps: 60 vs over a billion.</p>
<div class="callout">Exponential = the variable is in the exponent: 2ⁿ, not n².</div>` },
        { type: 'mcq', q: 'A pod count doubles every minute starting from 1. How many pods after 10 minutes?', choices: ['20', '100', '512', '1024'], answer: 3,
          explain: `Start at 2⁰ = 1, after 10 doublings you have 2¹⁰ = 1024. Your HPA would like a word.` },
        { type: 'learn', title: 'The legend of the chessboard',
          html: `<p>Put 1 grain of rice on square 1 of a chessboard, 2 on square 2, 4 on square 3… doubling each time. Square 64 gets 2⁶³ grains — about 9.2 × 10¹⁸, way more rice than humanity has ever grown.</p>
<div class="fun">🤓 Fun fact: 2⁶³ − 1 is also the max value of a signed 64-bit integer. Same chessboard, different square.</div>` },
        { type: 'learn', title: 'Exponential backoff',
          html: `<p>When a call fails, retrying immediately just hammers a sick service. <b>Exponential backoff</b> doubles the wait each time:</p>
<div class="formula">delay = base · 2^(attempt − 1)</div>
<p>With base 100 ms: 100, 200, 400, 800, 1600 ms…</p>
<div class="dev">You already know this: AWS SDKs, gRPC, Kubernetes CrashLoopBackOff (10s, 20s, 40s… capped at 5 min) all do this. Add <b>jitter</b> (randomness) so a thousand clients don't retry in lockstep — the "thundering herd".</div>` },
        { type: 'input', q: 'Backoff with base 100 ms doubling each retry: 100, 200, 400, … What is the delay before retry #6 (in ms)?', answer: ['3200', '3200ms'], placeholder: 'ms',
          explain: `100 · 2⁵ = 100 · 32 = 3200 ms. Retry #1 waits 2⁰ · 100, so retry #6 waits 2⁵ · 100.` },
        { type: 'mcq', q: 'Same policy (100, 200, 400, 800, 1600 ms). Total time spent waiting across those 5 retries?', choices: ['1600 ms', '3100 ms', '3200 ms', '5000 ms'], answer: 1,
          explain: `100+200+400+800+1600 = 3100. Neat pattern: a doubling sequence sums to (next term − first term) = 3200 − 100. The last wait is always about half the total.` },
        { type: 'tf', q: 'Without a maximum cap, exponential backoff after 20 retries at base 100 ms would wait over a day before the next try.', answer: true,
          explain: `Retry #21 would wait 100 ms · 2²⁰ ≈ 100 ms · 1,048,576 ≈ 104,858 s ≈ 29 hours. That is why every real backoff policy has a cap (max delay) and a max attempts.` },
        { type: 'order', q: 'Order these from smallest to largest', items: ['2¹⁰', '10⁴', '2²⁰', '10⁹', '2⁶⁴'],
          explain: `2¹⁰ ≈ 1 thousand, 10⁴ = 10 thousand, 2²⁰ ≈ 1 million, 10⁹ = 1 billion, 2⁶⁴ ≈ 1.8 × 10¹⁹. Rule of thumb: every 10 powers of 2 ≈ 3 powers of 10.` }
      ]
    },
    // ─────────────────────────────────────────────── 3
    {
      id: 'logs-intro',
      title: 'Logarithms: Counting the Halvings',
      emoji: '🪓',
      steps: [
        { type: 'learn', title: 'The undo button for exponents',
          html: `<p>Exponent question: <i>2 to the what is 8?</i> The answer is a <b>logarithm</b>:</p>
<div class="formula">log₂ 8 = 3   because   2³ = 8</div>
<p>A log answers <b>"how many times do I multiply the base to reach this number?"</b> — or, flipped around, <b>"how many times can I halve this until I hit 1?"</b></p>
<p>8 → 4 → 2 → 1: three halvings. log₂ 8 = 3.</p>` },
        { type: 'input', q: 'log₂ 32 = ?', answer: ['5', 'five'], placeholder: 'number',
          explain: `2⁵ = 32. Halving: 32 → 16 → 8 → 4 → 2 → 1 is 5 halvings.` },
        { type: 'learn', title: 'Logs crush big numbers',
          html: `<table>
<tr><th>n</th><th>log₂ n</th></tr>
<tr><td>1,024 (thousand)</td><td>10</td></tr>
<tr><td>~1 million</td><td>~20</td></tr>
<tr><td>~1 billion</td><td>~30</td></tr>
<tr><td>~1.8 × 10¹⁹ (2⁶⁴)</td><td>64</td></tr>
</table>
<div class="callout">Multiplying n by 1000 only adds about 10 to log₂ n. That's the superpower.</div>` },
        { type: 'mcq', q: 'Roughly what is log₂ of 1,000,000?', choices: ['6', '20', '1000', '500,000'], answer: 1,
          explain: `2²⁰ = 1,048,576 ≈ 1 million, so log₂(1M) ≈ 20. (6 would be log₁₀ — different base!)` },
        { type: 'learn', title: 'Logs you already use',
          html: `<div class="dev">You already know this: <code>git bisect</code> on 1000 commits finds the bad one in about 10 steps — each test halves the suspect range. That's log₂ 1000 ≈ 10.</div>
<div class="dev">How many bits do you need to give 300 microservices unique IDs? You need 2ᵇ ≥ 300, so b = ⌈log₂ 300⌉ = 9 (2⁸ = 256 is too few, 2⁹ = 512 is enough).</div>` },
        { type: 'input', q: 'git bisect over 4096 commits. In the worst case, how many test runs to find the first bad commit?', answer: ['12', 'twelve'], placeholder: 'number',
          explain: `4096 = 2¹², and each test halves the range, so log₂ 4096 = 12 steps.` },
        { type: 'mcq', q: 'You need unique IDs for 5000 objects. Minimum number of bits?', choices: ['12', '13', '50', '5000'], answer: 1,
          explain: `2¹² = 4096 < 5000, but 2¹³ = 8192 ≥ 5000. So ⌈log₂ 5000⌉ = 13 bits.` },
        { type: 'tf', q: 'log₂ 1 = 0', answer: true,
          explain: `2⁰ = 1, so log₂ 1 = 0. You need zero halvings to get from 1 down to 1.` }
      ]
    },
    // ─────────────────────────────────────────────── 4
    {
      id: 'log-rules',
      title: 'Bases & Log Rules',
      emoji: '🧮',
      steps: [
        { type: 'learn', title: 'Three bases you will meet',
          html: `<ul>
<li><b>log₂</b> — computer science's favorite (halving, bits, binary trees). CS folks often write just "log" or "lg".</li>
<li><b>log₁₀</b> — "how many digits-ish". log₁₀ 1000 = 3. Engineers and calculators love it.</li>
<li><b>ln</b> = logₑ — the <i>natural</i> log, base e ≈ 2.718. Math and physics' favorite (more in a later lesson).</li>
</ul>
<div class="callout">A log in any base is the same idea: how many times do I multiply the base to get here?</div>` },
        { type: 'input', q: 'log₁₀ 1,000,000 = ?', answer: ['6', 'six'], placeholder: 'number',
          explain: `10⁶ = 1,000,000. Shortcut: count the zeros.` },
        { type: 'learn', title: 'Log rules = exponent rules in disguise',
          html: `<ul>
<li><b>log(a · b) = log a + log b</b> — multiplying inside becomes adding outside</li>
<li><b>log(a / b) = log a − log b</b></li>
<li><b>log(aᵏ) = k · log a</b> — a power inside becomes a multiplier outside</li>
</ul>
<p>Example: log₂(8 · 4) = log₂ 8 + log₂ 4 = 3 + 2 = 5. And indeed 32 = 2⁵.</p>
<div class="fun">🤓 Fun fact: before calculators, engineers multiplied big numbers by looking up logs, <i>adding</i> them, and converting back. The slide rule is literally two log scales sliding past each other.</div>` },
        { type: 'mcq', q: 'log₂(1024 · 8) = ?', choices: ['13', '30', '80', '8192'], answer: 0,
          explain: `log₂ 1024 + log₂ 8 = 10 + 3 = 13. (And 1024 · 8 = 8192 = 2¹³. 8192 is the value, not the log.)` },
        { type: 'mcq', q: 'log₂(n³) equals…', choices: ['(log₂ n)³', '3 · log₂ n', 'log₂ n + 3', 'log₂ 3n'], answer: 1,
          explain: `Power rule: the exponent jumps out front as a multiplier. log₂(n³) = 3 · log₂ n. This is why "log of a polynomial" is still just O(log n).` },
        { type: 'learn', title: 'Changing bases',
          html: `<div class="formula">log_b x = log x / log b</div>
<p>Any base converts to any other by dividing by a <b>constant</b>. For example log₂ x = log₁₀ x / log₁₀ 2 ≈ 3.32 · log₁₀ x.</p>
<div class="callout">Since bases differ only by a constant factor, Big-O doesn't care: O(log₂ n) = O(log₁₀ n) = O(ln n). We just write O(log n).</div>` },
        { type: 'tf', q: 'log₂ n and log₁₀ n differ only by a constant factor (about 3.32).', answer: true,
          explain: `Change of base: log₂ n = log₁₀ n / log₁₀ 2 ≈ log₁₀ n / 0.301 ≈ 3.32 · log₁₀ n — for every n. A constant factor.` },
        { type: 'mcq', q: 'How many decimal digits does 10⁸ have?', choices: ['8', '9', '10', '100'], answer: 1,
          explain: `10⁸ = 100,000,000: a 1 followed by 8 zeros = 9 digits. In general a positive integer x has ⌊log₁₀ x⌋ + 1 digits. Classic off-by-one trap!` }
      ]
    },
    // ─────────────────────────────────────────────── 5
    {
      id: 'log-n-wild',
      title: 'Why Fast Things Are log n',
      emoji: '🔍',
      steps: [
        { type: 'learn', title: 'Halve the problem, repeatedly',
          html: `<p><b>Binary search</b> on a sorted list: check the middle. Too high? Throw away the top half. Too low? Throw away the bottom half. Repeat.</p>
<p>Each guess halves what's left, so the number of guesses is how many halvings until one item remains: <b>log₂ n</b>.</p>
<div class="callout">Any algorithm that throws away a constant fraction of the work each step runs in O(log n) steps.</div>` },
        { type: 'widget', widget: 'guess', title: 'Play binary search',
          html: `<p>I'm thinking of a number from 1 to 100. Always guess the middle of what's left and see how close you stay to log₂ 100 ≈ 6.6 (so at most 7 guesses).</p>` },
        { type: 'mcq', q: 'With perfect binary search, what is the maximum number of guesses for 1–100?', choices: ['6', '7', '10', '50'], answer: 1,
          explain: `log₂ 100 ≈ 6.64, and you can't make 0.64 of a guess, so round up: 7. With 6 guesses you can only distinguish 2⁶ = 64 numbers.` },
        { type: 'mcq', q: 'The list grows from 1 million to 1 billion sorted items. How many more binary-search steps (roughly)?', choices: ['About 10 more', 'About 1000× more', 'About 30 more', 'Twice as many'], answer: 0,
          explain: `log₂(1M) ≈ 20 and log₂(1B) ≈ 30. 1000× more data costs only ~10 extra steps.` },
        { type: 'learn', title: 'B-trees: logs with a huge base',
          html: `<p>Postgres and MySQL indexes are <b>B-trees</b>. Each node isn't split 2 ways but hundreds of ways (it holds hundreds of keys per page).</p>
<p>With fan-out f, the tree depth is <b>log_f n</b>. With f = 100:</p>
<ul><li>100 rows → depth 1</li><li>10,000 → 2</li><li>1,000,000 → 3</li><li>100,000,000 → 4</li></ul>
<div class="dev">That's why an indexed lookup on a 100M-row table touches only ~4 pages — and the top levels are almost always cached in shared_buffers.</div>` },
        { type: 'input', q: 'A B-tree with fan-out 1000. How many levels deep to index 1 billion (10⁹) rows?', answer: ['3', 'three'], placeholder: 'levels',
          explain: `log₁₀₀₀(10⁹) = 3, since 1000³ = 10⁹. Three page reads to find any row among a billion.` },
        { type: 'tf', q: 'A balanced binary tree with 1 million nodes has a height of about 20.', answer: true,
          explain: `Each level doubles the node count, so height ≈ log₂(1,000,000) ≈ 20.` },
        { type: 'mcq', q: 'Which takes about log₂ n steps?', choices: ['Scanning a log file line by line for "ERROR"', 'Finding a key in a balanced binary search tree', 'Comparing every pair of pods for duplicate IPs', 'Reading every row of an unindexed table'], answer: 1,
          explain: `A balanced BST discards half the remaining tree at each node. The others look at everything (n) or every pair (n²).` }
      ]
    },
    // ─────────────────────────────────────────────── 6
    {
      id: 'e-compound',
      title: 'e & Compound Growth',
      emoji: '🌱',
      steps: [
        { type: 'learn', title: 'Compounding more and more often',
          html: `<p>Invest $1 at 100% yearly interest. Paid once: $2. Paid twice (50% each half): 1.5² = $2.25. Monthly: (1 + 1/12)¹² ≈ $2.613. Daily: ≈ $2.7146.</p>
<p>Compound infinitely often and you approach a magic limit:</p>
<div class="formula">(1 + 1/n)ⁿ → e ≈ 2.71828…</div>
<p><b>e</b> is the number you get from "growing continuously at 100% rate for one unit of time".</p>` },
        { type: 'mcq', q: 'Compounding 100% interest monthly instead of yearly turns $1 into about…', choices: ['$2.00', '$2.61', '$12.00', '$3.14'], answer: 1,
          explain: `(1 + 1/12)¹² ≈ 2.613. More frequent compounding helps, but it can never exceed e ≈ 2.718.` },
        { type: 'learn', title: 'ln: the log that pairs with e',
          html: `<p><b>ln x</b> = logₑ x. It answers "how long must something grow continuously at 100% to reach x?".</p>
<ul><li>ln 1 = 0</li><li>ln e = 1</li><li>ln 2 ≈ 0.693</li></ul>
<p>Why do mathematicians love e? Because eˣ is the only function (up to scaling) that is its own rate of change — something growing at a speed equal to its current size. Populations, compound interest, unchecked replication.</p>` },
        { type: 'tf', q: 'ln e = 1', answer: true,
          explain: `ln is log base e, and e¹ = e. Just like log₁₀ 10 = 1 and log₂ 2 = 1.` },
        { type: 'learn', title: 'The Rule of 72',
          html: `<p>How long until something growing at r% per period doubles? Roughly:</p>
<div class="formula">doubling time ≈ 72 / r</div>
<p>It comes from ln 2 ≈ 0.693 (bumped to 72 because 72 has lots of divisors and corrects for discrete compounding).</p>
<div class="dev">Your Postgres DB grows 6% per month? 72 / 6 = 12 months to double. Capacity planning in your head, no spreadsheet.</div>` },
        { type: 'input', q: 'Traffic grows 9% per month. Using the Rule of 72, about how many months until it doubles?', answer: ['8', 'eight'], placeholder: 'months',
          explain: `72 / 9 = 8 months. (Exact: ln 2 / ln 1.09 ≈ 8.04. Great approximation!)` },
        { type: 'mcq', q: 'Disk usage doubles every 4 months. How much bigger is it after 1 year?', choices: ['3×', '4×', '8×', '12×'], answer: 2,
          explain: `12 months = 3 doublings: 2³ = 8×. Not 3×! Exponential growth fools linear-thinking brains every time.` },
        { type: 'mcq', q: 'Which value is e closest to?', choices: ['1.618', '2.718', '3.142', '1.414'], answer: 1,
          explain: `e ≈ 2.71828. The others are φ (golden ratio), π, and √2 — all famous, all different.` }
      ]
    },
    // ─────────────────────────────────────────────── 7
    {
      id: 'log-scales',
      title: 'Log Scales in the Wild',
      emoji: '📊',
      steps: [
        { type: 'learn', title: 'When the data spans orders of magnitude',
          html: `<p>Latencies range from 0.2 ms cache hits to 30 s timeouts — 5 orders of magnitude. On a normal (linear) axis, everything below 1 s is squashed into one pixel.</p>
<p>A <b>log scale</b> spaces 1, 10, 100, 1000 <i>evenly</i>. Each gridline is ×10 instead of +10.</p>
<div class="dev">You already know this: Grafana's Y-axis "Scale: Log (base 10)" option. Flip it on for latency histograms and suddenly your p50 and your p99.9 are both readable.</div>` },
        { type: 'mcq', q: 'On a log₁₀ axis, the distance from 1 to 10 equals the distance from…', choices: ['10 to 20', '10 to 100', '10 to 19', '100 to 110'], answer: 1,
          explain: `Equal distances on a log axis mean equal <i>ratios</i>. 1→10 is ×10, and so is 10→100.` },
        { type: 'learn', title: 'Straight line = exponential',
          html: `<p>Plot something exponential (like 2ⁿ) on a log Y-axis and it becomes a <b>straight line</b>, because log(2ⁿ) = n · log 2 — linear in n.</p>
<div class="callout">If your metric curves upward on a linear chart but is a straight line on a log chart, it's growing exponentially. Time to page someone.</div>` },
        { type: 'tf', q: 'On a log-scale Y axis, a metric growing exponentially looks like a straight upward line.', answer: true,
          explain: `log(c · aⁿ) = log c + n · log a, which is linear in n. Steeper line = faster growth rate.` },
        { type: 'learn', title: 'Decibels and Richter',
          html: `<p><b>Decibels</b> measure ratios on a log scale: dB = 10 · log₁₀(P₁/P₀).</p>
<ul><li>+10 dB = 10× the power</li><li>+20 dB = 100×</li><li>+3 dB ≈ 2× (since log₁₀ 2 ≈ 0.301)</li></ul>
<p><b>Richter</b> (earthquakes): each whole number is 10× the shaking amplitude and about 32× the energy.</p>
<div class="fun">🤓 Fun fact: Wi-Fi signal in dBm is a log scale too. −30 dBm is excellent, −90 dBm is basically gone: a 60 dB gap means a million times less power.</div>` },
        { type: 'mcq', q: 'A noise rises from 50 dB to 70 dB. How many times more power is that?', choices: ['20×', '40×', '100×', '1.4×'], answer: 2,
          explain: `+20 dB = 10^(20/10) = 10² = 100× the power. Every +10 dB is another ×10.` },
        { type: 'mcq', q: 'A magnitude 7 quake vs a magnitude 5 quake: how much larger is the shaking amplitude?', choices: ['2×', '20×', '100×', '1000×'], answer: 2,
          explain: `Two steps on a log₁₀ scale: 10 · 10 = 100× the amplitude. (In energy it's about 32² ≈ 1000×!)` },
        { type: 'order', q: 'On a log₁₀ axis, these gridlines are evenly spaced. Put them in order bottom to top.', items: ['0.1 ms', '1 ms', '10 ms', '100 ms', '1 s'],
          explain: `Each step is ×10: 0.1 ms → 1 ms → 10 ms → 100 ms → 1000 ms = 1 s. Evenly spaced ratios, not evenly spaced values.` }
      ]
    }
  ]
});

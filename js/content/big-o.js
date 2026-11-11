CQ.unit({
  id: 'big-o',
  order: 5,
  title: 'Big-O & Complexity',
  emoji: '⏱️',
  color: '#e5484d',
  tagline: 'Will it still work when n is a million?',
  lessons: [
    // ─────────────────────────────────────────────── 1
    {
      id: 'count-steps',
      title: 'Count Steps, Not Seconds',
      emoji: '👣',
      steps: [
        { type: 'learn', title: 'Why not just time it?',
          html: `<p>"It ran in 40 ms on my laptop" depends on your CPU, the JIT, cache warmth, a noisy neighbour on the node… and above all on <b>how big the input was</b>.</p>
<p>Big-O asks a sturdier question: <b>as the input size n grows, how does the number of steps grow?</b></p>
<div class="dev">You already know this: a query that's instant in staging with 500 rows and melts prod with 50 million. Same code, same hardware class — different n.</div>` },
        { type: 'mcq', q: 'Big-O notation primarily describes…', choices: ['Exact running time in milliseconds', 'How the work grows as the input grows', 'How much memory a server has', 'The best possible runtime on any machine'], answer: 1,
          explain: `Big-O is about growth rate — the shape of the curve as n → large — not wall-clock time on a specific machine.` },
        { type: 'learn', title: 'Only the dominant term matters',
          html: `<p>Say a function does <code>3n² + 5n + 100</code> steps. At n = 1000:</p>
<ul><li>3n² = 3,000,000</li><li>5n = 5,000</li><li>100 = 100</li></ul>
<p>The n² term is 99.8% of the work. As n grows it only gets more dominant. So we drop the lower terms <b>and</b> the constant factor: <b>O(n²)</b>.</p>
<div class="callout">Drop constants. Drop lower-order terms. Keep the fastest-growing piece.</div>` },
        { type: 'mcq', q: 'Simplify O(5n + 1000)', choices: ['O(5n)', 'O(n)', 'O(1000)', 'O(n + 1000)'], answer: 1,
          explain: `Drop the constant term 1000 and the constant factor 5. Linear is linear.` },
        { type: 'input', q: 'Simplify O(2n³ + 40n² + n log n) — type the Big-O.', answer: ['O(n³)', 'O(n^3)', 'n³', 'n^3', 'O(n**3)'], placeholder: 'O(...)',
          explain: `n³ grows fastest; n² and n log n are lower order. Drop the 2. Result: O(n³).` },
        { type: 'tf', q: 'An O(n) algorithm is always faster than an O(n²) algorithm, for every input size.', answer: false,
          explain: `Big-O hides constants. 1000n beats n² only once n > 1000. For tiny inputs, the "worse" algorithm can win — that's why many sort implementations switch to insertion sort for small arrays.` },
        { type: 'learn', title: 'Why constants still matter (a little)',
          html: `<p>Big-O is for the <i>big picture</i>. Two O(n) algorithms can differ 10× in practice due to cache behaviour, allocations, or syscalls.</p>
<div class="dev">It's like capacity planning: Big-O tells you whether you need 2× the nodes or 1000× the nodes when traffic grows. Profiling tells you which node type to buy.</div>` },
        { type: 'mcq', q: 'Simplify O(n²/2 + n/2)', choices: ['O(n²/2)', 'O(n)', 'O(n²)', 'O(n³)'], answer: 2,
          explain: `Drop the 1/2 factor and the lower n/2 term. n(n+1)/2 shows up constantly (e.g. comparing all pairs) and it's O(n²).` }
      ]
    },
    // ─────────────────────────────────────────────── 2
    {
      id: 'zoo',
      title: 'The Complexity Zoo',
      emoji: '🦁',
      steps: [
        { type: 'learn', title: 'Meet the usual suspects',
          html: `<table>
<tr><td><b>O(1)</b></td><td>constant</td><td>hash lookup, array index</td></tr>
<tr><td><b>O(log n)</b></td><td>logarithmic</td><td>binary search, B-tree lookup</td></tr>
<tr><td><b>O(n)</b></td><td>linear</td><td>scan a list, grep a file</td></tr>
<tr><td><b>O(n log n)</b></td><td>linearithmic</td><td>good sorting</td></tr>
<tr><td><b>O(n²)</b></td><td>quadratic</td><td>compare every pair</td></tr>
<tr><td><b>O(2ⁿ)</b></td><td>exponential</td><td>try every subset</td></tr>
<tr><td><b>O(n!)</b></td><td>factorial</td><td>try every ordering</td></tr>
</table>` },
        { type: 'widget', widget: 'growth', title: 'Watch them race',
          html: `<p>Drag n upward. Notice how log n barely moves, n² takes off, and 2ⁿ and n! leave the chart almost immediately.</p>` },
        { type: 'order', q: 'Order from slowest-growing (best) to fastest-growing (worst)', items: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)'],
          explain: `This ladder is worth memorizing. Everything up to n log n scales to huge inputs; n² gets painful in the millions; 2ⁿ and n! die before n reaches 100.` },
        { type: 'learn', title: 'What that means at n = 1 million',
          html: `<p>Suppose 1 step = 1 ns (generous). With n = 10⁶:</p>
<ul>
<li>log n ≈ 20 steps → 20 ns</li>
<li>n → 1 ms</li>
<li>n log n ≈ 2 × 10⁷ → 20 ms</li>
<li>n² = 10¹² → ~17 minutes</li>
<li>2ⁿ → longer than the age of the universe (by a lot)</li>
</ul>
<div class="callout">The jump from n log n to n² is the jump from "fine" to "incident".</div>` },
        { type: 'mcq', q: 'Looking up a key in a hash map (typical case) is…', choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 0,
          explain: `Hash the key, jump to the bucket — constant work regardless of how many keys are stored (on average). Redis GET is O(1) for the same reason.` },
        { type: 'mcq', q: 'Generating every possible ordering of n deployment steps to find the best one is…', choices: ['O(n²)', 'O(2ⁿ)', 'O(n!)', 'O(n log n)'], answer: 2,
          explain: `n choices for first, n−1 for second… = n! orderings. At n = 15 that's already over a trillion.` },
        { type: 'mcq', q: 'Checking all subsets of n feature flags to find a breaking combination is…', choices: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(n!)'], answer: 2,
          explain: `Each flag is on or off: 2 · 2 · … · 2 = 2ⁿ combinations. 30 flags ≈ a billion combos.` },
        { type: 'tf', q: 'For large n, n log n grows faster than n but slower than n².', answer: true,
          explain: `n log n = n · (log n). log n grows, so it beats n, but log n is far smaller than n, so it stays well below n · n.` }
      ]
    },
    // ─────────────────────────────────────────────── 3
    {
      id: 'loops',
      title: 'Analyzing Loops',
      emoji: '🔁',
      steps: [
        { type: 'learn', title: 'Loops multiply, sequences add',
          html: `<pre><code>for x in items:        # n times
    for y in items:    #   n times each
        compare(x, y)</code></pre>
<p>Nested loops <b>multiply</b>: n · n = O(n²).</p>
<pre><code>for x in a: ...   # n
for y in b: ...   # m</code></pre>
<p>Back-to-back loops <b>add</b>: O(n + m). If both are size n, that's O(2n) = O(n).</p>` },
        { type: 'mcq', q: 'Three nested loops, each running over all n items. Complexity?', choices: ['O(3n)', 'O(n³)', 'O(n²)', 'O(n log n)'], answer: 1,
          explain: `Nested → multiply: n · n · n = n³.` },
        { type: 'mcq', q: 'One loop over n users, followed (not nested) by one loop over n orders. Complexity?', choices: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], answer: 0,
          explain: `Sequential loops add: n + n = 2n = O(n).` },
        { type: 'learn', title: 'The triangle loop',
          html: `<pre><code>for i in range(n):
    for j in range(i + 1, n):
        check(i, j)</code></pre>
<p>The inner loop shrinks: n−1, n−2, … 1, 0. Total = n(n−1)/2 — every pair exactly once.</p>
<p>Half the work of the full square, but still <b>O(n²)</b>. Halving is a constant factor.</p>` },
        { type: 'tf', q: 'Comparing each pair only once (j > i) instead of all pairs makes the algorithm O(n log n).', answer: false,
          explain: `It does about n²/2 comparisons instead of n². That's a 2× saving — a constant — so it's still O(n²).` },
        { type: 'learn', title: 'The halving loop',
          html: `<pre><code>while n > 1:
    n = n // 2</code></pre>
<p>How many iterations? The number of times you can halve n: <b>O(log n)</b>. Same if you <i>double</i> a counter until it reaches n.</p>
<div class="callout">Loop variable adds/subtracts a constant → O(n). Loop variable multiplies/divides by a constant → O(log n).</div>` },
        { type: 'input', q: 'What is the complexity of: for i in 1..n: { j = 1; while j < n: j = j * 2 }', answer: ['O(n log n)', 'n log n', 'O(nlogn)', 'nlogn'], placeholder: 'O(...)',
          explain: `The outer loop runs n times; the inner doubling loop runs log n times. Nested → multiply: O(n log n).` },
        { type: 'mcq', q: 'for (i = 0; i < n; i += 100) { work() } — complexity?', choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n/100) which is better than O(n)'], answer: 2,
          explain: `It runs n/100 times. Dividing by 100 is a constant factor, so it's still O(n). Stepping by a constant ≠ halving.` },
        { type: 'mcq', q: 'for i in range(n): for j in range(5): f() — complexity?', choices: ['O(1)', 'O(n)', 'O(n²)', 'O(5ⁿ)'], answer: 1,
          explain: `The inner loop is a fixed 5 iterations — a constant. 5n = O(n). Only loops whose size depends on n change the complexity.` }
      ]
    },
    // ─────────────────────────────────────────────── 4
    {
      id: 'bounds-cases',
      title: 'O, Θ, Ω & Best/Worst Case',
      emoji: '🎯',
      steps: [
        { type: 'learn', title: 'Three kinds of bounds',
          html: `<ul>
<li><b>O (Big-O)</b> — an <i>upper</i> bound. "Grows no faster than…" (≤)</li>
<li><b>Ω (Big-Omega)</b> — a <i>lower</i> bound. "Grows at least as fast as…" (≥)</li>
<li><b>Θ (Big-Theta)</b> — a <i>tight</i> bound: both O and Ω. "Grows exactly like…" (=)</li>
</ul>
<p>Technically, a linear scan is O(n), but also O(n²) and O(2ⁿ) — those are true upper bounds, just useless ones. It's Θ(n).</p>
<div class="dev">In everyday engineering, people say "O" when they mean "Θ". Fine at standup — just know the difference for interviews and papers.</div>` },
        { type: 'tf', q: 'It is technically correct to say that an O(n) algorithm is also O(n²).', answer: true,
          explain: `Big-O is an upper bound. If it grows no faster than n, it certainly grows no faster than n². True but unhelpful — Θ(n) is the precise statement.` },
        { type: 'mcq', q: 'Which symbol means a tight bound (both upper and lower)?', choices: ['O', 'Ω', 'Θ', 'ε'], answer: 2,
          explain: `Θ (Theta) = sandwiched between the same function from above and below, up to constants.` },
        { type: 'learn', title: 'Best, worst, average case',
          html: `<p>Same algorithm, different inputs, different work. <b>Linear search</b> for a value:</p>
<ul>
<li><b>Best case:</b> it's the first item → 1 step</li>
<li><b>Worst case:</b> it's last or missing → n steps</li>
<li><b>Average case:</b> about n/2 → still Θ(n)</li>
</ul>
<div class="callout">Case (best/worst/average) and bound (O/Θ/Ω) are separate ideas. You can give a Θ bound for the worst case.</div>
<div class="dev">Like SLOs: p50 is your "average case", p99/max is your "worst case". Pagers care about the worst case.</div>` },
        { type: 'mcq', q: 'Quicksort with a bad pivot choice on already-sorted input degrades to…', choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'], answer: 2,
          explain: `Average case is O(n log n), but always picking the first element as pivot on sorted data peels off one element per level: n levels × n work = O(n²). Hence randomized pivots.` },
        { type: 'mcq', q: 'Hash table lookup: average O(1). What is the worst case if every key collides into one bucket?', choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2,
          explain: `All n keys in one chain → walk the chain → O(n). This is a real attack ("hash flooding"), which is why languages randomize hash seeds.` },
        { type: 'input', q: 'Linear search for a value that happens to be the very first element. How many comparisons?', answer: ['1', 'one'], placeholder: 'number',
          explain: `Best case: one comparison, found it. That's why "best case" analysis is rarely what you plan capacity around.` },
        { type: 'tf', q: '"Worst case" and "Big-O" mean the same thing.', answer: false,
          explain: `Big-O is a kind of bound (upper). Worst case is a choice of input. You can state an O, Ω or Θ bound for best, worst or average case independently.` }
      ]
    },
    // ─────────────────────────────────────────────── 5
    {
      id: 'space-amortized',
      title: 'Space & Amortized Cost',
      emoji: '📦',
      steps: [
        { type: 'learn', title: 'Space complexity',
          html: `<p>Same notation, different resource: how much <b>extra memory</b> grows with n?</p>
<ul>
<li>Summing a list with one accumulator → O(1) extra space</li>
<li>Copying the list, or building a set of seen values → O(n)</li>
<li>Building an n × n distance matrix → O(n²)</li>
</ul>
<div class="dev">You already know this: an OOMKilled pod is a space-complexity bug that met a memory limit. Streaming a file line by line is O(1) memory; <code>f.read()</code> on a 20 GB log is O(n) and a bad time.</div>` },
        { type: 'mcq', q: 'Deduplicating n log lines using a set of seen lines needs how much extra space (worst case)?', choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2,
          explain: `If every line is unique, the set holds all n of them: O(n). Trade-off: O(n) time with O(n) space, vs sorting first.` },
        { type: 'learn', title: 'Recursion uses stack space',
          html: `<p>Each recursive call pushes a frame onto the call stack. A recursion that goes n deep uses <b>O(n)</b> stack space — even if it allocates nothing else.</p>
<p>That's how you get a <code>RecursionError</code> in Python (default limit 1000) or a stack overflow in Java/Go on deep inputs.</p>` },
        { type: 'tf', q: 'A recursive function that recurses n levels deep uses O(n) space even if it creates no data structures.', answer: true,
          explain: `Each pending call keeps a stack frame alive until it returns. n nested calls = n frames.` },
        { type: 'learn', title: 'Amortized: the dynamic array trick',
          html: `<p>A Python list / Go slice / Java ArrayList appends into spare capacity. When full, it allocates <b>double</b> the size and copies everything over — an O(n) hiccup.</p>
<p>But copies happen at sizes 1, 2, 4, 8… n. Total copies ≤ 1 + 2 + 4 + … + n &lt; 2n. Spread over n appends, that's under 2 copies each.</p>
<div class="callout"><b>Amortized O(1)</b>: an occasional expensive operation, paid for by many cheap ones. Average per op over any sequence, guaranteed.</div>` },
        { type: 'mcq', q: 'Appending n items to a doubling dynamic array costs in total…', choices: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'], answer: 1,
          explain: `n writes plus fewer than 2n copying moves = O(n) total, i.e. amortized O(1) per append.` },
        { type: 'mcq', q: 'What if the array grew by a fixed +10 slots each time instead of doubling?', choices: ['Still amortized O(1)', 'Amortized O(n) per append, O(n²) total', 'O(log n) per append', 'It would use less total time'], answer: 1,
          explain: `It would copy at sizes 10, 20, 30, … n: about n²/20 copies total → O(n²), i.e. O(n) per append amortized. Growing by a multiplicative factor is the whole trick.` },
        { type: 'mcq', q: 'Which is the best analogy for amortized cost?', choices: ['A cron job that runs every minute forever', 'Paying for a yearly compaction window that keeps every daily write cheap', 'A request that always times out', 'A load balancer with one backend'], answer: 1,
          explain: `Occasional big cost (compaction, resizing, log rotation) + many cheap ops → small average cost per op. Postgres VACUUM and LSM-tree compaction live in amortized land.` }
      ]
    },
    // ─────────────────────────────────────────────── 6
    {
      id: 'recursion-master',
      title: 'Recursion & the Master Theorem (Lite)',
      emoji: '🪆',
      steps: [
        { type: 'learn', title: 'Recurrences',
          html: `<p>For recursive code, write the cost as a <b>recurrence</b>:</p>
<pre><code>def merge_sort(a):
    split a into two halves         #
    sort each half recursively      # 2 · T(n/2)
    merge them                      # O(n)</code></pre>
<div class="formula">T(n) = 2·T(n/2) + O(n)</div>
<p>"Solving the work for n = solving two half-sized problems plus linear glue."</p>` },
        { type: 'learn', title: 'The recursion tree',
          html: `<p>Draw it: the top does n work. Next level: two halves, n/2 each = n total. Next: four quarters = n total…</p>
<p>Every level costs n, and there are log₂ n levels (halve until size 1).</p>
<div class="formula">n per level × log n levels = O(n log n)</div>
<div class="callout">That's where the "log n" in O(n log n) sorting comes from: the depth of the halving tree.</div>` },
        { type: 'mcq', q: 'Binary search: T(n) = T(n/2) + O(1). Solution?', choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1,
          explain: `One subproblem of half size plus constant work per level, for log n levels: O(log n).` },
        { type: 'learn', title: 'Master theorem, lite version',
          html: `<p>For <b>T(n) = a·T(n/b) + O(nᵈ)</b>: a subproblems, each 1/b the size, with nᵈ glue work. Compare <b>a</b> with <b>bᵈ</b>:</p>
<ul>
<li><b>a &lt; bᵈ</b> → glue dominates → O(nᵈ)</li>
<li><b>a = bᵈ</b> → balanced → O(nᵈ log n)</li>
<li><b>a &gt; bᵈ</b> → leaves dominate → O(n^(log_b a))</li>
</ul>
<p>Merge sort: a=2, b=2, d=1 → 2 = 2¹ → O(n log n). ✓</p>` },
        { type: 'mcq', q: 'T(n) = 4·T(n/2) + O(n). Which case and result?', choices: ['a < bᵈ → O(n)', 'a = bᵈ → O(n log n)', 'a > bᵈ → O(n²)', 'a > bᵈ → O(4ⁿ)'], answer: 2,
          explain: `a = 4, b = 2, d = 1, so bᵈ = 2 and 4 > 2. Leaves dominate: O(n^(log₂ 4)) = O(n²).` },
        { type: 'mcq', q: 'T(n) = 2·T(n/2) + O(n²). Result?', choices: ['O(n²)', 'O(n² log n)', 'O(n log n)', 'O(n³)'], answer: 0,
          explain: `a = 2, bᵈ = 2² = 4, and 2 < 4. The top-level glue dominates: O(n²).` },
        { type: 'learn', title: 'When recursion explodes',
          html: `<p>Naive Fibonacci: <code>fib(n) = fib(n−1) + fib(n−2)</code>. Each call spawns two more, and the subproblems barely shrink. The call tree has roughly 1.6ⁿ nodes — exponential.</p>
<p>The fix — remembering answers you've already computed (memoization) — turns it into O(n). That's dynamic programming, coming up in a later unit.</p>
<div class="dev">It's the same reason you put Redis in front of an expensive query: don't recompute what you already know.</div>` },
        { type: 'tf', q: 'Naive recursive Fibonacci runs in O(n) time.', answer: false,
          explain: `It recomputes the same values over and over; the call tree grows exponentially (about φⁿ ≈ 1.618ⁿ, bounded by O(2ⁿ)). Memoized Fibonacci is O(n).` },
        { type: 'input', q: 'Using the master theorem: T(n) = 2·T(n/2) + O(1). Answer in Big-O.', answer: ['O(n)', 'n'], placeholder: 'O(...)',
          explain: `a = 2, b = 2, d = 0 → bᵈ = 1 < 2. Leaves dominate: O(n^(log₂ 2)) = O(n). Example: recursively summing a tree — you visit every node once.` }
      ]
    },
    // ─────────────────────────────────────────────── 7
    {
      id: 'real-world',
      title: 'Big-O in Production',
      emoji: '🔥',
      steps: [
        { type: 'learn', title: 'The N+1 query problem',
          html: `<pre><code>users = db.query("SELECT * FROM users LIMIT 100")
for u in users:
    u.orders = db.query("SELECT * FROM orders
                         WHERE user_id = ?", u.id)</code></pre>
<p>1 query for the list + N queries in the loop = <b>N+1 round trips</b>. Each trip costs network latency, so this is O(n) round trips where O(1) would do.</p>
<div class="dev">The classic ORM foot-gun. Fix: one JOIN, or <code>WHERE user_id IN (...)</code>, or your ORM's eager-loading (<code>select_related</code>, <code>includes</code>, <code>JOIN FETCH</code>).</div>` },
        { type: 'input', q: 'An endpoint lists 200 posts, then lazily loads each post\'s author in a loop. How many queries in total?', answer: ['201'], placeholder: 'number',
          explain: `1 for the posts + 200 for the authors = 201. At 1 ms round-trip each, that's 200 ms of pure network chatter for one page.` },
        { type: 'mcq', q: 'Best fix for that N+1?', choices: ['Add more DB replicas', 'Fetch all authors in one query with WHERE id IN (...) or a JOIN', 'Increase the connection pool size', 'Add retries with exponential backoff'], answer: 1,
          explain: `Change the algorithm, not the hardware: 2 queries (or 1 JOIN) instead of 201. Replicas and pools just let you do the wrong thing faster.` },
        { type: 'learn', title: 'Missing index = full scan',
          html: `<p><code>SELECT * FROM orders WHERE customer_id = 42</code></p>
<ul>
<li><b>No index:</b> Postgres must read every row — a <code>Seq Scan</code> — O(n).</li>
<li><b>B-tree index on customer_id:</b> walk down the tree — <code>Index Scan</code> — O(log n) to find the match.</li>
</ul>
<p>At 100 million rows: ~100,000,000 rows checked vs ~4 page hops.</p>
<div class="dev">Run <code>EXPLAIN ANALYZE</code>. "Seq Scan" on a big table in a hot query is Big-O shouting at you.</div>` },
        { type: 'mcq', q: 'A table grows 10×. Roughly what happens to an unindexed equality lookup vs an indexed one?', choices: ['Both get 10× slower', 'Unindexed ~10× slower; indexed barely changes', 'Indexed ~10× slower; unindexed barely changes', 'Neither changes'], answer: 1,
          explain: `Seq scan is O(n): 10× rows → ~10× work. B-tree is O(log n): 10× rows adds maybe one level, if that.` },
        { type: 'tf', q: 'Indexes are free: they make reads faster with no downside.', answer: false,
          explain: `Every INSERT/UPDATE must also update each index (O(log n) each), and indexes cost disk and memory. Index what your queries actually filter and join on.` },
        { type: 'learn', title: 'Hidden quadratics',
          html: `<p>Some O(n²) hides inside innocent code:</p>
<ul>
<li><code>if x in some_list</code> inside a loop → O(n) check × n iterations</li>
<li>String concatenation in a loop in some languages → copy the whole string each time</li>
<li><code>list.pop(0)</code> / <code>array.shift()</code> in a loop → each shifts all remaining items</li>
</ul>
<div class="callout">Swap the list for a set (O(1) membership) and quadratic becomes linear.</div>` },
        { type: 'mcq', q: 'for ip in incoming_ips (n): if ip in blocked_list (a Python list of m items): drop(). Complexity, and fix?', choices: ['O(n), already optimal', 'O(n · m); make blocked_list a set → O(n)', 'O(log n); use a heap', 'O(n + m); nothing to fix'], answer: 1,
          explain: `"in" on a list scans it: O(m) per IP → O(n · m). A set does hashed O(1) membership, so total O(n) (plus O(m) to build the set once).` },
        { type: 'order', q: 'Order these lookups by complexity, best to worst', items: ['Redis GET by key', 'Postgres lookup via B-tree index', 'grep through a log file', 'Comparing every pair of log lines for duplicates'],
          explain: `O(1) hash → O(log n) B-tree → O(n) scan → O(n²) all pairs.` }
      ]
    }
  ]
});

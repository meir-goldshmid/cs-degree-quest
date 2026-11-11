CQ.unit({
  id: 'counting-probability',
  order: 6,
  title: 'Counting & Probability',
  emoji: '🎲',
  color: '#12a594',
  tagline: 'Nines, collisions, false alarms and p99 — with actual math',
  lessons: [
    // ─────────────────────────────────────────────── 1
    {
      id: 'product-perm',
      title: 'The Product Rule & Permutations',
      emoji: '✖️',
      steps: [
        { type: 'learn', title: 'Choices multiply',
          html: `<p>If you make one choice with <b>a</b> options and then another with <b>b</b> options, there are <b>a · b</b> combined outcomes. That's the <b>product rule</b>.</p>
<p>3 regions × 4 instance types = 12 possible deployments.</p>
<div class="dev">You already know this: a CI matrix with 3 OS × 4 Python versions × 2 DBs runs 3 · 4 · 2 = 24 jobs. That's why your matrix builds get expensive fast.</div>` },
        { type: 'input', q: 'How many different 4-digit PINs are there (0000–9999)?', answer: ['10000', '10,000', '10⁴'], placeholder: 'number',
          explain: `Each of 4 positions has 10 options: 10 · 10 · 10 · 10 = 10⁴ = 10,000.` },
        { type: 'mcq', q: 'An 8-character password using only lowercase letters (a–z). How many possibilities?', choices: ['8 · 26 = 208', '26⁸ ≈ 2.1 × 10¹¹', '8²⁶', '26!'], answer: 1,
          explain: `26 choices per position, 8 positions: 26⁸ = 208,827,064,576. Sounds big, but a GPU cracker can chew through that quickly — length and alphabet size both matter.` },
        { type: 'learn', title: 'Permutations: order matters',
          html: `<p>How many ways to arrange n different things in a row? n choices for the first slot, n−1 for the second… down to 1:</p>
<div class="formula">n! = n · (n−1) · … · 2 · 1</div>
<p>3! = 6, 5! = 120, 10! = 3,628,800. (And 0! = 1 — one way to arrange nothing.)</p>` },
        { type: 'input', q: 'In how many different orders can you restart 4 services, one at a time?', answer: ['24', 'twenty-four', 'twentyfour'], placeholder: 'number',
          explain: `4! = 4 · 3 · 2 · 1 = 24 orders.` },
        { type: 'learn', title: 'Arranging only some of them',
          html: `<p>Pick and order just <b>k</b> out of n: n · (n−1) · … (k factors).</p>
<div class="formula">P(n, k) = n! / (n − k)!</div>
<p>Example: 10 engineers, assign a primary, secondary and tertiary on-call: 10 · 9 · 8 = 720 ways.</p>` },
        { type: 'mcq', q: 'A race has 8 runners. How many possible gold/silver/bronze podiums?', choices: ['24', '56', '336', '512'], answer: 2,
          explain: `8 choices for gold, 7 for silver, 6 for bronze: 8 · 7 · 6 = 336. Order matters here (gold ≠ bronze).` },
        { type: 'tf', q: '0! = 0', answer: false,
          explain: `0! = 1. There's exactly one way to arrange zero items (do nothing). It also makes formulas like n!/(n−k)! work when k = n.` }
      ]
    },
    // ─────────────────────────────────────────────── 2
    {
      id: 'combinations',
      title: 'Combinations: n Choose k',
      emoji: '🧺',
      steps: [
        { type: 'learn', title: 'When order doesn\'t matter',
          html: `<p>Choosing 3 nodes out of 5 for a quorum: {A,B,C} is the same set as {C,A,B}. Permutations count each set 3! = 6 times, so divide that out:</p>
<div class="formula">C(n, k) = n! / (k! · (n − k)!)</div>
<p>Read it as "<b>n choose k</b>". Here: 5! / (3! · 2!) = 120 / 12 = 10.</p>` },
        { type: 'mcq', q: 'Pick 2 reviewers from a team of 6 (order doesn\'t matter). How many ways?', choices: ['12', '15', '30', '36'], answer: 1,
          explain: `C(6,2) = 6 · 5 / 2 = 15. Permutations would be 30, but {Alice, Bob} = {Bob, Alice}, so halve it.` },
        { type: 'learn', title: 'Permutation or combination?',
          html: `<p>Ask: <b>"If I swap two chosen items, is it a different outcome?"</b></p>
<ul>
<li>Yes → permutation (on-call rotation order, podium, passwords)</li>
<li>No → combination (a team, a quorum, a poker hand, a set of feature flags)</li>
</ul>
<div class="fun">🤓 Fun fact: a "combination lock" is badly named. 1-2-3 ≠ 3-2-1, so it's really a permutation lock.</div>` },
        { type: 'mcq', q: 'How many 5-card poker hands from a 52-card deck?', choices: ['260', '311,875,200', '2,598,960', '52⁵'], answer: 2,
          explain: `C(52,5) = 52·51·50·49·48 / 5! = 311,875,200 / 120 = 2,598,960. The 311 million is the ordered count — dividing by 5! removes order.` },
        { type: 'tf', q: 'C(10, 3) = C(10, 7)', answer: true,
          explain: `Choosing 3 to include is the same as choosing 7 to exclude. Both equal 120. In general C(n,k) = C(n, n−k).` },
        { type: 'learn', title: 'Pairs: the n² sneaking back',
          html: `<p>How many pairs among n things? C(n, 2) = n(n−1)/2.</p>
<div class="dev">A full mesh of n services has n(n−1)/2 possible connections. 10 services → 45 links; 100 services → 4,950. That's the math behind "why do we need a service mesh / message bus?" — and why it's O(n²).</div>` },
        { type: 'input', q: '20 microservices, every pair might talk directly. How many distinct pairs?', answer: ['190'], placeholder: 'number',
          explain: `C(20,2) = 20 · 19 / 2 = 190.` },
        { type: 'mcq', q: 'You have 10 feature flags. How many ways to turn on exactly 2 of them?', choices: ['20', '45', '90', '1024'], answer: 1,
          explain: `C(10,2) = 45. (1024 = 2¹⁰ is the number of ways to set all flags any way at all — the sum of C(10,k) for k = 0…10.)` }
      ]
    },
    // ─────────────────────────────────────────────── 3
    {
      id: 'pigeonhole-birthday',
      title: 'Pigeonholes & the Birthday Paradox',
      emoji: '🎂',
      steps: [
        { type: 'learn', title: 'The pigeonhole principle',
          html: `<p>Put n + 1 pigeons into n holes, and some hole gets at least two. Obvious — and shockingly powerful.</p>
<ul>
<li>13 people → two share a birth month.</li>
<li>A 32-bit hash has 2³² outputs. Hash 2³² + 1 different keys → a collision is <b>guaranteed</b>.</li>
</ul>
<div class="callout">Whenever inputs outnumber outputs, collisions aren't a bug — they're a certainty.</div>` },
        { type: 'mcq', q: 'A /24 subnet has 254 usable host addresses. You launch 255 pods that each need a unique IP from it. What happens?', choices: ['Works if you are lucky', 'At least one pod cannot get a unique IP — guaranteed', 'About a 50% chance of a conflict', 'Kubernetes compresses the IPs'], answer: 1,
          explain: `Pigeonhole: 255 pods, 254 addresses. No luck involved — someone is left out.` },
        { type: 'learn', title: 'The birthday paradox',
          html: `<p>How many people in a room before there's a 50% chance two share a birthday? Not 183 — just <b>23</b>.</p>
<p>Why? It's about <i>pairs</i>, not people. 23 people form C(23,2) = 253 pairs, and each pair has a 1/365 chance to match.</p>
<p>With 70 people, the chance is over 99.9%.</p>` },
        { type: 'widget', widget: 'hash', title: 'Collisions come early',
          html: `<p>Type a handful of keys into 8 buckets. Count how many keys it takes before two land in the same bucket — often just 3 or 4, far fewer than 8.</p>` },
        { type: 'learn', title: 'Collisions arrive at √N',
          html: `<p>Rule of thumb: with N possible values, you hit a 50% collision chance after about <b>1.2 · √N</b> random items.</p>
<ul>
<li>365 birthdays → 1.2 · √365 ≈ 23 ✓</li>
<li>32-bit hash (N ≈ 4.3 billion) → ~77,000 items. Not billions!</li>
<li>UUIDv4 (122 random bits) → ~2.7 × 10¹⁸ items. You're fine.</li>
</ul>
<div class="dev">That's why 32-bit CRCs make lousy unique IDs, why Git moved toward SHA-256, and why short 7-char Git hashes eventually become ambiguous in big repos.</div>` },
        { type: 'mcq', q: 'You give each of your request IDs 32 random bits. Around how many requests until a 50% chance of some duplicate?', choices: ['~65', '~77,000', '~2 billion', '~4.3 billion'], answer: 1,
          explain: `√(2³²) = 2¹⁶ = 65,536, times ~1.18 ≈ 77,000. A busy service does that in seconds — use 64+ bits or UUIDs.` },
        { type: 'tf', q: 'In a room of 23 people, there\'s roughly a 50% chance that two share a birthday.', answer: true,
          explain: `Exactly ≈ 50.7%. Counterintuitive because we imagine "someone sharing MY birthday" (which needs ~253 people), not "any pair matching".` },
        { type: 'mcq', q: 'Doubling the number of hash bits from 32 to 64 moves the 50%-collision point from ~77 thousand items to…', choices: ['~154 thousand', '~5 billion', '~10¹⁹', '~77 million'], answer: 1,
          explain: `Threshold ∝ √N. √(2⁶⁴) = 2³² ≈ 4.3 billion, × 1.18 ≈ 5 billion. Doubling the bits squares the space and pushes collisions about 65,000× further out.` }
      ]
    },
    // ─────────────────────────────────────────────── 4
    {
      id: 'nines',
      title: 'Probability, Independence & the Nines',
      emoji: '9️⃣',
      steps: [
        { type: 'learn', title: 'Probability basics',
          html: `<p>Probability = favourable outcomes ÷ all equally likely outcomes, a number from 0 (never) to 1 (always).</p>
<ul>
<li>P(die shows 6) = 1/6</li>
<li>P(not A) = 1 − P(A)</li>
<li>If A and B are <b>independent</b>: P(A and B) = P(A) · P(B)</li>
</ul>
<p>Independent = knowing one tells you nothing about the other. Two coin flips, yes. Two pods on the same node during a node failure? Very much not.</p>` },
        { type: 'mcq', q: 'Roll two fair dice. What is the probability both show 6?', choices: ['1/6', '1/12', '1/36', '2/6'], answer: 2,
          explain: `Independent: 1/6 · 1/6 = 1/36.` },
        { type: 'learn', title: 'Translating nines into downtime',
          html: `<table>
<tr><th>Availability</th><th>Downtime / year</th></tr>
<tr><td>99% (two nines)</td><td>~3.65 days</td></tr>
<tr><td>99.9% (three)</td><td>~8.76 hours</td></tr>
<tr><td>99.99% (four)</td><td>~52.6 minutes</td></tr>
<tr><td>99.999% (five)</td><td>~5.26 minutes</td></tr>
</table>
<p>Math: downtime = (1 − availability) × 8,760 hours. Each extra nine cuts the error budget by 10×.</p>` },
        { type: 'input', q: 'An SLO of 99.9% over a 30-day month. How many minutes of downtime are allowed? (30 days = 43,200 minutes)', answer: ['43.2', '43.2min', '43.2minutes'], placeholder: 'minutes',
          explain: `0.001 × 43,200 = 43.2 minutes. That's your monthly error budget.` },
        { type: 'learn', title: 'Series: every link must hold',
          html: `<p>Your request goes LB → API → DB. It succeeds only if <b>all</b> are up. If they fail independently:</p>
<div class="formula">A_total = A₁ · A₂ · A₃</div>
<p>Three 99.9% components in series: 0.999³ ≈ 0.997 = <b>99.7%</b>.</p>
<div class="callout">Series availability is always worse than the weakest link. Every new hard dependency eats your nines.</div>` },
        { type: 'mcq', q: 'Your service hard-depends on 5 others, each 99.9% available (independently). Best-case availability of yours?', choices: ['99.9%', '≈ 99.5%', '≈ 95%', '99.99%'], answer: 1,
          explain: `0.999⁵ ≈ 0.995 = 99.5%. Even if your own code is perfect, you can't promise 99.9% on top of five 99.9% dependencies.` },
        { type: 'learn', title: 'Parallel: any one will do',
          html: `<p>Two replicas behind a load balancer: the service is down only if <b>both</b> are down.</p>
<div class="formula">A = 1 − (1 − A₁)(1 − A₂)</div>
<p>Two 99% replicas: 1 − 0.01 · 0.01 = 1 − 0.0001 = <b>99.99%</b>. Redundancy multiplies the <i>failure</i> probabilities.</p>
<div class="dev">The catch: <b>independence</b>. Two replicas in the same AZ, on the same node, or running the same bad config push fail <i>together</i>. That's why we use anti-affinity, multi-AZ, and staged rollouts.</div>` },
        { type: 'mcq', q: 'Three independent replicas, each 90% available. Probability at least one is up?', choices: ['90%', '99%', '99.9%', '72.9%'], answer: 2,
          explain: `All three down: 0.1³ = 0.001. At least one up: 1 − 0.001 = 0.999 = 99.9%. (72.9% = 0.9³ is the chance all three are up.)` },
        { type: 'tf', q: 'Two replicas in the same availability zone give the full 1 − (1−A)² availability during an AZ outage.', answer: false,
          explain: `The formula assumes independent failures. An AZ outage takes both down at once — correlated failure. Real-world redundancy is only as good as its independence.` }
      ]
    },
    // ─────────────────────────────────────────────── 5
    {
      id: 'bayes',
      title: 'Conditional Probability & Bayes',
      emoji: '🚨',
      steps: [
        { type: 'learn', title: 'Probability given something',
          html: `<p><b>P(A | B)</b> reads "probability of A <i>given</i> B" — zoom into only the world where B happened.</p>
<div class="formula">P(A | B) = P(A and B) / P(B)</div>
<p>Example: P(disk full | alert fired) vs P(alert fired | disk full). They sound similar. They are <b>wildly</b> different numbers — confusing them is how alert fatigue is born.</p>` },
        { type: 'mcq', q: 'Draw one card. Given that it\'s a heart, what\'s the probability it\'s the ace of hearts?', choices: ['1/52', '1/13', '1/4', '4/52'], answer: 1,
          explain: `Given "heart", the world shrinks to 13 cards, one of which is the ace: 1/13.` },
        { type: 'learn', title: 'The alert that cried wolf',
          html: `<p>An anomaly detector watches minute-by-minute metrics:</p>
<ul>
<li>Real incidents happen in <b>1%</b> of minutes.</li>
<li>When there's an incident, it fires <b>99%</b> of the time.</li>
<li>When everything's fine, it still fires <b>5%</b> of the time.</li>
</ul>
<p>It fires. What's the chance there's actually an incident? Most people guess ~95%. Let's count.</p>` },
        { type: 'learn', title: 'Count 10,000 minutes',
          html: `<ul>
<li>100 minutes have a real incident → 99 alerts</li>
<li>9,900 minutes are fine → 5% = <b>495</b> false alerts</li>
</ul>
<p>Total alerts: 99 + 495 = 594. Real ones: 99.</p>
<div class="formula">P(incident | alert) = 99 / 594 ≈ 17%</div>
<p>Five out of six pages are false alarms! The rare base rate swamps the "99% accurate" detector.</p>
<div class="dev">This is Bayes' theorem in on-call form. It's why the SRE book says alert on symptoms users feel, and why false-positive rate matters more than you think.</div>` },
        { type: 'tf', q: 'If a detector catches 99% of real incidents, then when it fires there\'s a 99% chance of a real incident.', answer: false,
          explain: `That swaps P(alert | incident) with P(incident | alert). With a low base rate and any meaningful false-positive rate, most alerts can be false — 17% real in our example.` },
        { type: 'learn', title: 'Bayes\' theorem, formally',
          html: `<div class="formula">P(A | B) = P(B | A) · P(A) / P(B)</div>
<ul>
<li><b>P(A)</b> — prior: the base rate before evidence</li>
<li><b>P(B | A)</b> — how likely the evidence is if A is true</li>
<li><b>P(A | B)</b> — posterior: updated belief after evidence</li>
</ul>
<p>The counting trick (imagine 10,000 cases) gives the same answer and is far harder to mess up.</p>` },
        { type: 'mcq', q: 'Same detector (99% catch rate, 5% false-positive rate), but now incidents happen in 50% of minutes. When it fires, P(incident)?', choices: ['≈ 17%', '≈ 50%', '≈ 95%', '≈ 99.9%'], answer: 2,
          explain: `Out of 10,000: 5,000 incidents → 4,950 alerts; 5,000 fine → 250 false alerts. 4,950 / 5,200 ≈ 95%. Same detector, different base rate, totally different meaning.` },
        { type: 'mcq', q: 'Best way to make the original alert more trustworthy?', choices: ['Lower the threshold so it fires more often', 'Reduce the false-positive rate (e.g. require the condition for 5 minutes)', 'Page more people at once', 'Increase the incident rate'], answer: 1,
          explain: `With rare incidents, false positives dominate. Cutting them (a "for: 5m" clause in Prometheus, multi-window burn-rate alerts) raises P(incident | alert) dramatically.` },
        { type: 'input', q: 'Out of 1,000 deploys, 20 are bad. A canary check flags 18 of the bad ones and 49 of the good ones. Of flagged deploys, how many are actually bad? (just the count)', answer: ['18'], placeholder: 'number',
          explain: `18 bad ones flagged, out of 18 + 49 = 67 flagged total. So P(bad | flagged) = 18/67 ≈ 27%.` }
      ]
    },
    // ─────────────────────────────────────────────── 6
    {
      id: 'expected-retries',
      title: 'Expected Value, Binomial & Retries',
      emoji: '🔄',
      steps: [
        { type: 'learn', title: 'Expected value: the long-run average',
          html: `<p>Multiply each outcome by its probability and add them up:</p>
<div class="formula">E[X] = Σ value × probability</div>
<p>A fair die: (1+2+3+4+5+6)/6 = <b>3.5</b>. You'll never roll 3.5, but it's the average over many rolls.</p>
<div class="dev">Risk math: a change with a 2% chance of a $50,000 outage has an expected cost of 0.02 × 50,000 = $1,000. Now compare that to the cost of the extra testing.</div>` },
        { type: 'input', q: 'A cache hit costs 1 ms, a miss costs 21 ms. Hit rate is 90%. Expected latency in ms?', answer: ['3', '3ms', 'three'], placeholder: 'ms',
          explain: `0.9 × 1 + 0.1 × 21 = 0.9 + 2.1 = 3 ms. Notice the 10% of misses contribute 70% of the average latency.` },
        { type: 'learn', title: 'Retries: the geometric distribution',
          html: `<p>Each attempt independently succeeds with probability p. How many attempts until the first success?</p>
<ul>
<li>P(first success on attempt k) = (1 − p)ᵏ⁻¹ · p</li>
<li>Expected attempts = <b>1 / p</b></li>
<li>P(all n attempts fail) = (1 − p)ⁿ</li>
</ul>
<p>Flaky call succeeding 25% of the time → 4 attempts on average.</p>` },
        { type: 'mcq', q: 'An API call succeeds 90% of the time (independently). With 3 total attempts, what\'s the chance all fail?', choices: ['10%', '1%', '0.1%', '30%'], answer: 2,
          explain: `0.1³ = 0.001 = 0.1%. Retries turn 90% into 99.9% — assuming failures are independent. If the backend is truly down, all 3 fail together.` },
        { type: 'input', q: 'A flaky test passes 20% of the time. On average, how many runs until it passes?', answer: ['5', 'five'], placeholder: 'runs',
          explain: `Expected attempts = 1/p = 1/0.2 = 5. (Please fix the test instead.)` },
        { type: 'learn', title: 'The binomial distribution',
          html: `<p>n independent trials, each succeeding with probability p. Chance of exactly k successes:</p>
<div class="formula">P(k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ</div>
<p>C(n, k) counts <i>which</i> trials succeeded; the rest is the probability of one such pattern.</p>
<div class="dev">Quorum math: an etcd cluster of 3 survives if at least 2 members are up. With each 90% up: P(3 up) = 0.729, P(exactly 2 up) = 3 · 0.9² · 0.1 = 0.243. Total ≈ <b>97.2%</b>.</div>` },
        { type: 'mcq', q: 'Flip a fair coin 3 times. Probability of exactly 2 heads?', choices: ['1/8', '2/8', '3/8', '1/2'], answer: 2,
          explain: `C(3,2) = 3 patterns (HHT, HTH, THH), each with probability (1/2)³ = 1/8. Total 3/8.` },
        { type: 'tf', q: 'If a request fans out to 3 backends and each fails independently with 1%, the chance at least one fails is exactly 3%.', answer: false,
          explain: `It's 1 − 0.99³ ≈ 2.97%. Adding probabilities slightly overcounts the cases where two fail at once. Close for small numbers, wrong for big ones (try 200 backends: "200%"?).` },
        { type: 'mcq', q: 'Which kind of retry makes a dependency outage worse?', choices: ['Capped exponential backoff with jitter', 'Immediate tight-loop retries from every client', 'A retry budget limiting retries to 10% of traffic', 'Not retrying non-idempotent writes'], answer: 1,
          explain: `During an outage failures are NOT independent — retrying instantly just multiplies load (a retry storm). Backoff, jitter and retry budgets keep the math from turning against you.` }
      ]
    },
    // ─────────────────────────────────────────────── 7
    {
      id: 'percentiles',
      title: 'Mean, Median & p99',
      emoji: '📉',
      steps: [
        { type: 'learn', title: 'Mean vs median',
          html: `<p><b>Mean</b>: add everything, divide by the count. <b>Median</b>: the middle value when sorted.</p>
<p>Latencies (ms): 10, 10, 10, 10, 1000</p>
<ul><li>Mean = 1040 / 5 = <b>208 ms</b></li><li>Median = <b>10 ms</b></li></ul>
<p>The mean describes nobody's actual experience. One outlier drags it far away.</p>
<div class="callout">Latency is skewed (long tail). Averages lie; percentiles tell the truth.</div>` },
        { type: 'input', q: 'Response times: 4, 7, 5, 100, 6 ms. What is the median?', answer: ['6', '6ms', 'six'], placeholder: 'ms',
          explain: `Sort: 4, 5, 6, 7, 100. The middle (3rd of 5) is 6. The mean would be 24.4 — dragged up by the 100.` },
        { type: 'learn', title: 'Percentiles',
          html: `<p>The <b>p99</b> is the value 99% of requests are at or below. The median is the <b>p50</b>.</p>
<ul>
<li>p50 — the typical request</li>
<li>p95 / p99 — the slow tail that real users still hit</li>
<li>p99.9 — your power users and biggest pages, often</li>
</ul>
<div class="dev">You already know this: Prometheus <code>histogram_quantile(0.99, …)</code>, Datadog p99 monitors, latency SLOs like "99% of requests under 300 ms".</div>` },
        { type: 'mcq', q: 'You served 10,000 requests. Roughly how many were slower than the p99?', choices: ['1', '10', '100', '990'], answer: 2,
          explain: `1% of 10,000 = 100 requests. "Only 1%" is still 100 unhappy users — or one user's every page load.` },
        { type: 'tf', q: 'You can get the overall p99 across 10 pods by averaging each pod\'s p99.', answer: false,
          explain: `Percentiles don't average. You need to merge the underlying distributions (e.g. sum Prometheus histogram buckets, then compute histogram_quantile). Averaging p99s can hide a single bad pod.` },
        { type: 'learn', title: 'Tail at scale',
          html: `<p>A page fans out to 100 backend calls and must wait for <b>all</b> of them. Each call is "only" slower than its p99 with probability 1%.</p>
<div class="formula">P(page hits ≥ 1 slow call) = 1 − 0.99¹⁰⁰ ≈ 63%</div>
<p>Most page loads now experience a backend's p99! Your backend's tail becomes your user's median.</p>
<div class="fun">🤓 Fun fact: this is the core of Google's famous paper "The Tail at Scale" — and the reason for tricks like hedged requests.</div>` },
        { type: 'mcq', q: 'A request fans out to 10 shards in parallel and waits for all. Each shard independently exceeds its p99 1% of the time. Chance the request sees at least one slow shard?', choices: ['≈ 1%', '≈ 9.6%', '≈ 10%', '≈ 63%'], answer: 1,
          explain: `1 − 0.99¹⁰ ≈ 1 − 0.904 = 0.096 ≈ 9.6%. Close to 10% (adding), but slightly less because of overlap.` },
        { type: 'order', q: 'For a typical long-tailed latency distribution, order from smallest to largest', items: ['p50', 'mean', 'p99', 'max'],
          explain: `Long tails pull the mean above the median (p50). p99 sits in the tail, and max is the single worst request. (For a symmetric distribution mean ≈ median, but latency is almost never symmetric.)` }
      ]
    }
  ]
});

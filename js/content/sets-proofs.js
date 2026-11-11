CQ.unit({
  id: 'sets-proofs',
  order: 3,
  title: 'Sets, Functions & Proofs',
  emoji: '🧩',
  color: '#ff7675',
  tagline: 'SQL joins, hashing and how to be 100% sure',
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'sets',
      title: 'Sets & Venn Diagrams',
      emoji: '⭕',
      steps: [
        { type: 'learn', title: 'What is a set?', html: `
<p>A <b>set</b> is a collection of <b>distinct</b> things with <b>no order</b>.</p>
<div class="formula">{1, 2, 3} = {3, 1, 2} = {1, 1, 2, 3}</div>
<ul><li><b>x ∈ A</b>: x is an element of A. <b>x ∉ A</b>: it is not.</li>
<li><b>∅</b>: the empty set.</li><li><b>|A|</b>: the cardinality (number of elements).</li></ul>
<div class="dev">You already know this: Redis <code>SADD</code> ignores duplicates, Python's <code>set()</code> dedupes, and Kubernetes labels on an object form a set of key/value pairs.</div>` },
        { type: 'tf', q: 'The set {a, b, b, c} has cardinality 4.', answer: false,
          explain: `Duplicates do not count in a set. {a, b, b, c} = {a, b, c}, so its cardinality is 3.` },
        { type: 'learn', title: 'The core operations', html: `
<p>Let A = {1, 2, 3, 4} and B = {3, 4, 5, 6}.</p>
<table><tr><th>Op</th><th>Meaning</th><th>Result</th></tr>
<tr><td>A ∪ B</td><td>in A or B (union)</td><td>{1,2,3,4,5,6}</td></tr>
<tr><td>A ∩ B</td><td>in both (intersection)</td><td>{3,4}</td></tr>
<tr><td>A − B</td><td>in A, not in B (difference)</td><td>{1,2}</td></tr></table>
<svg viewBox="0 0 200 90" width="200" height="90"><circle cx="75" cy="45" r="38" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="125" cy="45" r="38" fill="none" stroke="var(--accent)" stroke-width="2"/><text x="55" y="50" fill="currentColor" font-size="14">A</text><text x="138" y="50" fill="currentColor" font-size="14">B</text><text x="92" y="50" fill="currentColor" font-size="11">A∩B</text></svg>` },
        { type: 'input', q: 'A = {1, 2, 3, 4}, B = {3, 4, 5, 6}. What is |A ∪ B|?', answer: ['6', 'six'], placeholder: 'number',
          explain: `A ∪ B = {1, 2, 3, 4, 5, 6}. The shared 3 and 4 are counted once.` },
        { type: 'mcq', q: 'Same sets. What is B − A?',
          choices: ['{1, 2}', '{5, 6}', '{3, 4}', '∅'], answer: 1,
          explain: `Elements of B that are not in A: 5 and 6. Note that difference is not symmetric: A − B = {1, 2}.` },
        { type: 'learn', title: 'Sets in SQL', html: `
<p>SQL is set theory wearing a suit:</p>
<ul><li><code>UNION</code> = ∪ (removes duplicates; <code>UNION ALL</code> keeps them)</li>
<li><code>INTERSECT</code> = ∩</li>
<li><code>EXCEPT</code> = − (Oracle calls it <code>MINUS</code>)</li>
<li>Anti-join: <code>LEFT JOIN b ... WHERE b.id IS NULL</code> = A − B</li></ul>
<div class="dev">You already know this: "users who signed up but never logged in" is signups − logins. Redis even has <code>SUNION</code>, <code>SINTER</code> and <code>SDIFF</code>.</div>` },
        { type: 'mcq', q: 'Which standard SQL keyword performs set difference?',
          choices: ['UNION', 'INTERSECT', 'EXCEPT', 'DISTINCT'], answer: 2,
          explain: `SELECT ... EXCEPT SELECT ... returns rows from the first query that are not in the second.` },
        { type: 'learn', title: 'Counting without double counting', html: `
<p>If you add |A| and |B|, the overlap gets counted twice. Subtract it once:</p>
<div class="formula">|A ∪ B| = |A| + |B| − |A ∩ B|</div>
<p>This is <b>inclusion–exclusion</b>. 120 users on iOS, 80 on web, 30 on both: 120 + 80 − 30 = <b>170</b> unique users, not 200.</p>` },
        { type: 'input', q: '50 pods have the label app=api, 40 have env=prod, and 15 have both. How many pods have at least one of these labels?', answer: ['75'], placeholder: 'number',
          explain: `50 + 40 − 15 = 75.` },
        { type: 'tf', q: 'For any sets A and B, every element of A ∩ B is also in A ∪ B.', answer: true,
          explain: `If x is in both, it is certainly in at least one. In symbols: A ∩ B ⊆ A ∪ B.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'subsets-products',
      title: 'Subsets, Power Sets & Products',
      emoji: '🧮',
      steps: [
        { type: 'learn', title: 'Subsets', html: `
<p><b>A ⊆ B</b> ("A is a subset of B") means every element of A is also in B.</p>
<ul><li>{1, 2} ⊆ {1, 2, 3} ✅</li><li>A ⊆ A, always ✅</li><li>∅ ⊆ anything ✅ (vacuous truth strikes again: ∅ has no element that could fail)</li></ul>
<div class="dev">You already know this: a Kubernetes label selector matches a pod when the selector's labels are a subset of the pod's labels.</div>` },
        { type: 'tf', q: 'The empty set ∅ is a subset of every set.', answer: true,
          explain: `"Every element of ∅ is in B" is vacuously true because ∅ has no elements.` },
        { type: 'learn', title: 'The power set: 2ⁿ', html: `
<p>The <b>power set</b> P(A) is the set of <b>all</b> subsets of A. For A = {a, b}:</p>
<div class="formula">P(A) = { ∅, {a}, {b}, {a, b} }</div>
<p>Why 2ⁿ subsets? Each element is either <b>in or out</b>: one bit per element! Subsets of an n-element set ↔ n-bit numbers.</p>
<div class="formula">|P(A)| = 2ⁿ</div>
<div class="dev">You already know this: 10 feature flags give 2¹⁰ = 1024 on/off combinations. Each combination is a subset of the flags that are on.</div>` },
        { type: 'input', q: 'A has 5 elements. How many subsets does it have (|P(A)|)?', answer: ['32', 'thirty-two', 'thirty two'], placeholder: 'number',
          explain: `2⁵ = 32, counting both ∅ and A itself.` },
        { type: 'mcq', q: 'How many subsets of {x, y, z} contain x?',
          choices: ['3', '4', '6', '8'], answer: 1,
          explain: `x is forced in; y and z are each free (in/out): 2² = 4. Exactly half of the 8 subsets.` },
        { type: 'learn', title: 'Cartesian product', html: `
<p><b>A × B</b> is the set of all <b>ordered pairs</b> (a, b) with a ∈ A and b ∈ B.</p>
<div class="formula">{1, 2} × {x, y} = {(1,x), (1,y), (2,x), (2,y)}</div>
<div class="formula">|A × B| = |A| · |B|</div>
<div class="dev">You already know this: a CI build matrix (3 OSes × 4 Node versions = 12 jobs) is a cartesian product. So is SQL <code>CROSS JOIN</code>, and so is the accidental join you forgot the ON clause for.</div>` },
        { type: 'input', q: 'A CI matrix has 3 OSes × 4 runtime versions × 2 CPU architectures. How many jobs?', answer: ['24'], placeholder: 'number',
          explain: `3 × 4 × 2 = 24. Cartesian products grow fast; that is why CI bills grow fast too.` },
        { type: 'tf', q: 'For any sets A and B, A × B = B × A.', answer: false,
          explain: `Pairs are ordered: (1, x) ≠ (x, 1). They are equal only in special cases (A = B, or one of them empty). Same size, though.` },
        { type: 'mcq', q: 'You accidentally CROSS JOIN a 1,000-row table with another 1,000-row table. How many rows come back?',
          choices: ['1,000', '2,000', '1,000,000', '0'], answer: 2,
          explain: `|A × B| = 1,000 × 1,000 = 1,000,000. Say hi to your DBA.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'functions',
      title: 'Relations & Functions',
      emoji: '🗺️',
      steps: [
        { type: 'learn', title: 'Relations and functions', html: `
<p>A <b>relation</b> from A to B is any subset of A × B: "user follows user", "pod runs on node".</p>
<p>A <b>function</b> f: A → B is a relation where <b>every input gets exactly one output</b>.</p>
<ul><li><b>Domain</b>: the allowed inputs (A)</li><li><b>Codomain</b>: where outputs live (B)</li><li><b>Image / range</b>: outputs actually produced</li></ul>
<div class="dev">You already know this: "pod → node it is scheduled on" is a function (each scheduled pod has exactly one node). "Node → pods" is not; a node runs many pods.</div>` },
        { type: 'mcq', q: 'Which of these is NOT a function?',
          choices: ['Commit SHA → its author', 'Hostname → all IPs in its DNS A records', 'Pod → its namespace', 'User ID → user row (by primary key)'], answer: 1,
          explain: `A hostname can have several A records, so one input maps to many outputs. The others give exactly one output per input.` },
        { type: 'learn', title: 'Injective, surjective, bijective', html: `
<ul><li><b>Injective</b> (one-to-one): different inputs → different outputs. No collisions.</li>
<li><b>Surjective</b> (onto): every element of the codomain gets hit by some input.</li>
<li><b>Bijective</b>: both. A perfect pairing, so it can be <b>inverted</b>.</li></ul>
<div class="callout">Injective = "I can always tell which input you came from". Bijective = "and nothing in the target is left out".</div>` },
        { type: 'tf', q: 'A hash function from arbitrary strings to 64-bit values can be injective.', answer: false,
          explain: `There are infinitely many strings but only 2⁶⁴ outputs, so some different inputs must collide. (That is the pigeonhole principle, coming soon.)` },
        { type: 'learn', title: 'Functions in your stack', html: `
<ul><li><b>base64, gzip, encryption</b>: injective. You can decode/decompress/decrypt because no two inputs share an output.</li>
<li><b>Hash functions</b>: not injective. Collisions exist; cryptographic hashes just make them practically impossible to find.</li>
<li><b>Sharding</b> key → shard: surjective is what you want (every shard gets used), injective is impossible with more keys than shards.</li></ul>
<div class="dev">You already know this: "you cannot reverse a SHA-256" is really the statement "SHA-256 is not injective, and it is designed so you cannot find a preimage".</div>` },
        { type: 'mcq', q: 'f(x) = 2x, from integers to integers. Which is it?',
          choices: ['Injective but not surjective', 'Surjective but not injective', 'Bijective', 'Neither'], answer: 0,
          explain: `Different x give different 2x (injective). But odd numbers like 3 are never produced, so it is not surjective onto the integers.` },
        { type: 'mcq', q: 'Why can you decode base64 but not "decode" a SHA-256 hash?',
          choices: ['base64 is injective; SHA-256 maps infinitely many inputs onto finitely many outputs', 'SHA-256 is encrypted with a secret key', 'base64 output is shorter', 'SHA-256 is surjective'], answer: 0,
          explain: `base64 never merges two inputs, so each output has exactly one source. SHA-256 merges infinitely many inputs into each output, so there is no single input to return. (SHA-256 has no key; HMAC is a different story.)` },
        { type: 'learn', title: 'Bijections mean "same size"', html: `
<p>If a bijection exists between two finite sets, they have the <b>same number of elements</b>: you have paired them up perfectly, like socks.</p>
<p>How many bijections from {1, 2, 3} to {a, b, c}? 1 has 3 choices, then 2 has 2 left, then 3 has 1: 3 × 2 × 1 = 6.</p>
<div class="fun">🤓 Fun fact: Georg Cantor used bijections to show some infinities are bigger than others. There are "more" real numbers than integers.</div>` },
        { type: 'tf', q: 'If there is a bijection between finite sets A and B, then |A| = |B|.', answer: true,
          explain: `A bijection pairs each element of A with exactly one element of B, using up all of B. Same count.` },
        { type: 'input', q: 'How many bijections are there from {1, 2, 3, 4} to {a, b, c, d}?', answer: ['24', 'twenty-four', 'twenty four'], placeholder: 'number',
          explain: `4 × 3 × 2 × 1 = 4! = 24.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'modular',
      title: 'Modular Arithmetic',
      emoji: '🕐',
      steps: [
        { type: 'learn', title: 'Clock math', html: `
<p><b>a mod n</b> is the remainder after dividing a by n. It always lands in 0 … n − 1.</p>
<div class="formula">17 mod 5 = 2   (17 = 3×5 + 2)</div>
<p>You do this every day: 10 o'clock + 5 hours = 3 o'clock. That is (10 + 5) mod 12 = 3.</p>
<div class="dev">You already know this: <code>%</code> in code. Round-robin load balancing picks backend <code>i % N</code>.</div>` },
        { type: 'input', q: 'What is 23 mod 7?', answer: ['2', 'two'], placeholder: 'number',
          explain: `23 = 3×7 + 2, so the remainder is 2.` },
        { type: 'learn', title: 'Congruence & shortcuts', html: `
<p>We write <b>a ≡ b (mod n)</b> ("a is congruent to b mod n") when a and b have the same remainder, i.e. n divides a − b. So 17 ≡ 2 ≡ 22 (mod 5).</p>
<p>Superpower: you can reduce <b>before</b> adding or multiplying:</p>
<div class="formula">(a + b) mod n = ((a mod n) + (b mod n)) mod n</div>
<p>Same for ×. That keeps numbers small, which is how crypto handles 2048-bit math.</p>` },
        { type: 'mcq', q: 'Today is Monday. What day is it 100 days from now?',
          choices: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], answer: 2,
          explain: `100 mod 7 = 2 (98 is 14 full weeks). Monday + 2 days = Wednesday.` },
        { type: 'learn', title: 'Sharding with mod', html: `
<p>The simplest way to spread keys across N shards:</p>
<div class="formula">shard = hash(key) mod N</div>
<p>Hash tables, Redis Cluster slots (CRC16(key) mod 16384), Kafka partitions and ring buffers all use this.</p>
<div class="dev">You already know this: the catch is <b>resharding</b>. Change N and most keys move. That is the reason consistent hashing exists.</div>` },
        { type: 'widget', widget: 'hash', title: 'Hash into buckets', html: '<p>Type some keys. Each lands in bucket hash(key) mod 8. Try enough keys and collisions are inevitable.</p>' },
        { type: 'tf', q: 'If you go from hash(key) mod 4 to hash(key) mod 5, most keys stay on the same shard.', answer: false,
          explain: `A key stays only if h mod 4 = h mod 5, which happens when h mod 20 is 0, 1, 2 or 3: just 4 out of 20 = 20%. So about 80% of keys move. Ouch.` },
        { type: 'learn', title: 'Gotchas', html: `
<p><b>Negative numbers</b>: languages disagree! <code>-7 % 3</code> is <b>−1</b> in JS, C, Java and Go, but <b>2</b> in Python (the math answer, always 0 … n − 1).</p>
<p><b>Powers of 2</b>: for non-negative x, <code>x % 2ᵏ</code> equals <code>x &amp; (2ᵏ − 1)</code>, a single fast AND. That is why many hash tables use power-of-2 sizes.</p>
<div class="dev">You already know this: a negative hash code mod N gave a negative array index and crashed the service. Many have walked this path.</div>` },
        { type: 'input', q: 'In Python, what is -7 % 3?', answer: ['2', 'two'], placeholder: 'number',
          explain: `Python returns a result with the sign of the divisor: −7 = (−3)×3 + 2, so 2.` },
        { type: 'mcq', q: 'For a non-negative integer x, x % 8 is the same as:',
          choices: ['x >> 3', 'x & 7', 'x & 8', 'x | 7'], answer: 1,
          explain: `8 = 2³, and the remainder is just the lowest 3 bits: x & 0b111 = x & 7. (x >> 3 is the quotient, x / 8.)` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'proofs',
      title: 'Proofs: Direct & Contradiction',
      emoji: '🕵️',
      steps: [
        { type: 'learn', title: 'Tests vs proofs', html: `
<p>Tests check <b>some</b> inputs. A <b>proof</b> covers <b>all</b> of them, forever.</p>
<p><b>Direct proof</b>: start from what you know, take logical steps, arrive at the claim.</p>
<p><i>Claim:</i> the sum of two even numbers is even.<br><i>Proof:</i> even numbers look like 2a and 2b. Their sum 2a + 2b = 2(a + b), which is 2 times an integer, so it is even. ∎</p>
<div class="callout">∎ means "done, proven". Mathematicians' version of a green checkmark.</div>` },
        { type: 'tf', q: 'If a claim holds for a million test cases, it is proven for all integers.', answer: false,
          explain: `Examples are evidence, not proof. The Pólya conjecture held for every number up to 906,150,256 and then failed at 906,150,257.` },
        { type: 'mcq', q: 'To prove "the product of two odd numbers is odd", you expand (2a + 1)(2b + 1). Which form shows the result is odd?',
          choices: ['2(2ab + a + b) + 1', '4ab + 1', '2(ab) + 2', '(a + b)²'], answer: 0,
          explain: `(2a+1)(2b+1) = 4ab + 2a + 2b + 1 = 2(2ab + a + b) + 1, which is "2 times an integer, plus 1": odd. ∎` },
        { type: 'learn', title: 'Proof by contradiction', html: `
<p>Want to prove P? <b>Assume ¬P</b> and follow the logic until something impossible pops out. Since logic does not lie, the assumption must be wrong, so P is true.</p>
<div class="dev">You already know this: incident debugging. "Assume the cache is NOT the problem. Then this request must have hit Postgres. But Postgres logs show zero queries. Contradiction. It is the cache."</div>` },
        { type: 'learn', title: '√2 is irrational', html: `
<p>Assume √2 = p/q, a fraction in <b>lowest terms</b> (p and q share no common factor).</p>
<ol><li>Square it: 2 = p²/q², so p² = 2q².</li>
<li>So p² is even, which means p is even (odd × odd is odd). Write p = 2k.</li>
<li>Then 4k² = 2q², so q² = 2k², and q is even too.</li>
<li>Both p and q are even, but we said lowest terms! 💥</li></ol>
<p>Contradiction, so √2 is not a fraction. ∎</p>` },
        { type: 'order', q: 'Put the √2 proof in order.',
          items: ['Assume √2 = p/q in lowest terms', 'Square: p² = 2q²', 'So p is even: p = 2k', 'Substitute: q² = 2k², so q is even', 'Both even contradicts lowest terms'],
          explain: `Assume the opposite, derive that p and q are both even, and crash into the "lowest terms" assumption.` },
        { type: 'mcq', q: 'In the √2 proof, where exactly is the contradiction?',
          choices: ['p² cannot be even', 'p and q are both even, but the fraction was in lowest terms', '√2 is greater than 1', 'q cannot be zero'], answer: 1,
          explain: `If both are divisible by 2, the fraction could be reduced, contradicting the assumption that it was already fully reduced.` },
        { type: 'learn', title: 'Counterexamples', html: `
<p>To prove "for all x, P(x)" you need a proof. To <b>disprove</b> it you need just <b>one counterexample</b> (remember ¬∀ ≡ ∃¬).</p>
<p>Euler noticed n² + n + 41 is prime for n = 0, 1, 2, … 39. Forty successes in a row! Tempting to call it "always prime"...</p>
<div class="fun">🤓 Fun fact: Euclid proved there are infinitely many primes by contradiction around 300 BC. Still one of the most elegant proofs ever.</div>` },
        { type: 'tf', q: 'A single counterexample is enough to disprove a "for all" claim.', answer: true,
          explain: `"For all" claims are universal; one failing case breaks them. Just like one failing test fails the build.` },
        { type: 'input', q: 'What is the smallest n ≥ 0 for which n² + n + 41 is NOT prime?', answer: ['40', 'forty'], placeholder: 'number',
          explain: `40² + 40 + 41 = 1681 = 41 × 41. Forty passing tests, then failure.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'induction',
      title: 'Proof by Induction',
      emoji: '🪜',
      steps: [
        { type: 'learn', title: 'Falling dominoes', html: `
<p>To prove P(n) for every n = 1, 2, 3, …, show two things:</p>
<ol><li><b>Base case</b>: P(1) is true. (The first domino falls.)</li>
<li><b>Inductive step</b>: <i>if</i> P(k) is true, <i>then</i> P(k + 1) is true. (Each domino knocks over the next.)</li></ol>
<p>Then all dominoes fall. That is <b>mathematical induction</b>.</p>
<div class="dev">You already know this: if the initial schema is valid and every migration keeps a valid schema valid, then the schema is valid after any number of migrations.</div>` },
        { type: 'mcq', q: 'What are the two parts of a proof by induction?',
          choices: ['Hypothesis and conclusion', 'Base case and inductive step', 'Assumption and contradiction', 'Example and counterexample'], answer: 1,
          explain: `Base case starts the chain; the inductive step keeps it going for all n.` },
        { type: 'learn', title: 'Gauss and the sum 1…n', html: `
<p>Legend: young Gauss was told to add 1 + 2 + … + 100 and answered instantly by pairing 1+100, 2+99, … (50 pairs of 101).</p>
<div class="formula">1 + 2 + … + n = n(n + 1) / 2</div>
<p><b>Base case</b> n = 1: left side is 1, right side is 1·2/2 = 1. ✅</p>` },
        { type: 'learn', title: 'The inductive step', html: `
<p><b>Assume</b> it holds for k: 1 + … + k = k(k + 1)/2. (This is the <b>inductive hypothesis</b>.)</p>
<p>Add the next term (k + 1) to both sides:</p>
<div class="formula">k(k+1)/2 + (k+1) = (k+1)(k/2 + 1) = (k+1)(k+2)/2</div>
<p>That is exactly the formula with n = k + 1. Dominoes fall. ∎</p>
<div class="dev">You already know this: this sum is why nested loops like <code>for i … for j &lt; i</code> do about n²/2 work.</div>` },
        { type: 'input', q: 'What is 1 + 2 + … + 100?', answer: ['5050'], placeholder: 'number',
          explain: `100 × 101 / 2 = 5050.` },
        { type: 'tf', q: 'In the inductive step you are allowed to assume the statement is true for k.', answer: true,
          explain: `Yes, that is the inductive hypothesis. You are not assuming what you want to prove; you are proving "P(k) ⇒ P(k+1)".` },
        { type: 'learn', title: 'Another classic: powers of 2', html: `
<p>Induction also proves:</p>
<div class="formula">1 + 2 + 4 + … + 2ⁿ⁻¹ = 2ⁿ − 1</div>
<p>In binary that is obvious: 1111 (four ones) = 10000 − 1 = 15.</p>
<div class="dev">You already know this: with exponential backoff (1s, 2s, 4s, …) the total wait is always just under the next delay. The sum of all previous waits is one less than the next one.</div>` },
        { type: 'input', q: 'Exponential backoff waits 1, 2, 4, …, 512 seconds (10 retries). What is the total wait in seconds?', answer: ['1023'], placeholder: 'number',
          explain: `1 + 2 + … + 2⁹ = 2¹⁰ − 1 = 1023 seconds.` },
        { type: 'mcq', q: 'Someone "proves" n = n + 1 for all n: "if k = k + 1, then adding 1 gives k + 1 = k + 2". What went wrong?',
          choices: ['The inductive step is invalid', 'There is no valid base case, so the chain never starts', 'Induction only works for even numbers', 'Nothing, the proof is correct'], answer: 1,
          explain: `The step "P(k) ⇒ P(k+1)" really is valid here, but P(1) (1 = 2) is false. No first domino, nothing falls. Never skip the base case.` },
        { type: 'order', q: 'Order the parts of an induction proof.',
          items: ['State the claim P(n)', 'Prove the base case P(1)', 'Assume P(k) (inductive hypothesis)', 'Prove P(k + 1) from it', 'Conclude P(n) holds for all n ≥ 1'],
          explain: `Claim, base case, hypothesis, step, conclusion. Dominoes: set up, push the first, show each one topples the next.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'pigeonhole',
      title: 'The Pigeonhole Principle',
      emoji: '🐦',
      steps: [
        { type: 'learn', title: 'Too many pigeons', html: `
<p>Put <b>n + 1</b> pigeons into <b>n</b> holes, and some hole gets at least <b>2</b> pigeons.</p>
<p>Sounds too obvious to matter. It is secretly one of the most powerful tools in CS.</p>
<div class="dev">You already know this: 11 pods with anti-affinity "max 1 per node" on a 10-node cluster. One pod stays Pending. The scheduler just proved the pigeonhole principle for you.</div>` },
        { type: 'input', q: 'How many people do you need to GUARANTEE that two share a birth month?', answer: ['13', 'thirteen'], placeholder: 'number',
          explain: `12 months = 12 holes. 12 people could all differ; the 13th must share.` },
        { type: 'learn', title: 'Hash collisions are guaranteed', html: `
<p>More possible keys than buckets? Then collisions <b>must</b> happen. No clever hash function can avoid it.</p>
<p>Generalized version: N items into k boxes means some box gets at least</p>
<div class="formula">⌈N / k⌉ items</div>
<p>(⌈ ⌉ means "round up".)</p>` },
        { type: 'mcq', q: '100 requests are spread (in any way) across 8 pods. At least one pod handles at least how many?',
          choices: ['12', '13', '8', '100'], answer: 1,
          explain: `⌈100 / 8⌉ = ⌈12.5⌉ = 13. If every pod had at most 12, the total would be at most 96.` },
        { type: 'learn', title: 'No compressor shrinks everything', html: `
<p>There are 2ⁿ files of exactly n bits. How many strictly shorter bit strings are there? 2⁰ + 2¹ + … + 2ⁿ⁻¹ = 2ⁿ − 1 (hi, induction!). One fewer.</p>
<p>A lossless compressor must be injective (so it can decompress). By pigeonhole, it cannot map 2ⁿ files into 2ⁿ − 1 shorter strings. Some file does <b>not</b> get smaller.</p>
<div class="dev">You already know this: gzip an already-gzipped file or a JPEG and it gets slightly bigger.</div>` },
        { type: 'tf', q: 'A lossless compressor that makes every possible input strictly smaller is impossible.', answer: true,
          explain: `Pigeonhole: 2ⁿ inputs of length n, only 2ⁿ − 1 shorter outputs. Two inputs would collide and you could not decompress both.` },
        { type: 'learn', title: 'Collisions come early', html: `
<p>Pigeonhole tells you when a collision is <b>guaranteed</b>. In practice they show up much sooner: with just <b>23</b> people, there is a better than 50% chance two share a birthday. That is the <b>birthday paradox</b>.</p>
<p>For a 32-bit hash, a collision is guaranteed at 2³² + 1 keys, but it is more likely than not after only about <b>77,000</b>.</p>
<div class="fun">🤓 Fun fact: this is why Git moved toward SHA-256 and why UUIDv4 uses 122 random bits. You want collisions to stay astronomically unlikely.</div>` },
        { type: 'mcq', q: 'How many distinct keys do you need to GUARANTEE a collision with a 32-bit hash?',
          choices: ['32', '2³²', '2³² + 1', 'About 77,000'], answer: 2,
          explain: `2³² possible outputs = 2³² holes. One more key than holes forces a collision. (77,000 is where a collision becomes likely, not certain.)` },
        { type: 'tf', q: 'In a room of 23 people, the probability that two share a birthday is over 50%.', answer: true,
          explain: `About 50.7% (ignoring leap years). There are 253 possible pairs, which is why it climbs so fast.` },
        { type: 'input', q: 'A dark drawer has only black and white socks. How many socks must you grab to guarantee a matching pair?', answer: ['3', 'three'], placeholder: 'number',
          explain: `2 colors = 2 holes. Three socks into two colors: two must match.` }
      ]
    }
  ]
});

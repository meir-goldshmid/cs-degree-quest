CQ.unit({
  id: 'logic',
  order: 1,
  title: 'Logic & Boolean Algebra',
  emoji: '🧠',
  color: '#7c5cff',
  tagline: 'The math hiding inside every if-statement',
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'propositions',
      title: 'True, False & Propositions',
      emoji: '💡',
      steps: [
        { type: 'learn', title: 'Welcome to logic 👋', html: `
<p>You have written thousands of <code>if</code> statements. Congratulations: you are already a logician, you just never got the certificate.</p>
<p>A <b>proposition</b> is a statement that is either <b>true</b> or <b>false</b>. Not both, not "it depends", not "works on my machine".</p>
<ul><li>"Port 443 is open on web-1" ✅ proposition</li><li>"2 + 2 = 5" ✅ proposition (a false one!)</li><li>"Restart the pod" ❌ a command</li><li>"Is Redis up?" ❌ a question</li></ul>
<div class="dev">You already know this: a health check endpoint returns a proposition. "The service is healthy" is either true (200) or false (503).</div>` },
        { type: 'mcq', q: 'Which of these is a proposition?',
          choices: ['Roll back the deploy', 'Is the DB up?', 'The cluster has 12 nodes', 'x + 1'], answer: 2,
          explain: `"The cluster has 12 nodes" is either true or false. The others are a command, a question, and an expression that produces a number (not a truth value).` },
        { type: 'learn', title: 'Variables & connectives', html: `
<p>Logicians name propositions with letters: let <b>p</b> = "the deploy succeeded", <b>q</b> = "the tests passed".</p>
<p>Then glue them with <b>connectives</b> into compound propositions:</p>
<table><tr><th>Logic</th><th>Read as</th><th>Code</th></tr>
<tr><td>¬p</td><td>NOT p</td><td><code>!p</code></td></tr>
<tr><td>p ∧ q</td><td>p AND q</td><td><code>p &amp;&amp; q</code></td></tr>
<tr><td>p ∨ q</td><td>p OR q</td><td><code>p || q</code></td></tr></table>
<div class="callout">Trick to remember: ∧ looks like the A in <b>A</b>ND. ∨ is the other one.</div>` },
        { type: 'input', q: 'Which JavaScript operator corresponds to the logic symbol ∧ ?', answer: ['&&'], placeholder: 'operator',
          explain: `∧ is AND, which is <code>&amp;&amp;</code> in JS, C, Java, Go, Bash and friends. (Python spells it <code>and</code>.)` },
        { type: 'mcq', q: 'p = "the deploy succeeded", q = "the tests passed". Translate: "The tests passed but the deploy failed."',
          choices: ['p ∧ ¬q', 'q ∧ ¬p', 'q ∨ ¬p', '¬(p ∧ q)'], answer: 1,
          explain: `"Tests passed" is q, "deploy failed" is ¬p, and "but" glues them with AND: q ∧ ¬p.` },
        { type: 'tf', q: 'In logic, the English word "but" means AND.', answer: true,
          explain: `"But" adds attitude ("surprisingly…"), yet logically it just means both parts are true. Logic is very unimpressed by tone.` },
        { type: 'learn', title: 'Not everything gets a truth value', html: `
<p>Some sentences look like propositions but are broken. The classic: <b>"This sentence is false."</b></p>
<p>If it is true, then it is false. If it is false, then it is true. It never settles. Logicians call this the <b>Liar paradox</b> and exclude it from being a proposition.</p>
<div class="dev">You already know this: it is a flapping health check that marks itself unhealthy whenever it is healthy. No stable state exists.</div>
<div class="fun">🤓 Fun fact: George Boole published "The Laws of Thought" in 1854. A century later his algebra became the circuitry inside every CPU. Hence "boolean".</div>` },
        { type: 'tf', q: '"This sentence is false" is a valid proposition.', answer: false,
          explain: `It can be neither consistently true nor consistently false, so it does not qualify as a proposition. It is the Liar paradox.` },
        { type: 'mcq', q: 'p = "CPU > 90%", q = "an alert fires". Which formula says "The CPU is NOT above 90%, yet an alert fires"?',
          choices: ['¬p ∧ q', '¬(p ∧ q)', 'p ∨ q', '¬p ∨ ¬q'], answer: 0,
          explain: `"Not above 90%" is ¬p, "an alert fires" is q, and "yet" is another AND in disguise: ¬p ∧ q. Also known as "a noisy alert".` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'truth-tables',
      title: 'AND, OR, NOT, XOR & Truth Tables',
      emoji: '📋',
      steps: [
        { type: 'learn', title: 'Truth tables', html: `
<p>A <b>truth table</b> lists every combination of inputs and the resulting output. It is basically exhaustive unit testing for logic.</p>
<table><tr><th>p</th><th>q</th><th>p ∧ q</th><th>p ∨ q</th></tr>
<tr><td>F</td><td>F</td><td>F</td><td>F</td></tr>
<tr><td>F</td><td>T</td><td>F</td><td>T</td></tr>
<tr><td>T</td><td>F</td><td>F</td><td>T</td></tr>
<tr><td>T</td><td>T</td><td>T</td><td>T</td></tr></table>
<p><b>AND</b> is picky: true only if both are true. <b>OR</b> is easygoing: true if at least one is true. <b>NOT</b> just flips.</p>` },
        { type: 'widget', widget: 'truth', title: 'Play with the switches', html: '<p>Toggle A and B and watch every operator react. Try to predict each output before you tap!</p>' },
        { type: 'mcq', q: 'p is true and q is true. What is p ∨ q?',
          choices: ['True', 'False', 'Undefined'], answer: 0,
          explain: `Logical OR is <b>inclusive</b>: "at least one". Both true still counts. English "or" (soup or salad?) is often exclusive; logic's OR is not.` },
        { type: 'learn', title: 'XOR: the "are they different?" detector', html: `
<p><b>XOR</b> (exclusive or, written ⊕) is true when <b>exactly one</b> input is true.</p>
<table><tr><th>p</th><th>q</th><th>p ⊕ q</th></tr>
<tr><td>F</td><td>F</td><td>F</td></tr><tr><td>F</td><td>T</td><td>T</td></tr>
<tr><td>T</td><td>F</td><td>T</td></tr><tr><td>T</td><td>T</td><td>F</td></tr></table>
<p>Another way to read it: p ⊕ q is true when p and q <b>differ</b>. In most languages it is <code>^</code> on bits, or <code>a !== b</code> on booleans.</p>
<div class="dev">You already know this: a config drift check. Desired vs actual differ → XOR is 1 → reconcile!</div>` },
        { type: 'tf', q: 'true ⊕ true = true', answer: false,
          explain: `XOR is true only when exactly one input is true. Two trues are the same, so XOR gives false.` },
        { type: 'mcq', q: 'Which expression is true exactly when p and q differ (i.e. equals p ⊕ q)?',
          choices: ['p ∧ q', '(p ∨ q) ∧ ¬(p ∧ q)', '¬p ∨ q', 'p ∨ q'], answer: 1,
          explain: `"At least one is true" AND "not both are true" = exactly one is true. That is XOR built from AND, OR and NOT.` },
        { type: 'learn', title: 'How big is a truth table?', html: `
<p>Each variable can be T or F. Two variables give 2 × 2 = 4 rows. Three give 2 × 2 × 2 = 8.</p>
<div class="formula">n variables → 2ⁿ rows</div>
<div class="dev">You already know this: 10 feature flags means 2¹⁰ = 1024 possible configurations. That is why nobody tests all of them (and why flag combos cause incidents).</div>` },
        { type: 'input', q: 'How many rows does a truth table with 3 variables have?', answer: ['8', 'eight'], placeholder: 'number',
          explain: `2³ = 8 rows: every combination of T/F for three inputs.` },
        { type: 'learn', title: 'NAND rules them all', html: `
<p><b>NAND</b> = NOT AND: false only when both inputs are true.</p>
<p>Wild fact: with <b>only NAND gates</b> you can build NOT, AND, OR, XOR... every boolean function there is. NOT p is just p NAND p.</p>
<div class="fun">🤓 Fun fact: the famous course "From NAND to Tetris" builds a whole computer, then a game, starting from nothing but NAND. NOR is also universal like this.</div>` },
        { type: 'tf', q: 'Using only NAND operations, you can express any boolean function.', answer: true,
          explain: `NAND is "functionally complete". NOT p = p NAND p, and AND/OR follow from there. Chip designers love this.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'implication',
      title: 'If-Then: Implication',
      emoji: '➡️',
      steps: [
        { type: 'learn', title: 'p → q', html: `
<p><b>Implication</b> p → q reads "if p, then q". Think of it as a <b>promise</b>. The only way to break a promise is: p happened, and q did not.</p>
<table><tr><th>p</th><th>q</th><th>p → q</th></tr>
<tr><td>T</td><td>T</td><td>T</td></tr><tr><td>T</td><td>F</td><td><b>F</b></td></tr>
<tr><td>F</td><td>T</td><td>T</td></tr><tr><td>F</td><td>F</td><td>T</td></tr></table>
<div class="callout">p → q is false in exactly ONE row: p true, q false.</div>` },
        { type: 'mcq', q: 'When is p → q false?',
          choices: ['p false, q true', 'p true, q false', 'both false', 'both true'], answer: 1,
          explain: `The promise "if p then q" is broken only when p holds but q does not.` },
        { type: 'learn', title: 'The weird rows', html: `
<p>Why is p → q <b>true</b> when p is false? Because the promise was never tested.</p>
<p>Your manager says: "If you are on call this weekend, I will buy you pizza." You were not on call. Pizza or no pizza, the promise was not broken. This is called <b>vacuous truth</b>.</p>
<div class="dev">You already know this: an SLO rule "if latency > 500ms then page someone". On a calm day with no page, the rule is not violated. If someone gets paged anyway for another reason, this particular rule still is not violated (just a noisy pager).</div>` },
        { type: 'tf', q: '"If 2 + 2 = 5, then the moon is made of cheese" is a TRUE statement in logic.', answer: true,
          explain: `The premise is false, so the implication is vacuously true. Logic does not care that the moon is not cheese.` },
        { type: 'learn', title: 'Converse, contrapositive & a handy rewrite', html: `
<p>Start with p → q. Its relatives:</p>
<ul><li><b>Contrapositive</b>: ¬q → ¬p. <b>Always equivalent</b> to the original.</li>
<li><b>Converse</b>: q → p. NOT equivalent!</li>
<li><b>Inverse</b>: ¬p → ¬q. Also not equivalent (it equals the converse).</li></ul>
<p>And the rewrite that turns any implication into code:</p>
<div class="formula">p → q  ≡  ¬p ∨ q</div>
<div class="dev">You already know this: <code>assert(!isProd || tlsEnabled)</code> means "if prod, then TLS must be on".</div>` },
        { type: 'mcq', q: '"If the build is green, then the tests passed." Which is logically equivalent?',
          choices: ['If the tests passed, the build is green.', 'If the build is not green, the tests did not pass.', 'If the tests did not pass, the build is not green.', 'The build is green and the tests passed.'], answer: 2,
          explain: `That is the contrapositive (¬q → ¬p), which always matches the original. The first choice is the converse and the second is the inverse: tests can pass while lint still breaks the build.` },
        { type: 'tf', q: 'The converse of p → q (that is, q → p) is logically equivalent to p → q.', answer: false,
          explain: `"If it is a Postgres DB, it is a database" is true. The converse "if it is a database, it is Postgres" is false (hi, MySQL). Mixing these up is a classic reasoning bug.` },
        { type: 'learn', title: 'If AND only if', html: `
<p>The <b>biconditional</b> p ⇔ q ("p if and only if q", often written "iff") is true when p and q have the <b>same</b> value.</p>
<p>It is (p → q) ∧ (q → p), a promise in both directions. Notice it is exactly the opposite of XOR. That is why it is also called <b>XNOR</b>.</p>
<div class="dev">You already know this: "the pod receives traffic iff its readiness probe passes". Ready ⇒ traffic, and traffic ⇒ ready.</div>` },
        { type: 'input', q: 'p is false and q is false. What is the value of p → q? (true/false)', answer: ['true', 't', '1'], placeholder: 'true or false',
          explain: `The premise is false, so the implication is vacuously true.` },
        { type: 'mcq', q: 'Which expression is equivalent to p → q?',
          choices: ['¬p ∨ q', 'p ∨ ¬q', '¬p ∧ q', 'p ∧ ¬q'], answer: 0,
          explain: `¬p ∨ q is false only when p is true and q is false, which is exactly the single false row of p → q. (p ∧ ¬q is the NEGATION of p → q.)` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'de-morgan',
      title: "De Morgan's Laws",
      emoji: '🔀',
      steps: [
        { type: 'learn', title: 'Pushing NOT inside', html: `
<p>Augustus De Morgan gave us the two most useful refactoring rules in history:</p>
<div class="formula">¬(A ∧ B) ≡ ¬A ∨ ¬B</div>
<div class="formula">¬(A ∨ B) ≡ ¬A ∧ ¬B</div>
<p>Mnemonic: when NOT walks into the parentheses, it <b>flips every operand</b> and <b>swaps AND ↔ OR</b>.</p>
<p>"It is not the case that (Redis AND Postgres are up)" = "Redis is down OR Postgres is down".</p>` },
        { type: 'tf', q: 'For any booleans a and b: !(a && b) === (!a || !b)', answer: true,
          explain: `That is De Morgan's first law. Check all 4 combos if you do not believe it. It holds every time.` },
        { type: 'learn', title: 'Refactoring with De Morgan', html: `
<p>Double negations in conditions make code reviewers sweat:</p>
<pre><code>if (!(user.isAdmin || user.isOwner)) {
  return deny();
}</code></pre>
<p>Apply De Morgan: NOT flips each piece, OR becomes AND.</p>
<pre><code>if (!user.isAdmin &amp;&amp; !user.isOwner) {
  return deny();
}</code></pre>
<div class="dev">You already know this: it is the same rule that turns "allow if admin OR owner" into a guard clause "deny if not admin AND not owner".</div>` },
        { type: 'mcq', q: 'Which is equivalent to !(status === 200 && body !== "")?',
          choices: ['status !== 200 && body === ""', 'status !== 200 || body === ""', 'status === 200 || body !== ""', 'status !== 200 || body !== ""'], answer: 1,
          explain: `Flip each comparison (=== ↔ !==) and swap && for ||. The response is bad if the status is wrong OR the body is empty.` },
        { type: 'learn', title: 'More laws of the algebra', html: `
<table><tr><th>Law</th><th>Rule</th></tr>
<tr><td>Double negation</td><td>¬¬p ≡ p</td></tr>
<tr><td>Identity</td><td>p ∧ T ≡ p, p ∨ F ≡ p</td></tr>
<tr><td>Domination</td><td>p ∨ T ≡ T, p ∧ F ≡ F</td></tr>
<tr><td>Distributive</td><td>p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)</td></tr>
<tr><td>Absorption</td><td>p ∨ (p ∧ q) ≡ p</td></tr></table>
<p>These are the "algebra" in Boolean algebra: you can simplify conditions symbolically, just like simplifying 2x + 3x = 5x.</p>` },
        { type: 'mcq', q: 'Which is equivalent to !(x > 5 || y <= 3)?',
          choices: ['x <= 5 || y > 3', 'x <= 5 && y > 3', 'x < 5 && y > 3', 'x > 5 && y <= 3'], answer: 1,
          explain: `OR becomes AND, and each comparison flips: the opposite of x > 5 is x <= 5 (careful, NOT x < 5!), and the opposite of y <= 3 is y > 3.` },
        { type: 'tf', q: '¬(A ∨ B) ≡ ¬A ∨ ¬B', answer: false,
          explain: `When NOT moves inside, OR must become AND: ¬(A ∨ B) ≡ ¬A ∧ ¬B. Forgetting to swap the operator is the #1 De Morgan bug.` },
        { type: 'input', q: 'Simplify ¬¬p', answer: ['p'], placeholder: 'expression',
          explain: `Double negation: not-not-p is just p. Like <code>!!x</code> in JS, which gives back the truthiness of x.` },
        { type: 'mcq', q: 'Simplify: isProd || (isProd && isEU)',
          choices: ['isProd', 'isProd && isEU', 'isEU', 'true'], answer: 0,
          explain: `Absorption: p ∨ (p ∧ q) ≡ p. If isProd is true the whole thing is true; if isProd is false, the second part is false too. isEU never matters.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'short-circuit',
      title: 'Short-Circuit Evaluation',
      emoji: '⚡',
      steps: [
        { type: 'learn', title: 'Lazy operators', html: `
<p>Logic says: F ∧ anything = F, and T ∨ anything = T. Programming languages use this to <b>skip work</b>:</p>
<ul><li><code>a &amp;&amp; b</code>: if a is false, b is <b>never evaluated</b>.</li>
<li><code>a || b</code>: if a is true, b is <b>never evaluated</b>.</li></ul>
<p>That is <b>short-circuit evaluation</b>, and it is why <code>user &amp;&amp; user.name</code> does not crash on a null user.</p>` },
        { type: 'mcq', q: 'In JS, does false && launchMissiles() call launchMissiles?',
          choices: ['Yes, always', 'No, never', 'Only in strict mode'], answer: 1,
          explain: `The left side is false, so the result is already known to be false. The right side is skipped. World peace preserved.` },
        { type: 'learn', title: 'Your shell does it too', html: `
<p>In Bash, exit code 0 means success (true-ish). So:</p>
<pre><code>make build &amp;&amp; make deploy   # deploy only if build succeeds
cd /app || exit 1           # bail out if cd fails</code></pre>
<div class="dev">You already know this: every Dockerfile <code>RUN apt-get update &amp;&amp; apt-get install -y ...</code> line is short-circuit logic. One failing command stops the chain.</div>` },
        { type: 'tf', q: 'In Bash, with make test || echo "tests failed", the echo runs only if make test fails.', answer: true,
          explain: `|| runs the right side only when the left side "is false", i.e. exits non-zero.` },
        { type: 'learn', title: 'Order matters', html: `
<p>Because evaluation is left-to-right and lazy:</p>
<ul><li>Put <b>guards first</b>: <code>user != null &amp;&amp; user.isAdmin</code></li>
<li>Put <b>cheap checks first</b>: <code>flagEnabled &amp;&amp; await expensiveDbCheck()</code></li>
<li>Beware <b>side effects</b> on the right: they might never run.</li></ul>
<p>Note: in C, Java and others, single <code>&amp;</code> and <code>|</code> are bitwise/non-short-circuit and evaluate both sides.</p>` },
        { type: 'mcq', q: 'user might be null. Which line is safe?',
          choices: ['if (user.isAdmin && user != null)', 'if (user != null && user.isAdmin)', 'Both are equally safe'], answer: 1,
          explain: `The guard must come first. In option A, user.isAdmin is evaluated before the null check and throws a TypeError when user is null.` },
        { type: 'learn', title: 'JS twist: || returns a value', html: `
<p>In JS (and Python), <code>a || b</code> returns <b>the first truthy operand</b> (or the last one), not a strict boolean. Hence defaults like:</p>
<pre><code>const port = process.env.PORT || 8080;</code></pre>
<p>Trap: 0, "" and NaN are falsy, so <code>0 || 8080</code> is 8080 even if 0 was intentional. The nullish operator <code>??</code> only falls back on null/undefined.</p>
<div class="dev">You already know this: the "retries: 0 got silently turned into retries: 3" config bug. That was ||.</div>` },
        { type: 'input', q: 'In JavaScript, what does 0 || 8080 evaluate to?', answer: ['8080'], placeholder: 'value',
          explain: `0 is falsy, so || moves on and returns 8080.` },
        { type: 'tf', q: 'In JavaScript, 0 ?? 8080 evaluates to 8080.', answer: false,
          explain: `?? only falls back when the left side is null or undefined. 0 is neither, so the result is 0.` },
        { type: 'mcq', q: 'You want to skip an expensive DB lookup when the feature flag is off. Which is better?',
          choices: ['flagOn && (await dbCheck())', '(await dbCheck()) && flagOn'], answer: 0,
          explain: `With the cheap flag first, a false flag short-circuits and the DB is never queried. The other order always pays for the query.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'bitwise',
      title: 'Bitwise Ops, Masks & Flags',
      emoji: '🎚️',
      steps: [
        { type: 'learn', title: 'Logic, but on every bit at once', html: `
<p>Bitwise operators apply logic to each bit position independently:</p>
<pre><code>  1100   (12)        1100        1100
&amp; 1010   (10)      | 1010      ^ 1010
= 1000   (8)       = 1110 (14) = 0110 (6)</code></pre>
<p>Also: <code>~x</code> flips every bit, <code>x &lt;&lt; n</code> shifts left, <code>x &gt;&gt; n</code> shifts right.</p>
<div class="callout">&amp;&amp; works on whole truth values; &amp; works bit by bit. One CPU instruction handles 64 bits at once.</div>` },
        { type: 'widget', widget: 'bits', title: 'Flip some bits', html: '<p>Build 12 (00001100) and 10 (00001010) in your head, then set only the bits they share. You should land on 8.</p>' },
        { type: 'input', q: 'What is 6 & 3 in decimal? (6 = 110, 3 = 011)', answer: ['2', 'two'], placeholder: 'number',
          explain: `110 & 011 = 010 = 2. Only the middle bit is set in both.` },
        { type: 'learn', title: 'Flags & masks', html: `
<p>Pack many booleans into one integer, one bit each. Unix permissions do exactly that: <b>r = 4</b> (100), <b>w = 2</b> (010), <b>x = 1</b> (001).</p>
<table><tr><th>Goal</th><th>Code</th></tr>
<tr><td>Check a flag</td><td><code>perms &amp; 4</code> (nonzero → set)</td></tr>
<tr><td>Set a flag</td><td><code>perms | 1</code></td></tr>
<tr><td>Clear a flag</td><td><code>perms &amp; ~2</code></td></tr>
<tr><td>Toggle a flag</td><td><code>perms ^ 1</code></td></tr></table>
<div class="dev">You already know this: Linux capabilities, epoll events, open() flags like O_CREAT | O_TRUNC, and Postgres infomask bits are all bitmasks.</div>` },
        { type: 'mcq', q: 'perms = 6 (rw-). Which expression adds execute permission?',
          choices: ['perms & 1', 'perms | 1', 'perms ^ 6', 'perms & ~1'], answer: 1,
          explain: `OR sets a bit: 110 | 001 = 111 = 7 (rwx). AND with 1 would test it, and & ~1 would clear it.` },
        { type: 'tf', q: '7 & 4 is nonzero, so permission 7 includes read.', answer: true,
          explain: `111 & 100 = 100 = 4, nonzero. The read bit is set.` },
        { type: 'learn', title: 'Shifts & subnet masks', html: `
<p><code>1 &lt;&lt; n</code> equals 2ⁿ. Shifting right by 1 halves a non-negative integer (rounding down).</p>
<p>Networking is masks all the way down. A /24 netmask is 24 ones followed by 8 zeros = 255.255.255.0. The <b>network address</b> is <code>ip &amp; mask</code>.</p>
<div class="dev">You already know this: when you pick a Kubernetes pod CIDR like 10.244.0.0/16, the cluster uses a mask of 16 one-bits to decide "is this IP inside the pod network?"</div>` },
        { type: 'input', q: 'What is 1 << 10 in decimal?', answer: ['1024'], placeholder: 'number',
          explain: `Shifting 1 left by 10 places gives 2¹⁰ = 1024.` },
        { type: 'mcq', q: 'IP 192.168.5.77 with mask 255.255.255.0. What is the network address (ip & mask)?',
          choices: ['192.168.5.0', '192.168.0.0', '0.0.0.77', '192.168.5.255'], answer: 0,
          explain: `255 keeps an octet, 0 wipes it. The first three octets survive and the last becomes 0.` },
        { type: 'learn', title: 'XOR party tricks', html: `
<p>XOR has magical properties: <b>x ^ x = 0</b>, <b>x ^ 0 = x</b>, and it is its own inverse.</p>
<p>So <code>(a ^ b) ^ b === a</code>: XOR with b twice and you are back where you started.</p>
<div class="dev">You already know this: RAID 5 parity. parity = d1 ^ d2 ^ d3. A disk dies? XOR the survivors with the parity and the lost data reappears.</div>` },
        { type: 'tf', q: 'For any integers a and b: (a ^ b) ^ b === a', answer: true,
          explain: `b ^ b = 0 and a ^ 0 = a. This is the basis of XOR parity and simple XOR ciphers.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'quantifiers',
      title: 'Predicates & Quantifiers ∀ ∃',
      emoji: '🌍',
      steps: [
        { type: 'learn', title: 'Propositions with holes', html: `
<p>"x > 3" is not a proposition yet. It has a hole: x. A statement with variables is a <b>predicate</b>: P(x) = "x > 3". Fill the hole and you get a proposition: P(5) is true, P(1) is false.</p>
<p>Or <b>quantify</b> it:</p>
<ul><li><b>∀x P(x)</b>: "for <b>all</b> x, P(x)" (upside-down A for All)</li>
<li><b>∃x P(x)</b>: "there <b>exists</b> an x with P(x)" (backwards E for Exists)</li></ul>` },
        { type: 'mcq', q: 'Domain: pods in your cluster. Ready(p) = "pod p is ready". How do you write "every pod is ready"?',
          choices: ['∃p Ready(p)', '∀p Ready(p)', '∀p ¬Ready(p)', '¬∃p Ready(p)'], answer: 1,
          explain: `"Every" is ∀. ∃p Ready(p) would mean "at least one pod is ready", a much lower bar.` },
        { type: 'learn', title: 'You use quantifiers daily', html: `
<table><tr><th>Logic</th><th>JS</th><th>Python</th></tr>
<tr><td>∀x P(x)</td><td><code>xs.every(P)</code></td><td><code>all(...)</code></td></tr>
<tr><td>∃x P(x)</td><td><code>xs.some(P)</code></td><td><code>any(...)</code></td></tr></table>
<p>Edge case: over an <b>empty</b> domain, ∀ is <b>true</b> (vacuously, nobody broke the rule) and ∃ is <b>false</b> (nobody exists to satisfy it).</p>
<div class="dev">You already know this: a deployment with 0 replicas reports "all replicas available" ✅. Vacuous truth has fooled many dashboards.</div>` },
        { type: 'tf', q: 'In JavaScript, [].every(x => x > 1000) returns true.', answer: true,
          explain: `∀ over an empty set is vacuously true: there is no element that fails the test.` },
        { type: 'learn', title: 'Negating quantifiers', html: `
<p>De Morgan strikes again, now for quantifiers:</p>
<div class="formula">¬∀x P(x) ≡ ∃x ¬P(x)</div>
<div class="formula">¬∃x P(x) ≡ ∀x ¬P(x)</div>
<p>"Not all pods are healthy" = "some pod is unhealthy". "No pod is crashing" = "every pod is not crashing".</p>` },
        { type: 'mcq', q: 'What is the negation of "every server has a backup"?',
          choices: ['No server has a backup', 'Some server has no backup', 'Every server has no backup', 'Some server has a backup'], answer: 1,
          explain: `¬∀s Backup(s) ≡ ∃s ¬Backup(s). It takes just ONE server without a backup to break the claim. Ask anyone who lived through that incident.` },
        { type: 'tf', q: '¬∃x P(x) is equivalent to ∀x ¬P(x).', answer: true,
          explain: `"There is no x with P" means "every x fails P". Flip the quantifier, push the NOT inside.` },
        { type: 'learn', title: 'Order of quantifiers matters', html: `
<p>Let H(e, i) = "engineer e handles incident i". Compare:</p>
<ul><li><b>∀i ∃e H(e, i)</b>: every incident is handled by <i>some</i> engineer (maybe different ones). Healthy rotation.</li>
<li><b>∃e ∀i H(e, i)</b>: there is <i>one</i> engineer who handles <i>every</i> incident. That person needs a vacation.</li></ul>
<div class="callout">Swapping ∀ and ∃ changes the meaning. Read left to right: each quantifier is chosen knowing the earlier ones.</div>` },
        { type: 'mcq', q: 'Which formula says "one single engineer handles every incident"?',
          choices: ['∀i ∃e H(e, i)', '∃e ∀i H(e, i)', '∀e ∀i H(e, i)', '∃i ∃e H(e, i)'], answer: 1,
          explain: `∃e first picks one specific engineer, then ∀i says that same engineer handles all incidents.` },
        { type: 'input', q: 'What does [1, 2, 3].some(x => x > 2) return?', answer: ['true'], placeholder: 'true or false',
          explain: `∃x (x > 2) holds because 3 > 2. One witness is enough.` }
      ]
    }
  ]
});

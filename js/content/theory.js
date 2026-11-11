CQ.unit({
  id: 'theory',
  order: 13,
  title: 'Theory of Computation',
  emoji: '🤖',
  color: '#e0457b',
  tagline: 'What computers can do, what they can\'t, and what they can\'t do fast',
  lessons: [
    // ───────────────────────────── Lesson 1 ─────────────────────────────
    {
      id: 'fsm',
      title: 'Finite State Machines',
      emoji: '🚦',
      steps: [
        { type: 'learn', title: 'The simplest computer', html: `
<p>A <b>finite state machine</b> (FSM) has:</p>
<ul>
<li>a finite set of <b>states</b> (one is the start state)</li>
<li><b>transitions</b>: "in state S, on input X, go to state T"</li>
</ul>
<p>That's all. No variables, no stack, no heap. Its only memory is <b>which state it's in right now</b>.</p>
<svg viewBox="0 0 220 70" width="260" height="83" style="display:block;margin:auto">
  <circle cx="35" cy="35" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="110" cy="35" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="185" cy="35" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="35" y="39" font-size="10" text-anchor="middle" fill="currentColor">Green</text>
  <text x="110" y="39" font-size="10" text-anchor="middle" fill="currentColor">Yellow</text>
  <text x="185" y="39" font-size="10" text-anchor="middle" fill="currentColor">Red</text>
  <line x1="57" y1="35" x2="84" y2="35" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="88,35 81,31 81,39" fill="var(--accent)"/>
  <line x1="132" y1="35" x2="159" y2="35" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="163,35 156,31 156,39" fill="var(--accent)"/>
  <path d="M185 57 Q110 85 39 59" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <polygon points="36,57 45,58 40,64" fill="var(--accent)"/>
</svg>
<p style="text-align:center">Every arrow is labelled "timer".</p>` },
        { type: 'mcq', q: 'The traffic light FSM is in state Red. The timer fires. What is the next state?', choices: ['Yellow', 'Green', 'Red', 'Off'], answer: 1,
          explain: 'Follow the arrow out of Red: it loops back to Green.' },
        { type: 'learn', title: 'You run FSMs all day', html: `
<div class="dev">You already know this:
<ul>
<li><b>Kubernetes pod phase</b>: Pending → Running → Succeeded or Failed (plus Unknown when the node stops reporting).</li>
<li><b>TCP connections</b>: <code>ss -tan</code> shows LISTEN, SYN-SENT, ESTABLISHED, FIN-WAIT-1, TIME-WAIT… straight out of the TCP state diagram in RFC 793.</li>
<li>Circuit breakers: Closed → Open → Half-Open.</li>
<li>Your incident process: Triggered → Acknowledged → Resolved.</li>
</ul></div>
<p>Writing them as explicit FSMs (an enum + a transition table) kills a whole class of "how did it get into <i>that</i> state?" bugs.</p>` },
        { type: 'order', q: 'A TCP client actively closes a connection. Order the states it moves through.', items: ['ESTABLISHED', 'FIN_WAIT_1', 'FIN_WAIT_2', 'TIME_WAIT', 'CLOSED'],
          explain: 'Send FIN → FIN_WAIT_1. Get the ACK → FIN_WAIT_2. Get the peer\'s FIN → TIME_WAIT (lingering 2×MSL so stray packets die). Then CLOSED. Hence all those TIME_WAIT sockets on busy hosts.' },
        { type: 'tf', q: 'An FSM can remember an unbounded amount of information, as long as it has enough time.', answer: false,
          explain: 'Its only memory is its current state, and there are finitely many states. That limitation is the whole point — and, as we\'ll see, its weakness.' },
        { type: 'learn', title: 'FSMs as recognizers', html: `
<p>Mark some states as <b>accepting</b>. Feed the machine a string one character at a time. If it ends in an accepting state, the string is <b>accepted</b>.</p>
<p>Example — "does this binary string have an even number of 1s?" Two states: <b>Even</b> (start, accepting) and <b>Odd</b>. Each 1 flips between them; each 0 stays put.</p>
<svg viewBox="0 0 200 80" width="230" height="92" style="display:block;margin:auto">
  <circle cx="50" cy="40" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <circle cx="50" cy="40" r="18" fill="none" stroke="currentColor" stroke-width="1"/>
  <circle cx="150" cy="40" r="22" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <text x="50" y="44" font-size="10" text-anchor="middle" fill="currentColor">Even</text>
  <text x="150" y="44" font-size="10" text-anchor="middle" fill="currentColor">Odd</text>
  <path d="M70 30 Q100 12 130 30" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <path d="M130 50 Q100 68 70 50" fill="none" stroke="var(--accent)" stroke-width="1.5"/>
  <text x="100" y="16" font-size="10" text-anchor="middle" fill="currentColor">1</text>
  <text x="100" y="72" font-size="10" text-anchor="middle" fill="currentColor">1</text>
</svg>
<p style="text-align:center">(0 loops each state back to itself; the double circle = accepting.)</p>` },
        { type: 'input', q: 'Run the parity machine on input 1101, starting in Even. Which state does it end in? (Even/Odd)', answer: ['odd'], placeholder: 'Even or Odd',
          explain: '1 → Odd, 1 → Even, 0 → Even, 1 → Odd. Three 1s: odd. The string is rejected.' },
        { type: 'mcq', q: 'A Kubernetes Job\'s pod finishes with exit code 0. Which phase does it end in?', choices: ['Running', 'Succeeded', 'Completed', 'Terminated'], answer: 1,
          explain: 'The pod phase is Succeeded. ("Completed" is what kubectl shows in the STATUS column — a display string, not the phase. Sneaky.)' }
      ]
    },
    // ───────────────────────────── Lesson 2 ─────────────────────────────
    {
      id: 'regular-languages',
      title: 'Regular Languages & Regex',
      emoji: '🔍',
      steps: [
        { type: 'learn', title: 'Languages = sets of strings', html: `
<p>In theory-land, a <b>language</b> is just a set of strings. "All valid IPv4 addresses" is a language. So is "all binary strings with an even number of 1s".</p>
<p>A language is <b>regular</b> if some FSM recognizes it. And here's the big reveal:</p>
<div class="callout">Regular expressions and finite state machines are equally powerful. Every regex can be compiled into an FSM, and vice versa (Kleene's theorem).</div>
<div class="dev">You already know this: Go's <code>regexp</code> and Google's RE2 compile your pattern into an automaton and guarantee linear-time matching. That's theory paying rent.</div>` },
        { type: 'mcq', q: 'Which string matches the regex ^a(b|c)*d$ ?', choices: ['abcd', 'abbe', 'bcd', 'a'], answer: 0,
          explain: 'It needs: an a, then any number of b\'s and c\'s, then a d, and nothing else. "abcd" = a + bc + d. ✓' },
        { type: 'input', q: 'What is the minimum number of states for an FSM that accepts binary strings ending in 1?', answer: ['2', 'two'], placeholder: 'number',
          explain: 'Two states: "last char was 1" (accepting) and "anything else" (start). On 1 go to the first, on 0 go to the second. One state can\'t distinguish accept from reject.' },
        { type: 'learn', title: 'What regex can\'t do', html: `
<p>Try to match <b>balanced parentheses</b> — <code>(()(()))</code> — to any depth. Or the language aⁿbⁿ: some a's followed by <i>the same number</i> of b's.</p>
<p>You'd need to <b>count</b> without limit. An FSM with k states can only track k different counts; feed it k+1 a's and two different counts must share a state (pigeonhole!). It's now confused forever.</p>
<div class="callout">Balanced parentheses and aⁿbⁿ are <b>not regular</b>. No true regex can match them.</div>` },
        { type: 'tf', q: 'A classic regular expression can check that parentheses are balanced, to any nesting depth.', answer: false,
          explain: 'Checking balance needs unbounded counting, and finite states can\'t count without limit. You need a stack (or a counter that can grow forever).' },
        { type: 'learn', title: 'Why this matters on call', html: `
<div class="dev">You already know this:
<ul>
<li>That legendary Stack Overflow answer about parsing HTML with regex? This is the theory behind it. HTML, JSON and YAML nest — use a real parser (<code>jq</code>, <code>yq</code>).</li>
<li>PCRE "regexes" add backreferences, which are <i>not</i> regular and need backtracking engines. Backtracking can go exponential: <b>ReDoS</b>. Cloudflare's global outage on 2 July 2019 was one regex in a WAF rule backtracking its way to 100% CPU.</li>
</ul></div>` },
        { type: 'mcq', q: 'Why can\'t any FSM recognize aⁿbⁿ (n a\'s followed by exactly n b\'s)?', choices: ['Strings can be too long to read', 'It has finitely many states, so it can\'t count arbitrarily high', 'FSMs can\'t read the letter b', 'It could, with enough states'], answer: 1,
          explain: 'For any fixed number of states, a long enough run of a\'s forces two different counts into the same state. "Enough states" never suffices because n is unbounded.' },
        { type: 'mcq', q: 'Which regex engine design guarantees matching time linear in input length (no ReDoS)?', choices: ['Backtracking engines like PCRE', 'Automaton-based engines like RE2 / Go regexp', 'Any engine, if the regex is short', 'None — all regex is exponential'], answer: 1,
          explain: 'RE2-style engines simulate an FSM, stepping through the input once. The price: no backreferences, because those aren\'t regular.' }
      ]
    },
    // ───────────────────────────── Lesson 3 ─────────────────────────────
    {
      id: 'grammars-parsers',
      title: 'Grammars & Parsers',
      emoji: '🌳',
      steps: [
        { type: 'learn', title: 'Context-free grammars', html: `
<p>A <b>grammar</b> is a set of rewrite rules. Here's one for balanced parentheses:</p>
<div class="formula">S → ( S ) S &nbsp;|&nbsp; ε</div>
<p>"An S is either: an open paren, an S, a close paren, then another S — or nothing (ε)." The rule mentions <b>itself</b>. That recursion is the extra power FSMs lack.</p>
<p>Languages described this way are <b>context-free</b>. The matching machine is a <b>pushdown automaton</b>: an FSM plus a <b>stack</b>.</p>` },
        { type: 'mcq', q: 'A pushdown automaton is an FSM plus what?', choices: ['A queue', 'A stack', 'A hash map', 'A second FSM'], answer: 1,
          explain: 'A stack. Push on "(", pop on ")". Empty stack at the end = balanced. Exactly how you\'d write the LeetCode solution.' },
        { type: 'tf', q: 'The grammar S → a S b | ε generates exactly the strings aⁿbⁿ (n ≥ 0).', answer: true,
          explain: 'Each step adds one a on the left and one b on the right, so the counts always match: ε, ab, aabb, aaabbb… The language regex couldn\'t handle is easy for a grammar.' },
        { type: 'learn', title: 'JSON is a grammar', html: `
<pre><code>value  → object | array | string
       | number | true | false | null
object → { } | { members }
members→ string : value | string : value , members
array  → [ ] | [ elements ]
elements → value | value , elements</code></pre>
<p>value contains object, object contains value… recursion again. That's why JSON can nest forever, and why regex can't validate it.</p>
<div class="dev">You already know this: Postgres parses your SQL with a grammar file (<code>gram.y</code>) fed to the Bison parser generator. YAML, HCL, PromQL, nginx.conf — all have grammars and parsers.</div>` },
        { type: 'input', q: 'Using S → ( S ) S | ε, can you generate the string "(()"? (yes/no)', answer: ['no', 'n', 'false'], placeholder: 'yes or no',
          explain: 'Every rule adds parens in matched pairs, so every generated string is balanced. "(()" has 2 opens and 1 close — impossible.' },
        { type: 'learn', title: 'The parsing pipeline', html: `
<ol>
<li><b>Lexer</b> (tokenizer): chop text into tokens — <code>{</code>, <code>"name"</code>, <code>:</code>, <code>42</code>. Tokens are regular, so lexers use regex/FSMs.</li>
<li><b>Parser</b>: arrange tokens into a tree following the grammar (often a hand-written <b>recursive descent</b> parser: one function per rule).</li>
<li><b>AST</b>: the abstract syntax tree your program actually works with.</li>
<li><b>Evaluate / compile</b> the tree.</li>
</ol>
<div class="dev">You already know this: a YAML indentation error in a Helm chart is the parser telling you your input doesn't fit the grammar.</div>` },
        { type: 'order', q: 'Order the stages of processing source code', items: ['Raw text', 'Tokens (lexer)', 'Syntax tree (parser)', 'Evaluation / code generation'],
          explain: 'Text → tokens → tree → do something with it. Same pipeline for compilers, jq, SQL engines and config loaders.' },
        { type: 'order', q: 'Order these machine types from least to most powerful', items: ['Finite state machine (regular)', 'Pushdown automaton (context-free)', 'Turing machine (anything computable)'],
          explain: 'Each adds memory: none beyond the state → a stack → an unbounded read/write tape. This ladder is part of the Chomsky hierarchy.' },
        { type: 'mcq', q: 'Why do lexers usually use regex while parsers use grammars?', choices: ['Tokens are flat patterns (regular); program structure nests (context-free)', 'Regex is newer', 'Grammars can\'t describe numbers', 'It\'s only tradition'], answer: 0,
          explain: 'Individual tokens like 42 or "hello" don\'t nest, so an FSM suffices. Brackets, blocks and objects nest, which needs a stack.' }
      ]
    },
    // ───────────────────────────── Lesson 4 ─────────────────────────────
    {
      id: 'turing-machines',
      title: 'Turing Machines',
      emoji: '📼',
      steps: [
        { type: 'learn', title: 'Turing\'s tape machine (1936)', html: `
<p>Alan Turing imagined the simplest possible "computer":</p>
<ul>
<li>an <b>infinite tape</b> of cells, each holding a symbol</li>
<li>a <b>head</b> that reads/writes one cell and moves left or right</li>
<li>a finite <b>state table</b>: "in state q, reading s → write t, move L/R, go to state r"</li>
</ul>
<svg viewBox="0 0 220 60" width="260" height="71" style="display:block;margin:auto">
  <g fill="none" stroke="currentColor" stroke-width="1.2">
    <rect x="10" y="10" width="30" height="24"/><rect x="40" y="10" width="30" height="24"/><rect x="70" y="10" width="30" height="24"/>
    <rect x="100" y="10" width="30" height="24" stroke="var(--accent)" stroke-width="2.5"/><rect x="130" y="10" width="30" height="24"/><rect x="160" y="10" width="30" height="24"/>
  </g>
  <g font-size="12" text-anchor="middle" fill="currentColor">
    <text x="25" y="27">1</text><text x="55" y="27">0</text><text x="85" y="27">1</text><text x="115" y="27">1</text><text x="145" y="27">_</text><text x="175" y="27">_</text>
    <text x="205" y="27">…</text>
  </g>
  <polygon points="115,38 108,50 122,50" fill="var(--accent)"/>
  <text x="130" y="50" font-size="9" fill="currentColor">head (state q)</text>
</svg>
<p>It's an FSM that got an unlimited scratchpad it can read and write anywhere.</p>` },
        { type: 'input', q: 'A Turing machine walks right along the tape flipping every bit (0↔1), halting at the first blank. Input tape: 1011. What is on the tape when it halts?', answer: ['0100'], placeholder: 'bits',
          explain: 'Flip each bit: 1→0, 0→1, 1→0, 1→0 gives 0100.' },
        { type: 'learn', title: 'Church–Turing & Turing-completeness', html: `
<p>The <b>Church–Turing thesis</b>: anything that can be computed by any step-by-step procedure can be computed by a Turing machine. Every real language — Python, Go, Bash, SQL with recursion — is equally powerful in <i>what</i> it can compute (not how fast).</p>
<p>A system is <b>Turing-complete</b> if it can simulate a Turing machine. Roughly: conditionals + unbounded memory + unbounded loops (or recursion).</p>
<div class="fun">🤓 Fun fact: things proven Turing-complete by accident include C++ templates, SQL with recursive CTEs, Excel formulas (with LAMBDA), Magic: The Gathering, Minecraft redstone and PowerPoint animations.</div>` },
        { type: 'mcq', q: 'Which of these is Turing-complete?', choices: ['A JSON document', 'A classic regular expression', 'Python', 'An HTML file with no scripts'], answer: 2,
          explain: 'Python has conditionals, loops and unbounded memory (in principle). JSON and plain HTML are data, and regex is only as powerful as an FSM.' },
        { type: 'tf', q: 'PostgreSQL SQL with recursive CTEs (WITH RECURSIVE) is Turing-complete.', answer: true,
          explain: 'Recursive CTEs give you unbounded iteration; people have implemented cyclic tag systems and even Turing machines in them. Your database is a full computer.' },
        { type: 'learn', title: 'When config becomes code', html: `
<div class="dev">You already know this: YAML is just data. Then you add Helm/Jinja templating with conditionals, loops and recursive includes… and your "config" is now a programming language that can be buggy, slow, or never finish.</div>
<p>Some config languages refuse on purpose: <b>Dhall</b> and <b>CUE</b> are deliberately <i>not</i> Turing-complete, and Bazel's <b>Starlark</b> bans recursion and while-loops. The payoff: evaluation is <b>guaranteed to terminate</b>.</p>` },
        { type: 'mcq', q: 'Why would a config language like Dhall deliberately avoid being Turing-complete?', choices: ['To be faster to type', 'So that evaluating a config is guaranteed to finish', 'Because Turing-complete languages can\'t output YAML', 'To avoid licensing fees'], answer: 1,
          explain: 'Give up general loops/recursion and you can guarantee termination: your deploy never hangs evaluating a config. Next lesson shows why Turing-complete languages can never offer that guarantee.' },
        { type: 'mcq', q: 'What makes a Turing machine more powerful than a pushdown automaton?', choices: ['It reads faster', 'It can read and write anywhere on an unbounded tape, not just the top of a stack', 'It has more states', 'It runs on electricity'], answer: 1,
          explain: 'A stack only lets you touch the top. A tape lets you go back and re-read or rewrite anything — that random-ish access is the leap to full computation.' }
      ]
    },
    // ───────────────────────────── Lesson 5 ─────────────────────────────
    {
      id: 'halting-problem',
      title: 'The Halting Problem',
      emoji: '🛑',
      steps: [
        { type: 'learn', title: 'The dream tool', html: `
<p>Wouldn't it be great to have a CI step: <code>halts(program, input)</code> that returns true if the program eventually finishes, false if it loops forever? No more stuck jobs!</p>
<p>In 1936 Turing proved: <b>no such program can exist</b> that works correctly for <i>every</i> program and input.</p>
<p>The proof is a beautiful trap. Let's build it.</p>` },
        { type: 'learn', title: 'The troll program', html: `
<p>Suppose <code>halts(P, x)</code> exists. Write this:</p>
<pre><code>def troll(P):
    if halts(P, P):
        while True: pass   # loop forever
    else:
        return             # halt</code></pre>
<p>troll does the <b>opposite</b> of whatever halts predicts. Now the killer question: what does <code>troll(troll)</code> do?</p>` },
        { type: 'input', q: 'Suppose halts(troll, troll) returns true. Does troll(troll) actually halt? (yes/no)', answer: ['no', 'n'], placeholder: 'yes or no',
          explain: 'If halts says "it halts", troll enters the infinite loop — so it doesn\'t halt. halts was wrong.' },
        { type: 'mcq', q: 'And if halts(troll, troll) returns false?', choices: ['troll(troll) loops forever, so halts was right', 'troll(troll) returns immediately, so halts was wrong', 'The program crashes', 'halts can\'t be called on itself'], answer: 1,
          explain: 'Predict "loops forever" and troll returns right away. Either answer is wrong — so the assumed halts() can\'t exist. Contradiction, QED.' },
        { type: 'learn', title: 'Rice\'s theorem: it gets worse', html: `
<p>Rice's theorem generalizes it: <b>any</b> non-trivial question about what a program <i>does</i> (its behavior, not its text) is undecidable in general.</p>
<ul>
<li>"Does this code ever divide by zero?"</li>
<li>"Is this function dead code?"</li>
<li>"Can this service ever leak the API key?"</li>
</ul>
<p>So every static analyzer must compromise: allow <b>false positives</b>, <b>false negatives</b>, or say "I don't know".</p>
<div class="dev">You already know this: linters warn about things that are fine, and miss things that aren't. Not lazy engineering — mathematically unavoidable.</div>` },
        { type: 'tf', q: 'The halting problem means it\'s impossible to tell whether any particular program halts.', answer: false,
          explain: 'For many specific programs it\'s easy (print("hi") halts). What\'s impossible is a single algorithm that answers correctly for every program-input pair.' },
        { type: 'learn', title: 'How SREs cope', html: `
<div class="dev">You already know the engineering answer to an undecidable problem: <b>timeouts</b>. CI job timeouts, <code>activeDeadlineSeconds</code> on Jobs, <code>statement_timeout</code> in Postgres, liveness probes, context deadlines in Go. You can't predict whether it'll finish — so you stop waiting.</div>` },
        { type: 'order', q: 'Order the steps of the halting-problem proof', items: ['Assume a perfect halts(P, x) exists', 'Build troll(P), which does the opposite of halts(P, P)', 'Ask what troll(troll) does', 'Both answers contradict halts', 'Conclude halts cannot exist'],
          explain: 'Classic proof by contradiction: assume it, build something paradoxical with it, conclude the assumption was false.' },
        { type: 'mcq', q: 'A vendor sells a tool that "detects every infinite loop in any codebase with zero false alarms". What should you think?', choices: ['Great, buy it', 'Impossible as stated — it would solve the halting problem', 'Only possible in Rust', 'Possible with enough GPUs'], answer: 1,
          explain: 'Perfect, general infinite-loop detection is the halting problem. Real tools are useful but must miss some loops or flag some false ones.' }
      ]
    },
    // ───────────────────────────── Lesson 6 ─────────────────────────────
    {
      id: 'p-vs-np',
      title: 'P vs NP',
      emoji: '🧩',
      steps: [
        { type: 'learn', title: 'Easy to solve vs easy to check', html: `
<p>Now: problems that <i>are</i> solvable, but how fast?</p>
<ul>
<li><b>P</b>: problems you can <b>solve</b> in polynomial time (n, n², n³…). Sorting, shortest paths, searching.</li>
<li><b>NP</b>: problems where a proposed answer can be <b>checked</b> in polynomial time. Sudoku: filling it in is hard, checking a filled grid is easy.</li>
</ul>
<div class="dev">You already know the flavor: checking a password against its bcrypt hash takes milliseconds; finding the password from the hash is hopeless. Reviewing a working Terraform plan is easy; writing it was the hard part.</div>` },
        { type: 'mcq', q: 'Which problem is known to be in P?', choices: ['Finding the shortest path between two nodes in a graph', 'Solving any Sudoku of any size', 'Finding the shortest tour visiting every city', 'Packing items into the fewest bins'], answer: 0,
          explain: 'Dijkstra / BFS solve shortest path in polynomial time. The other three are NP-complete (or NP-hard): no known polynomial algorithm.' },
        { type: 'tf', q: 'Every problem in P is also in NP.', answer: true,
          explain: 'If you can solve it fast, you can check an answer fast: just solve it and compare. So P ⊆ NP.' },
        { type: 'learn', title: 'The million-dollar question', html: `
<div class="formula">P = NP ?</div>
<p>Is every problem whose answer is easy to <i>check</i> also easy to <i>solve</i>? Nobody knows. It's one of the Clay Institute's Millennium Problems, with a <b>$1,000,000</b> prize.</p>
<p>Most experts believe <b>P ≠ NP</b>. If P = NP (with a practical algorithm), much of modern cryptography would collapse — finding keys would become as easy as checking them.</p>` },
        { type: 'mcq', q: 'What is the current status of P vs NP?', choices: ['Proven P = NP', 'Proven P ≠ NP', 'Unsolved', 'Proven undecidable'], answer: 2,
          explain: 'Still open since it was formalized in 1971. Most believe P ≠ NP, but belief is not proof.' },
        { type: 'learn', title: 'NP-complete: the hardest of the bunch', html: `
<p>A problem is <b>NP-complete</b> if it's in NP <i>and</i> every NP problem can be translated (reduced) into it in polynomial time.</p>
<p>The first one: <b>SAT</b> — given a boolean formula, is there an assignment of true/false that makes it true? (Cook–Levin, 1971.) Thousands more followed: traveling salesman, graph coloring, knapsack, bin packing, Sudoku…</p>
<div class="callout">Solve any one NP-complete problem in polynomial time and you've solved them all — and proven P = NP.</div>` },
        { type: 'input', q: 'SAT time! (A ∨ B) ∧ (¬A ∨ B) ∧ (¬B ∨ C). In every satisfying assignment, what must C be? (true/false)', answer: ['true', 't', '1', 'yes'], placeholder: 'true or false',
          explain: 'The first two clauses: if B were false, we\'d need both A and ¬A. So B = true. Then (¬B ∨ C) forces C = true. Checking was quick — finding, in general, is the hard part.' },
        { type: 'mcq', q: 'If someone found a polynomial-time algorithm for SAT, what would follow?', choices: ['Only SAT gets faster', 'Every problem in NP could be solved in polynomial time (P = NP)', 'The halting problem becomes solvable', 'Nothing important'], answer: 1,
          explain: 'Every NP problem reduces to SAT, so a fast SAT solver is a fast solver for all of NP. The halting problem stays undecidable — that\'s a different wall entirely.' }
      ]
    },
    // ───────────────────────────── Lesson 7 ─────────────────────────────
    {
      id: 'np-in-practice',
      title: 'NP-Hard in Production',
      emoji: '📦',
      steps: [
        { type: 'learn', title: 'You face NP-hard problems weekly', html: `
<div class="dev">You already know this: the <b>Kubernetes scheduler</b> places pods (items with CPU/memory sizes) onto nodes (bins with capacity). Optimal placement is multi-dimensional <b>bin packing</b> — NP-hard. So kube-scheduler doesn't search for the perfect answer: it <b>filters</b> feasible nodes, <b>scores</b> them with heuristics, and picks the best, one pod at a time.</div>
<p>Others in the wild: on-call rotation scheduling, CI job placement, cloud cost optimization, and <b>package dependency resolution</b> (apt, pip, npm) — which is NP-complete in general.</p>` },
        { type: 'mcq', q: 'Why doesn\'t the Kubernetes scheduler compute the globally optimal placement of all pods?', choices: ['Nobody thought of it', 'Optimal multi-dimensional bin packing is NP-hard, so it uses fast heuristics instead', 'Kubernetes doesn\'t know pod sizes', 'It does — every time'], answer: 1,
          explain: 'Exact optimization would blow up exponentially on big clusters. Filter + score heuristics give good-enough placements in milliseconds.' },
        { type: 'learn', title: 'Brute force explodes', html: `
<p><b>Traveling salesman</b>: visit n cities once, return home, minimize distance. Fixing the start city and ignoring direction, there are <b>(n−1)!/2</b> possible tours.</p>
<ul>
<li>5 cities → 12 tours</li>
<li>10 cities → 181,440</li>
<li>20 cities → ≈ 6 × 10¹⁶ (about 2 years at a billion tours per second)</li>
<li>25 cities → ≈ 3 × 10²³ (about 10 million years. Add 5 cities, multiply the pain by 5 million.)</li>
</ul>` },
        { type: 'input', q: 'Using (n−1)!/2, how many distinct tours are there for 6 cities?', answer: ['60'], placeholder: 'number',
          explain: '(6 − 1)! / 2 = 120 / 2 = 60.' },
        { type: 'learn', title: 'Heuristics & approximations', html: `
<p>When exact is too slow, engineers cheat — cleverly:</p>
<ul>
<li><b>Greedy heuristics</b>: e.g. First-Fit Decreasing for bin packing — sort items largest first, put each into the first bin with room. Provably never much worse than optimal.</li>
<li><b>Approximation algorithms</b>: guaranteed within a factor of optimal.</li>
<li><b>SAT solvers</b>: worst case exponential, yet they routinely crush real instances with millions of variables (chip verification, package managers).</li>
</ul>
<div class="dev">Fun design story: Go modules use <b>Minimal Version Selection</b>, deliberately designed so dependency resolution is <i>not</i> NP-complete. Change the problem, dodge the wall.</div>` },
        { type: 'input', q: 'First-Fit Decreasing: bins of capacity 10, items 6, 5, 4, 3, 2. How many bins are used?', answer: ['2', 'two'], placeholder: 'number',
          explain: '6 → bin 1. 5 → bin 2 (6+5 > 10). 4 → bin 1 (now 10). 3 → bin 2 (8). 2 → bin 2 (10). Two bins — and since the items total 20, that\'s optimal.' },
        { type: 'tf', q: 'NP-complete means the problem cannot be solved in practice.', answer: false,
          explain: 'It means no known algorithm is fast in the worst case. Real-world instances are often solved well — exactly or approximately — by solvers and heuristics.' },
        { type: 'order', q: 'Order the First-Fit Decreasing algorithm', items: ['Sort items from largest to smallest', 'Take the next item', 'Place it in the first bin with enough room', 'If no bin fits, open a new bin', 'Repeat until all items are placed'],
          explain: 'Big items first (they\'re the hardest to fit), then let small items fill the gaps. Simple, fast and surprisingly close to optimal.' },
        { type: 'mcq', q: 'A teammate claims their new script always finds the optimal pod placement for any cluster in polynomial time. Best response?', choices: ['Ship it to prod', 'Extraordinary claim: that would prove P = NP — let\'s see the proof (and the $1M)', 'Optimal placement is trivially easy', 'Ask them to rewrite it in Rust'], answer: 1,
          explain: 'Bin packing is NP-hard. A guaranteed-optimal polynomial algorithm would settle P vs NP. More likely it\'s a good heuristic that isn\'t always optimal — which may still be very useful!' }
      ]
    }
  ]
});

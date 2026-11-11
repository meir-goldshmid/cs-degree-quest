# CS Degree Quest — Content Guide

Every unit lives in its own file: `js/content/<unit-id>.js`. A file registers exactly one unit:

```js
CQ.unit({
  id: 'logic',                 // kebab-case, unique, matches file name
  order: 1,                    // position on the learning map (see table below)
  title: 'Logic & Boolean Algebra',
  emoji: '🧠',
  color: '#7c5cff',            // accent color for the unit (hex)
  tagline: 'The math hiding inside every if-statement',
  lessons: [
    {
      id: 'propositions',      // unique inside the unit
      title: 'True, False & Propositions',
      emoji: '💡',
      steps: [ /* see step types */ ]
    }
  ]
});
```

## Step types

```js
// 1. Teaching card. HTML string. Keep it SHORT (phone screen!): ~40-120 words.
{ type: 'learn', title: 'What is a proposition?', html: '<p>...</p>' }

// 2. Multiple choice. `answer` = index of the correct choice (0-based). 2-4 choices.
{ type: 'mcq', q: 'Which is a proposition?', choices: ['x > 3', '2 + 2 = 4', 'Close the door'], answer: 1,
  explain: 'Short explanation shown after answering (right or wrong).' }

// 3. True / false.
{ type: 'tf', q: 'NOT (A AND B) equals (NOT A) OR (NOT B).', answer: true, explain: '...' }

// 4. Typed answer. `answer` is a string or array of accepted strings.
//    Comparison is case-insensitive and ignores spaces, so 'n log n' matches 'nlogn'.
{ type: 'input', q: 'What is 1011 in decimal?', answer: ['11'], placeholder: 'number', explain: '...' }

// 5. Put in order. `items` are listed in the CORRECT order; the app shuffles them.
{ type: 'order', q: 'Order from fastest to slowest growth', items: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], explain: '...' }

// 6. Interactive widget (built into the app). `html` is optional intro text shown above it.
{ type: 'widget', widget: 'bits', title: 'Flip the bits', html: '<p>Tap bits to toggle them.</p>' }
```

### Available widgets
| widget        | what it does |
|---------------|--------------|
| `bits`        | 8 toggleable bits, shows decimal / hex / two's-complement value |
| `truth`       | toggle A and B, live AND / OR / XOR / NOT / IMPLIES / NAND |
| `growth`      | slider for n, bar chart of 1, log n, n, n log n, n², 2ⁿ, n! |
| `guess`       | "I'm thinking of a number 1–100" — binary search game, compares to log₂ |
| `sort`        | animated bubble / insertion / merge / quick sort with comparison counter |
| `graph`       | small graph, step through BFS or DFS, shows queue/stack + visit order + degrees |
| `derivative`  | f(x)=x² with a draggable point; secant → tangent slope as h → 0 |
| `integral`    | area under f(x) with N rectangles (Riemann sum) converging to the exact area |
| `unitcircle`  | angle slider: degrees ↔ radians, sin, cos on the unit circle |
| `hash`        | type keys, see them hashed into 8 buckets, collisions chained |

## HTML you can use in `learn` / `widget` html
- `<p>`, `<b>`, `<i>`, `<ul><li>`, `<ol>`, `<table>`, `<code>`, `<pre><code>...</code></pre>`
- `<div class="callout">Key idea…</div>` — highlighted key takeaway
- `<div class="dev">You already know this: …</div>` — analogy from the learner's dev/SRE world (use these a lot! The learner is a 37-year-old senior backend/devops/SRE engineer with no formal CS/math education. Connect theory to Kubernetes, databases, load balancers, Git, caches, logs, retries, etc.)
- `<div class="formula">a² + b² = c²</div>` — big centered math line
- `<div class="fun">🤓 Fun fact: …</div>` — trivia / history
- Inline `<svg>` diagrams are welcome (keep viewBox small, use `currentColor` or `var(--accent)` for strokes so it works in dark mode).
- Use Unicode math: ² ³ ⁿ ₂ √ ∑ ∫ ∞ ≤ ≥ ≠ ≈ → ⇒ ⇔ ∧ ∨ ¬ ⊕ ∈ ∉ ⊆ ∪ ∩ ∅ Θ Ω π θ Δ ∀ ∃. No LaTeX.

## Rules
1. **Plain JS, runs in the browser as a classic script.** Strings: use single quotes or template literals. If you use template literals, do NOT put backticks inside them. Escape `'` inside single-quoted strings. No `import`/`export`.
2. Each unit: **5–7 lessons**. Each lesson: **7–11 steps**, starting with a `learn` card, interleaving learn cards and questions (≥ 4 questions per lesson, mix types; at least one non-mcq type per lesson). End each lesson with a question, not a learn card.
3. Tone: fun, warm, witty, encouraging, zero condescension. Explain like a great senior colleague at a whiteboard. Build intuition first, then the formal name.
4. Every question has an `explain`. Answers must be unambiguous and correct — double-check math!
5. For `input` answers, accept reasonable variants (e.g. `['8', 'eight']`, `['O(n log n)', 'n log n']`).
6. Progress from basics to advanced inside the unit. Assume nothing but programming experience.
7. Validate with: `node tools/validate.mjs js/content/<file>.js` — must print OK.

## Unit map (id → order)
| order | id | title |
|---|---|---|
| 1 | `logic` | Logic & Boolean Algebra |
| 2 | `numbers` | Number Systems & Bits |
| 3 | `sets-proofs` | Sets, Functions & Proofs |
| 4 | `exp-log` | Exponents & Logarithms |
| 5 | `big-o` | Big-O & Complexity |
| 6 | `counting-probability` | Counting & Probability |
| 7 | `data-structures` | Data Structures |
| 8 | `sorting-searching` | Sorting & Searching |
| 9 | `recursion-dp` | Recursion, Greedy & Dynamic Programming |
| 10 | `graphs` | Graphs & Graph Algorithms |
| 11 | `trig-calculus` | Trig, Derivatives & Integrals |
| 12 | `linear-algebra` | Vectors & Matrices |
| 13 | `theory` | Theory of Computation |

# 🎓 CS Degree Quest

**The CS degree you never took — in 5-minute lessons.**

A fun, mobile-first, Duolingo-style web app for working engineers (devs, SREs, DevOps, backend folks) who learned on the job and want the theory a computer science degree would have given them: logic, number systems, proofs, logarithms, Big-O, probability, data structures, algorithms, graphs, calculus, linear algebra and theory of computation.

Every concept is tied back to things you already use: Kubernetes, Postgres, Redis, nginx, Git, Prometheus, CI/CD, incidents.

## What's inside

| # | Unit | Highlights |
|---|------|-----------|
| 1 | 🧠 Logic & Boolean Algebra | truth tables, implication, De Morgan refactors, bitmasks, ∀ ∃ |
| 2 | 🔢 Number Systems & Bits | binary, hex, chmod octal, two's complement, floats, UTF-8 |
| 3 | 🧩 Sets, Functions & Proofs | SQL as set ops, bijections, modular arithmetic, induction, pigeonhole |
| 4 | 📈 Exponents & Logarithms | exponential backoff, logs as "halvings", B-tree depth, log scales |
| 5 | ⏱️ Big-O & Complexity | the complexity ladder, loop analysis, amortized, N+1 queries |
| 6 | 🎲 Counting & Probability | combinations, birthday paradox, availability nines, Bayes on alerts, p99 |
| 7 | 🧱 Data Structures | arrays, linked lists, hash tables, heaps, BSTs, B-trees, Bloom filters |
| 8 | 🔍 Sorting & Searching | binary search & git bisect, merge/quick/heap sort, n log n lower bound |
| 9 | 🪆 Recursion, Greedy & DP | call stacks, memoization = caching, edit distance, backtracking |
| 10 | 🕸️ Graphs | degrees & handshake lemma, BFS/DFS, Dijkstra, topo sort, MST, union-find |
| 11 | 📐 Trig, Derivatives & Integrals | radians, PromQL `rate()` as a derivative, integrals as totals, gradient descent |
| 12 | 🧮 Vectors & Matrices | dot product & cosine similarity (embeddings), transformations, neural nets |
| 13 | 🤖 Theory of Computation | state machines, regex limits, Turing machines, halting problem, P vs NP |

**90 lessons · ~880 steps · ~480 questions · 10 interactive labs.**

## Why you'll keep coming back

- 🔥 **Daily streaks** with earned streak freezes
- 🎯 **Daily XP goal** with a progress ring
- 🧑‍🎓 **12 levels**, from *Curious Coder* to *Turing Laureate*
- 🏅 **23 achievements** + a course certificate per unit
- 🔁 **Spaced-repetition review** that brings back the questions you missed
- 🕹️ **Interactive labs**: bit flipper, truth tables, Big-O growth race, binary-search game, sorting visualizer, BFS/DFS stepper, derivative and integral explorers, unit circle, hash table
- 🎉 Confetti, sounds, haptics, combos, and a printable **diploma** at the end
- 📅 One-tap daily calendar reminder, 📣 share buttons, 📲 installable (PWA, works offline)

## Run locally

No build step, no dependencies. Serve the folder with any static server:

```bash
npx serve .            # or: python -m http.server 8000
```

Progress is stored in `localStorage` on your device; use Export/Import on the profile screen to move it between devices.

## Adding content

Each unit is one file in `js/content/`. See [CONTENT_GUIDE.md](CONTENT_GUIDE.md) for the format, then validate:

```bash
node tools/validate.mjs
```

PRs with new lessons, fixes, or better analogies are very welcome.

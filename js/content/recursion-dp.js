CQ.unit({
  id: 'recursion-dp',
  order: 9,
  title: 'Recursion, Greedy & Dynamic Programming',
  emoji: '🪆',
  color: '#e8590c',
  tagline: 'Functions that call themselves, and the caching trick that makes them fast',
  lessons: [
    // ───────────────────────────── Lesson 1 ─────────────────────────────
    {
      id: 'recursion-basics',
      title: 'Recursion & the Call Stack',
      emoji: '🪆',
      steps: [
        {
          type: 'learn', title: 'A function that calls itself',
          html: `<p><b>Recursion</b> means solving a problem by handing a <i>smaller copy of the same problem</i> to yourself.</p>
<pre><code>def factorial(n):
    if n &lt;= 1:          # base case
        return 1
    return n * factorial(n - 1)   # recursive case</code></pre>
<p>Every recursive function needs two parts:</p>
<ul><li><b>Base case</b>: a problem so small you just answer it.</li>
<li><b>Recursive case</b>: shrink the problem and call yourself.</li></ul>
<div class="callout">Each call must move <b>closer</b> to the base case, or you never stop.</div>`
        },
        {
          type: 'learn', title: 'The call stack',
          html: `<p>When <code>factorial(3)</code> runs, each call waits for the one below it. The runtime keeps those paused calls on the <b>call stack</b>:</p>
<pre><code>factorial(3)  waits for ...
  factorial(2)  waits for ...
    factorial(1)  returns 1   ← base case
  returns 2 * 1 = 2
returns 3 * 2 = 6</code></pre>
<p>Each paused call is a <b>stack frame</b> holding its own local variables (its own <code>n</code>). Calls pile up going down, then <i>unwind</i> on the way back up: last in, first out.</p>
<div class="dev">You already know this: it's a stack trace! Each line in a Python traceback or Java exception is one frame on the call stack, newest at the end (Python) or top (Java).</div>`
        },
        {
          type: 'mcq', q: 'What happens if a recursive function has no base case?',
          choices: ['It returns 0 automatically', 'It keeps calling itself until the stack runs out of space', 'The compiler converts it into a loop', 'It runs exactly once'],
          answer: 1,
          explain: `With nothing to stop it, every call makes another call. Frames pile up until the stack is full and you get a stack overflow (Python: RecursionError, Java: StackOverflowError).`
        },
        {
          type: 'learn', title: 'Stack overflow (the real one)',
          html: `<p>The stack is small: often around <b>8 MB</b> for the main thread on Linux (<code>ulimit -s</code> shows 8192 KB by default), and much less for extra threads. Python also caps recursion depth at <b>1000</b> by default (<code>sys.getrecursionlimit()</code>).</p>
<p>So recursion depth is a real resource. Recursing 10 levels down a tree? Fine. Recursing 1,000,000 times down a linked list? Boom.</p>
<div class="dev">This is the same as unbounded retries calling retries: every layer holds resources while waiting on the next. Without a limit (the base case), you exhaust the pool and the whole thing falls over.</div>
<div class="fun">🤓 Fun fact: yes, the website is named after this crash.</div>`
        },
        {
          type: 'input', q: 'How many frames are on the stack at the deepest point of factorial(5) (counting the factorial(5) call itself)?',
          answer: ['5', 'five'], placeholder: 'number',
          explain: `factorial(5) → factorial(4) → factorial(3) → factorial(2) → factorial(1). That's 5 frames stacked up before factorial(1) hits the base case and they start unwinding. Depth grows linearly with n.`
        },
        {
          type: 'learn', title: 'Where recursion shines: trees',
          html: `<p>Recursion is natural when the <i>data</i> is recursive. A directory contains files and... more directories. Each subdirectory is a smaller version of the same problem:</p>
<pre><code>def total_size(path):
    if os.path.isfile(path):          # base case
        return os.path.getsize(path)
    return sum(total_size(os.path.join(path, c))
               for c in os.listdir(path))</code></pre>
<div class="dev">This is literally <code>du -s</code>. Same shape as <code>rm -r</code>, <code>chmod -R</code>, <code>find</code>, walking a JSON/YAML document, or rendering nested Helm values. "-R" in a CLI flag almost always means "recursion inside".</div>
<p>Here the stack depth is the <b>nesting depth</b> of the tree, not the number of files, so it rarely overflows.</p>`
        },
        {
          type: 'tf', q: 'In the total_size function above, the maximum recursion depth equals the total number of files on disk.',
          answer: false,
          explain: `Depth equals how deeply directories are nested. A folder with a million files side by side is only one level deep; each file call returns immediately before the next starts.`
        },
        {
          type: 'learn', title: 'Recursion vs loops',
          html: `<p>Anything recursive can be rewritten with a loop plus an explicit stack (a list you push and pop yourself). That's exactly what the runtime's call stack was doing for you.</p>
<pre><code>stack = [root]
while stack:
    path = stack.pop()
    ...
    stack.extend(children(path))</code></pre>
<div class="callout">Recursion = clearer code. Explicit stack = no depth limit (it lives on the heap). Pick based on how deep the input can get.</div>
<div class="fun">🤓 Some languages (Scheme, Haskell) guarantee <b>tail-call optimisation</b>: if the recursive call is the very last thing a function does, the frame is reused. Python and Java do not.</div>`
        },
        {
          type: 'order', q: 'Put the events of calling factorial(2) in order.',
          items: ['factorial(2) is called and pushes a frame', 'factorial(2) calls factorial(1)', 'factorial(1) hits the base case and returns 1', 'factorial(2) computes 2 * 1 and returns 2'],
          explain: `Calls go down (push), the base case answers, then results flow back up (pop) as each waiting frame finishes its multiplication.`
        },
        {
          type: 'mcq', q: 'You must process a linked list with 5 million nodes in Python. Best approach?',
          choices: ['Recursion: one call per node', 'A simple loop', 'Recursion, but raise the recursion limit to 10 million'],
          answer: 1,
          explain: `5 million frames would crash the real C stack even with a raised limit. A loop uses constant stack space. Recursion is for problems whose depth stays small (trees, divide and conquer), not for long linear chains.`
        }
      ]
    },

    // ───────────────────────────── Lesson 2 ─────────────────────────────
    {
      id: 'recursion-trees',
      title: 'Recursion Trees & Exploding Fibonacci',
      emoji: '🌳',
      steps: [
        {
          type: 'learn', title: 'Fibonacci, the innocent-looking trap',
          html: `<p>Fibonacci: each number is the sum of the previous two. 0, 1, 1, 2, 3, 5, 8, 13, 21...</p>
<pre><code>def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)</code></pre>
<p>Looks perfect. It matches the math definition exactly. Try <code>fib(40)</code> and go make a coffee. Try <code>fib(100)</code> and go retire.</p>
<p>Why? Unlike factorial, each call makes <b>two</b> calls.</p>`
        },
        {
          type: 'learn', title: 'Draw the recursion tree',
          html: `<p>Draw every call as a node, with its children being the calls it makes:</p>
<svg viewBox="0 0 300 150" width="100%" style="max-width:320px" font-size="12" text-anchor="middle">
<g stroke="currentColor" stroke-width="1.5" opacity="0.6">
<line x1="150" y1="18" x2="80" y2="58"/><line x1="150" y1="18" x2="220" y2="58"/>
<line x1="80" y1="58" x2="45" y2="98"/><line x1="80" y1="58" x2="115" y2="98"/>
<line x1="220" y1="58" x2="190" y2="98"/><line x1="220" y1="58" x2="250" y2="98"/>
<line x1="45" y1="98" x2="25" y2="135"/><line x1="45" y1="98" x2="65" y2="135"/>
</g>
<g fill="currentColor">
<text x="150" y="22">fib(4)</text>
<text x="80" y="62">fib(3)</text><text x="220" y="62" fill="var(--accent)" font-weight="bold">fib(2)</text>
<text x="45" y="102" fill="var(--accent)" font-weight="bold">fib(2)</text><text x="115" y="102">fib(1)</text>
<text x="190" y="102">fib(1)</text><text x="250" y="102">fib(0)</text>
<text x="25" y="139">fib(1)</text><text x="65" y="139">fib(0)</text>
</g></svg>
<p>See <b>fib(2)</b> computed twice? For bigger n, the same subproblems get recomputed thousands, then millions of times.</p>
<div class="callout">Recursion tree: total work = sum of work in every node. Count the nodes, count the cost.</div>`
        },
        {
          type: 'input', q: 'Count the nodes in the tree above: how many total calls does fib(4) make (including itself)?',
          answer: ['9', 'nine'], placeholder: 'number',
          explain: `fib(4), two fib(3)/fib(2), four at the next level, two at the bottom: 1 + 2 + 4 + 2 = 9 calls. In general calls(n) = calls(n−1) + calls(n−2) + 1.`
        },
        {
          type: 'learn', title: 'Why it\'s exponential',
          html: `<p>Each level of the tree roughly <b>doubles</b> the number of calls, and the tree is about n levels deep. Upper bound: 2 × 2 × 2 ... n times = <b>O(2ⁿ)</b>.</p>
<p>(The tight bound is about 1.618ⁿ, the golden ratio, because the fib(n−2) branch is shorter. Still exponential, still a disaster.)</p>
<table><tr><th>n</th><th>calls (approx.)</th></tr>
<tr><td>10</td><td>177</td></tr><tr><td>30</td><td>2.7 million</td></tr><tr><td>50</td><td>40 billion</td></tr></table>
<p>Yet there are only <b>n+1 distinct</b> questions: fib(0) to fib(n). We're asking the same few questions billions of times.</p>`
        },
        {
          type: 'widget', widget: 'growth', title: 'Feel the explosion',
          html: `<p>Drag n up and watch the 2ⁿ bar leave everything else behind. That's naive fib. Our fix in the next lesson will turn it into the boring, lovely <b>n</b> bar.</p>`
        },
        {
          type: 'mcq', q: 'What is the main reason naive recursive fib is slow?',
          choices: ['Function calls are slow in Python', 'It recomputes the same subproblems over and over', 'Addition of big numbers is expensive', 'The recursion depth is exponential'],
          answer: 1,
          explain: `The depth is only about n (linear). The problem is the width: overlapping subproblems like fib(2) get recomputed again and again, so the total number of calls is exponential.`
        },
        {
          type: 'tf', q: 'The maximum stack depth of naive fib(n) is about n, even though the total number of calls is exponential.',
          answer: true,
          explain: `The stack only holds one path from root to leaf at a time: fib(n) → fib(n−1) → ... → fib(1). Depth ≈ n. The time is exponential because the tree is enormously wide, not deep.`
        },
        {
          type: 'learn', title: 'Two different recursion shapes',
          html: `<ul><li><b>One call per level</b> (factorial, walking a list): a chain. O(n) calls.</li>
<li><b>Two calls, each on half the input</b> (merge sort): log n levels, n work per level → O(n log n).</li>
<li><b>Two calls, each on input shrunk by just 1 or 2</b> (naive fib): ~n levels, doubling each level → exponential.</li></ul>
<div class="callout">The killer combo: <b>branching</b> + <b>tiny shrink</b>. Halving tames branching; shaving off 1 doesn't.</div>
<div class="dev">It's like a retry storm: every failed request fans out into 2 retries, which each fan out into 2 more... Fan-out with little progress per hop = exponential load.</div>`
        },
        {
          type: 'mcq', q: 'f(n) calls f(n−1) three times (and does O(1) other work). Its running time is roughly...',
          choices: ['O(n)', 'O(3n)', 'O(n³)', 'O(3ⁿ)'],
          answer: 3,
          explain: `Each level triples the calls and there are n levels: 3 × 3 × ... × 3 = 3ⁿ. Branching factor b with depth d gives about bᵈ nodes.`
        }
      ]
    },

    // ───────────────────────────── Lesson 3 ─────────────────────────────
    {
      id: 'memoization',
      title: 'Memoization: It\'s Just Caching',
      emoji: '🧠',
      steps: [
        {
          type: 'learn', title: 'Remember what you already computed',
          html: `<p>Fix for fib: before computing, check if you've seen this input. After computing, save the answer.</p>
<pre><code>memo = {}
def fib(n):
    if n &lt; 2:
        return n
    if n in memo:
        return memo[n]          # cache hit
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]</code></pre>
<p>This is <b>memoization</b> (yes, "memo", not "memorization").</p>
<div class="dev">You already know this: it's Redis in front of Postgres. Cache-aside pattern: check the cache, on miss compute and store. The only difference is the cache lives in a dict and the "slow backend" is your own function.</div>`
        },
        {
          type: 'learn', title: 'What it does to the tree',
          html: `<p>With memoization, every <code>fib(k)</code> is computed <b>once</b>. Every later request is a cache hit that returns instantly, chopping off that whole subtree.</p>
<p>The giant tree collapses to a chain: fib(n), fib(n−1), ..., fib(0), each computed once, each doing O(1) work.</p>
<div class="formula">O(2ⁿ) → O(n)</div>
<p>fib(100) now takes microseconds instead of longer than the age of the universe. Same code shape, one dictionary.</p>`
        },
        {
          type: 'mcq', q: 'What is the time complexity of memoized fib(n)?',
          choices: ['O(1)', 'O(log n)', 'O(n)', 'O(2ⁿ)'],
          answer: 2,
          explain: `There are n+1 distinct subproblems (fib(0)..fib(n)), each computed once with O(1) work (an addition plus cache lookups). Total O(n).`
        },
        {
          type: 'learn', title: 'Python does it for you',
          html: `<pre><code>from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)</code></pre>
<p>(<code>functools.cache</code> is the same thing, shorter.) The decorator wraps your function in a dict keyed by arguments.</p>
<div class="callout">Memoization only works on <b>pure</b> functions: same input → same output, no side effects.</div>
<div class="dev">Same rule as HTTP caching: you can cache GET /users/42, but caching POST /payments would be... an incident. And if the data behind it changes, you need invalidation. Pure functions never need invalidation, which is why memoization is so easy.</div>`
        },
        {
          type: 'tf', q: 'It is safe to memoize a function that returns the current time.',
          answer: false,
          explain: `The output depends on something other than the arguments, so it's not pure. A memoized version would return the first time forever. Classic stale-cache bug.`
        },
        {
          type: 'learn', title: 'The recipe: dynamic programming',
          html: `<p>Memoization works when a problem has two properties:</p>
<ol><li><b>Optimal substructure</b>: the answer is built from answers to smaller subproblems.</li>
<li><b>Overlapping subproblems</b>: the same smaller subproblems show up again and again.</li></ol>
<p>Problems with both are solved by <b>dynamic programming (DP)</b>. Memoized recursion is called <b>top-down DP</b>.</p>
<div class="fun">🤓 Fun fact: Richard Bellman picked the name "dynamic programming" in the 1950s partly because it sounded impressive and his funders were allergic to the word "research". "Programming" meant planning/tabulating, not code.</div>`
        },
        {
          type: 'mcq', q: 'Merge sort splits the array into halves that never overlap. Would memoizing merge sort help?',
          choices: ['Yes, it would make it O(n)', 'No, each subproblem is solved only once anyway', 'Yes, it would make it O(log n)'],
          answer: 1,
          explain: `Merge sort's subproblems don't overlap: every subarray is sorted exactly once. A cache would never get a hit. Memoization needs overlapping subproblems to pay off.`
        },
        {
          type: 'input', q: 'Memoized fib(30): how many distinct values end up stored in memo (it stores fib(2) through fib(30), base cases are not stored)?',
          answer: ['29', 'twenty-nine', 'twenty nine'], placeholder: 'number',
          explain: `fib(2), fib(3), ..., fib(30): that's 30 − 2 + 1 = 29 entries. Linear in n, versus about 2.7 million calls without the cache.`
        },
        {
          type: 'mcq', q: 'The memo dict costs extra memory. What is the space/time trade we just made for fib?',
          choices: ['O(n) extra memory to go from exponential to linear time', 'O(2ⁿ) memory to save O(n) time', 'No extra memory at all'],
          answer: 0,
          explain: `We store n-ish values to avoid exponential recomputation. Trading a little RAM for a lot of CPU: the universal deal of caching.`
        }
      ]
    },

    // ───────────────────────────── Lesson 4 ─────────────────────────────
    {
      id: 'bottom-up-dp',
      title: 'Bottom-Up DP Tables',
      emoji: '📊',
      steps: [
        {
          type: 'learn', title: 'Flip it: fill a table from the bottom',
          html: `<p>Top-down: start at fib(n), recurse down, cache on the way. <b>Bottom-up</b>: start at the base cases and fill a table upward, so every answer you need is already there.</p>
<pre><code>def fib(n):
    dp = [0, 1] + [0] * (n - 1)
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]</code></pre>
<p>No recursion, no stack overflow, no dict. Just a loop and an array.</p>
<div class="dev">Top-down is lazy cache-aside (compute on demand). Bottom-up is a precomputed materialized view: fill everything in order, then read.</div>`
        },
        {
          type: 'learn', title: 'Climbing stairs',
          html: `<p>Classic interview problem: a staircase has n steps. You can climb <b>1 or 2</b> steps at a time. How many different ways to reach the top?</p>
<p>Think about your <i>last</i> move. You arrived at step n either from step n−1 (a 1-step) or from step n−2 (a 2-step). So:</p>
<div class="formula">ways(n) = ways(n−1) + ways(n−2)</div>
<p>with ways(1) = 1 and ways(2) = 2 (1+1 or 2).</p>
<table><tr><th>n</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr>
<tr><th>ways</th><td>1</td><td>2</td><td>3</td><td>5</td><td>8</td></tr></table>
<p>Surprise: it's Fibonacci wearing a hat.</p>`
        },
        {
          type: 'input', q: 'Using ways(n) = ways(n−1) + ways(n−2), how many ways are there to climb 6 steps?',
          answer: ['13', 'thirteen'], placeholder: 'number',
          explain: `ways(5) = 8 and ways(4) = 5, so ways(6) = 8 + 5 = 13.`
        },
        {
          type: 'tf', q: 'Bottom-up fib only ever reads the last two entries, so you could replace the whole array with two variables and use O(1) space.',
          answer: true,
          explain: `Keep prev and curr, then repeatedly do prev, curr = curr, prev + curr. Still O(n) time, now O(1) memory. Many DP tables can shrink like this when each row only depends on the previous one.`
        },
        {
          type: 'learn', title: 'Coin change: fewest coins',
          html: `<p>Coins {1, 3, 4}. What's the fewest coins that make amount A?</p>
<p>The last coin you use is 1, 3 or 4. So:</p>
<div class="formula">best(A) = 1 + min(best(A−1), best(A−3), best(A−4))</div>
<p>(skipping coins bigger than A), with best(0) = 0. Fill the table left to right:</p>
<table><tr><th>A</th><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td></tr>
<tr><th>best</th><td>0</td><td>1</td><td>2</td><td>1</td><td>1</td><td>2</td><td>?</td></tr></table>
<p>Example: best(5) = 1 + min(best(4), best(2), best(1)) = 1 + min(1, 2, 1) = 2 (4+1).</p>`
        },
        {
          type: 'input', q: 'Coins {1, 3, 4}: what is best(6), the fewest coins that make 6?',
          answer: ['2', 'two'], placeholder: 'number',
          explain: `best(6) = 1 + min(best(5), best(3), best(2)) = 1 + min(2, 1, 2) = 2. The coins are 3 + 3. Remember this one: it comes back to haunt a greedy algorithm in the next lesson.`
        },
        {
          type: 'learn', title: 'Edit distance: the algorithm behind diff',
          html: `<p>How many single-character <b>insert / delete / replace</b> operations turn one string into another? That's the <b>edit distance</b> (Levenshtein distance).</p>
<p><code>kitten → sitten → sittin → sitting</code>: 3 edits.</p>
<p>DP table: <code>d[i][j]</code> = edit distance between the first i chars of A and the first j chars of B. If the chars match, <code>d[i][j] = d[i−1][j−1]</code>. Otherwise:</p>
<div class="formula">1 + min(delete d[i−1][j], insert d[i][j−1], replace d[i−1][j−1])</div>
<p>Table size (m+1) × (n+1), so <b>O(m·n)</b> time.</p>
<div class="dev">You use this daily: <code>git diff</code> and <code>diff</code> solve a close cousin (longest common subsequence / Myers' algorithm). "Did you mean <i>git status</i>?" when you type <code>git stauts</code> is edit distance picking the closest command.</div>`
        },
        {
          type: 'mcq', q: 'What is the edit distance between "cat" and "cut"?',
          choices: ['0', '1', '2', '3'],
          answer: 1,
          explain: `Replace 'a' with 'u'. One operation.`
        },
        {
          type: 'input', q: 'What is the edit distance between "flaw" and "lawn"?',
          answer: ['2', 'two'], placeholder: 'number',
          explain: `Delete the leading 'f' (→ "law"), then insert 'n' at the end (→ "lawn"). 2 edits, and you can't do it in 1 since the strings differ at both ends.`
        },
        {
          type: 'order', q: 'Order the steps to design a bottom-up DP solution.',
          items: ['Define what a subproblem means (e.g. best(A) = fewest coins for amount A)', 'Write the recurrence relating it to smaller subproblems', 'Fill in the base cases', 'Loop through subproblems from smallest to largest, filling the table', 'Read the final answer from the table'],
          explain: `Define the state, write the recurrence, seed the base cases, fill in dependency order, read the answer. That recipe solves an astonishing number of problems.`
        }
      ]
    },

    // ───────────────────────────── Lesson 5 ─────────────────────────────
    {
      id: 'greedy',
      title: 'Greedy Algorithms (and When They Lie)',
      emoji: '🤑',
      steps: [
        {
          type: 'learn', title: 'Grab the best thing right now',
          html: `<p>A <b>greedy algorithm</b> makes the choice that looks best <i>right now</i> and never reconsiders.</p>
<p>Making change with US coins (25, 10, 5, 1)? Grab the biggest coin that fits, repeat. 63¢ = 25+25+10+1+1+1. Six coins, and it's optimal.</p>
<div class="callout">Greedy is fast and simple: no table, no backtracking. The catch: it's only correct for problems with the right structure.</div>
<div class="dev">Greedy is how most schedulers work. The Kubernetes scheduler scores nodes and places each pod on the best-scoring node right now. It never moves earlier pods to make a better overall packing (that's what the descheduler is for!).</div>`
        },
        {
          type: 'learn', title: 'Greedy fails: the coin trap',
          html: `<p>Now use coins <b>{1, 3, 4}</b> and make <b>6</b>.</p>
<ul><li><b>Greedy:</b> take 4 (biggest that fits), then 1, then 1. <b>3 coins.</b></li>
<li><b>Optimal (DP):</b> 3 + 3. <b>2 coins.</b></li></ul>
<p>Grabbing the 4 felt great, but it locked us into a worse total. Greedy can't undo a choice.</p>
<div class="callout">Greedy works when a locally best choice is always part of <i>some</i> globally best solution (the "greedy choice property"). Otherwise, you need DP or search.</div>`
        },
        {
          type: 'mcq', q: 'Coins {1, 5, 6, 9}, amount 11. Greedy picks 9 + 1 + 1. What does an optimal solution use?',
          choices: ['9 + 1 + 1 (3 coins, greedy is optimal)', '6 + 5 (2 coins)', '5 + 5 + 1 (3 coins)', '6 + 1 + 1 + 1 + 1 + 1 (6 coins)'],
          answer: 1,
          explain: `6 + 5 = 11 with just 2 coins. Greedy's 9 was a trap leaving a remainder of 2 that only 1s can cover.`
        },
        {
          type: 'tf', q: 'If a greedy algorithm works for one set of coin denominations, it works for all coin denominations.',
          answer: false,
          explain: `It depends on the denominations. US coins {1, 5, 10, 25} happen to be "canonical" (greedy is optimal), but {1, 3, 4} is not. DP works for any set.`
        },
        {
          type: 'learn', title: 'Where greedy wins: interval scheduling',
          html: `<p>One meeting room, a pile of meeting requests (start, end). Book the <b>maximum number</b> of non-overlapping meetings.</p>
<p>Tempting greedy rules that <b>fail</b>:</p>
<ul><li>Shortest meeting first (a short one can overlap two others).</li>
<li>Earliest start first (one all-day meeting starts first and blocks everything).</li></ul>
<p>The rule that is <b>provably optimal</b>:</p>
<div class="callout">Sort by <b>end time</b>. Pick the meeting that ends earliest, drop everything overlapping it, repeat.</div>
<p>Finishing early leaves the most room for everything else. Sort + one pass = O(n log n).</p>`
        },
        {
          type: 'learn', title: 'Try it',
          html: `<p>Meetings (start–end):</p>
<table><tr><th>A</th><td>1–4</td></tr><tr><th>B</th><td>3–5</td></tr><tr><th>C</th><td>0–6</td></tr><tr><th>D</th><td>5–7</td></tr><tr><th>E</th><td>3–9</td></tr><tr><th>F</th><td>5–9</td></tr><tr><th>G</th><td>6–10</td></tr><tr><th>H</th><td>8–11</td></tr></table>
<p>Earliest end is A (ends 4): take it. Next meeting starting at or after 4 with the earliest end is D (5–7): take it. Next one starting at or after 7: H (8–11). Take it.</p>
<p>Result: A, D, H. Three meetings, and no schedule can fit four.</p>`
        },
        {
          type: 'mcq', q: 'Meetings: X 0–10, Y 1–3, Z 4–6. Which greedy rule gives the wrong answer here?',
          choices: ['Earliest end time first', 'Earliest start time first', 'Both give 2 meetings'],
          answer: 1,
          explain: `Earliest start picks X (0–10), which blocks Y and Z: only 1 meeting. Earliest end picks Y (ends 3), then Z (ends 6): 2 meetings, the optimum.`
        },
        {
          type: 'learn', title: 'Greedy vs DP: the cheat sheet',
          html: `<table><tr><th></th><th>Greedy</th><th>DP</th></tr>
<tr><td>Choices</td><td>One, never revisited</td><td>Tries all, keeps best</td></tr>
<tr><td>Speed</td><td>Usually fastest</td><td>Slower, uses a table</td></tr>
<tr><td>Correct?</td><td>Only with the greedy-choice property</td><td>Whenever subproblems overlap and combine</td></tr></table>
<p>Famous greedy wins: Dijkstra's shortest paths, Huffman compression (gzip!), Kruskal/Prim minimum spanning trees (next unit).</p>
<div class="dev">Incident habit translated: greedy is "fix the loudest alert first". Often fine! But sometimes the root cause is a quiet alert, and the "obvious" fix makes the whole outage longer.</div>`
        },
        {
          type: 'order', q: 'Apply earliest-end-first to meetings P 1–3, Q 2–5, R 3–6, S 6–8, T 7–9 (a meeting may start exactly when another ends). Put the meetings greedy picks in the order it picks them.',
          items: ['P (1–3)', 'R (3–6)', 'S (6–8)'],
          explain: `Sorted by end: P(3), Q(5), R(6), S(8), T(9). Take P. Q starts at 2, before P ends: skip. R starts at 3: take. S starts at 6: take. T starts at 7, before S ends at 8: skip. Three meetings: P, R, S.`
        }
      ]
    },

    // ───────────────────────────── Lesson 6 ─────────────────────────────
    {
      id: 'backtracking',
      title: 'Divide & Conquer and Backtracking',
      emoji: '♛',
      steps: [
        {
          type: 'learn', title: 'Divide & conquer, recap',
          html: `<p>Three moves:</p>
<ol><li><b>Divide</b> the problem into independent smaller pieces.</li>
<li><b>Conquer</b> each piece recursively.</li>
<li><b>Combine</b> the answers.</li></ol>
<p>Merge sort: split in half, sort each half, merge. Binary search: look at the middle, recurse into one half. The pieces <i>don't overlap</i>, which is what separates it from DP.</p>
<div class="dev">This is MapReduce, Spark, and every "fan out to N shards, then aggregate" query. Elasticsearch scatters a search to shards (divide/conquer) and the coordinating node merges the results (combine).</div>`
        },
        {
          type: 'mcq', q: 'Merge sort: two halves, then O(n) merge work. T(n) = 2T(n/2) + n solves to...',
          choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
          answer: 1,
          explain: `There are log₂ n levels of halving, and each level does n total merge work across all its pieces. n × log n.`
        },
        {
          type: 'learn', title: 'Backtracking: try, check, undo',
          html: `<p>Some problems have no clever shortcut: you must <b>search</b> through choices. <b>Backtracking</b> builds a solution one choice at a time, and the moment a partial solution breaks a rule, it <b>undoes</b> the last choice and tries the next one.</p>
<pre><code>def solve(state):
    if is_complete(state):
        record(state); return
    for choice in options(state):
        if is_valid(state, choice):
            apply(state, choice)
            solve(state)
            undo(state, choice)   # backtrack</code></pre>
<div class="callout">The power move is <b>pruning</b>: abandon a dead branch early instead of finishing it.</div>`
        },
        {
          type: 'learn', title: 'N-queens',
          html: `<p>Place N chess queens on an N×N board so no two attack each other (no shared row, column or diagonal).</p>
<p>Backtracking: place one queen per row. In each row, try each column; if it's attacked, skip it. If a row has no safe column, go back up and move the previous queen.</p>
<svg viewBox="0 0 120 120" width="120" style="max-width:120px">
<g fill="currentColor" opacity="0.12"><rect x="30" y="0" width="30" height="30"/><rect x="90" y="0" width="30" height="30"/><rect x="0" y="30" width="30" height="30"/><rect x="60" y="30" width="30" height="30"/><rect x="30" y="60" width="30" height="30"/><rect x="90" y="60" width="30" height="30"/><rect x="0" y="90" width="30" height="30"/><rect x="60" y="90" width="30" height="30"/></g>
<rect x="0" y="0" width="120" height="120" fill="none" stroke="currentColor"/>
<g fill="var(--accent)" font-size="22" text-anchor="middle"><text x="45" y="23">♛</text><text x="105" y="53">♛</text><text x="15" y="83">♛</text><text x="75" y="113">♛</text></g></svg>
<p>One of the only 2 solutions for 4×4. The 8×8 board has 92 solutions. Sudoku solvers work exactly the same way: fill a cell, check rules, backtrack on conflict.</p>`
        },
        {
          type: 'tf', q: 'Backtracking can skip huge parts of the search space because it abandons a partial solution as soon as it breaks a rule.',
          answer: true,
          explain: `That's pruning. For 8-queens, blindly trying every placement of 8 queens on 64 squares is about 4.4 billion combinations; backtracking row by row explores only a couple thousand nodes.`
        },
        {
          type: 'learn', title: 'Generating permutations',
          html: `<p>All orderings of [A, B, C]: pick a first element, then recursively permute the rest.</p>
<pre><code>def perms(items, path=[]):
    if not items:
        print(path); return
    for i, x in enumerate(items):
        perms(items[:i] + items[i+1:], path + [x])</code></pre>
<p>Output: ABC, ACB, BAC, BCA, CAB, CBA. 3 choices, then 2, then 1: <b>3! = 6</b>. For n items, n! orderings, which grows even faster than 2ⁿ.</p>
<div class="dev">This is why "just try every deploy order of our 15 services" is not a plan: 15! ≈ 1.3 trillion. Real tools use the dependency graph instead (topological sort, next unit).</div>`
        },
        {
          type: 'input', q: 'How many permutations does perms() print for a list of 4 distinct items?',
          answer: ['24', 'twenty-four', 'twenty four', '4!'], placeholder: 'number',
          explain: `4! = 4 × 3 × 2 × 1 = 24.`
        },
        {
          type: 'mcq', q: 'Which technique fits best: "find the cheapest way to cut a rod, where the same sub-lengths keep reappearing in the calculation"?',
          choices: ['Divide & conquer (independent pieces)', 'Dynamic programming (overlapping subproblems)', 'Backtracking (search with pruning)', 'Greedy (grab the biggest piece)'],
          answer: 1,
          explain: `"Same sub-lengths keep reappearing" is the signature of overlapping subproblems. Cache them: dynamic programming.`
        },
        {
          type: 'order', q: 'Order these from the fastest growth (worst) to the slowest, for the number of things a naive search must try.',
          items: ['n! (all orderings of n items)', '2ⁿ (all subsets of n items)', 'n² (all pairs of n items)', 'n log n (sorting n items)'],
          explain: `n! beats 2ⁿ for n ≥ 4 (e.g. 10! = 3,628,800 vs 2¹⁰ = 1024). Polynomials like n² are far tamer, and n log n is tamer still.`
        }
      ]
    }
  ]
});

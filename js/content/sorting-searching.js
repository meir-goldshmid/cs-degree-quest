CQ.unit({
  id: 'sorting-searching',
  order: 8,
  title: 'Sorting & Searching',
  emoji: '🔍',
  color: '#f97316',
  tagline: 'Finding needles fast, and lining up the haystack first',
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'binary-search',
      title: 'Linear vs Binary Search',
      emoji: '🎯',
      steps: [
        { type: 'learn', title: 'The honest way: look at everything', html: `
<p><b>Linear search</b>: check item 0, item 1, item 2… until you find it or run out. Works on <i>any</i> list, sorted or not.</p>
<p>Cost: <b>O(n)</b>. Fine for 50 items. Painful for 50 million.</p>
<div class="dev">You already know this: <code>grep</code> over an unindexed log file, or a Postgres <b>Seq Scan</b> in your EXPLAIN plan. Honest, reliable, slow at scale.</div>` },
        { type: 'learn', title: 'The clever way: halve the problem', html: `
<p>If the data is <b>sorted</b>, peek at the middle. Target bigger? Throw away the whole left half. Smaller? Throw away the right half. Repeat.</p>
<p>Each step halves the search space, so it takes about <b>log₂ n</b> steps:</p>
<div class="formula">1,000,000 → 500,000 → 250,000 → … → 1   (≈ 20 steps)</div>
<p>That is <b>binary search</b>: O(log n). Let's feel it.</p>` },
        { type: 'widget', widget: 'guess', title: 'Guess my number', html: '<p>Always guess the middle of what is left. You should never need more than 7 guesses for 1–100.</p>' },
        { type: 'input', q: 'Using binary search, what is the maximum number of guesses needed to find a number between 1 and 100?', answer: ['7', 'seven'], placeholder: 'guesses',
          explain: '2⁶ = 64 < 100 ≤ 128 = 2⁷. Six halvings can only distinguish 64 possibilities, seven can handle 128. So 7 guesses always suffice.' },
        { type: 'tf', q: 'Binary search works on any list, sorted or not, as long as it is stored in an array.', answer: false,
          explain: 'The whole trick relies on order: "the middle is too small, so everything to its left is too small as well". On unsorted data that inference is false, and you\'ll confidently miss things.' },
        { type: 'learn', title: 'Off-by-one: the boss fight', html: `
<p>Binary search is famous for being easy to explain and hard to get exactly right. A correct version (inclusive bounds):</p>
<pre><code>def bsearch(a, target):
    lo, hi = 0, len(a) - 1
    while lo &lt;= hi:               # &lt;=, not &lt;
        mid = lo + (hi - lo) // 2
        if a[mid] == target: return mid
        if a[mid] &lt; target: lo = mid + 1   # +1!
        else:                hi = mid - 1   # -1!
    return -1</code></pre>
<div class="fun">🤓 Fun fact: Java's <code>Arrays.binarySearch</code> shipped for ~9 years with <code>mid = (lo + hi) / 2</code>. On arrays with over ~1 billion elements, <code>lo + hi</code> overflows a 32-bit int and goes negative. Joshua Bloch wrote it up in 2006. Hence <code>lo + (hi - lo) / 2</code>.</div>` },
        { type: 'tf', q: 'In the code above, changing "lo = mid + 1" to "lo = mid" can make the loop run forever.', answer: true,
          explain: 'Say lo = 3, hi = 4: mid = 3. If a[3] < target, lo = mid sets lo back to 3 — no progress, infinite loop. The +1 guarantees the range shrinks every iteration.' },
        { type: 'learn', title: 'git bisect: binary search for bugs', html: `
<p>Something broke between release v1.4 (good) and HEAD (bad), 1,000 commits apart. <code>git bisect</code> checks out the middle commit; you test it and say <code>good</code> or <code>bad</code>; it halves the range. Repeat.</p>
<pre><code>git bisect start
git bisect bad HEAD
git bisect good v1.4
git bisect run ./test.sh    # fully automatic!</code></pre>
<div class="dev">This is the single most practical binary search of your career. Same idea when you bisect a bad config across 64 nodes, or narrow down which of 200 feature flags broke prod by flipping half at a time.</div>` },
        { type: 'input', q: 'About how many test runs does git bisect need (worst case) to find the bad commit among 1,000 commits?', answer: ['10', 'ten'], placeholder: 'runs',
          explain: '2¹⁰ = 1024 ≥ 1000, so about 10 halvings. Ten builds instead of a thousand. Bisect is magic that is actually just log₂.' },
        { type: 'mcq', q: 'You will search an UNSORTED list of 1 million items exactly once. What is the fastest approach?',
          choices: ['Sort it (O(n log n)), then binary search', 'Just do a linear search (O(n))', 'Binary search directly', 'Build a B-tree first'], answer: 1,
          explain: 'Sorting alone costs more than one linear scan. Sorting (or indexing) pays off only when you will search many times — exactly the trade-off behind "should I add this index?".' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'simple-sorts',
      title: 'Bubble, Insertion & Selection',
      emoji: '🫧',
      steps: [
        { type: 'learn', title: 'Bubble sort: the famous slowpoke', html: `
<p>Walk the list comparing neighbours; if they are in the wrong order, swap. After one pass the biggest item has "bubbled" to the end. Repeat until a pass makes no swaps.</p>
<pre><code>[5, 1, 4, 2, 8]
 swap 5,1 → [1, 5, 4, 2, 8]
 swap 5,4 → [1, 4, 5, 2, 8]
 swap 5,2 → [1, 4, 2, 5, 8]
 5 &lt; 8, ok   (end of pass 1: 8 is in place)</code></pre>
<p>Worst case O(n²). Mostly taught so you know what <i>not</i> to ship.</p>` },
        { type: 'widget', widget: 'sort', title: 'Watch them race', html: '<p>Run bubble sort and insertion sort on the same data and compare the comparison counters. Then peek at merge and quick sort for a preview.</p>' },
        { type: 'mcq', q: 'After ONE full bubble-sort pass on [3, 1, 2], what is the list?',
          choices: ['[1, 2, 3]', '[1, 3, 2]', '[3, 1, 2]', '[2, 1, 3]'], answer: 0,
          explain: '3 > 1 swap → [1, 3, 2]; 3 > 2 swap → [1, 2, 3]. Lucky — sorted in one pass (but bubble sort needs one more pass with zero swaps to be sure).' },
        { type: 'learn', title: 'Insertion sort: how you sort cards', html: `
<p>Keep a sorted part on the left. Take the next item and slide it left until it fits, like sorting a hand of playing cards.</p>
<pre><code>for i in range(1, len(a)):
    x = a[i]; j = i - 1
    while j &gt;= 0 and a[j] &gt; x:
        a[j+1] = a[j]; j -= 1
    a[j+1] = x</code></pre>
<ul><li>Worst case (reverse sorted): O(n²)</li><li>Best case (already sorted): <b>O(n)</b> — each item takes one comparison and stays put.</li></ul>
<div class="callout">Insertion sort is genuinely great for <b>small</b> or <b>nearly sorted</b> data. Real-world sorts use it for small chunks!</div>` },
        { type: 'mcq', q: 'Your log lines are already sorted by timestamp except for a few late arrivals slightly out of place. Which simple sort shines?',
          choices: ['Selection sort', 'Insertion sort', 'Bubble sort without early exit', 'They are all equally good'], answer: 1,
          explain: 'Insertion sort does work proportional to how far items are out of place. Nearly sorted → nearly O(n). Selection sort always does ~n²/2 comparisons no matter what.' },
        { type: 'learn', title: 'Selection sort: find the min, repeat', html: `
<p>Scan the whole unsorted part for the minimum, swap it into the next position. Repeat.</p>
<p>It always does about <b>n²/2 comparisons</b>, even on sorted input — it never notices. But it does at most <b>n − 1 swaps</b>, which mattered back when writes were very expensive.</p>
<div class="dev">Think of it as a dumb rolling deploy that always re-checks every remaining pod before picking the next one — predictable, but never takes a shortcut.</div>` },
        { type: 'tf', q: 'Selection sort runs faster on already-sorted input than on random input.', answer: false,
          explain: 'It still scans the entire unsorted part each round to confirm the minimum: n(n−1)/2 comparisons every time. Its time doesn\'t depend on input order at all.' },
        { type: 'input', q: 'How many comparisons does insertion sort make on an already-sorted list of 10 items?', answer: ['9', 'nine'], placeholder: 'number',
          explain: 'Each of items 2..10 is compared once with its left neighbour, finds it is already in place, and stops: n − 1 = 9 comparisons. That is the O(n) best case.' },
        { type: 'order', q: 'Insertion sort on [4, 3, 1]: order the states of the array, from start to finish',
          items: ['[4, 3, 1]', '[3, 4, 1]', '[1, 3, 4]'],
          explain: 'Step 1: take 3, slide it left past 4 → [3, 4, 1]. Step 2: take 1, slide it past 4 and 3 → [1, 3, 4]. The sorted left part grows by one each step.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'merge-sort',
      title: 'Merge Sort',
      emoji: '🪓',
      steps: [
        { type: 'learn', title: 'Divide and conquer', html: `
<p>Merge sort's plan is gloriously lazy:</p>
<ol><li><b>Split</b> the list in half.</li><li><b>Sort</b> each half (recursively — same trick).</li><li><b>Merge</b> the two sorted halves.</li></ol>
<p>A list of 1 item is already sorted, so the recursion bottoms out. All the real work happens in the merge.</p>
<div class="dev">You already know this pattern: split a big job into shards, let workers handle them in parallel, then combine results. MapReduce, parallel CI test shards, and fan-out/fan-in pipelines are all divide and conquer.</div>` },
        { type: 'learn', title: 'Merging two sorted lists', html: `
<p>Keep a finger on the front of each list. Take the smaller of the two fronts, advance that finger. When one list runs out, append the rest of the other.</p>
<pre><code>L = [1, 4, 7]   R = [2, 3, 9]
1 vs 2 → 1     4 vs 2 → 2     4 vs 3 → 3
4 vs 9 → 4     7 vs 9 → 7     L empty → 9
result: [1, 2, 3, 4, 7, 9]</code></pre>
<p>Merging lists of total length n takes <b>O(n)</b> — at most n − 1 comparisons.</p>` },
        { type: 'input', q: 'In the merge above, how many comparisons were made?', answer: ['5', 'five'], placeholder: 'number',
          explain: '1v2, 4v2, 4v3, 4v9, 7v9 — five comparisons. Then L ran out and 9 was appended for free. That is n − 1 = 6 − 1 = 5, the maximum for 6 items.' },
        { type: 'learn', title: 'Why n log n?', html: `
<p>Picture the recursion as a tree. Each level splits lists in half, so there are <b>log₂ n</b> levels. At every level, the merges together touch all <b>n</b> items once.</p>
<div class="formula">log₂ n levels × n work per level = O(n log n)</div>
<p>And that is the worst case too — merge sort doesn't care how the input looks. 1 million items: ~20 levels × 1M ≈ 20M steps, versus ~500 billion for an O(n²) sort.</p>` },
        { type: 'input', q: 'How many levels of halving does merge sort need to get a list of 8 items down to single items?', answer: ['3', 'three'], placeholder: 'levels',
          explain: '8 → 4 → 2 → 1: three halvings, because log₂ 8 = 3.' },
        { type: 'learn', title: 'Stable, and good with disks', html: `
<p>Merge sort is <b>stable</b>: equal items keep their original relative order (more on why that matters later). Its cost: O(n) <b>extra memory</b> for merging.</p>
<p>Its superpower is <b>external sorting</b> — sorting data far bigger than RAM:</p>
<ol><li>Read a chunk that fits in memory, sort it, write it out as a sorted "run".</li><li>Repeat for the whole file.</li><li>K-way merge all the runs, streaming, reading each sequentially.</li></ol>
<div class="dev">GNU <code>sort</code> does exactly this on your 200 GB access log (see its temp files and <code>-S</code> buffer size). Postgres too: EXPLAIN ANALYZE shows <code>Sort Method: external merge  Disk: …</code> when a sort overflows <code>work_mem</code>.</div>` },
        { type: 'order', q: 'Order the steps of an external merge sort of a 500 GB log on a 16 GB machine',
          items: ['Read a chunk that fits in RAM', 'Sort that chunk in memory', 'Write it to disk as a sorted run', 'K-way merge all sorted runs into the final output'],
          explain: 'Chunk → sort → spill → repeat → merge. Merging only needs to read the front of each run, so it streams with little memory.' },
        { type: 'mcq', q: 'What is merge sort\'s worst-case time complexity?',
          choices: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], answer: 1,
          explain: 'Always log n levels × O(n) merging per level. No unlucky inputs — a big reason it is used where predictability matters.' },
        { type: 'tf', q: 'Standard array merge sort sorts in place, using only O(1) extra memory.', answer: false,
          explain: 'The standard merge needs a temporary buffer of size up to n: O(n) extra memory. In-place merge variants exist but are complex and slower. (Merge sort on linked lists, though, can avoid the buffer.)' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'quicksort',
      title: 'Quicksort',
      emoji: '⚡',
      steps: [
        { type: 'learn', title: 'Pick a pivot, split the crowd', html: `
<p><b>Quicksort</b> flips merge sort around: do the work <i>before</i> recursing.</p>
<ol><li>Pick a <b>pivot</b> element.</li><li><b>Partition</b>: move everything smaller to its left, everything larger to its right. The pivot is now in its final spot!</li><li>Recursively quicksort the left and right parts.</li></ol>
<p>No merge step needed — once both sides are sorted, the whole thing is sorted.</p>
<div class="dev">Like triaging an incident queue: pick a severity threshold, split tickets into "above" and "below", then triage each pile the same way.</div>` },
        { type: 'order', q: 'Order the steps of quicksort on one sub-array',
          items: ['Pick a pivot', 'Partition: smaller items left, larger items right', 'Recursively sort the left and right parts'],
          explain: 'Pivot → partition → recurse. Unlike merge sort, the "combine" step is free: the pivot already sits between two sorted halves.' },
        { type: 'input', q: 'Partition [7, 2, 9, 4, 5] around pivot 5. At what 0-based index does 5 end up?', answer: ['2', 'two'], placeholder: 'index',
          explain: 'Two items (2 and 4) are smaller than 5, so they occupy indexes 0 and 1, and 5 lands at index 2 — its final sorted position. 7 and 9 go to the right.' },
        { type: 'learn', title: 'When quicksort goes bad', html: `
<p>Average case: pivots split things roughly in half → ~log n levels → <b>O(n log n)</b>, with tiny constants and great cache behaviour. Usually the fastest comparison sort in practice.</p>
<p>Worst case: the pivot is always the smallest or largest item. Each partition only peels off one element → n levels → <b>O(n²)</b>.</p>
<p>The classic trap: <b>always pick the first element</b> as pivot, then feed it <b>already-sorted</b> data. 💥</p>
<div class="dev">This is an incident waiting for a specific input — like a regex that's fine until someone sends the one pathological string. Adversarial inputs can trigger it on purpose ("quicksort killer").</div>` },
        { type: 'tf', q: 'Quicksort with "first element as pivot" on an already-sorted array takes O(n²) time.', answer: true,
          explain: 'The first element is the minimum, so each partition puts nothing on the left and everything else on the right. n − 1, n − 2, … comparisons sum to ~n²/2.' },
        { type: 'learn', title: 'Defences', html: `
<ul><li><b>Random pivot</b>: no fixed input is reliably bad; expected O(n log n).</li>
<li><b>Median-of-three</b>: pivot = median of first, middle, last. Kills the sorted-input trap.</li>
<li><b>Fallback</b>: if recursion gets too deep, switch algorithms (introsort — coming soon).</li></ul>
<p>Other traits: it sorts <b>in place</b> (only O(log n) stack if you recurse on the smaller side first), and it is <b>not stable</b> — partitioning swaps items over long distances.</p>` },
        { type: 'widget', widget: 'sort', title: 'Quick vs merge', html: '<p>Run quick sort and merge sort on the same data. Compare their comparison counters to bubble and insertion sort.</p>' },
        { type: 'mcq', q: 'Why is a random pivot a good defence?',
          choices: ['It makes the worst case O(n log n) guaranteed', 'It makes the expected time O(n log n) for every input, so no specific input is reliably slow', 'It makes quicksort stable', 'It removes the need for partitioning'], answer: 1,
          explain: 'The worst case still exists in theory, but it now depends on bad luck rather than bad input — and that luck is astronomically unlikely for large n. Guaranteed O(n log n) requires something like introsort\'s fallback.' },
        { type: 'mcq', q: 'Which pairing is correct?',
          choices: ['Quicksort: stable, O(n) extra memory · Merge sort: unstable, in place', 'Quicksort: unstable, in place · Merge sort: stable, O(n) extra memory', 'Both stable and in place', 'Both unstable, O(n) extra memory'], answer: 1,
          explain: 'Classic trade-off: quicksort is in-place and fast but unstable with an O(n²) worst case; merge sort is stable and always O(n log n) but needs a buffer.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'heapsort-lower-bound',
      title: 'Heap Sort & the Speed Limit',
      emoji: '🚧',
      steps: [
        { type: 'learn', title: 'Heap sort', html: `
<p>Remember heaps? A <b>max-heap</b> always has the largest item at the root. So:</p>
<ol><li>Turn the array into a max-heap in place: O(n).</li><li>Swap the root (max) with the last item; shrink the heap by one; sift the new root down: O(log n).</li><li>Repeat n times.</li></ol>
<p>The sorted part grows from the right end. Total: <b>O(n log n) worst case</b>, <b>O(1) extra memory</b>. Not stable, and its jumpy memory access is cache-unfriendly, so it is usually slower than quicksort in practice.</p>
<div class="dev">Postgres uses a heap when you write <code>ORDER BY … LIMIT 10</code>: EXPLAIN ANALYZE shows <code>Sort Method: top-N heapsort</code>. It keeps only the best 10 instead of sorting everything.</div>` },
        { type: 'mcq', q: 'Which combination does heap sort offer that neither quicksort nor merge sort offers?',
          choices: ['O(n log n) worst case AND O(1) extra memory', 'Stability', 'O(n) best case on sorted input', 'Great cache locality'], answer: 0,
          explain: 'Quicksort is in place but has an O(n²) worst case; merge sort is O(n log n) worst case but needs O(n) memory. Heap sort gets both guarantees — at the cost of speed in practice and stability.' },
        { type: 'learn', title: 'Is there a speed limit?', html: `
<p>Every fast sort so far lands on O(n log n). Coincidence? Nope. It is a <b>proven lower bound</b> for <b>comparison sorts</b> — algorithms that only learn about data by asking "is a &lt; b?".</p>
<p>The argument: n items can be arranged in <b>n!</b> possible orders. The algorithm must tell them all apart. Each yes/no comparison can at best halve the remaining possibilities.</p>
<div class="formula">comparisons ≥ log₂(n!) ≈ n log₂ n</div>
<p>It is a decision tree with n! leaves, so its height is at least log₂(n!).</p>` },
        { type: 'input', q: 'How many possible orderings do 3 distinct items have?', answer: ['6', 'six'], placeholder: 'number',
          explain: '3! = 3 × 2 × 1 = 6: abc, acb, bac, bca, cab, cba.' },
        { type: 'input', q: 'So what is the minimum number of comparisons any comparison sort needs in the worst case to sort 3 items?', answer: ['3', 'three'], placeholder: 'number',
          explain: '2 comparisons give at most 2² = 4 outcomes — not enough to distinguish 6 orderings. 3 comparisons give 8 ≥ 6. So ⌈log₂ 6⌉ = 3.' },
        { type: 'learn', title: 'Twenty questions, but for sorting', html: `
<p>Each comparison is a yes/no question. Sorting is a game of "which of the n! orderings is it?". With 20 questions you can distinguish ~1 million things; to distinguish n! things you need log₂(n!) questions.</p>
<p>And log₂(n!) grows like n log n (Stirling's approximation). So merge sort and heap sort are <b>asymptotically optimal</b> comparison sorts. You literally cannot do better… <i>by comparing</i>.</p>
<div class="fun">🤓 Fun fact: the bound is tight for tiny n too. Sorting 5 items needs at least ⌈log₂ 120⌉ = 7 comparisons, and 7 is achievable.</div>` },
        { type: 'tf', q: 'No comparison-based sorting algorithm can have a worst case better than O(n log n).', answer: true,
          explain: 'Its decision tree must have ≥ n! leaves, so worst-case depth ≥ log₂(n!) = Ω(n log n). This is a proof about all possible algorithms, not just ones we have found.' },
        { type: 'mcq', q: 'What does the lower-bound argument assume?',
          choices: ['The data fits in memory', 'The algorithm learns about the order only by comparing pairs of items', 'The data is random', 'The algorithm is recursive'], answer: 1,
          explain: 'The loophole: if you can look at the actual values (digits, bytes, small integer ranges) instead of just comparing, the bound doesn\'t apply. Next lesson: sorts that break the "speed limit".' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'linear-sorts',
      title: 'Counting, Radix & Stability',
      emoji: '🔢',
      steps: [
        { type: 'learn', title: 'Counting sort: just tally them', html: `
<p>Sorting 10 million HTTP status codes? There are only a handful of distinct values. Don't compare — <b>count</b>:</p>
<pre><code>counts = {200: 9100000, 301: 40000, 404: 800000, 500: 60000}
# then emit each value count times, in key order</code></pre>
<p>For integers in a range of size k: one pass to count, one pass over the k buckets.</p>
<div class="formula">O(n + k)</div>
<p>No comparisons at all, so the n log n speed limit simply doesn't apply.</p>
<div class="dev">You do this every day: <code>awk '{print $9}' access.log | sort | uniq -c</code> is the same tally idea — and a Prometheus histogram is counting sort's bucket array, frozen in time.</div>` },
        { type: 'mcq', q: 'Counting sort is a terrible choice when…',
          choices: ['Values are small integers like ages 0–150', 'Values are 64-bit integers spread across the whole range', 'There are many duplicates', 'n is very large'], answer: 1,
          explain: 'k would be 2⁶⁴ — you can\'t allocate that many counters. Counting sort needs a small value range k relative to n.' },
        { type: 'learn', title: 'Radix sort: one digit at a time', html: `
<p>What if the range is big? Sort by <b>digits</b>, least significant first, using a stable counting sort for each digit:</p>
<pre><code>[170, 45, 75, 90, 802, 24, 2, 66]
by ones:     [170, 90, 802, 2, 24, 45, 75, 66]
by tens:     [802, 2, 24, 45, 66, 170, 75, 90]
by hundreds: [2, 24, 45, 66, 75, 90, 170, 802]</code></pre>
<p>With d digits in base b: <b>O(d · (n + b))</b>. 32-bit ints as 4 bytes: 4 passes of counting sort with 256 buckets — linear in n.</p>` },
        { type: 'tf', q: 'LSD radix sort only works if the per-digit sort is stable.', answer: true,
          explain: 'When sorting by tens, items with the same tens digit must keep the order established by the ones-digit pass. Without stability, earlier passes get scrambled and the result is wrong.' },
        { type: 'learn', title: 'Stability: ties keep their order', html: `
<p>A sort is <b>stable</b> if items that compare equal stay in their original relative order.</p>
<p>Why care? It lets you <b>sort by multiple keys</b> in passes. Want incidents by severity, and within each severity by time? Sort by time first, then stable-sort by severity. Ties on severity keep their time order.</p>
<ul><li>Stable: merge sort, insertion sort, bubble sort, counting sort, Timsort</li><li>Not stable: quicksort, heap sort, selection sort</li></ul>
<div class="dev">Ever clicked one column header, then another, in a dashboard table and got a nice grouped view? That's a stable sort earning its keep.</div>` },
        { type: 'mcq', q: 'Tickets sorted by time: [(P2, 09:00), (P1, 09:05), (P2, 09:10), (P1, 09:20)]. You STABLE-sort by priority. Result?',
          choices: ['(P1, 09:05), (P1, 09:20), (P2, 09:00), (P2, 09:10)', '(P1, 09:20), (P1, 09:05), (P2, 09:10), (P2, 09:00)', '(P1, 09:05), (P1, 09:20), (P2, 09:10), (P2, 09:00)', 'Order within each priority is unpredictable'], answer: 0,
          explain: 'P1s come first, P2s second, and within each priority the original (time) order is preserved: 09:05 before 09:20, 09:00 before 09:10.' },
        { type: 'mcq', q: 'Which sort is NOT stable (in its standard form)?',
          choices: ['Merge sort', 'Insertion sort', 'Quicksort', 'Counting sort'], answer: 2,
          explain: 'Partitioning swaps items across long distances, so equal items can swap places. Merge, insertion and counting sort all preserve the order of ties.' },
        { type: 'input', q: 'Counting sort of n = 1,000,000 values in range 0–999 (k = 1,000). What is its complexity, in terms of n and k?', answer: ['O(n + k)', 'n + k', 'O(n+k)', 'n+k', 'O(k + n)', 'k + n'], placeholder: 'O(...)',
          explain: 'One pass over the n items to count, one pass over the k counters to emit: O(n + k). Here that is about 1,001,000 steps — linear.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'real-world-sorts',
      title: 'What Real Languages Use',
      emoji: '🏭',
      steps: [
        { type: 'learn', title: 'Nobody ships textbook sorts', html: `
<p>Production sorts are <b>hybrids</b>: they mix algorithms to get the best of each. The two big families:</p>
<ul><li><b>Timsort</b> — merge sort + insertion sort, tuned for real data.</li><li><b>Introsort</b> (and descendants) — quicksort + heap sort + insertion sort.</li></ul>
<p>Both use <b>insertion sort for tiny chunks</b> (roughly under 16–64 items), where its low overhead beats everything.</p>` },
        { type: 'learn', title: 'Timsort: exploit existing order', html: `
<p>Written by Tim Peters for Python in 2002. Real data is rarely random — it is often partly sorted (appended logs, mostly-ordered IDs). Timsort:</p>
<ol><li>Scans for <b>runs</b> that are already ascending (or descending, which it reverses).</li><li>Extends short runs with insertion sort.</li><li>Merges runs cleverly, with "galloping" when one run dominates.</li></ol>
<p>Already sorted input: <b>O(n)</b>. Worst case: <b>O(n log n)</b>. And it is <b>stable</b>.</p>
<div class="dev">Used by Python's <code>sorted()</code>/<code>list.sort()</code> (with a refined merge policy, Powersort, since 3.11), Java's <code>Arrays.sort</code> for objects and <code>Collections.sort</code>, and V8 for JavaScript's <code>Array.prototype.sort</code>.</div>` },
        { type: 'tf', q: 'Timsort sorts an already-sorted list in about linear time.', answer: true,
          explain: 'It detects one giant run covering the whole list and has nothing left to merge: ~n − 1 comparisons.' },
        { type: 'learn', title: 'Introsort: quicksort with a safety net', html: `
<p><b>Introsort</b> (Musser, 1997) starts as quicksort. If recursion depth exceeds about 2·log₂ n — a sign of bad pivots — it switches that part to <b>heap sort</b>. Small partitions get insertion sort.</p>
<p>Result: quicksort's real-world speed, with a <b>guaranteed O(n log n) worst case</b>. Not stable.</p>
<div class="dev">Used by C++ <code>std::sort</code> and .NET's <code>Array.Sort</code>. Go's <code>sort.Sort</code> (since Go 1.19) and <code>slices.Sort</code> use <b>pdqsort</b>, a modern descendant that also spots patterns like sorted runs. It's a circuit breaker for your sort: when things look pathological, fail over to the boring reliable path.</div>` },
        { type: 'mcq', q: 'Why does introsort fall back to heap sort rather than merge sort?',
          choices: ['Heap sort is stable', 'Heap sort is O(n log n) worst case AND in place, matching quicksort\'s memory footprint', 'Heap sort is faster than quicksort on average', 'Merge sort is O(n²) in the worst case'], answer: 1,
          explain: 'Introsort wants to stay in place like quicksort. Heap sort gives the O(n log n) guarantee with O(1) extra memory. Merge sort would need an O(n) buffer.' },
        { type: 'mcq', q: 'Java uses a dual-pivot quicksort for int[] but Timsort for Object[]. Why the difference?',
          choices: ['Objects are always nearly sorted', 'Stability only matters when equal elements are distinguishable — two equal ints are identical, two equal objects may not be', 'Quicksort cannot compare objects', 'Timsort is faster on integers'], answer: 1,
          explain: 'Swapping two 5s changes nothing observable, so primitives can use the faster unstable sort. Objects with equal sort keys can differ in other fields, so the API promises stability.' },
        { type: 'order', q: 'A hybrid sort is handed a random array of 1 million items. Order what typically happens (introsort-style)',
          items: ['Quicksort partitions the large array', 'Partitions shrink as recursion goes deeper', 'Tiny partitions are finished with insertion sort'],
          explain: 'Big picture first (quicksort), then small cleanup (insertion sort). If recursion depth blew past ~2 log n along the way, that partition would switch to heap sort instead.' },
        { type: 'mcq', q: 'You need to sort 300 GB of JSON log lines by timestamp on a box with 32 GB RAM. Best plan?',
          choices: ['Load it all and call sorted()', 'External merge sort — e.g. GNU sort with a buffer size and temp dir', 'Bubble sort, in place, to save memory', 'Heap sort, since it is in place'], answer: 1,
          explain: 'It doesn\'t fit in RAM, so in-memory algorithms are out (in-place won\'t help — the data itself is bigger than RAM). Sort chunks, spill sorted runs, merge them streaming: external merge sort, exactly what GNU sort does.' },
        { type: 'tf', q: 'For everyday code, you should usually call your language\'s built-in sort rather than writing your own.', answer: true,
          explain: 'The built-ins are hybrids tuned for years on real data, handle edge cases, and are heavily tested. Knowing how they work tells you when they\'re stable, when they\'re O(n) on sorted data, and when to reach for something else (top-k heap, external sort, counting sort).' }
      ]
    }
  ]
});

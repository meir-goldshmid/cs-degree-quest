CQ.unit({
  id: 'data-structures',
  order: 7,
  title: 'Data Structures',
  emoji: '🧱',
  color: '#0ea5e9',
  tagline: 'How data is shaped decides how fast your code runs',
  lessons: [
    // ------------------------------------------------------------------
    {
      id: 'arrays',
      title: 'Arrays, Memory & Cache',
      emoji: '📦',
      steps: [
        { type: 'learn', title: 'An array is just a row of boxes', html: `
<p>RAM is one gigantic numbered street of bytes. An <b>array</b> grabs a <b>contiguous</b> stretch of that street and puts same-sized items next to each other.</p>
<p>Because every item is the same size, finding item <code>i</code> is pure arithmetic — no searching:</p>
<div class="formula">address(i) = base + i × size</div>
<p>That is why <code>arr[i]</code> is <b>O(1)</b>: one multiply, one add, one memory read. Whether the array has 10 items or 10 billion.</p>` },
        { type: 'input', q: 'An array of 4-byte ints starts at address 1000. What is the address of arr[5]?', answer: ['1020'], placeholder: 'address',
          explain: '1000 + 5 × 4 = 1020. Index 0 lives at 1000, so index 5 is five boxes further along. (This is also why arrays start at 0: the index is literally the offset.)' },
        { type: 'learn', title: 'The CPU loves neighbours', html: `
<p>The CPU never fetches just one byte from RAM. It pulls a whole <b>cache line</b> (usually 64 bytes) into its tiny, ultra-fast cache. Read <code>arr[0]</code> and you get <code>arr[1..15]</code> (4-byte ints) for free.</p>
<p>This is <b>cache locality</b>. Walking an array front-to-back is absurdly fast because the next item is almost always already in cache — and the hardware prefetcher even guesses what you want next.</p>
<div class="dev">You already know this: it is like batching reads from a slow disk or an S3 bucket. One round trip that brings back a whole page beats 16 tiny round trips. RAM is the "slow remote service" from the CPU's point of view (~100 ns vs ~1 ns for L1 cache).</div>` },
        { type: 'tf', q: 'Two algorithms with the same Big-O can differ hugely in real speed because of cache locality.', answer: true,
          explain: 'Big-O ignores constants, and cache misses are a massive constant (~100× slower than a cache hit). Iterating a contiguous array often beats iterating a linked list of the same length by a wide margin, even though both are O(n).' },
        { type: 'learn', title: 'Dynamic arrays: the growable trick', html: `
<p>A plain array has a fixed size. But Python's <code>list</code>, Go slices, Java's <code>ArrayList</code> and C++ <code>vector</code> all grow. How?</p>
<ol><li>Allocate some spare <b>capacity</b>.</li><li>Append into the spare space: O(1).</li><li>When full, allocate a <b>bigger</b> block (typically 1.5×–2×), copy everything over, free the old one.</li></ol>
<p>The copy is O(n), but it happens so rarely that the <b>amortized</b> cost per append is still <b>O(1)</b>.</p>
<div class="dev">This is like capacity planning with headroom: you don't add one node every time traffic grows by one request. You double the node pool occasionally, and the cost of that big move is spread over all the growth it absorbs.</div>` },
        { type: 'mcq', q: 'Why does doubling capacity give amortized O(1) appends, while growing by +1 each time does not?',
          choices: ['Doubling uses less memory', 'With doubling, total copy work for n appends is at most about 2n; with +1 it is about n²/2', 'Doubling avoids copying entirely', 'The CPU cache makes the copies free'], answer: 1,
          explain: 'Doubling: copies of 1 + 2 + 4 + … + n < 2n items in total, so ~2 copies per append on average. Growing by +1 copies 1 + 2 + 3 + … + n ≈ n²/2 items — O(n) per append on average.' },
        { type: 'mcq', q: 'You have a dynamic array of 1 million items. Which operation is O(n)?',
          choices: ['Read arr[500000]', 'Append to the end (amortized)', 'Insert a new item at index 0', 'Overwrite arr[0]'], answer: 2,
          explain: 'Inserting at the front means shifting all 1 million items one slot to the right. Reading, overwriting, and (amortized) appending at the end are all O(1).' },
        { type: 'order', q: 'Order these from FASTEST to SLOWEST typical access latency',
          items: ['CPU L1 cache', 'Main memory (RAM)', 'NVMe SSD read', 'Network round trip to another region'],
          explain: 'Roughly: L1 ~1 ns, RAM ~100 ns, NVMe SSD ~10–100 µs, cross-region network ~50–150 ms. Each step is orders of magnitude slower — the famous "latency numbers every programmer should know".' },
        { type: 'tf', q: 'Accessing arr[i] in an array gets slower as the array gets bigger, because the computer has to walk to position i.', answer: false,
          explain: 'No walking! The address is computed directly: base + i × size. That is the whole superpower of arrays — O(1) random access.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'linked-lists',
      title: 'Linked Lists',
      emoji: '🔗',
      steps: [
        { type: 'learn', title: 'A treasure hunt in memory', html: `
<p>A <b>linked list</b> stores each item in its own little <b>node</b>, anywhere in memory. Each node holds a value plus a <b>pointer</b> to the next node.</p>
<svg viewBox="0 0 300 60" width="100%" style="max-width:320px" fill="none" stroke="currentColor">
<rect x="5" y="15" width="50" height="30" rx="5"/><text x="22" y="35" fill="currentColor" stroke="none" font-size="13">7</text>
<rect x="85" y="15" width="50" height="30" rx="5"/><text x="102" y="35" fill="currentColor" stroke="none" font-size="13">3</text>
<rect x="165" y="15" width="50" height="30" rx="5"/><text x="180" y="35" fill="currentColor" stroke="none" font-size="13">42</text>
<line x1="55" y1="30" x2="83" y2="30" stroke="var(--accent)" stroke-width="2"/><line x1="135" y1="30" x2="163" y2="30" stroke="var(--accent)" stroke-width="2"/><line x1="215" y1="30" x2="243" y2="30" stroke="var(--accent)" stroke-width="2"/>
<text x="248" y="35" fill="currentColor" stroke="none" font-size="12">null</text></svg>
<p>To find item #500 you must follow 500 pointers, one by one. Like a treasure hunt where each clue tells you where the next clue is.</p>` },
        { type: 'mcq', q: 'In a singly linked list of n nodes, what is the cost of reading the i-th item?',
          choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2,
          explain: 'You have to start at the head and follow pointers i times. In the worst case that is n hops: O(n). No arithmetic shortcut like arrays have.' },
        { type: 'learn', title: 'So why would anyone use one?', html: `
<p>Because <b>inserting or removing</b> is cheap once you are standing at the right spot: just rewire a pointer or two. No shifting of millions of items.</p>
<pre><code>// insert X after node A
X.next = A.next
A.next = X      // O(1), done</code></pre>
<p>Inserting at the <b>head</b> is always O(1). A <b>doubly</b> linked list adds a <code>prev</code> pointer, so you can also remove a node in O(1) when you hold a reference to it.</p>
<div class="dev">You already know this: the Linux kernel is full of intrusive doubly linked lists (<code>struct list_head</code>) — process lists, wait queues, and more. And an <b>LRU cache</b> (think Redis eviction, or your CDN) is classically a hash map + doubly linked list: move a hit to the front in O(1), evict from the tail in O(1).</div>` },
        { type: 'tf', q: 'Inserting a new node at the head of a singly linked list is O(1), no matter how long the list is.', answer: true,
          explain: 'New node points to the old head, head now points to the new node. Two pointer writes, regardless of length.' },
        { type: 'learn', title: 'The hidden cost: pointer chasing', html: `
<p>Linked list nodes are scattered around memory. Every hop is a potential <b>cache miss</b> (~100 ns), while an array walk mostly hits the cache (~1 ns).</p>
<p>Plus each node carries pointer overhead: on 64-bit systems that is 8 bytes per pointer — often bigger than the value itself!</p>
<div class="callout">In practice: default to a dynamic array. Reach for a linked list when you need O(1) splicing in the middle with a node already in hand, or stable node addresses.</div>
<div class="fun">🤓 Fun fact: Bjarne Stroustrup (creator of C++) famously showed that for "insert at random sorted position" workloads, <code>vector</code> beats <code>list</code> even though the list does "less work" — because finding the spot dominates and arrays crush pointer chasing.</div>` },
        { type: 'mcq', q: 'You need an LRU cache: O(1) lookup by key AND O(1) "move this entry to most-recently-used". What is the classic design?',
          choices: ['A sorted array', 'A hash map pointing into a doubly linked list', 'A single singly linked list', 'A binary search tree only'], answer: 1,
          explain: 'The hash map finds the node in O(1); the doubly linked list lets you unlink it and move it to the front in O(1), and evict from the tail in O(1). This is the textbook (and interview-favourite) LRU.' },
        { type: 'order', q: 'Order the steps to insert a new node X right after node A in a singly linked list',
          items: ['Create node X with its value', 'Set X.next = A.next', 'Set A.next = X'],
          explain: 'Order matters! If you set A.next = X first, you lose the only pointer to the rest of the list — the classic "I just leaked half my list" bug.' },
        { type: 'mcq', q: 'Which workload is the WORST fit for a linked list?',
          choices: ['A job queue where you add at the tail and remove from the head', 'Random access by index, like binary search', 'Splicing one list into the middle of another', 'An undo history where you push and pop at one end'], answer: 1,
          explain: 'Binary search needs to jump straight to the middle — O(1) in an array, O(n) in a linked list. The other workloads only touch the ends or a node you already hold.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'stacks-queues',
      title: 'Stacks & Queues',
      emoji: '🥞',
      steps: [
        { type: 'learn', title: 'Two rules for waiting in line', html: `
<p>Both are just lists with a <b>rule</b> about which end you use:</p>
<ul><li><b>Stack</b> — LIFO, Last In First Out. Like a stack of pancakes: push on top, pop from top.</li>
<li><b>Queue</b> — FIFO, First In First Out. Like the line at a coffee shop: join at the back, leave from the front.</li></ul>
<p>All the main operations (push, pop, enqueue, dequeue, peek) are <b>O(1)</b>.</p>
<div class="dev">You already know this: a message queue (SQS, RabbitMQ, a Kafka partition) is FIFO. Your terminal's <code>Ctrl+Z</code> undo history and <code>pushd</code>/<code>popd</code> are stacks.</div>` },
        { type: 'mcq', q: 'Push 1, push 2, push 3, then pop. What comes out of a STACK?',
          choices: ['1', '2', '3'], answer: 2,
          explain: 'Last In, First Out — 3 was the last thing pushed, so it pops first.' },
        { type: 'input', q: 'Enqueue A, B, C, then dequeue twice into a QUEUE. Which letter is the second one dequeued?', answer: ['B', 'b'], placeholder: 'letter',
          explain: 'First In, First Out: A leaves first, then B. C is still waiting.' },
        { type: 'learn', title: 'The call stack', html: `
<p>Every time a function is called, the runtime pushes a <b>stack frame</b> (local variables + return address). When it returns, the frame is popped. That is <i>the</i> stack in "stack trace".</p>
<pre><code>main()
 └ handleRequest()
    └ parseJson()
       └ parseValue()   ← top of stack</code></pre>
<p>Recurse too deep and you run out of stack space: <b>stack overflow</b>. Default thread stacks are small (often 1–8 MB), which is why a runaway recursion crashes fast.</p>
<div class="dev">A stack trace in your Sentry/Datadog error is literally a dump of the call stack, top frame first — the most recently called function is where it blew up.</div>` },
        { type: 'tf', q: 'The frame on top of the call stack belongs to the function that is currently executing.', answer: true,
          explain: 'The latest call is always on top; when it returns, its frame pops and its caller resumes. (Fun quirk: Python prints tracebacks with "most recent call last", i.e. upside down — and kindly tells you so.)' },
        { type: 'learn', title: 'Queues power BFS, stacks power DFS', html: `
<p>Exploring a graph (a network, a dependency tree, a website's links)?</p>
<ul><li>Use a <b>queue</b> → <b>Breadth-First Search</b>: visit all neighbours at distance 1, then distance 2… Finds shortest paths in unweighted graphs.</li>
<li>Use a <b>stack</b> → <b>Depth-First Search</b>: dive down one path as far as possible, then backtrack.</li></ul>
<p>Same loop, different container. Try it:</p>` },
        { type: 'widget', widget: 'graph', title: 'BFS vs DFS', html: '<p>Step through BFS (queue) and DFS (stack). Watch how the container decides the visit order.</p>' },
        { type: 'mcq', q: 'You want to find the minimum number of network hops between two hosts (all links equal). Which traversal?',
          choices: ['DFS with a stack', 'BFS with a queue', 'Either gives the shortest path', 'Neither can do it'], answer: 1,
          explain: 'BFS explores in rings of increasing distance, so the first time it reaches the target is via a shortest path (in hop count). DFS may wander down a long path first.' },
        { type: 'mcq', q: 'Which tool checks that brackets like ( [ { } ] ) are balanced in one pass?',
          choices: ['A queue', 'A stack', 'A hash table', 'A heap'], answer: 1,
          explain: 'Push every opener; on each closer, pop and check it matches. The most recently opened bracket must close first — LIFO. Every linter and JSON parser does a version of this.' },
        { type: 'tf', q: 'A queue can be implemented efficiently with a circular buffer (an array where head and tail wrap around).', answer: true,
          explain: 'A ring buffer gives O(1) enqueue/dequeue with great cache locality. The Linux kernel, network card RX/TX rings, and log buffers all use them.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'hash-tables',
      title: 'Hash Tables',
      emoji: '#️⃣',
      steps: [
        { type: 'learn', title: 'The most useful data structure ever', html: `
<p>A <b>hash table</b> (dict, map, object, HashMap) gives you key → value lookups in <b>O(1) on average</b>. The trick:</p>
<ol><li>Run the key through a <b>hash function</b> → a big number.</li>
<li>Take it <code>mod</code> the number of buckets → a bucket index.</li>
<li>Store/find the value in that bucket — which lives in an array, so it is O(1) to jump to.</li></ol>
<div class="formula">bucket = hash(key) mod m</div>
<div class="dev">You already know this: Redis is basically a giant hash table over the network. So is your service-discovery cache, your nginx <code>map</code> block, and every JSON object you've ever parsed.</div>` },
        { type: 'widget', widget: 'hash', title: 'Hash some keys', html: '<p>Type keys like <code>alice</code>, <code>bob</code>, <code>pod-7</code>… and watch which bucket they land in. Keep going until two keys collide!</p>' },
        { type: 'learn', title: 'Collisions are inevitable', html: `
<p>Infinite possible keys, finite buckets — two keys <i>will</i> land in the same bucket. That is a <b>collision</b>. Two classic fixes:</p>
<ul><li><b>Chaining</b>: each bucket holds a small list of entries (what the widget does). Java's HashMap does this (and turns long chains into trees).</li>
<li><b>Open addressing</b>: if the bucket is taken, probe the next free slot. Python's dict and Go's newer maps work this way.</li></ul>
<p>Either way, if everything collides into one bucket, a lookup degrades to scanning a list: <b>O(n) worst case</b>.</p>
<div class="fun">🤓 Fun fact: in 2011, "hash flooding" attacks sent web servers POST bodies with thousands of keys crafted to collide, turning each request into O(n²) work. That's why Python, Ruby, Perl & co. now randomize their hash seed per process.</div>` },
        { type: 'mcq', q: 'What are the average and worst-case lookup costs of a hash table?',
          choices: ['O(1) average, O(1) worst', 'O(1) average, O(n) worst', 'O(log n) average, O(n) worst', 'O(n) average, O(n) worst'], answer: 1,
          explain: 'With a good hash function and resizing, buckets stay tiny → O(1) average. If everything collides (bad hash or attacker), you are scanning one long chain → O(n).' },
        { type: 'learn', title: 'Load factor & resizing', html: `
<p>The <b>load factor</b> is how full the table is:</p>
<div class="formula">α = n / m  (entries / buckets)</div>
<p>As α grows, collisions grow. So tables <b>resize</b> past a threshold — Java's HashMap at 0.75, Python's dict around 2/3 — typically doubling the buckets and <b>rehashing</b> every key into its new home. Like dynamic arrays: an occasional O(n) step, amortized O(1).</p>
<div class="dev">Redis does this <i>incrementally</i>: it keeps two tables during a resize and migrates a few buckets per operation, so a giant rehash never causes a latency spike. Very SRE-friendly design.</div>` },
        { type: 'input', q: 'A hash table has 16 buckets and 12 entries. What is its load factor? (decimal)', answer: ['0.75', '.75', '3/4'], placeholder: 'e.g. 0.5',
          explain: '12 / 16 = 0.75 — exactly the point at which Java\'s HashMap would double to 32 buckets.' },
        { type: 'learn', title: 'Consistent hashing (teaser)', html: `
<p>Sharding keys across servers with <code>hash(key) mod N</code> works… until N changes. Go from 4 to 5 cache servers and about <b>80%</b> of keys suddenly map to a different server. Cache stampede! 🔥</p>
<p><b>Consistent hashing</b> puts servers and keys on a ring; each key goes to the next server clockwise. Adding a server only steals keys from its neighbour — roughly <b>1/N</b> of keys move.</p>
<div class="dev">You've met this: nginx <code>hash $request_uri consistent;</code>, Envoy's ring hash / Maglev load balancers, memcached client libraries (ketama), Cassandra and DynamoDB partitioning.</div>` },
        { type: 'tf', q: 'With plain "hash(key) mod N" sharding, adding one server usually remaps most of the keys.', answer: true,
          explain: 'A key stays put only if hash mod N equals hash mod (N+1), which is true for only about 1/(N+1) of keys. Going from 4 to 5 servers, ~80% move. Consistent hashing fixes this.' },
        { type: 'mcq', q: 'Which job is a hash table BAD at?',
          choices: ['Checking whether a user ID was already seen', 'Counting requests per IP address', 'Listing all keys between "user_100" and "user_200" in sorted order', 'Caching computed results by input'], answer: 2,
          explain: 'Hashing deliberately scatters keys, so there is no order to exploit — a range query means scanning everything. Ordered structures (BSTs, B-trees, sorted arrays) are built for ranges.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'trees-bst',
      title: 'Trees & Binary Search Trees',
      emoji: '🌳',
      steps: [
        { type: 'learn', title: 'Trees: hierarchy, upside down', html: `
<p>A <b>tree</b> is nodes connected parent → children, with one <b>root</b> at the top and no cycles. Nodes without children are <b>leaves</b>. The <b>height</b> is the longest root-to-leaf path.</p>
<div class="dev">You live in trees: the filesystem (<code>/</code> is the root), the DOM, JSON documents, DNS (<code>.</code> → <code>com</code> → <code>example</code>), Kubernetes ownerReferences (Deployment → ReplicaSet → Pod), and your org chart.</div>
<p>A <b>binary tree</b> is one where each node has at most 2 children: left and right.</p>` },
        { type: 'learn', title: 'Binary Search Tree: sorted by shape', html: `
<p>A <b>BST</b> keeps one rule at <i>every</i> node: everything in the left subtree is smaller, everything in the right subtree is larger.</p>
<svg viewBox="0 0 240 130" width="100%" style="max-width:280px" fill="none" stroke="currentColor">
<line x1="120" y1="22" x2="65" y2="62"/><line x1="120" y1="22" x2="175" y2="62"/><line x1="65" y1="62" x2="35" y2="105"/><line x1="65" y1="62" x2="95" y2="105"/><line x1="175" y1="62" x2="205" y2="105"/>
<circle cx="120" cy="22" r="15" fill="var(--accent)" fill-opacity="0.2"/><circle cx="65" cy="62" r="15"/><circle cx="175" cy="62" r="15"/><circle cx="35" cy="105" r="15"/><circle cx="95" cy="105" r="15"/><circle cx="205" cy="105" r="15"/>
<g fill="currentColor" stroke="none" font-size="12" text-anchor="middle"><text x="120" y="26">50</text><text x="65" y="66">30</text><text x="175" y="66">70</text><text x="35" y="109">20</text><text x="95" y="109">40</text><text x="205" y="109">80</text></g></svg>
<p>Searching for 40: 40 &lt; 50 → go left; 40 &gt; 30 → go right; found! Each comparison throws away a whole subtree — binary search, baked into a data structure.</p>` },
        { type: 'mcq', q: 'In the tree above, you insert 45. Where does it go?',
          choices: ['Left child of 40', 'Right child of 40', 'Right child of 30, replacing 40', 'Left child of 70'], answer: 1,
          explain: '45 < 50 → left to 30. 45 > 30 → right to 40. 45 > 40 → right of 40, which is empty, so it lands there.' },
        { type: 'learn', title: 'In-order traversal = sorted output', html: `
<p>Visit <b>left subtree, then the node, then right subtree</b>, recursively. On a BST this spits out the keys in sorted order — for free.</p>
<pre><code>def in_order(node):
    if node is None: return
    in_order(node.left)
    print(node.key)
    in_order(node.right)</code></pre>
<p>That is why ordered maps (Java <code>TreeMap</code>, C++ <code>std::map</code>) can answer range queries like "all keys from 30 to 60" efficiently, which a hash table can't.</p>` },
        { type: 'order', q: 'What is the in-order traversal of the tree above (50 root, 30 & 70, then 20, 40, 80)?',
          items: ['20', '30', '40', '50', '70', '80'],
          explain: 'Left subtree of 50 gives 20, 30, 40; then 50; then the right subtree gives 70, 80. Sorted, as promised.' },
        { type: 'learn', title: 'Balanced vs degenerate', html: `
<p>Search cost = tree height. A nicely <b>balanced</b> tree with n nodes has height ≈ log₂ n. A million keys? About 20 levels. 🚀</p>
<p>But insert keys <b>already in sorted order</b> (1, 2, 3, 4…) into a naive BST: each one goes to the right of the last. You get a "tree" that is really a linked list — height n, search O(n). 🐌</p>
<p><b>Self-balancing</b> trees (AVL, red-black) do small rotations on insert/delete to keep height O(log n) guaranteed.</p>
<div class="dev">Linux's CFS process scheduler kept runnable tasks in a red-black tree ordered by virtual runtime; the leftmost node is the next task to run. Auto-increment IDs are exactly the kind of sorted input that would wreck a naive BST.</div>` },
        { type: 'tf', q: 'Inserting the keys 1, 2, 3, …, n in order into a plain (non-balancing) BST produces a tree of height about log₂ n.', answer: false,
          explain: 'Each new key is larger than everything so far, so it always goes right. The result is a straight chain of height n — a linked list wearing a tree costume.' },
        { type: 'input', q: 'About how many levels deep is a balanced BST holding ~1,000,000 keys? (nearest whole number)', answer: ['20', 'twenty'], placeholder: 'levels',
          explain: '2²⁰ = 1,048,576 ≈ 1 million, so log₂(1,000,000) ≈ 20. A lookup needs only ~20 comparisons.' },
        { type: 'mcq', q: 'Why use a balanced BST instead of a hash table?',
          choices: ['It has faster average lookups', 'It keeps keys ordered, enabling range queries, min/max and "next key after X"', 'It uses no pointers', 'It never needs comparisons'], answer: 1,
          explain: 'Hash tables win on raw average lookups (O(1) vs O(log n)), but trees keep order. Need sorted iteration or ranges? Trees.' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'heaps',
      title: 'Heaps & Priority Queues',
      emoji: '⛰️',
      steps: [
        { type: 'learn', title: 'Always know who\'s most important', html: `
<p>A <b>priority queue</b> is a queue where the item that comes out next is the one with the highest (or lowest) priority — not the oldest.</p>
<p>The classic implementation is a <b>binary heap</b>: a binary tree where every parent is ≤ its children (a <b>min-heap</b>). So the smallest item is always at the root.</p>
<ul><li>Peek min: <b>O(1)</b></li><li>Insert: <b>O(log n)</b></li><li>Pop min: <b>O(log n)</b></li></ul>
<div class="dev">You already know this: kube-scheduler keeps pending pods in a priority queue (higher PriorityClass first). Go's runtime and libuv (under Node.js) keep pending timers in heaps to know which timeout fires next.</div>` },
        { type: 'tf', q: 'In a min-heap, the items are fully sorted from left to right.', answer: false,
          explain: 'Only the parent ≤ child rule holds. Siblings and cousins can be in any order. This weaker promise is exactly what makes heaps cheaper to maintain than a fully sorted structure.' },
        { type: 'learn', title: 'A tree hiding inside an array', html: `
<p>Heaps are always <b>complete</b> trees (filled level by level, left to right), so they pack perfectly into an array — no pointers needed! For 0-based index <code>i</code>:</p>
<pre><code>parent(i) = (i - 1) // 2
left(i)   = 2*i + 1
right(i)  = 2*i + 2</code></pre>
<p><b>Insert</b>: put the item at the end, then <b>sift up</b> (swap with parent while smaller).<br><b>Pop</b>: take the root, move the last item to the root, then <b>sift down</b> (swap with the smaller child while bigger). Each walks one root-to-leaf path: O(log n).</p>` },
        { type: 'input', q: 'In a 0-indexed array heap, what is the index of the parent of the node at index 9?', answer: ['4', 'four'], placeholder: 'index',
          explain: '(9 − 1) // 2 = 8 // 2 = 4. Check: left(4) = 9. ✔' },
        { type: 'mcq', q: 'Min-heap array: [2, 5, 3, 9, 7]. You pop the min. What is the root afterwards?',
          choices: ['5', '3', '7', '9'], answer: 1,
          explain: 'Remove 2, move the last item (7) to the root: [7, 5, 3, 9]. Sift down: the smaller child of 7 is 3, swap → [3, 5, 7, 9]. Root is 3 — the next smallest, as it should be.' },
        { type: 'learn', title: 'Top-k: the SRE\'s favourite trick', html: `
<p>"Show me the 10 slowest endpoints out of 50 million log lines." Sorting everything is O(n log n) and needs all the data in memory.</p>
<p>Instead keep a <b>min-heap of size k</b>. For each item: if it beats the heap's root (the smallest of your current top-k), pop the root and push the new item.</p>
<div class="formula">O(n log k) time, O(k) memory</div>
<p>With k = 10, log k is tiny — basically a single streaming pass. Works on a stream you can never hold in memory.</p>
<div class="dev">This is how "top talkers" in network monitoring and "top N queries" in pg_stat_statements-style dashboards can be computed in a streaming way.</div>` },
        { type: 'mcq', q: 'To find the k LARGEST items in a stream, which heap do you keep?',
          choices: ['A max-heap of all items', 'A min-heap of size k', 'A max-heap of size k', 'No heap — sort the stream'], answer: 1,
          explain: 'The min-heap\'s root is the smallest of your current top-k — the "bouncer". Anything bigger kicks it out. A max-heap of size k would put the wrong item at the door.' },
        { type: 'tf', q: 'Building a heap from n unsorted items can be done in O(n), faster than n separate inserts.', answer: true,
          explain: 'Bottom-up "heapify" sifts down from the last parent to the root. Most nodes are near the bottom and barely move, so the total work sums to O(n), not O(n log n).' },
        { type: 'order', q: 'Order by time complexity on a binary heap with n items, cheapest first',
          items: ['Peek at the min', 'Insert one item', 'Build a heap from n items', 'Sort all items by popping repeatedly'],
          explain: 'Peek O(1) < insert O(log n) < build O(n) < pop-everything O(n log n). (That last one is heap sort — coming in the next unit!)' }
      ]
    },
    // ------------------------------------------------------------------
    {
      id: 'tries-btrees',
      title: 'Tries, B-trees & Bloom Filters',
      emoji: '🗄️',
      steps: [
        { type: 'learn', title: 'Tries: trees of prefixes', html: `
<p>A <b>trie</b> (from re<i>trie</i>val) stores strings character by character. Each edge is a letter; words sharing a prefix share a path.</p>
<p>Lookup cost is <b>O(L)</b> where L is the key length — independent of how many keys are stored! And "everything starting with <code>kube</code>" is just one subtree.</p>
<div class="dev">You already know this: HTTP routers like Go's httprouter/Gin use radix trees (compressed tries) for <code>/api/v1/pods/:name</code>. Linux's IPv4 routing table (fib_trie) is a trie doing longest-prefix match on CIDR blocks. Shell tab-completion is a trie query.</div>` },
        { type: 'mcq', q: 'A router must find the most specific CIDR route for 10.1.2.3 among 10.0.0.0/8, 10.1.0.0/16 and 10.1.2.0/24. Which structure is built for this?',
          choices: ['A hash table on the full IP', 'A trie over the address bits (longest-prefix match)', 'A min-heap of prefix lengths', 'A FIFO queue'], answer: 1,
          explain: 'Walk the trie bit by bit; the deepest matching route seen is the longest prefix — here 10.1.2.0/24. A hash table on exact IPs cannot answer "most specific prefix".' },
        { type: 'learn', title: 'B-trees: trees built for disks', html: `
<p>A binary tree with a billion keys is ~30 levels. If each level is a random <b>disk read</b>, that is 30 slow I/Os per lookup. Ouch.</p>
<p>A <b>B-tree</b> makes each node a whole <b>disk page</b> (Postgres: 8 KB) holding <b>hundreds</b> of sorted keys and child pointers. Huge fanout → tiny height:</p>
<div class="formula">height ≈ log₂₀₀(10⁹) ≈ 4</div>
<p>Plus the top levels are always hot in RAM, so a lookup in a billion-row table is often just 1–2 real disk reads. Keys stay sorted, so range scans (<code>WHERE created_at BETWEEN …</code>) walk neighbouring leaves.</p>
<div class="dev">That is why <code>CREATE INDEX</code> in Postgres gives you a B-tree by default, and MySQL InnoDB stores whole tables as B+trees. Your index is literally this data structure.</div>` },
        { type: 'tf', q: 'B-trees use high fanout (many keys per node) mainly to minimize the number of slow disk/page reads per lookup.', answer: true,
          explain: 'Reading one 8 KB page costs about the same as reading 8 bytes, so you pack as much decision-making as possible into each page. Fewer levels = fewer I/Os.' },
        { type: 'learn', title: 'LSM trees (teaser)', html: `
<p>B-trees update pages <b>in place</b> — random writes. For write-heavy workloads, <b>LSM trees</b> (Log-Structured Merge) flip it: buffer writes in memory, flush them as sorted immutable files (<b>SSTables</b>), and merge (compact) files in the background.</p>
<ul><li>Writes: fast, sequential, append-only.</li><li>Reads: may have to check several files.</li></ul>
<div class="dev">RocksDB, LevelDB, Cassandra, ScyllaDB and many time-series DBs are LSM-based. "Compaction storms" you may have seen on dashboards are the merge step catching up.</div>` },
        { type: 'learn', title: 'Bloom filters: "definitely not" or "maybe"', html: `
<p>An LSM read might check many files. How to skip files that can't contain the key? A <b>Bloom filter</b>: a bit array plus k hash functions.</p>
<ul><li><b>Add</b>: set the k bits the key hashes to.</li><li><b>Query</b>: if <i>any</i> of those k bits is 0 → <b>definitely not present</b>. If all are 1 → <b>maybe present</b>.</li></ul>
<p>Tiny memory (≈10 bits per key for ~1% false positives), zero false negatives.</p>
<div class="dev">Cassandra and RocksDB keep a Bloom filter per SSTable so a read can skip files that definitely don't hold the key. CDNs use them to avoid caching "one-hit wonders".</div>` },
        { type: 'mcq', q: 'A Bloom filter says "maybe present" for key X. What do you know?',
          choices: ['X is definitely in the set', 'X is definitely not in the set', 'X might be in the set — you must check the real data', 'The filter is corrupted'], answer: 2,
          explain: 'All of X\'s bits could have been set by other keys — a false positive. Only a "no" is definitive. So "maybe" means: go do the real (expensive) lookup.' },
        { type: 'tf', q: 'A standard Bloom filter can give false negatives (say "not present" for a key that was added).', answer: false,
          explain: 'Adding a key sets all its bits to 1, and a standard Bloom filter never clears bits. So an added key always finds its bits set. False positives yes, false negatives never. (Which is also why you can\'t delete from a plain Bloom filter.)' },
        { type: 'order', q: 'Order the lookups by how many disk page reads they need for a billion-row table, FEWEST first',
          items: ['B-tree index lookup (fanout ~hundreds)', 'Balanced binary tree on disk (one key per node)', 'Full table scan'],
          explain: 'B-tree: ~4 levels (often fewer real reads thanks to caching). Binary tree: ~30 levels. Full scan: every page of the table — potentially millions. This is your EXPLAIN plan in a nutshell.' },
        { type: 'mcq', q: 'Match the job to the structure: "autocomplete all hostnames starting with web-prod-".',
          choices: ['Bloom filter', 'Trie', 'Min-heap', 'Hash table'], answer: 1,
          explain: 'Walk down the trie along "web-prod-", then list everything in that subtree. A hash table scatters keys and can\'t find prefixes without scanning everything.' }
      ]
    }
  ]
});

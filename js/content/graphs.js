CQ.unit({
  id: 'graphs',
  order: 10,
  title: 'Graphs & Graph Algorithms',
  emoji: '🕸️',
  color: '#0ca678',
  tagline: 'Your infrastructure has been a graph this whole time',
  lessons: [
    // ───────────────────────────── Lesson 1 ─────────────────────────────
    {
      id: 'graph-basics',
      title: 'Dots, Lines & Degrees',
      emoji: '🔵',
      steps: [
        {
          type: 'learn', title: 'A graph is dots and lines',
          html: `<p>A <b>graph</b> is a set of <b>vertices</b> (nodes, the dots) and <b>edges</b> (the lines connecting pairs of them). That's it. Nothing to do with bar charts.</p>
<svg viewBox="0 0 210 120" width="100%" style="max-width:260px" font-size="14" text-anchor="middle">
<g stroke="currentColor" stroke-width="2"><line x1="30" y1="25" x2="130" y2="25"/><line x1="30" y1="25" x2="80" y2="95"/><line x1="130" y1="25" x2="80" y2="95"/><line x1="80" y1="95" x2="180" y2="95"/></g>
<g fill="var(--accent)"><circle cx="30" cy="25" r="14"/><circle cx="130" cy="25" r="14"/><circle cx="80" cy="95" r="14"/><circle cx="180" cy="95" r="14"/></g>
<g fill="#fff" font-weight="bold"><text x="30" y="30">A</text><text x="130" y="30">B</text><text x="80" y="100">C</text><text x="180" y="100">D</text></g></svg>
<p>Here: V = {A, B, C, D} and E = {A–B, A–C, B–C, C–D}. We write |V| = 4 and |E| = 4.</p>
<div class="dev">You already live in graphs: microservices (who calls whom), network topology (routers and links), Git commits (parent pointers), Terraform resources (dependencies), social follows, foreign keys between Postgres tables.</div>`
        },
        {
          type: 'learn', title: 'Flavours of graph',
          html: `<ul><li><b>Undirected</b>: edges go both ways. A–B means B–A. (A network cable, a Facebook friendship.)</li>
<li><b>Directed</b> (a digraph): edges have arrows. A→B doesn't imply B→A. (Service A calls service B; you follow someone on X.)</li>
<li><b>Weighted</b>: edges carry a number: latency, cost, distance, bandwidth.</li></ul>
<div class="dev">A service mesh map in Kiali or a Datadog service map is a <b>directed, weighted</b> graph: arrows show call direction, weights show requests/sec or p99 latency.</div>`
        },
        {
          type: 'mcq', q: 'Which is most naturally modelled as a DIRECTED graph?',
          choices: ['Ethernet cables between switches', 'Python modules and the modules they import', 'Two people who are friends on Facebook', 'Roads where every road is two-way'],
          answer: 1,
          explain: `"a imports b" does not mean "b imports a". The relationship has a direction, so it's a directed edge. Cables, mutual friendships and two-way roads are symmetric: undirected.`
        },
        {
          type: 'learn', title: 'Degree',
          html: `<p>The <b>degree</b> of a vertex is how many edges touch it. In the picture above: A has degree 2, B has 2, C has 3, D has 1.</p>
<p>Add them up: 2 + 2 + 3 + 1 = <b>8</b>. Number of edges: <b>4</b>. Coincidence?</p>
<div class="formula">∑ deg(v) = 2 · |E|</div>
<p>This is the <b>handshake lemma</b>: every edge has two ends, so each edge adds exactly 1 to the degree of <i>two</i> vertices. At a party, total handshakes counted per person is twice the number of handshakes.</p>`
        },
        {
          type: 'input', q: 'A network has 10 switches, and the degrees (cable counts) of all switches add up to 30. How many cables are there?',
          answer: ['15', 'fifteen'], placeholder: 'number',
          explain: `Sum of degrees = 2 × edges, so edges = 30 / 2 = 15.`
        },
        {
          type: 'tf', q: 'It is possible to build an undirected graph where exactly 3 vertices have an odd degree.',
          answer: false,
          explain: `The degree sum is 2|E|, always even. Three odd numbers plus any number of even numbers is odd. So the number of odd-degree vertices is always even. A neat corollary of the handshake lemma!`
        },
        {
          type: 'learn', title: 'In-degree and out-degree',
          html: `<p>In a directed graph, each vertex has an <b>in-degree</b> (arrows coming in) and <b>out-degree</b> (arrows going out).</p>
<svg viewBox="0 0 240 120" width="100%" style="max-width:300px" font-size="12" text-anchor="middle">
<defs><marker id="g1arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<g stroke="currentColor" stroke-width="1.8" marker-end="url(#g1arr)"><line x1="52" y1="25" x2="93" y2="25"/><line x1="140" y1="32" x2="182" y2="83"/><line x1="140" y1="22" x2="182" y2="22"/><line x1="52" y1="95" x2="178" y2="95"/></g>
<g fill="var(--accent)"><rect x="4" y="12" width="48" height="26" rx="6"/><rect x="94" y="12" width="46" height="26" rx="6"/><rect x="183" y="10" width="54" height="26" rx="6"/><rect x="4" y="82" width="48" height="26" rx="6"/><rect x="179" y="82" width="46" height="26" rx="6"/></g>
<g fill="#fff" font-weight="bold"><text x="28" y="29">web</text><text x="117" y="29">api</text><text x="210" y="27">cache</text><text x="28" y="99">worker</text><text x="202" y="99">db</text></g></svg>
<p>api: in-degree 1, out-degree 2. db: in-degree 2, out-degree 0.</p>
<div class="dev">High in-degree = lots of things depend on you = huge blast radius. That's your db, your auth service, your DNS. High out-degree = you depend on lots of things = you go down whenever any of them sneezes.</div>
<p>Directed handshake: ∑ in-degrees = ∑ out-degrees = |E|.</p>`
        },
        {
          type: 'mcq', q: 'In the service diagram above, which vertex has the highest in-degree?',
          choices: ['web', 'api', 'db', 'cache'],
          answer: 2,
          explain: `db receives arrows from api and worker: in-degree 2. api and cache have in-degree 1, web and worker have 0.`
        },
        {
          type: 'input', q: 'In a "complete" undirected graph every vertex is connected to every other vertex. How many edges does a complete graph on 6 vertices have?',
          answer: ['15', 'fifteen'], placeholder: 'number',
          explain: `Each of the 6 vertices has degree 5, so the degree sum is 30, and by the handshake lemma |E| = 30 / 2 = 15. In general n(n−1)/2.`
        },
        {
          type: 'learn', title: 'Where it all started',
          html: `<div class="fun">🤓 Fun fact: graph theory began in 1736 when Leonhard Euler proved you can't walk across all seven bridges of Königsberg exactly once. His argument? Degrees! A walk using every edge once needs 0 or 2 vertices of odd degree, and Königsberg had 4.</div>
<p>Same reasoning tells you whether a network tech can trace every cable in a building exactly once without doubling back.</p>`
        },
        {
          type: 'tf', q: 'In a directed graph, the sum of all in-degrees always equals the sum of all out-degrees.',
          answer: true,
          explain: `Every arrow leaves exactly one vertex and enters exactly one vertex, so both sums equal |E|.`
        }
      ]
    },

    // ───────────────────────────── Lesson 2 ─────────────────────────────
    {
      id: 'representations',
      title: 'Storing a Graph in Memory',
      emoji: '🗄️',
      steps: [
        {
          type: 'learn', title: 'Option 1: adjacency list',
          html: `<p>For each vertex, store a list of its neighbours. A dict of lists:</p>
<pre><code>graph = {
  'A': ['B', 'C'],
  'B': ['A', 'C'],
  'C': ['A', 'B', 'D'],
  'D': ['C'],
}</code></pre>
<p>(This is the A-B-C-D graph from the last lesson.) Memory: one entry per vertex plus one per edge-end: <b>O(V + E)</b>.</p>
<div class="dev">This is how most real systems store graphs: a <code>depends_on</code> list on each Terraform resource, the <code>parents</code> list in each Git commit object, the <code>import</code> lines at the top of each Python file.</div>`
        },
        {
          type: 'learn', title: 'Option 2: adjacency matrix',
          html: `<p>A V × V grid: row u, column v is 1 if there's an edge u–v.</p>
<table><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>
<tr><th>A</th><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><th>B</th><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><th>C</th><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><th>D</th><td>0</td><td>0</td><td>1</td><td>0</td></tr></table>
<p>For an undirected graph it's symmetric across the diagonal. For a weighted graph, store the weight instead of 1.</p>
<p>Memory: <b>O(V²)</b> no matter how few edges there are.</p>`
        },
        {
          type: 'input', q: 'How many 1s are in the adjacency matrix above?',
          answer: ['8', 'eight'], placeholder: 'number',
          explain: `Each undirected edge appears twice (row u col v, and row v col u). 4 edges × 2 = 8. Handshake lemma strikes again: the row sums are the degrees.`
        },
        {
          type: 'learn', title: 'Trade-offs',
          html: `<table><tr><th>Operation</th><th>List</th><th>Matrix</th></tr>
<tr><td>Memory</td><td>O(V + E)</td><td>O(V²)</td></tr>
<tr><td>Is u–v an edge?</td><td>O(deg u)</td><td>O(1)</td></tr>
<tr><td>Loop over u's neighbours</td><td>O(deg u)</td><td>O(V)</td></tr></table>
<p>A graph is <b>sparse</b> when E is much smaller than V² (most real graphs!), and <b>dense</b> when E is close to V².</p>
<div class="callout">Sparse → adjacency list. Dense, or you need instant edge lookups → matrix.</div>`
        },
        {
          type: 'mcq', q: 'A social network has 1 billion users with about 200 friends each. Which representation is sane?',
          choices: ['Adjacency matrix', 'Adjacency list', 'Both use about the same memory'],
          answer: 1,
          explain: `A matrix needs 10⁹ × 10⁹ = 10¹⁸ cells: even at 1 bit each that's 125 petabytes. The list stores about 10⁹ × 200 entries: big, but manageable. Very sparse graph → list.`
        },
        {
          type: 'tf', q: 'The adjacency matrix of a directed graph is always symmetric.',
          answer: false,
          explain: `If A→B exists but B→A doesn't, then cell [A][B] = 1 and [B][A] = 0. Only undirected graphs are guaranteed symmetric.`
        },
        {
          type: 'learn', title: 'Graphs in your database',
          html: `<p>In Postgres, the classic way is an <b>edge table</b>: one row per edge.</p>
<pre><code>CREATE TABLE edges (src int, dst int, weight int);
CREATE INDEX ON edges (src);  -- fast "neighbours of src"</code></pre>
<p>That's just an adjacency list, flattened. With the index, "give me u's neighbours" is a quick lookup, and <code>WITH RECURSIVE</code> queries can walk it (yes, recursion again).</p>
<div class="dev">Kubernetes ownerReferences (Pod → ReplicaSet → Deployment) are a graph stored as an edge list on each object. The garbage collector walks those edges to cascade-delete.</div>`
        },
        {
          type: 'mcq', q: 'A 500-node graph where almost every pair of nodes is connected, and your hot loop constantly asks "are u and v connected?". Best choice?',
          choices: ['Adjacency matrix', 'Adjacency list', 'A single sorted array of all vertices'],
          answer: 0,
          explain: `Dense graph (E near V²) plus constant-time edge checks: the matrix's sweet spot. 500 × 500 = 250,000 cells is tiny.`
        },
        {
          type: 'input', q: 'An undirected graph has 100 vertices and 300 edges. In an adjacency list, how many neighbour entries are stored in total across all lists?',
          answer: ['600', 'six hundred'], placeholder: 'number',
          explain: `Each undirected edge u–v is stored twice: v in u's list and u in v's list. 2 × 300 = 600 entries (= the degree sum).`
        }
      ]
    },

    // ───────────────────────────── Lesson 3 ─────────────────────────────
    {
      id: 'bfs-dfs',
      title: 'BFS & DFS: Exploring a Graph',
      emoji: '🔦',
      steps: [
        {
          type: 'learn', title: 'Two ways to explore',
          html: `<p>To visit every vertex reachable from a start vertex, there are two classic strategies:</p>
<ul><li><b>Breadth-first search (BFS)</b>: visit all neighbours first, then their neighbours... ripples spreading on a pond. Uses a <b>queue</b> (FIFO).</li>
<li><b>Depth-first search (DFS)</b>: follow one path as deep as it goes, then back up and try the next branch. A maze explorer with one hand on the wall. Uses a <b>stack</b> (LIFO), or recursion.</li></ul>
<p>Both keep a <b>visited</b> set so they never process a vertex twice (graphs have cycles; trees don't).</p>
<div class="callout">Both run in <b>O(V + E)</b>: every vertex visited once, every edge looked at once (twice if undirected).</div>`
        },
        {
          type: 'learn', title: 'BFS in code',
          html: `<pre><code>from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    while queue:
        u = queue.popleft()          # FIFO
        print(u)
        for v in graph[u]:
            if v not in visited:
                visited.add(v)
                queue.append(v)</code></pre>
<p>Swap <code>deque.popleft()</code> for <code>list.pop()</code> (a stack) and you get an iterative DFS-style traversal. Data structure choice = search strategy.</p>`
        },
        {
          type: 'widget', widget: 'graph', title: 'Step through BFS and DFS',
          html: `<p>Run BFS, then DFS, from the same start. Watch the queue vs the stack, and how BFS fans out level by level while DFS dives down one branch.</p>`
        },
        {
          type: 'learn', title: 'Practice graph',
          html: `<p>Use this graph for the next questions. Neighbours are always visited in alphabetical order.</p>
<svg viewBox="0 0 270 120" width="100%" style="max-width:300px" font-size="14" text-anchor="middle">
<g stroke="currentColor" stroke-width="2"><line x1="30" y1="60" x2="100" y2="25"/><line x1="30" y1="60" x2="100" y2="95"/><line x1="100" y1="25" x2="170" y2="25"/><line x1="100" y1="95" x2="170" y2="95"/><line x1="170" y1="25" x2="240" y2="25"/></g>
<g fill="var(--accent)"><circle cx="30" cy="60" r="14"/><circle cx="100" cy="25" r="14"/><circle cx="100" cy="95" r="14"/><circle cx="170" cy="25" r="14"/><circle cx="170" cy="95" r="14"/><circle cx="240" cy="25" r="14"/></g>
<g fill="#fff" font-weight="bold"><text x="30" y="65">A</text><text x="100" y="30">B</text><text x="100" y="100">D</text><text x="170" y="30">E</text><text x="170" y="100">C</text><text x="240" y="30">F</text></g></svg>
<p>Edges: A–B, A–D, B–E, E–F, D–C.</p>`
        },
        {
          type: 'order', q: 'Starting from A, put the vertices in BFS visit order.',
          items: ['A', 'B', 'D', 'E', 'C', 'F'],
          explain: `Queue: [A] → visit A, enqueue B, D. Visit B, enqueue E. Visit D, enqueue C. Visit E, enqueue F. Visit C. Visit F. Level by level: {A}, {B, D}, {E, C}, {F}.`
        },
        {
          type: 'order', q: 'Now recursive DFS from A (alphabetical neighbours). Put the vertices in visit order.',
          items: ['A', 'B', 'E', 'F', 'D', 'C'],
          explain: `A → B (first neighbour) → E → F, dead end. Back up all the way to A, whose next neighbour is D → C. DFS finishes one branch completely before starting the next.`
        },
        {
          type: 'learn', title: 'BFS finds the fewest hops',
          html: `<p>Because BFS processes vertices in order of distance (all 1-hop, then all 2-hop...), the first time it reaches a vertex is via a <b>shortest path</b> in number of edges.</p>
<div class="dev"><code>traceroute</code> shows you hops. LinkedIn's "2nd-degree connection" is BFS distance 2. A crawler that respects "max depth 3" is BFS with a level limit. And Kubernetes's garbage collector walking ownerReferences? A graph traversal.</div>
<p>DFS doesn't give shortest paths, but it shines for exploring everything, detecting cycles, and topological sorting (coming up).</p>`
        },
        {
          type: 'mcq', q: 'You want the minimum number of service hops from the edge gateway to the payments service. Which traversal?',
          choices: ['BFS', 'DFS', 'Either: both find the shortest path'],
          answer: 0,
          explain: `BFS explores in order of hop count, so the first time it reaches payments is via a minimum-hop path. DFS might wander down a long path first.`
        },
        {
          type: 'tf', q: 'Without a visited set, BFS on a graph with a cycle can loop forever.',
          answer: true,
          explain: `A–B–C–A: from A you queue B, from B you queue C, from C you queue A again... forever. Trees don't need the visited check because they have no cycles; general graphs do.`
        },
        {
          type: 'mcq', q: 'A graph has 1,000 vertices and 5,000 edges, stored as an adjacency list. Roughly how much work does BFS do?',
          choices: ['About 1,000 steps', 'About 6,000 steps (V + E)', 'About 1,000,000 steps (V²)', 'About 5,000,000 steps (V × E)'],
          answer: 1,
          explain: `O(V + E): each vertex is dequeued once and each adjacency entry is scanned once. (With a matrix it would be O(V²), since finding neighbours means scanning a whole row.)`
        }
      ]
    },

    // ───────────────────────────── Lesson 4 ─────────────────────────────
    {
      id: 'shortest-paths',
      title: 'Shortest Paths & Dijkstra',
      emoji: '🗺️',
      steps: [
        {
          type: 'learn', title: 'When edges have weights',
          html: `<p>BFS counts hops. But a path of 3 fast links can beat 1 slow one. With weights, we need <b>Dijkstra's algorithm</b> (1956).</p>
<p>Idea: keep a tentative distance for every vertex (start = 0, others = ∞). Repeatedly:</p>
<ol><li>Pick the <b>unfinished vertex with the smallest distance</b>. It's now final.</li>
<li><b>Relax</b> its outgoing edges: if dist[u] + w(u,v) &lt; dist[v], update dist[v].</li></ol>
<div class="callout">Dijkstra = BFS where the queue is a <b>priority queue</b> (min-heap) ordered by distance. It's a greedy algorithm that's provably correct, as long as no edge weight is negative.</div>`
        },
        {
          type: 'learn', title: 'Run it by hand',
          html: `<svg viewBox="0 0 220 135" width="100%" style="max-width:280px" font-size="13" text-anchor="middle">
<defs><marker id="g4arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
<g stroke="currentColor" stroke-width="1.8" marker-end="url(#g4arr)"><line x1="32" y1="58" x2="96" y2="25"/><line x1="32" y1="76" x2="96" y2="110"/><line x1="110" y1="102" x2="110" y2="34"/><line x1="124" y1="25" x2="188" y2="58"/><line x1="124" y1="110" x2="188" y2="76"/></g>
<g fill="var(--accent)"><circle cx="20" cy="67" r="13"/><circle cx="110" cy="20" r="13"/><circle cx="110" cy="115" r="13"/><circle cx="200" cy="67" r="13"/></g>
<g fill="#fff" font-weight="bold"><text x="20" y="72">A</text><text x="110" y="25">B</text><text x="110" y="120">C</text><text x="200" y="72">D</text></g>
<g fill="currentColor" font-weight="bold"><text x="55" y="33">4</text><text x="55" y="107">1</text><text x="122" y="72">2</text><text x="165" y="33">1</text><text x="165" y="107">5</text></g></svg>
<p>From A: dist A=0, others ∞.</p>
<ol><li>Finalize <b>A</b>(0). Relax: B=4, C=1.</li>
<li>Smallest is <b>C</b>(1). Relax: B = min(4, 1+2) = 3, D = 1+5 = 6.</li>
<li>Smallest is <b>B</b>(3). Relax: D = min(6, 3+1) = 4.</li>
<li>Finalize <b>D</b>(4).</li></ol>`
        },
        {
          type: 'input', q: 'What is the shortest distance from A to D in that graph?',
          answer: ['4', 'four'], placeholder: 'number',
          explain: `A→C→B→D = 1 + 2 + 1 = 4. The direct-looking A→B→D costs 4 + 1 = 5 and A→C→D costs 1 + 5 = 6.`
        },
        {
          type: 'order', q: 'In what order does Dijkstra finalize the vertices of that graph, starting from A?',
          items: ['A (0)', 'C (1)', 'B (3)', 'D (4)'],
          explain: `Always the smallest tentative distance next: A at 0, then C at 1, then B (improved from 4 to 3 via C), then D (improved from 6 to 4 via B).`
        },
        {
          type: 'learn', title: 'Your routers run Dijkstra',
          html: `<div class="dev"><b>OSPF</b> (and IS-IS), the routing protocols inside most data-centre and enterprise networks, are "link-state" protocols: every router floods its links and their costs to everyone, so each router holds the whole graph. Then each one runs <b>Dijkstra</b> (OSPF literally calls it the SPF, "shortest path first", calculation) to build its routing table. When a link flaps, routers re-run SPF. That's what "SPF throttling" timers are about.</div>
<p>Also Dijkstra-flavoured: Google Maps (with heavy speedups like A*), game pathfinding, and latency-aware load balancing ideas.</p>
<p>With a binary heap, Dijkstra runs in <b>O((V + E) log V)</b>.</p>`
        },
        {
          type: 'learn', title: 'Teaser: negative edges break it',
          html: `<p>Dijkstra assumes that once a vertex has the smallest distance, nothing later can improve it. A <b>negative</b> edge breaks that.</p>
<p>Edges: A→B (2), A→C (3), C→B (−2). Dijkstra finalizes B at 2 before it looks at C. But A→C→B = 3 − 2 = <b>1</b>. Wrong answer, confidently delivered.</p>
<p>The fix is <b>Bellman-Ford</b>: relax <i>every</i> edge, V−1 times. Slower, O(V·E), but it handles negative weights and detects <b>negative cycles</b> (where looping forever keeps lowering the cost, so "shortest" is meaningless).</p>
<div class="fun">🤓 Fun fact: RIP, the ancient "distance-vector" routing protocol, is a distributed Bellman-Ford. Negative weights show up in finance: currency arbitrage is literally a negative cycle hunt.</div>`
        },
        {
          type: 'tf', q: 'Dijkstra\'s algorithm always gives correct shortest paths, even if some edge weights are negative.',
          answer: false,
          explain: `It can finalize a vertex too early, before a cheaper route through a negative edge is discovered. Use Bellman-Ford for negative weights.`
        },
        {
          type: 'mcq', q: 'All edges in your graph have the same weight (say 1). What\'s the simplest correct shortest-path algorithm?',
          choices: ['Plain BFS', 'Dijkstra is required', 'Bellman-Ford is required', 'DFS'],
          answer: 0,
          explain: `When every edge costs the same, fewest hops = cheapest path, and BFS finds fewest hops in O(V + E) without a heap.`
        },
        {
          type: 'mcq', q: 'Which data structure makes Dijkstra efficient at "pick the unfinished vertex with the smallest distance"?',
          choices: ['A FIFO queue', 'A stack', 'A min-heap (priority queue)', 'A hash set'],
          answer: 2,
          explain: `A min-heap gives the smallest element in O(log V) per operation. A FIFO queue is BFS, a stack is DFS.`
        }
      ]
    },

    // ───────────────────────────── Lesson 5 ─────────────────────────────
    {
      id: 'dags-topo',
      title: 'DAGs, Topological Sort & Cycles',
      emoji: '🧬',
      steps: [
        {
          type: 'learn', title: 'Directed Acyclic Graphs',
          html: `<p>A <b>DAG</b> is a directed graph with <b>no cycles</b>: follow the arrows from anywhere and you'll never come back to where you started.</p>
<p>DAGs are how the world expresses <b>dependencies</b>:</p>
<ul><li>Terraform: a subnet depends on a VPC (<code>terraform graph</code> literally prints it).</li>
<li>Build systems: Make, Bazel, Docker multi-stage builds.</li>
<li>Airflow and Argo Workflows: an Airflow DAG is exactly this.</li>
<li>CI pipelines: GitHub Actions <code>needs:</code>, GitLab <code>needs:</code>.</li>
<li>Package managers resolving dependencies (apt, npm, pip).</li></ul>`
        },
        {
          type: 'learn', title: 'Git is a DAG',
          html: `<div class="dev">Every Git commit points to its <b>parent(s)</b>. A normal commit has 1 parent, the very first commit has 0, a merge commit has 2 (or more). Arrows always point back in time, so you can never loop back: it's a DAG. Branches are just named pointers into it. <code>git log --graph</code> draws it, and <code>git merge-base</code> finds the nearest common ancestor of two vertices.</div>
<p>Commits are content-addressed: a commit's hash includes its parents' hashes, so creating a cycle would need a commit that contains its own future hash. Practically impossible.</p>`
        },
        {
          type: 'tf', q: 'In a Git repository, a merge commit is a vertex with out-degree 2 or more (if edges point from child to parent).',
          answer: true,
          explain: `A merge commit records two (or more, for an octopus merge) parents, so it has an arrow to each of them.`
        },
        {
          type: 'learn', title: 'Topological sort',
          html: `<p>A <b>topological order</b> lists all vertices so every edge points <i>forward</i>: each thing comes after everything it depends on. It exists <b>if and only if</b> the graph is a DAG.</p>
<p><b>Kahn's algorithm:</b></p>
<ol><li>Count each vertex's in-degree (number of unmet dependencies).</li>
<li>Put every vertex with in-degree 0 in a queue: they're ready.</li>
<li>Pop one, output it, and decrement the in-degree of everything that depended on it. Anything hitting 0 joins the queue.</li>
<li>Repeat. If vertices remain that never hit 0, there's a cycle.</li></ol>
<div class="dev">This is exactly how Terraform plans an apply: everything with no pending dependencies is "ready" and runs in parallel (up to <code>-parallelism=10</code> by default). Airflow schedules tasks the same way.</div>`
        },
        {
          type: 'order', q: 'Terraform resources: the subnet references the VPC, the instance references the subnet, the DNS record references the instance\'s IP. Put them in a valid creation order.',
          items: ['aws_vpc', 'aws_subnet', 'aws_instance', 'aws_route53_record'],
          explain: `Each resource must be created after the one it references. This chain has exactly one topological order. Destroy runs it in reverse!`
        },
        {
          type: 'input', q: 'A DAG has edges A→B, A→C, B→D, C→D. How many different valid topological orders does it have?',
          answer: ['2', 'two'], placeholder: 'number',
          explain: `A must be first and D must be last. B and C don't depend on each other, so either can go first: A,B,C,D or A,C,B,D. Independent vertices = choice = parallelism.`
        },
        {
          type: 'learn', title: 'Cycle detection',
          html: `<p>A cycle in a dependency graph is always bad news:</p>
<ul><li>Terraform: <code>Error: Cycle: aws_security_group.a, aws_security_group.b</code></li>
<li>Python: <code>ImportError: cannot import name ... (most likely due to a circular import)</code></li>
<li>Databases: a <b>deadlock</b>. Transaction T1 waits for a lock held by T2, which waits for T1. Postgres builds a "wait-for" graph and, after <code>deadlock_timeout</code> (1s by default), searches it for a cycle and kills one victim.</li></ul>
<p><b>How to find one with DFS:</b> mark vertices as unvisited, "in progress" (on the current DFS path) or done. If DFS reaches an <b>in-progress</b> vertex, you've found a back edge: a cycle.</p>`
        },
        {
          type: 'mcq', q: 'Kahn\'s algorithm finishes but has output only 5 of 8 vertices. What does that tell you?',
          choices: ['The graph has a cycle', 'The graph is disconnected', 'The graph has negative weights', 'Three vertices have no edges'],
          answer: 0,
          explain: `Vertices on a cycle wait on each other forever, so their in-degree never reaches 0 and they're never output. Disconnected pieces or isolated vertices are fine: isolated vertices start at in-degree 0.`
        },
        {
          type: 'mcq', q: 'Postgres wait-for graph: T1 waits for T2, T2 waits for T3, T3 waits for T1. What is this?',
          choices: ['A DAG, so everything finishes eventually', 'A cycle, so it\'s a deadlock', 'A tree rooted at T1'],
          answer: 1,
          explain: `T1 → T2 → T3 → T1 is a cycle: nobody can proceed. Postgres will abort one transaction with "deadlock detected" to break it.`
        },
        {
          type: 'tf', q: 'Every DAG has at least one vertex with in-degree 0.',
          answer: true,
          explain: `Start anywhere and walk arrows backwards. With no cycles you can't revisit a vertex, and the graph is finite, so you must eventually hit a vertex with no incoming arrows. That's why Kahn's algorithm always has somewhere to start on a DAG.`
        }
      ]
    },

    // ───────────────────────────── Lesson 6 ─────────────────────────────
    {
      id: 'trees-mst',
      title: 'Trees, Spanning Trees & Union-Find',
      emoji: '🌲',
      steps: [
        {
          type: 'learn', title: 'A tree is a special graph',
          html: `<p>In graph terms, a <b>tree</b> is an undirected graph that is <b>connected</b> and has <b>no cycles</b>. Those two facts imply a bunch of others:</p>
<ul><li>A tree with n vertices has exactly <b>n − 1 edges</b>.</li>
<li>There's exactly <b>one path</b> between any two vertices.</li>
<li>Remove any edge and it falls into two pieces. Add any edge and you create exactly one cycle.</li></ul>
<div class="dev">The Linux filesystem (ignoring hard links and symlinks), the DOM, a JSON document, the process tree (<code>pstree</code>): all trees. And spanning-tree protocol (STP) on Ethernet switches exists precisely to turn a looped network into a tree, so broadcast frames can't circle forever.</div>`
        },
        {
          type: 'input', q: 'An office network of 40 switches is wired as a tree (thanks, STP). How many active links does it have?',
          answer: ['39', 'thirty-nine', 'thirty nine'], placeholder: 'number',
          explain: `A tree on n vertices has n − 1 edges: 40 − 1 = 39. Fewer and it can't be connected; more and there must be a cycle.`
        },
        {
          type: 'learn', title: 'Minimum spanning tree',
          html: `<p>You have to cable 4 buildings. Each possible cable has a cost. Connect <b>everyone</b>, as <b>cheaply</b> as possible. The answer is a <b>minimum spanning tree (MST)</b>: a tree touching every vertex with the smallest total weight.</p>
<svg viewBox="0 0 220 130" width="100%" style="max-width:280px" font-size="13" text-anchor="middle">
<g stroke="currentColor" stroke-width="2"><line x1="20" y1="65" x2="110" y2="18"/><line x1="110" y1="18" x2="110" y2="112"/><line x1="20" y1="65" x2="110" y2="112"/><line x1="110" y1="112" x2="200" y2="65"/><line x1="110" y1="18" x2="200" y2="65"/></g>
<g fill="var(--accent)"><circle cx="20" cy="65" r="13"/><circle cx="110" cy="18" r="13"/><circle cx="110" cy="112" r="13"/><circle cx="200" cy="65" r="13"/></g>
<g fill="#fff" font-weight="bold"><text x="20" y="70">A</text><text x="110" y="23">B</text><text x="110" y="117">C</text><text x="200" y="70">D</text></g>
<g fill="currentColor" font-weight="bold"><text x="55" y="33">1</text><text x="121" y="70">2</text><text x="55" y="104">3</text><text x="165" y="104">4</text><text x="165" y="33">5</text></g></svg>
<p>Edges: A–B 1, B–C 2, A–C 3, C–D 4, B–D 5.</p>`
        },
        {
          type: 'learn', title: 'Kruskal\'s algorithm',
          html: `<p>Greedy, and provably optimal:</p>
<ol><li>Sort edges by weight, cheapest first.</li>
<li>Take each edge <b>unless it would create a cycle</b>.</li>
<li>Stop at V − 1 edges.</li></ol>
<p>On the graph above: take A–B (1), take B–C (2), <b>skip</b> A–C (3), since A and C are already connected, take C–D (4). Done: 3 edges for 4 vertices.</p>
<p><b>Prim's algorithm</b> is the other classic: start at one vertex and keep adding the cheapest edge that reaches a new vertex (a priority queue again, like Dijkstra). Both give a minimum total.</p>`
        },
        {
          type: 'input', q: 'What is the total weight of the minimum spanning tree of the A, B, C, D graph?',
          answer: ['7', 'seven'], placeholder: 'number',
          explain: `A–B (1) + B–C (2) + C–D (4) = 7. A–C (3) was skipped because it would close the cycle A–B–C, and B–D (5) was never needed.`
        },
        {
          type: 'learn', title: 'Union-find: "already connected?" in near O(1)',
          html: `<p>Kruskal's key question is "are u and v already in the same group?". The <b>union-find</b> (disjoint-set) structure answers it fast:</p>
<pre><code>parent = {v: v for v in vertices}
def find(x):                 # who is x's group leader?
    while parent[x] != x:
        parent[x] = parent[parent[x]]   # path compression
        x = parent[x]
    return x
def union(a, b):             # merge two groups
    parent[find(a)] = find(b)</code></pre>
<p>Each group is a little tree; <code>find</code> walks to the root. With path compression and "union by rank" (attach the shorter tree under the taller), operations are <b>almost constant time</b> (inverse Ackermann, α(n) ≤ 4 for any n you'll ever meet).</p>`
        },
        {
          type: 'mcq', q: 'In Kruskal\'s algorithm, find(u) == find(v) for the next cheapest edge u–v. What should you do?',
          choices: ['Add the edge', 'Skip the edge: it would create a cycle', 'Stop the algorithm', 'Restart with a different edge order'],
          answer: 1,
          explain: `Same leader means u and v are already connected through edges you picked. Adding u–v would form a cycle, which a tree can't have.`
        },
        {
          type: 'tf', q: 'A minimum spanning tree also gives the shortest path between every pair of vertices.',
          answer: false,
          explain: `Different goals! The MST minimises the TOTAL cable cost. In our example, the MST route from A to D is A–B–C–D = 1 + 2 + 4 = 7, but the shortest path is A–B–D = 1 + 5 = 6, using edge B–D, which isn't even in the MST. For shortest paths, use Dijkstra.`
        }
      ]
    },

    // ───────────────────────────── Lesson 7 ─────────────────────────────
    {
      id: 'graphs-in-the-wild',
      title: 'Components, PageRank & the Real World',
      emoji: '🌍',
      steps: [
        {
          type: 'learn', title: 'Connected components',
          html: `<p>A <b>connected component</b> is a maximal group of vertices that can all reach each other. An undirected graph splits into one or more components.</p>
<p>Counting them: loop over every vertex; if it isn't visited yet, that's a new component, so run BFS/DFS from it to mark its whole group. O(V + E). Or: union every edge with union-find, then count distinct leaders.</p>
<div class="dev">A network partition is your cluster splitting into components. etcd and Consul use Raft so only the component holding a <b>majority</b> of members keeps accepting writes, and the minority side stops. "Is the graph connected?" is the question your monitoring asks when it alerts on a split brain.</div>`
        },
        {
          type: 'input', q: 'Vertices 1 to 7, edges 1–2, 2–3, 4–5. Vertices 6 and 7 have no edges. How many connected components?',
          answer: ['4', 'four'], placeholder: 'number',
          explain: `{1, 2, 3}, {4, 5}, {6}, {7}. An isolated vertex is its own component.`
        },
        {
          type: 'learn', title: 'PageRank: importance as a graph property',
          html: `<p>Google's original insight: the web is a directed graph (pages → links). A page is important if <b>important pages link to it</b>. Circular? Yes, and it still works: iterate until the scores settle.</p>
<p>The "random surfer" model: someone clicks random links forever, and with probability 0.15 (damping factor 0.85) gets bored and jumps to a random page. A page's <b>PageRank</b> is the fraction of time the surfer spends there.</p>
<div class="dev">Same idea finds the "most critical" services in a dependency graph, or the most influential accounts in a social graph. Graph centrality metrics are how you'd spot the hidden single point of failure that nobody drew on the architecture diagram.</div>`
        },
        {
          type: 'mcq', q: 'Page X has 1 incoming link, from a page with a huge PageRank. Page Y has 3 incoming links, from pages nobody links to. Which statement is right?',
          choices: ['Y always ranks higher: more links wins', 'X can rank higher: the importance of who links to you matters, not just the count', 'They always rank equally'],
          answer: 1,
          explain: `PageRank weights each incoming link by the linking page's own rank (split among its outgoing links). One vote from a heavyweight can outweigh several votes from nobodies.`
        },
        {
          type: 'learn', title: 'Routing: graphs all the way down',
          html: `<ul><li><b>OSPF / IS-IS</b> (inside a network): link-state, every router runs Dijkstra.</li>
<li><b>RIP</b>: distance-vector, a distributed Bellman-Ford.</li>
<li><b>BGP</b> (between internet providers): path-vector, picks routes by policy, not just shortest. The internet itself is a graph of tens of thousands of networks (autonomous systems).</li></ul>
<div class="dev">Next time you see "BGP route leak took down half the internet", that's an edge appearing in a graph that shouldn't be there, with traffic dutifully following it.</div>
<div class="fun">🤓 Fun fact: "six degrees of separation" is a claim about BFS distances in the human friendship graph. Facebook measured its graph in 2016: on average, any two users were linked through about 3.5 intermediate people.</div>`
        },
        {
          type: 'mcq', q: 'Match the problem to the tool: "Lay fibre between 12 offices so all are connected at minimum total cost."',
          choices: ['Dijkstra', 'Topological sort', 'Minimum spanning tree (Kruskal/Prim)', 'PageRank'],
          answer: 2,
          explain: `"Connect everything, minimum total cost" is the MST problem exactly. Dijkstra minimises a path from one source, not total cabling.`
        },
        {
          type: 'mcq', q: 'Match the problem to the tool: "Run 200 Airflow tasks, each only after the tasks it needs have finished."',
          choices: ['Topological sort on a DAG', 'BFS for shortest path', 'Union-find', 'Bellman-Ford'],
          answer: 0,
          explain: `Dependencies + "run after prerequisites" = a topological order of the DAG. Airflow's scheduler is a Kahn's-algorithm-style "what's ready now?" loop.`
        },
        {
          type: 'order', q: 'Order these graph algorithms by typical running time on a sparse graph, fastest first.',
          items: ['BFS: O(V + E)', 'Dijkstra with a heap: O((V + E) log V)', 'Bellman-Ford: O(V · E)'],
          explain: `BFS touches everything once. Dijkstra adds a log factor for the heap. Bellman-Ford relaxes every edge up to V−1 times, which is much slower.`
        },
        {
          type: 'tf', q: 'Adding one new edge between two different connected components reduces the number of components by exactly one.',
          answer: true,
          explain: `The edge merges those two components into one and touches nothing else. That's exactly a union() in union-find.`
        }
      ]
    }
  ]
});

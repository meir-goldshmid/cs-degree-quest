CQ.unit({
  id: 'linear-algebra',
  order: 12,
  title: 'Vectors & Matrices',
  emoji: '🧮',
  color: '#2bb3a3',
  tagline: 'The math of embeddings, 3D graphics and neural nets',
  lessons: [
    // ───────────────────────────── Lesson 1 ─────────────────────────────
    {
      id: 'vectors',
      title: 'Vectors: Arrays & Arrows',
      emoji: '➡️',
      steps: [
        { type: 'learn', title: 'A vector is an array (that knows geometry)', html: `
<p>A <b>vector</b> is an ordered list of numbers: <code>[3, 4]</code>. Two numbers = 2D, three = 3D, 1536 numbers = 1536D (yes, really — more on that soon).</p>
<p>You can also draw it as an <b>arrow</b> from the origin: 3 right, 4 up.</p>
<svg viewBox="0 0 120 100" width="150" height="125" style="display:block;margin:auto">
  <line x1="10" y1="90" x2="115" y2="90" stroke="currentColor" stroke-width="0.8"/>
  <line x1="10" y1="90" x2="10" y2="5" stroke="currentColor" stroke-width="0.8"/>
  <line x1="10" y1="90" x2="70" y2="10" stroke="var(--accent)" stroke-width="2.5"/>
  <polygon points="70,10 60,15 67,21" fill="var(--accent)"/>
  <text x="74" y="16" font-size="10" fill="currentColor">[3, 4]</text>
</svg>
<div class="dev">You already know this: a pod's resource request is a vector: <code>[cpu, memory]</code> = <code>[0.5, 512Mi]</code>. Each position has a fixed meaning — order matters, just like columns in a table.</div>` },
        { type: 'learn', title: 'Adding vectors', html: `
<p>Add position by position:</p>
<div class="formula">[1, 2] + [3, 4] = [4, 6]</div>
<p>As arrows: put the second arrow's tail on the first arrow's tip. The sum points to where you end up — like chaining two moves.</p>
<p>Both vectors must have the <b>same length</b> (dimension). <code>[1, 2] + [1, 2, 3]</code> is a type error.</p>` },
        { type: 'mcq', q: 'What is [2, −1] + [3, 5]?', choices: ['[5, 4]', '[6, −5]', '[5, 6]', '[−1, 4]'], answer: 0,
          explain: 'Position by position: 2 + 3 = 5 and −1 + 5 = 4. Result [5, 4].' },
        { type: 'tf', q: 'You can add the vectors [1, 2] and [1, 2, 3].', answer: false,
          explain: 'Vectors must have the same dimension to be added. What would the 3rd position of [1, 2] even be? It is a shape mismatch.' },
        { type: 'learn', title: 'Scaling vectors', html: `
<p>Multiply a vector by a plain number (a <b>scalar</b>) and every entry gets multiplied:</p>
<div class="formula">2 · [3, −1] = [6, −2]</div>
<p>As an arrow: same direction, twice as long. Multiply by −1 and it flips around to point the opposite way.</p>
<div class="dev">You already know this: scaling a Deployment to 3 replicas multiplies the per-pod request vector by 3. That is literally what the scheduler has to fit onto your nodes.</div>` },
        { type: 'input', q: 'What is 3 · [2, 5]? (write it like [a,b])', answer: ['[6,15]', '6,15', '(6,15)', '[6, 15]'], placeholder: '[a,b]',
          explain: '3 × 2 = 6, 3 × 5 = 15. Result [6, 15].' },
        { type: 'mcq', q: 'A pod requests [0.25 CPU, 512 MiB]. What do 3 replicas request in total?', choices: ['[0.75, 512]', '[0.25, 1536]', '[0.75, 1536]', '[3.25, 515]'], answer: 2,
          explain: '3 · [0.25, 512] = [0.75, 1536]. Scale every component.' },
        { type: 'mcq', q: 'What does multiplying a vector by −1 do to its arrow?', choices: ['Rotates it 90°', 'Points it the opposite direction', 'Makes it length 1', 'Nothing'], answer: 1,
          explain: 'Every component flips sign, so the arrow points exactly the other way with the same length.' }
      ]
    },
    // ───────────────────────────── Lesson 2 ─────────────────────────────
    {
      id: 'norm-dot',
      title: 'Length & the Dot Product',
      emoji: '📏',
      steps: [
        { type: 'learn', title: 'Length (norm)', html: `
<p>How long is the arrow [3, 4]? It's the hypotenuse of a 3-by-4 right triangle — Pythagoras:</p>
<div class="formula">‖[3, 4]‖ = √(3² + 4²) = √25 = 5</div>
<p>In any dimension: square every entry, add them up, take the square root. This is called the <b>norm</b> (or L2 norm, Euclidean length).</p>` },
        { type: 'input', q: 'What is the length of [6, 8]?', answer: ['10'], placeholder: 'number',
          explain: '√(36 + 64) = √100 = 10. (It is the 3-4-5 triangle, doubled.)' },
        { type: 'mcq', q: 'What is the length of [1, 2, 2]?', choices: ['5', '3', '√5', '9'], answer: 1,
          explain: '√(1 + 4 + 4) = √9 = 3. Same recipe in 3D.' },
        { type: 'learn', title: 'The dot product', html: `
<p>Multiply matching positions, then add everything up:</p>
<div class="formula">[1, 2, 3] · [4, 5, 6] = 4 + 10 + 18 = 32</div>
<p>Two vectors in, <b>one number</b> out.</p>
<div class="dev">You already know this: a weighted score. Alert severity = [errors, latency, saturation] · [5, 2, 1]. Every "multiply these by those weights and sum" in your code is a dot product in disguise.</div>` },
        { type: 'input', q: 'What is [2, 3] · [4, −1]?', answer: ['5'], placeholder: 'number',
          explain: '2 × 4 + 3 × (−1) = 8 − 3 = 5.' },
        { type: 'learn', title: 'What the dot product means', html: `
<div class="formula">a · b = ‖a‖ · ‖b‖ · cos θ</div>
<p>θ is the angle between the arrows. So the dot product measures how much two vectors <b>point the same way</b>:</p>
<ul>
<li>Same direction → large positive</li>
<li>Perpendicular (90°) → <b>0</b> (cos 90° = 0)</li>
<li>Opposite-ish (more than 90°) → negative</li>
</ul>` },
        { type: 'tf', q: '[1, 0] · [0, 1] = 0, which means the two vectors are perpendicular.', answer: true,
          explain: '1·0 + 0·1 = 0. The x-axis and y-axis are at 90°, and cos 90° = 0.' },
        { type: 'mcq', q: 'Two non-zero vectors have an angle of 120° between them. Their dot product is…', choices: ['Positive', 'Zero', 'Negative', 'Undefined'], answer: 2,
          explain: 'cos 120° = −0.5, which is negative, and lengths are positive. So the dot product is negative: they point mostly away from each other.' }
      ]
    },
    // ───────────────────────────── Lesson 3 ─────────────────────────────
    {
      id: 'cosine-similarity',
      title: 'Cosine Similarity & Embeddings',
      emoji: '🧲',
      steps: [
        { type: 'learn', title: 'Similarity = angle', html: `
<p>Rearrange the dot product formula to get just the angle part:</p>
<div class="formula">cos θ = (a · b) / (‖a‖ · ‖b‖)</div>
<p>This is <b>cosine similarity</b>. It ranges from −1 (opposite) through 0 (unrelated) to 1 (same direction). It ignores length, caring only about <b>direction</b>.</p>` },
        { type: 'mcq', q: 'What is the cosine similarity of [1, 1] and [2, 2]?', choices: ['0', '0.5', '1', '2'], answer: 2,
          explain: 'Same direction, different length. Dot = 4, lengths √2 and √8, product √16 = 4. 4/4 = 1.' },
        { type: 'learn', title: 'Embeddings: meaning as direction', html: `
<p>An <b>embedding model</b> turns text (or images, code…) into a vector of, say, 768 or 1536 numbers. It is trained so that things with <b>similar meaning point in similar directions</b>.</p>
<p>"pod keeps restarting" and "container in CrashLoopBackOff" end up with high cosine similarity even though they share almost no words.</p>
<div class="dev">You already know this (or will soon): semantic search over runbooks and postmortems. Store embeddings in Postgres with <b>pgvector</b> and query with <code>ORDER BY embedding &lt;=&gt; query_embedding LIMIT 5</code> — <code>&lt;=&gt;</code> is pgvector's cosine distance (1 − cosine similarity).</div>` },
        { type: 'input', q: 'What is the cosine similarity of [1, 0] and [0, 5]?', answer: ['0', 'zero'], placeholder: 'number',
          explain: 'Dot product is 1·0 + 0·5 = 0, so cos θ = 0. They are perpendicular — "unrelated" in embedding-speak.' },
        { type: 'tf', q: 'The cosine similarity of [1, 2] and [−1, −2] is −1.', answer: true,
          explain: 'One is exactly the negative of the other: opposite directions, angle 180°, cos 180° = −1.' },
        { type: 'learn', title: 'Vector databases', html: `
<p>Comparing a query against 10 million vectors one by one is O(n) per search. Vector DBs (pgvector, Qdrant, Pinecone, Weaviate…) use <b>approximate nearest neighbour</b> indexes like HNSW — trading a tiny bit of accuracy for huge speed.</p>
<p>Many embedding models output <b>unit-length</b> vectors (norm 1). Then the denominator is 1 and cosine similarity is just the dot product — cheaper to compute.</p>
<div class="dev">You already know this: it's like a B-tree index vs a seq scan, except "nearest" instead of "equal", and "approximately" is part of the deal.</div>` },
        { type: 'order', q: 'Order the steps of a semantic search (RAG-style) pipeline', items: ['Embed every document into a vector', 'Store the vectors in a vector index', 'Embed the user query', 'Find the nearest vectors by cosine similarity', 'Return the top-k matching documents'],
          explain: 'Index time: embed and store. Query time: embed the question with the same model, look up neighbours, return the best matches.' },
        { type: 'mcq', q: 'For vectors that all have length 1, cosine similarity equals…', choices: ['Their sum', 'Their dot product', 'The distance between them', 'Always 1'], answer: 1,
          explain: 'cos θ = (a · b) / (1 · 1) = a · b. That is why normalized embeddings are popular: similarity becomes a plain dot product.' }
      ]
    },
    // ───────────────────────────── Lesson 4 ─────────────────────────────
    {
      id: 'matrices',
      title: 'Matrices as Transformations',
      emoji: '🔲',
      steps: [
        { type: 'learn', title: 'A matrix is a grid of numbers', html: `
<p>A <b>matrix</b> has rows and columns. Its <b>shape</b> is rows × columns:</p>
<pre><code>[ 1  2  3 ]
[ 4  5  6 ]     ← a 2×3 matrix</code></pre>
<div class="dev">You already know this: a Postgres table of numbers, a CSV of metrics (one row per host, one column per metric), a NumPy array. A vector is just a matrix with one column.</div>` },
        { type: 'mcq', q: 'What is the shape of [[1, 2], [3, 4], [5, 6]] (three rows)?', choices: ['2×3', '3×2', '6×1', '3×3'], answer: 1,
          explain: 'Three rows, two columns: 3×2. Rows first, always — like (row, col) indexing.' },
        { type: 'learn', title: 'Matrix × vector', html: `
<p>Each <b>row</b> of the matrix dot-products with the vector, giving one output number:</p>
<pre><code>[ 2  0 ] [1]   [2·1 + 0·1]   [2]
[ 0  3 ] [1] = [0·1 + 3·1] = [3]</code></pre>
<p>Here the matrix stretched x by 2 and y by 3. A matrix is a <b>function that transforms vectors</b>: scale, rotate, mirror, shear.</p>` },
        { type: 'input', q: 'Compute [[1, 2], [3, 4]] × [1, 1]. (write like [a,b])', answer: ['[3,7]', '3,7', '(3,7)', '[3, 7]'], placeholder: '[a,b]',
          explain: 'Row 1: 1·1 + 2·1 = 3. Row 2: 3·1 + 4·1 = 7. Result [3, 7].' },
        { type: 'learn', title: 'Rotation matrices', html: `
<p>Rotate any 2D vector by angle θ (counter-clockwise):</p>
<pre><code>[ cos θ  −sin θ ]
[ sin θ   cos θ ]</code></pre>
<p>For 90°: cos = 0, sin = 1, so the matrix is [[0, −1], [1, 0]]. It sends [1, 0] → [0, 1].</p>
<div class="dev">You already know this: CSS <code>transform: matrix(a, b, c, d, tx, ty)</code> is exactly a 2×2 matrix plus a translation. <code>rotate()</code>, <code>scale()</code> and <code>skew()</code> are friendly names for matrices. GPUs multiply millions of vertex vectors by matrices every frame.</div>` },
        { type: 'mcq', q: 'Apply the 90° rotation [[0, −1], [1, 0]] to the vector [2, 0]. Result?', choices: ['[0, 2]', '[0, −2]', '[−2, 0]', '[2, 2]'], answer: 0,
          explain: 'Row 1: 0·2 + (−1)·0 = 0. Row 2: 1·2 + 0·0 = 2. [2, 0] pointing right becomes [0, 2] pointing up — a quarter turn counter-clockwise.' },
        { type: 'tf', q: 'The matrix [[−1, 0], [0, 1]] mirrors vectors across the y-axis (flips the x-coordinate).', answer: true,
          explain: '[x, y] → [−x, y]. Left becomes right, up stays up: a mirror across the vertical axis.' },
        { type: 'mcq', q: 'Which matrix doubles every vector\'s length without changing its direction?', choices: ['[[2, 0], [0, 2]]', '[[1, 0], [0, 1]]', '[[0, 2], [2, 0]]', '[[2, 2], [2, 2]]'], answer: 0,
          explain: '[[2, 0], [0, 2]] sends [x, y] to [2x, 2y]. [[0, 2], [2, 0]] would also swap x and y — changing direction.' }
      ]
    },
    // ───────────────────────────── Lesson 5 ─────────────────────────────
    {
      id: 'matrix-multiplication',
      title: 'Matrix Multiplication',
      emoji: '✖️',
      steps: [
        { type: 'learn', title: 'The shape rule', html: `
<p>You can multiply A (m×n) by B (n×p) only if the <b>inner</b> dimensions match. The result is m×p:</p>
<div class="formula">(m×<b>n</b>) · (<b>n</b>×p) → m×p</div>
<p>Entry (i, j) of the result = row i of A · column j of B (a dot product).</p>
<div class="dev">You already know this: it's a JOIN with a strict schema check. A's columns must line up with B's rows, or Postgres — er, NumPy — throws "shapes not aligned".</div>` },
        { type: 'mcq', q: 'A is 3×2 and B is 2×4. What is the shape of A·B?', choices: ['2×2', '3×4', '4×3', 'Not allowed'], answer: 1,
          explain: 'Inner dimensions (2 and 2) match; the outer ones (3 and 4) give the result shape: 3×4.' },
        { type: 'tf', q: 'You can multiply a 2×3 matrix by another 2×3 matrix.', answer: false,
          explain: 'Inner dimensions are 3 and 2 — they do not match. (2×3)·(3×2) would work, giving 2×2.' },
        { type: 'learn', title: 'Worked example', html: `
<pre><code>[1 2]   [5 6]   [1·5+2·7  1·6+2·8]   [19 22]
[3 4] · [7 8] = [3·5+4·7  3·6+4·8] = [43 50]</code></pre>
<p>Row of the left, column of the right, dot product, repeat for every cell.</p>` },
        { type: 'input', q: 'In [[2, 1], [0, 3]] · [[1, 4], [2, 5]], what is the top-left entry?', answer: ['4'], placeholder: 'number',
          explain: 'Row 1 of the left [2, 1] · column 1 of the right [1, 2] = 2·1 + 1·2 = 4.' },
        { type: 'learn', title: 'Order matters!', html: `
<p>Multiplying matrices <b>composes</b> transformations. But in general <b>A·B ≠ B·A</b>.</p>
<p>Rotate-then-stretch-horizontally gives a different shape than stretch-horizontally-then-rotate. Try it with your phone and a book.</p>
<p>When applying M = A·B to a vector v: M·v = A·(B·v). <b>B acts first</b>, then A — read right to left.</p>
<div class="dev">You already know this: middleware order. Auth-then-rate-limit is not rate-limit-then-auth. Same for Dockerfile layers, iptables rules and kustomize patches.</div>` },
        { type: 'tf', q: 'For any two square matrices, A·B = B·A.', answer: false,
          explain: 'Matrix multiplication is not commutative. Example: [[1,2],[3,4]]·[[0,1],[1,0]] = [[2,1],[4,3]] but [[0,1],[1,0]]·[[1,2],[3,4]] = [[3,4],[1,2]].' },
        { type: 'mcq', q: 'M = R · S, and you compute M·v. Which transformation is applied to v first?', choices: ['R', 'S', 'Both at once, order irrelevant', 'Neither'], answer: 1,
          explain: 'M·v = R·(S·v). S touches v first, then R. Right to left, like function composition f(g(x)).' },
        { type: 'mcq', q: 'A is 1×5, B is 5×1. What is the shape of A·B?', choices: ['1×1', '5×5', '1×5', 'Not allowed'], answer: 0,
          explain: '(1×5)·(5×1) → 1×1: a single number. That is a dot product wearing a matrix costume! (B·A would be 5×5 — another sign that order matters.)' }
      ]
    },
    // ───────────────────────────── Lesson 6 ─────────────────────────────
    {
      id: 'identity-inverse-systems',
      title: 'Identity, Inverse & Equations',
      emoji: '↩️',
      steps: [
        { type: 'learn', title: 'The identity matrix', html: `
<p><b>I</b> has 1s on the diagonal and 0s elsewhere:</p>
<pre><code>I₂ = [1 0]
     [0 1]</code></pre>
<p>A·I = I·A = A, and I·v = v. It is the "multiply by 1" of matrices.</p>
<div class="dev">You already know this: a no-op middleware, <code>cat</code> in a pipeline, a kustomize overlay with no patches. Data passes through untouched.</div>` },
        { type: 'mcq', q: 'Which is the 2×2 identity matrix?', choices: ['[[1, 1], [1, 1]]', '[[0, 1], [1, 0]]', '[[1, 0], [0, 1]]', '[[0, 0], [0, 0]]'], answer: 2,
          explain: '1s on the diagonal, 0s elsewhere. [[0, 1], [1, 0]] swaps x and y — not a no-op.' },
        { type: 'learn', title: 'The inverse: Ctrl+Z', html: `
<p>The <b>inverse</b> A⁻¹ undoes A: A·A⁻¹ = A⁻¹·A = I.</p>
<ul>
<li>Inverse of "rotate 90°" is "rotate −90°".</li>
<li>Inverse of "scale by 2" is "scale by ½".</li>
</ul>
<p>But not every matrix has one. If a matrix squashes the plane flat onto a line (its <b>determinant</b> is 0), information is lost and can't be recovered.</p>
<div class="dev">You already know this: encryption has an inverse (decrypt). Hashing doesn't — many inputs collapse to one output. A non-invertible matrix is lossy like a hash.</div>` },
        { type: 'mcq', q: 'What is the inverse of [[2, 0], [0, 4]]?', choices: ['[[−2, 0], [0, −4]]', '[[0.5, 0], [0, 0.25]]', '[[4, 0], [0, 2]]', '[[0, 2], [4, 0]]'], answer: 1,
          explain: 'The matrix scales x by 2 and y by 4. Undo it by scaling x by ½ and y by ¼. Check: [[2,0],[0,4]]·[[0.5,0],[0,0.25]] = I.' },
        { type: 'tf', q: 'Every square matrix has an inverse.', answer: false,
          explain: 'Matrices with determinant 0 (like [[1, 2], [2, 4]], which squashes everything onto a line) have no inverse.' },
        { type: 'learn', title: 'Systems of linear equations', html: `
<p>Two unknowns, two equations:</p>
<pre><code>2x +  y = 5
 x −  y = 1</code></pre>
<p>Add them: 3x = 6, so x = 2, then y = 1. In matrix form this is <b>A·v = b</b> with A = [[2, 1], [1, −1]], v = [x, y], b = [5, 1]. Solving means v = A⁻¹·b.</p>
<div class="dev">You already know this: capacity planning. "Small nodes have 2 CPU, large have 8; I need 40 CPU and want 8 nodes total — how many of each?" That's a linear system. (Answer: 4 small + 4 large.)</div>` },
        { type: 'input', q: 'Solve: x + y = 10 and x − y = 4. What is x?', answer: ['7'], placeholder: 'number',
          explain: 'Add the equations: 2x = 14, so x = 7 (and y = 3). Check: 7 + 3 = 10 ✓, 7 − 3 = 4 ✓.' },
        { type: 'mcq', q: 'How many solutions does this system have?  x + y = 2  and  2x + 2y = 5', choices: ['Exactly one', 'None', 'Infinitely many', 'Two'], answer: 1,
          explain: 'Double the first: 2x + 2y = 4, which can never also equal 5. The lines are parallel and never cross. Its matrix [[1,1],[2,2]] has determinant 0 — no inverse.' }
      ]
    },
    // ───────────────────────────── Lesson 7 ─────────────────────────────
    {
      id: 'neural-nets',
      title: 'A Taste of Neural Nets',
      emoji: '🧠',
      steps: [
        { type: 'learn', title: 'One neuron = one dot product', html: `
<p>A neuron takes inputs x, multiplies them by learned <b>weights</b> w, adds a <b>bias</b> b, and passes the result through an <b>activation function</b>:</p>
<div class="formula">output = σ(w · x + b)</div>
<p>A popular activation is <b>ReLU</b>: ReLU(z) = max(0, z). Negative → 0, positive → unchanged.</p>` },
        { type: 'input', q: 'Weights [1, 2], input [3, −1], bias 1, activation ReLU. What is the output?', answer: ['2'], placeholder: 'number',
          explain: 'w · x = 1·3 + 2·(−1) = 1. Plus bias: 2. ReLU(2) = 2.' },
        { type: 'learn', title: 'A layer = one matrix multiply', html: `
<p>Stack many neurons' weight vectors as rows of a matrix W. A whole layer is:</p>
<div class="formula">y = σ(W·x + b)</div>
<p>If W is 4×3, the layer takes 3 inputs and produces 4 outputs. A deep network is layer after layer of this.</p>
<div class="dev">You already know this: it's a pipeline of transforms, like <code>kubectl get -o json | jq | yq</code>, where each stage reshapes the data a bit. "Parameters" in "a 70B-parameter model" are just the numbers in all those W matrices and b vectors.</div>` },
        { type: 'mcq', q: 'A layer has weight matrix W of shape 4×3 and receives an input vector of length 3. What is the length of W·x?', choices: ['3', '4', '7', '12'], answer: 1,
          explain: '(4×3)·(3×1) → 4×1. Three numbers in, four out.' },
        { type: 'learn', title: 'Why the nonlinearity matters', html: `
<p>Multiply two matrices and you get… another matrix. So two linear layers with no activation between them collapse into <b>one</b> linear layer — all that depth buys nothing.</p>
<p>The activation (ReLU etc.) bends the space between layers. That bend is what lets networks learn curvy, complicated patterns.</p>
<div class="callout">Neural net ≈ (matrix multiply → nonlinearity) × many layers. Trained by gradient descent.</div>` },
        { type: 'tf', q: 'Two linear layers stacked with no activation function between them are equivalent to a single linear layer.', answer: true,
          explain: 'W₂·(W₁·x) = (W₂·W₁)·x, and W₂·W₁ is just one matrix. (Biases fold in the same way.) Without nonlinearity, depth is wasted.' },
        { type: 'order', q: 'Order the steps of one layer\'s forward pass', items: ['Take the input vector x', 'Multiply by the weight matrix: W·x', 'Add the bias vector: + b', 'Apply the activation (e.g. ReLU)', 'Pass the result to the next layer'],
          explain: 'y = σ(W·x + b), then y becomes the next layer\'s x.' },
        { type: 'mcq', q: 'Why are GPUs (hello, nvidia.com/gpu node pools) so central to AI?', choices: ['They have more RAM than CPUs', 'They do huge numbers of multiply-adds in parallel, which is what matrix multiplication is', 'They run Python faster', 'They store the embeddings permanently'], answer: 1,
          explain: 'Matrix multiplication is millions of independent dot products — embarrassingly parallel. GPUs have thousands of cores built for exactly that.' }
      ]
    }
  ]
});

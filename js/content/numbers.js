CQ.unit({
  id: 'numbers',
  order: 2,
  title: 'Number Systems & Bits',
  emoji: '🔢',
  color: '#00b894',
  tagline: 'Why 0.1 + 0.2 ≠ 0.3 and chmod speaks octal',
  lessons: [
    // ─────────────────────────────────────────────────────────────
    {
      id: 'binary',
      title: 'Positional Notation & Binary',
      emoji: '0️⃣',
      steps: [
        { type: 'learn', title: 'What does "472" actually mean?', html: `
<p>You learned this so long ago you forgot it is a system. In <b>472</b>, each digit is multiplied by a power of 10 based on its position:</p>
<div class="formula">472 = 4×10² + 7×10¹ + 2×10⁰</div>
<p>(Reminder: anything to the power 0 is 1.) That is <b>positional notation</b>, and 10 is the <b>base</b>. Change the base and everything else works the same.</p>` },
        { type: 'mcq', q: 'In the number 3,051, what value does the digit 3 represent?',
          choices: ['3', '30', '300', '3000'], answer: 3,
          explain: `It sits in the 10³ position: 3 × 1000 = 3000.` },
        { type: 'learn', title: 'Base 2: binary', html: `
<p>Computers use base 2: only digits 0 and 1 (on/off, high/low voltage). The place values are powers of 2:</p>
<table><tr><td>2³</td><td>2²</td><td>2¹</td><td>2⁰</td></tr><tr><td>8</td><td>4</td><td>2</td><td>1</td></tr>
<tr><td><b>1</b></td><td><b>0</b></td><td><b>1</b></td><td><b>1</b></td></tr></table>
<p>So binary 1011 = 8 + 0 + 2 + 1 = <b>11</b>. Each binary digit is a <b>bit</b> (binary digit).</p>` },
        { type: 'widget', widget: 'bits', title: 'Be the CPU', html: '<p>Tap bits to toggle them. Try to make 13, then 100, then 255. Watch the decimal value update.</p>' },
        { type: 'input', q: 'What is binary 1101 in decimal?', answer: ['13', 'thirteen'], placeholder: 'number',
          explain: `8 + 4 + 0 + 1 = 13.` },
        { type: 'learn', title: 'Decimal → binary', html: `
<p>Greedy method: subtract the biggest power of 2 that fits, write a 1 there, repeat.</p>
<p>25 → 16 fits (9 left) → 8 fits (1 left) → 4 no → 2 no → 1 fits.</p>
<div class="formula">25 = 16 + 8 + 1 = 11001₂</div>
<div class="dev">You already know this: it is like packing pods onto nodes biggest-first. Not always optimal for pods, but perfect for binary!</div>` },
        { type: 'input', q: 'Write 25 in binary.', answer: ['11001', '0b11001', '00011001'], placeholder: 'binary',
          explain: `16 + 8 + 1 = 25, so the bits at positions 16, 8 and 1 are set: 11001.` },
        { type: 'learn', title: 'How much fits in n bits?', html: `
<p>Each bit doubles the possibilities:</p>
<div class="formula">n bits → 2ⁿ values: 0 … 2ⁿ − 1</div>
<div class="dev">You already know this: each IPv4 octet is 8 bits, so it tops out at 255. TCP ports are 16 bits, so the max is 65535. Those limits are not arbitrary; they are 2ⁿ − 1.</div>` },
        { type: 'tf', q: 'With 8 bits you can represent 256 different values.', answer: true,
          explain: `2⁸ = 256 values: 0 through 255.` },
        { type: 'mcq', q: 'What is the largest unsigned value you can store in 16 bits?',
          choices: ['16', '32767', '65535', '65536'], answer: 2,
          explain: `2¹⁶ = 65536 values, starting from 0, so the max is 65535. Hello, highest TCP port.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'hex',
      title: 'Hexadecimal',
      emoji: '🎨',
      steps: [
        { type: 'learn', title: 'Base 16', html: `
<p>Binary is long and painful to read. <b>Hexadecimal</b> (base 16) is the compact version. It needs 16 digits, so after 9 it borrows letters:</p>
<div class="formula">0 1 2 3 4 5 6 7 8 9 A B C D E F</div>
<p>A = 10, B = 11, … F = 15. The prefix <code>0x</code> marks hex: <code>0x1F</code>.</p>
<div class="callout">Magic: one hex digit = exactly 4 bits (a "nibble"). Two hex digits = one byte.</div>` },
        { type: 'input', q: 'What is hex F in decimal?', answer: ['15', 'fifteen'], placeholder: 'number',
          explain: `A=10, B=11, C=12, D=13, E=14, F=15. F is the biggest single hex digit, which is binary 1111.` },
        { type: 'learn', title: 'Converting', html: `
<p><b>Hex → decimal</b>: same positional idea with powers of 16.</p>
<div class="formula">0x2F = 2×16 + 15 = 47</div>
<p><b>Binary ↔ hex</b>: group bits by 4 from the right and translate each group:</p>
<pre><code>1010 1111
  A    F   → 0xAF</code></pre>
<p>No arithmetic needed. That is why hex is everywhere in low-level land.</p>` },
        { type: 'input', q: 'What is 0xFF in decimal?', answer: ['255'], placeholder: 'number',
          explain: `15×16 + 15 = 255. It is 11111111 in binary: a full byte.` },
        { type: 'mcq', q: 'Convert binary 1100 0011 to hex.',
          choices: ['0xC3', '0x3C', '0xC4', '0xB3'], answer: 0,
          explain: `1100 = 12 = C, 0011 = 3. So 0xC3.` },
        { type: 'learn', title: 'Hex in the wild', html: `
<ul><li><b>Colors</b>: <code>#RRGGBB</code>, one byte per channel. #FF0000 is pure red.</li>
<li><b>Memory addresses</b>: <code>0x7ffd5e8c</code> in core dumps and stack traces.</li>
<li><b>Hashes</b>: a Git commit SHA-1 is 40 hex chars; SHA-256 is 64.</li>
<li><b>UUIDs, MAC addresses</b>, <code>xxd</code> / <code>hexdump</code> output.</li></ul>
<div class="dev">You already know this: <code>git log --oneline</code> shows 7-ish hex chars of the SHA. That is 28 bits, plenty to be unique in most repos.</div>` },
        { type: 'mcq', q: 'What color is #00FF00?',
          choices: ['Red', 'Green', 'Blue', 'White'], answer: 1,
          explain: `RR = 00, GG = FF (max), BB = 00. Only green is on.` },
        { type: 'tf', q: 'A Git SHA-1 hash written as 40 hex characters is 160 bits long.', answer: true,
          explain: `Each hex char is 4 bits: 40 × 4 = 160 bits (20 bytes).` },
        { type: 'widget', widget: 'bits', title: 'Hex and bits side by side', html: '<p>Set the bits to make 0xA5 (1010 0101). Notice how each group of 4 bits maps to exactly one hex digit.</p>' },
        { type: 'input', q: 'A SHA-256 hash is shown as 64 hex characters. How many bits is that?', answer: ['256'], placeholder: 'number',
          explain: `64 × 4 = 256 bits. The name gives it away!` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'octal-chmod',
      title: 'Octal & chmod 755',
      emoji: '🔐',
      steps: [
        { type: 'learn', title: 'Base 8', html: `
<p><b>Octal</b> uses digits 0–7, and one octal digit = exactly <b>3 bits</b>.</p>
<p>Why care? Unix permissions come in groups of 3 bits: <b>r = 4</b>, <b>w = 2</b>, <b>x = 1</b>. Add them up and you get one octal digit per group.</p>
<table><tr><th>bits</th><th>rwx</th><th>octal</th></tr>
<tr><td>111</td><td>rwx</td><td>7</td></tr><tr><td>110</td><td>rw-</td><td>6</td></tr>
<tr><td>101</td><td>r-x</td><td>5</td></tr><tr><td>100</td><td>r--</td><td>4</td></tr></table>` },
        { type: 'mcq', q: 'What octal digit means rwx?',
          choices: ['3', '6', '7', '8'], answer: 2,
          explain: `4 + 2 + 1 = 7, binary 111. (8 is not even an octal digit!)` },
        { type: 'learn', title: 'Decoding chmod 755', html: `
<p>Three octal digits = owner, group, others.</p>
<div class="formula">755 = rwx r-x r-x</div>
<div class="formula">644 = rw- r-- r--</div>
<p>755 is the classic for executables and directories, 644 for regular files.</p>
<div class="dev">You already know this: <code>ls -l</code> prints <code>-rwxr-xr-x</code>. Now you can read it as 755 at a glance.</div>` },
        { type: 'input', q: 'What octal digit is r-x?', answer: ['5', 'five'], placeholder: 'digit',
          explain: `r = 4, x = 1, no w: 4 + 1 = 5.` },
        { type: 'mcq', q: 'What does chmod 600 on ~/.ssh/id_ed25519 mean?',
          choices: ['Everyone can read and write it', 'Owner can read and write; nobody else can do anything', 'Owner can execute it only', 'Group can read it'], answer: 1,
          explain: `6 = rw- for the owner, 0 = --- for group and others. SSH refuses keys that are more open ("UNPROTECTED PRIVATE KEY FILE!").` },
        { type: 'learn', title: 'Octal traps in config files', html: `
<p>In C and old JS, a leading 0 meant octal: <code>010</code> is 8! Python 3 requires <code>0o755</code>.</p>
<p>Kubernetes <code>defaultMode</code> for secret/configMap volumes: in YAML you can write <code>0644</code> (octal), but JSON has no octal, so you must write the decimal value <b>420</b>.</p>
<div class="formula">0644₈ = 6×64 + 4×8 + 4 = 420</div>
<div class="dev">You already know this: if you ever saw <code>420</code> in a JSON manifest and thought "is this a joke?", it is just 0644 in decimal.</div>` },
        { type: 'tf', q: 'In a Kubernetes JSON manifest, defaultMode 0644 has to be written as 420.', answer: true,
          explain: `JSON numbers are decimal only. 6×64 + 4×8 + 4 = 384 + 32 + 4 = 420.` },
        { type: 'input', q: 'What is octal 755 in decimal?', answer: ['493'], placeholder: 'number',
          explain: `7×64 + 5×8 + 5 = 448 + 40 + 5 = 493.` },
        { type: 'mcq', q: 'You want a deploy script executable by everyone but writable only by its owner. Which mode?',
          choices: ['777', '755', '644', '700'], answer: 1,
          explain: `755: owner rwx, group and others r-x. 777 lets anyone edit it (yikes), 644 has no execute bit, 700 locks out everyone but the owner.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'twos-complement',
      title: "Negative Numbers & Overflow",
      emoji: '🔄',
      steps: [
        { type: 'learn', title: "Two's complement", html: `
<p>How do you store −5 with just bits? The winning trick: make the <b>top bit worth a negative amount</b>. In 8 bits the place values are:</p>
<div class="formula">−128, 64, 32, 16, 8, 4, 2, 1</div>
<p>So 11111111 = −128 + 127 = <b>−1</b>, and 10000000 = <b>−128</b>. This is <b>two's complement</b>, used by basically every CPU today.</p>` },
        { type: 'widget', widget: 'bits', title: 'Find −1 and −128', html: '<p>Set all 8 bits and check the two\'s-complement reading. Then set only the top bit. Same bits, different interpretation!</p>' },
        { type: 'mcq', q: 'What range does an 8-bit signed (two\'s complement) integer cover?',
          choices: ['0 to 255', '−127 to 127', '−128 to 127', '−128 to 128'], answer: 2,
          explain: `Still 256 values, just shifted: −128 … 127. There is one more negative than positive, because 0 takes a slot on the non-negative side.` },
        { type: 'learn', title: 'Negating: flip and add one', html: `
<p>To get −x: <b>invert all bits, then add 1</b>.</p>
<pre><code> 5 = 00000101
flip  11111010
+1    11111011  = −5</code></pre>
<p>Check: −128 + 64 + 32 + 16 + 8 + 2 + 1 = −5 ✅</p>` },
        { type: 'input', q: 'What value is 11111110 in 8-bit two\'s complement?', answer: ['-2', '−2'], placeholder: 'number',
          explain: `−128 + 64 + 32 + 16 + 8 + 4 + 2 = −2. Or: flip → 00000001, +1 → 00000010 = 2, so it was −2.` },
        { type: 'learn', title: 'Overflow: the odometer effect', html: `
<p>Add 1 to 01111111 (127) and you get 10000000, which reads as <b>−128</b>. The number wraps around like a car odometer.</p>
<div class="dev">You already know this: a Postgres <code>SERIAL</code> (32-bit int) primary key eventually hits 2,147,483,647 and inserts fail with "integer out of range". Teams then do a painful migration to <code>BIGINT</code>. Start with <code>BIGSERIAL</code>/<code>bigint</code> identity columns.</div>
<div class="fun">🤓 Fun fact: in 2014 "Gangnam Style" neared 2³¹ − 1 views and YouTube moved its counter to 64 bits. And 32-bit Unix time overflows on 19 January 2038.</div>` },
        { type: 'tf', q: 'In 8-bit signed arithmetic, 127 + 1 wraps around to −128.', answer: true,
          explain: `01111111 + 1 = 10000000, and the top bit is worth −128.` },
        { type: 'mcq', q: 'What is the maximum value of a signed 32-bit integer?',
          choices: ['4,294,967,295', '2,147,483,647', '65,535', '2,147,483,648'], answer: 1,
          explain: `2³¹ − 1 = 2,147,483,647. (4,294,967,295 is the unsigned 32-bit max, 2³² − 1.)` },
        { type: 'learn', title: 'Why two\'s complement won', html: `
<p>The hardware adds signed numbers <b>exactly like unsigned ones</b>, just dropping the carry-out:</p>
<pre><code>  11111111  (−1)
+ 00000001  (+1)
= 1 00000000 → carry dropped → 0 ✅</code></pre>
<p>Older schemes (sign-magnitude, ones\' complement) had two zeros (+0 and −0) and needed special adder logic. Two\'s complement has exactly one zero.</p>` },
        { type: 'tf', q: 'Two\'s complement has two different representations of zero (+0 and −0).', answer: false,
          explain: `Only one zero: 00000000. Negating it (flip → 11111111, +1 → 00000000 with the carry dropped) gives zero back.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'bytes-units',
      title: 'Bytes, KB vs KiB',
      emoji: '💾',
      steps: [
        { type: 'learn', title: 'Two kinds of "kilo"', html: `
<p>A <b>byte</b> is 8 bits (half a byte is a <b>nibble</b>, really). Then things get political:</p>
<table><tr><th>SI (powers of 10)</th><th>Binary (powers of 2)</th></tr>
<tr><td>1 KB = 1000 B</td><td>1 KiB = 1024 B</td></tr>
<tr><td>1 MB = 10⁶ B</td><td>1 MiB = 2²⁰ = 1,048,576 B</td></tr>
<tr><td>1 GB = 10⁹ B</td><td>1 GiB = 2³⁰ = 1,073,741,824 B</td></tr></table>
<p>The "i" (kibi, mebi, gibi) means "binary". The gap grows at each step: about 2.4% at kilo, about 7.4% at giga.</p>` },
        { type: 'input', q: 'How many bytes are in 1 KiB?', answer: ['1024'], placeholder: 'number',
          explain: `KiB is the binary kilo: 2¹⁰ = 1024 bytes.` },
        { type: 'learn', title: 'Where this bites you', html: `
<p>Disk vendors sell in GB/TB (powers of 10). Windows reports sizes in powers of 2 but labels them "GB". So a "1 TB" drive shows up as about 931 "GB".</p>
<div class="dev">You already know this (maybe the hard way): in Kubernetes, <code>memory: 512Mi</code> is 512 × 2²⁰ bytes, while <code>512M</code> is 512 × 10⁶ bytes, about 4.6% less. Mixing them up is a quiet way to get OOMKilled.</div>` },
        { type: 'tf', q: 'In Kubernetes resource units, 1Gi is larger than 1G.', answer: true,
          explain: `1Gi = 1,073,741,824 bytes; 1G = 1,000,000,000 bytes.` },
        { type: 'mcq', q: 'Why does a brand-new "1 TB" drive show about 931 GB in Windows?',
          choices: ['The filesystem ate 69 GB', 'The vendor counted 10¹² bytes; Windows divides by 2³⁰ per "GB"', 'Bad sectors are hidden', 'It reserves space for swap'], answer: 1,
          explain: `10¹² ÷ 2³⁰ ≈ 931.3. Same bytes, different unit. Nobody stole anything.` },
        { type: 'learn', title: 'Bits vs bytes on the wire', html: `
<p>Network speeds are in <b>bits</b> per second (lowercase b: Mbps, Gbps). File sizes are in <b>bytes</b> (uppercase B). Divide by 8.</p>
<div class="formula">1 Gbps ÷ 8 = 125 MB/s (before protocol overhead)</div>
<div class="dev">You already know this: the eternal ticket "I pay for 100 Mbps but downloads show 12 MB/s". That is working as intended.</div>` },
        { type: 'input', q: 'An 800 Mbps link can move at most how many MB/s (ignoring overhead)?', answer: ['100'], placeholder: 'number',
          explain: `800 megabits ÷ 8 bits per byte = 100 megabytes per second.` },
        { type: 'learn', title: 'Powers of 2 cheat sheet', html: `
<table><tr><td>2¹⁰</td><td>1,024</td><td>≈ thousand (Ki)</td></tr>
<tr><td>2²⁰</td><td>1,048,576</td><td>≈ million (Mi)</td></tr>
<tr><td>2³⁰</td><td>≈ 1.07 billion</td><td>≈ billion (Gi)</td></tr>
<tr><td>2³²</td><td>≈ 4.29 billion</td><td>4 Gi</td></tr></table>
<p>So 2ⁿ for big n: every 10 doublings ≈ ×1000.</p>` },
        { type: 'mcq', q: 'A 32-bit pointer can address at most how much memory (byte-addressable)?',
          choices: ['32 MiB', '2 GiB', '4 GiB', '32 GiB'], answer: 2,
          explain: `2³² distinct addresses × 1 byte = 4 GiB. That is why 32-bit systems hit a 4 GB wall and the world moved to 64-bit.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'floating-point',
      title: 'Floating Point: 0.1 + 0.2 ≠ 0.3',
      emoji: '🌊',
      steps: [
        { type: 'learn', title: 'The most famous bug that is not a bug', html: `
<pre><code>&gt; 0.1 + 0.2
0.30000000000000004</code></pre>
<p>Why? In decimal, 1/3 = 0.3333… never ends. In <b>binary</b>, 1/10 never ends either: 0.0001100110011…₂. The computer must cut it off, so 0.1 is stored as a value <i>very slightly</i> off. Those tiny errors add up.</p>
<div class="callout">Not a JS bug: Python, Java, Go, C and your GPU all do this. It is the IEEE 754 standard.</div>` },
        { type: 'tf', q: 'In JavaScript, 0.1 + 0.2 === 0.3 is true.', answer: false,
          explain: `It is false: the left side is 0.30000000000000004. Both sides are rounded binary approximations, and they round differently.` },
        { type: 'learn', title: 'Scientific notation in base 2', html: `
<p>A 64-bit <b>double</b> stores a number like ± 1.fraction × 2^exponent:</p>
<ul><li>1 bit: sign</li><li>11 bits: exponent</li><li>52 bits: fraction (mantissa)</li></ul>
<p>That gives about <b>15–17 significant decimal digits</b> of precision and a huge range (up to about 1.8 × 10³⁰⁸).</p>
<div class="dev">You already know this: it is like Prometheus storing every sample as a float64. Great range, tiny rounding errors in the last digits.</div>` },
        { type: 'mcq', q: 'Which decimal value can a binary float store EXACTLY?',
          choices: ['0.1', '0.2', '0.375', '0.3'], answer: 2,
          explain: `0.375 = 3/8 = 0.011₂, a finite binary fraction. 0.1, 0.2 and 0.3 have a factor of 5 in the denominator, so they repeat forever in binary.` },
        { type: 'learn', title: 'Living with floats', html: `
<p>A fraction is exact in binary only if its denominator (in lowest terms) is a power of 2: ½, ¼, ⅜ yes; ⅒ no.</p>
<ul><li><b>Never compare with ===</b>. Use a tolerance: <code>Math.abs(a - b) &lt; 1e-9</code>.</li>
<li><b>Never store money as float</b>. Use integer cents or a decimal type.</li></ul>
<div class="dev">You already know this: Postgres <code>NUMERIC(12,2)</code> is exact decimal; <code>real</code> / <code>double precision</code> are IEEE floats. Billing tables want NUMERIC (or bigint cents).</div>` },
        { type: 'mcq', q: 'You are designing a Postgres column for invoice amounts. Best choice?',
          choices: ['double precision', 'real', 'NUMERIC(12,2) or integer cents', 'text'], answer: 2,
          explain: `Exact decimal (or integer cents) avoids rounding errors. A float would eventually make accountants very unhappy.` },
        { type: 'learn', title: 'Weird corners', html: `
<p>JS numbers are doubles, so integers are only exact up to <b>2⁵³ − 1 = 9,007,199,254,740,991</b> (<code>Number.MAX_SAFE_INTEGER</code>). Beyond that, integers start skipping.</p>
<p>Also: <code>NaN</code> ("not a number", e.g. 0/0) is not equal to anything, <b>including itself</b>. And 1/0 is <code>Infinity</code>, not an error.</p>
<div class="dev">You already know this: APIs send 64-bit IDs as strings (Twitter famously added <code>id_str</code>) because JS would silently round them.</div>` },
        { type: 'tf', q: 'In JavaScript, 2**53 + 1 === 2**53 is true.', answer: true,
          explain: `2⁵³ + 1 is not representable as a double, so it rounds to 2⁵³. Past MAX_SAFE_INTEGER, consecutive integers collapse together.` },
        { type: 'input', q: 'Which special floating-point value is not equal to itself?', answer: ['NaN', 'not a number'], placeholder: 'value',
          explain: `NaN !== NaN is true. Use Number.isNaN(x) to test for it.` },
        { type: 'mcq', q: 'What is the best way to check if two computed floats a and b are "equal"?',
          choices: ['a === b', 'Math.abs(a - b) < epsilon', 'String(a) === String(b)', 'Math.round(a) === Math.round(b)'], answer: 1,
          explain: `Compare within a small tolerance. Rounding to integers throws away far too much, and string comparison has the same problem as ===.` }
      ]
    },
    // ─────────────────────────────────────────────────────────────
    {
      id: 'text-encoding',
      title: 'ASCII, Unicode & UTF-8',
      emoji: '🔤',
      steps: [
        { type: 'learn', title: 'Text is just numbers', html: `
<p><b>ASCII</b> (1963) maps 128 characters to numbers using 7 bits:</p>
<table><tr><td>'0'</td><td>48</td></tr><tr><td>'A'</td><td>65</td></tr><tr><td>'a'</td><td>97</td></tr><tr><td>space</td><td>32</td></tr></table>
<p>Cute detail: 'a' − 'A' = 32 = one single bit. Toggling bit 5 switches case.</p>
<div class="dev">You already know this: <code>\\n</code> is 10 (LF) and <code>\\r</code> is 13 (CR). The CRLF vs LF wars in Git diffs are literally about one extra byte.</div>` },
        { type: 'input', q: 'What is the ASCII code of "B"?', answer: ['66'], placeholder: 'number',
          explain: `'A' is 65, so 'B' is 66.` },
        { type: 'learn', title: 'Unicode: one table to rule them all', html: `
<p>128 characters do not cover 日本語, Ελληνικά or 🔥. <b>Unicode</b> gives every character a number called a <b>code point</b>, from U+0000 up to U+10FFFF (about 1.1 million slots).</p>
<ul><li>'A' = U+0041</li><li>'é' = U+00E9</li><li>'€' = U+20AC</li><li>'😀' = U+1F600</li></ul>
<div class="callout">Unicode is the mapping (character → number). An <b>encoding</b> like UTF-8 decides how that number becomes bytes.</div>` },
        { type: 'tf', q: 'Unicode and UTF-8 are the same thing.', answer: false,
          explain: `Unicode assigns code points. UTF-8, UTF-16 and UTF-32 are different ways to encode those code points as bytes.` },
        { type: 'learn', title: 'UTF-8: variable length genius', html: `
<p>UTF-8 uses <b>1 to 4 bytes</b> per character:</p>
<table><tr><th>Code points</th><th>Bytes</th><th>Example</th></tr>
<tr><td>U+0000–U+007F</td><td>1</td><td>A → 41</td></tr>
<tr><td>U+0080–U+07FF</td><td>2</td><td>é → C3 A9</td></tr>
<tr><td>U+0800–U+FFFF</td><td>3</td><td>€ → E2 82 AC</td></tr>
<tr><td>U+10000+</td><td>4</td><td>😀 → F0 9F 98 80</td></tr></table>
<p>Every ASCII file is already valid UTF-8. That backward compatibility is why UTF-8 won the web.</p>` },
        { type: 'mcq', q: 'How many bytes does 😀 (U+1F600) take in UTF-8?',
          choices: ['1', '2', '3', '4'], answer: 3,
          explain: `Code points above U+FFFF need 4 bytes in UTF-8: F0 9F 98 80.` },
        { type: 'learn', title: 'When encodings go wrong', html: `
<p>Read UTF-8 bytes as Latin-1 and you get <b>mojibake</b>: é (C3 A9) shows up as "Ã©" because C3 is Ã and A9 is © in Latin-1.</p>
<div class="dev">You already know this: MySQL's old <code>utf8</code> charset only stores up to 3 bytes per character, so emoji fail. You need <code>utf8mb4</code>. And in JS, <code>'😀'.length</code> counts UTF-16 code units, not characters.</div>` },
        { type: 'tf', q: 'In JavaScript, "😀".length is 2.', answer: true,
          explain: `JS strings are UTF-16. Characters beyond U+FFFF are stored as two 16-bit "surrogate" units, so length says 2. Use [...str].length to count code points.` },
        { type: 'mcq', q: 'Your logs show "cafÃ©" instead of "café". Most likely cause?',
          choices: ['The disk is corrupted', 'UTF-8 bytes were decoded as Latin-1 / Windows-1252', 'The string was gzipped', 'An integer overflow'], answer: 1,
          explain: `é in UTF-8 is C3 A9; decoded one byte at a time as Latin-1 that is "Ã©". Classic mojibake. Check your Content-Type charset and DB connection encoding.` },
        { type: 'order', q: 'Order these characters from fewest to most bytes in UTF-8.', items: ['A', 'é', '€', '😀'],
          explain: `A = 1 byte, é = 2, € = 3, 😀 = 4. Higher code points need more bytes.` }
      ]
    }
  ]
});

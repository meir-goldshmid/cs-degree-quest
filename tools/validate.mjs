// Validates content files: node tools/validate.mjs [files...]  (defaults to all js/content/*.js)
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const WIDGETS = ['bits', 'truth', 'growth', 'guess', 'sort', 'graph', 'derivative', 'integral', 'unitcircle', 'hash'];
const TYPES = ['learn', 'mcq', 'tf', 'input', 'order', 'widget'];

let files = process.argv.slice(2);
if (!files.length) {
  const dir = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..', 'js', 'content');
  files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => path.join(dir, f));
}

let failed = false;
const seen = new Set();
for (const file of files) {
  const errs = [];
  const units = [];
  const ctx = { CQ: { unit: u => units.push(u) } };
  try {
    vm.runInNewContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  } catch (e) {
    errs.push('Script error: ' + e.message);
  }
  if (!errs.length && units.length !== 1) errs.push(`Expected exactly 1 CQ.unit call, got ${units.length}`);
  const u = units[0];
  if (u) {
    for (const k of ['id', 'order', 'title', 'emoji', 'color', 'tagline', 'lessons']) if (u[k] == null) errs.push(`unit missing ${k}`);
    if (seen.has(u.id)) errs.push(`duplicate unit id ${u.id}`);
    seen.add(u.id);
    if (path.basename(file, '.js') !== u.id) errs.push(`file name should be ${u.id}.js`);
    const lids = new Set();
    let qCount = 0, stepCount = 0;
    (u.lessons || []).forEach((l, li) => {
      const where = `lesson[${li}] ${l.id}`;
      for (const k of ['id', 'title', 'emoji', 'steps']) if (l[k] == null) errs.push(`${where} missing ${k}`);
      if (lids.has(l.id)) errs.push(`${where} duplicate id`);
      lids.add(l.id);
      const steps = l.steps || [];
      if (steps.length < 5) errs.push(`${where}: only ${steps.length} steps`);
      let q = 0;
      steps.forEach((s, si) => {
        const w = `${where} step[${si}]`;
        stepCount++;
        if (!TYPES.includes(s.type)) return errs.push(`${w} bad type ${s.type}`);
        if (s.type === 'learn' && !s.html) errs.push(`${w} learn needs html`);
        if (s.type === 'widget' && !WIDGETS.includes(s.widget)) errs.push(`${w} unknown widget ${s.widget}`);
        if (['mcq', 'tf', 'input', 'order'].includes(s.type)) {
          q++;
          if (!s.q) errs.push(`${w} missing q`);
          if (!s.explain) errs.push(`${w} missing explain`);
        }
        if (s.type === 'mcq') {
          if (!Array.isArray(s.choices) || s.choices.length < 2) errs.push(`${w} needs choices`);
          else if (!(s.answer >= 0 && s.answer < s.choices.length)) errs.push(`${w} answer index out of range`);
        }
        if (s.type === 'tf' && typeof s.answer !== 'boolean') errs.push(`${w} tf answer must be boolean`);
        if (s.type === 'input' && !(typeof s.answer === 'string' || (Array.isArray(s.answer) && s.answer.length))) errs.push(`${w} input answer must be string or array`);
        if (s.type === 'order' && (!Array.isArray(s.items) || s.items.length < 3)) errs.push(`${w} order needs >=3 items`);
      });
      if (q < 3) errs.push(`${where}: only ${q} questions`);
      qCount += q;
    });
    if (!errs.length) console.log(`OK  ${path.basename(file)}  "${u.title}"  ${u.lessons.length} lessons, ${stepCount} steps, ${qCount} questions`);
  }
  if (errs.length) {
    failed = true;
    console.log(`FAIL ${path.basename(file)}`);
    errs.forEach(e => console.log('   - ' + e));
  }
}
process.exit(failed ? 1 : 0);

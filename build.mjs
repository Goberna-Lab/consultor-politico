// build.mjs — arma index.html concatenando los parciales del manifest.
// SIN dependencias. Correr tras editar cualquier parcial:  node build.mjs
// El index.html es GENERADO — no editarlo a mano; editar los parciales en
// base/*.html y sections/<seccion>/<seccion>.html, luego correr este script.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(readFileSync(join(root, 'build.manifest.json'), 'utf8'));
const html = manifest.map((p) => readFileSync(join(root, p), 'utf8')).join('');
writeFileSync(join(root, 'index.html'), html);
console.log(`index.html generado desde ${manifest.length} parciales`);

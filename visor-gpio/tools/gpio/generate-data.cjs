/* Archivo: generate-data.cjs | Adaptador reproducible para abrir con file://.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Fase 2. Licencia: ../../docs/gpio/LICENCIAS.md */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const read = (name) => fs.readFileSync(path.join(root, 'docs/gpio', name), 'utf8');
const payload = { workspace: JSON.parse(read('registro.json')), template: JSON.parse(read('plantilla-proyecto.json')).project, guide: read('referencia-tecnica.md') };
const header = fs.readFileSync(__filename, 'utf8').split('*/')[0].replace('generate-data.cjs | Adaptador reproducible para abrir con file://.', 'data.js | Generado; editar JSON/Markdown canónicos y ejecutar generate-data.cjs.').replace('SPDX-License-Identifier: MIT', 'SPDX-License-Identifier: MIT AND CC-BY-4.0').trimEnd() + '\n * Código/datos: MIT. Guía original embebida: CC BY 4.0, mismo autor y repositorio.\n */\n';
const output = header + 'globalThis.GPIO_SEED = ' + JSON.stringify(payload).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029') + ';\n';
const destination = path.join(__dirname, 'data.js');
if (process.argv.includes('--check')) {
  if (!fs.existsSync(destination) || fs.readFileSync(destination, 'utf8') !== output) {
    process.stderr.write('data.js no coincide con sus fuentes. Ejecuta node tools/gpio/generate-data.cjs\n'); process.exitCode = 1;
  } else process.stdout.write('data.js coincide con JSON y guía canónicos.\n');
} else { fs.writeFileSync(destination, output, 'utf8'); process.stdout.write('data.js generado sin dependencias externas.\n'); }

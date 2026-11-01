/* Archivo: board.test.cjs | Integridad de disposición y estados visuales.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Placa visual. Licencia: ../../docs/gpio/LICENCIAS.md */
const test = require('node:test');
const assert = require('node:assert/strict');
const B = require('../../tools/gpio/board.js');
const data = require('../../docs/gpio/registro.json');
test('dos filas de 15 con exactamente los 25 GPIO y 5 contactos del perfil', () => {
  assert.equal(B.layout.left.length, 15); assert.equal(B.layout.right.length, 15);
  const contacts = [...B.layout.left, ...B.layout.right];
  assert.deepEqual(contacts.filter((p) => Number.isInteger(p.gpio)).map((p) => p.gpio).sort((a,b) => a-b), data.boardProfiles[0].pins.map((p) => p.gpio));
  assert.equal(contacts.filter((p) => p.gpio === undefined).length, 5);
  assert.ok(data.boardProfiles[0].pins.every((p) => p.headerPosition === null));
});
test('la clasificación técnica no cambia cuando cambia la ocupación del proyecto', () => {
  const pins = data.boardProfiles[0].pins;
  assert.equal(B.indicator(pins.find((p) => p.gpio === 12)).label, 'Arranque');
  assert.equal(B.indicator(pins.find((p) => p.gpio === 34)).label, 'Solo entrada');
  assert.equal(B.indicator(pins.find((p) => p.gpio === 1)).category, 'system');
  assert.equal(B.indicator(pins.find((p) => p.gpio === 23)).category, 'normal');
});

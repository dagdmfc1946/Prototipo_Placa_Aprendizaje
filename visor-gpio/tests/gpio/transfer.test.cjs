/* Archivo: transfer.test.cjs | Pruebas de respaldo, importación y almacenamiento.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Fase 3. Licencia: ../../docs/gpio/LICENCIAS.md */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const M = require('../../tools/gpio/model.js');
const T = require('../../tools/gpio/transfer.js');
const { createStore, KEY, BACKUP } = require('../../tools/gpio/storage.js');
const seed = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '../../docs/gpio/registro.json'), 'utf8'));
const trusted = seed.boardProfiles;
const fresh = () => M.clone(seed);
const validate = (data) => T.validateWorkspace(data, trusted);
function memory() {
  const map = new Map();
  return { getItem: (key) => map.get(key) ?? null, setItem: (key, value) => map.set(key, value) };
}
test('exportación completa e individual reproducen proyectos, notas y evidencia', () => {
  const state = fresh(); state.projects[0].pins[0].notes = '<img src=x onerror=alert(1)>';
  assert.deepEqual(T.parseText(JSON.stringify(state), trusted).workspace, state);
  const single = T.exportProject(state, state.activeProjectId);
  const parsed = T.parseText(JSON.stringify(single), trusted);
  assert.equal(parsed.kind, 'gpio-project');
  assert.deepEqual(parsed.workspace.projects[0], state.projects[0]);
  assert.ok(!JSON.stringify(single).includes('application/pdf'));
});
test('rechaza estructura, versión, referencias, duplicados y perfiles manipulados', () => {
  const mutations = [
    (s) => { s.schemaVersion = '9.0.0'; },
    (s) => { s.activeProjectId = 'inexistente'; },
    (s) => { s.projects.push(M.clone(s.projects[0])); },
    (s) => { s.projects[0].pins[0].gpio = 34; },
    (s) => { s.boardProfiles[0].pins.find((p) => p.gpio === 34).output = true; },
    (s) => { s.projects[0].pins[0].extra = true; },
    (s) => { s.projects[0].pins.find((p) => p.gpio === 13).assignments[0].evidence[0].sourceId = 'inventada'; },
    (s) => { s.projects[0].pins.find((p) => p.gpio === 13).assignments[0].validation.status = 'passed'; },
    (s) => { s.projects[0].name = 'x'.repeat(201); },
    (s) => { s.projects[0].createdAt = '2026-02-31'; },
  ];
  for (const mutate of mutations) { const state = fresh(); mutate(state); assert.throws(() => validate(state)); }
  assert.throws(() => T.parseText('{no json}', trusted));
  assert.throws(() => T.parseText(' '.repeat(2 * 1024 * 1024 + 1), trusted), /2 MiB/);
  const malicious = JSON.parse(JSON.stringify(seed));
  Object.defineProperty(malicious.projects[0], '__proto__', { value: { polluted: true }, enumerable: true });
  assert.throws(() => validate(malicious));
  assert.equal({}.polluted, undefined);
});
test('añadir importación genera nuevos IDs y no hereda pruebas; restaurar reemplaza explícitamente', () => {
  const state = fresh();
  const input = T.parseText(JSON.stringify(seed), trusted);
  const added = T.importData(state, input, 'add');
  assert.equal(state.projects.length, 1);
  assert.equal(added.projects.length, 2);
  assert.notEqual(added.projects[0].id, added.projects[1].id);
  assert.ok(added.projects[1].pins.flatMap((p) => p.assignments).every((a) => a.connection === 'unknown'));
  const single = T.parseText(JSON.stringify(T.exportProject(seed, seed.activeProjectId)), trusted);
  const restored = T.importData(added, single, 'restore');
  assert.equal(restored.projects.length, 2);
  assert.deepEqual(restored.projects[0], seed.projects[0]);
  const full = T.importData(added, input, 'restore');
  assert.deepEqual(full, seed);
});
test('autoguardado conserva proyecto activo y mantiene la última copia anterior', () => {
  const disk = memory(); const store = createStore(disk, validate);
  assert.equal(store.load().workspace, null);
  const first = fresh(); assert.equal(store.save(first).ok, true);
  const second = fresh(); second.projects[0].name = 'Editado';
  assert.equal(store.save(second).ok, true);
  assert.deepEqual(store.backup(), first);
  assert.deepEqual(createStore(disk, validate).load().workspace, second);
});
test('almacenamiento bloqueado/cuota agotada conserva el trabajo en memoria y el disco anterior', () => {
  const disk = memory(); const store = createStore(disk, validate); store.load();
  const state = fresh(); store.save(state); const before = disk.getItem(KEY);
  disk.setItem = () => { throw new Error('QuotaExceededError'); };
  state.projects[0].name = 'Sin guardar';
  assert.equal(store.save(state).ok, false);
  assert.equal(disk.getItem(KEY), before);
  assert.equal(state.projects[0].name, 'Sin guardar');
  assert.ok(createStore(null, validate).load().error);
});
test('JSON local corrupto no se sobrescribe automáticamente; respaldo verificable disponible', () => {
  const disk = memory(); disk.setItem(KEY, '{corrupto}'); disk.setItem(BACKUP, JSON.stringify(seed));
  const store = createStore(disk, validate);
  assert.ok(store.load().error); assert.deepEqual(store.backup(), seed);
  assert.equal(store.save(seed).ok, false); assert.equal(disk.getItem(KEY), '{corrupto}');
  assert.equal(store.save(seed, true).ok, true);
});
test('otra pestaña no puede ser sobrescrita silenciosamente', () => {
  const disk = memory(); const a = createStore(disk, validate); const b = createStore(disk, validate);
  a.load(); b.load(); a.save(seed);
  assert.equal(b.save(seed).conflict, true);
  assert.equal(b.save(seed, true).ok, true);
});
test('la colección completa debe caber en un respaldo reimportable de 2 MiB', () => {
  const state = fresh();
  for (let i = 0; i < 30; i++) {
    const project = M.clone(seed.projects[0]); project.id = `trabajo-${i}`;
    project.pins.forEach((p) => { p.notes = 'x'.repeat(4000); }); state.projects.push(project);
  }
  assert.throws(() => validate(state), /2 MiB/);
});

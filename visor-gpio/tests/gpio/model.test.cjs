/* Archivo: model.test.cjs | Pruebas de proyectos y GPIO.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Fase 2. Licencia: ../../docs/gpio/LICENCIAS.md */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const M = require('../../tools/gpio/model.js');
const seed = JSON.parse(fs.readFileSync(path.join(root, 'docs/gpio/registro.json'), 'utf8'));
const template = JSON.parse(fs.readFileSync(path.join(root, 'docs/gpio/plantilla-proyecto.json'), 'utf8'));
const fresh = () => M.clone(seed);
const evidence = { sourceId: 'user-session', detail: 'Prueba informada por el usuario', date: '2026-10-31', reportedBy: 'Diego' };
function assigned(gpio, component = 'LED', signal = 'OUT', busId = null, iface = 'DIGITAL') {
  return { gpio, allocation: 'assigned', reservationReason: '', notes: '', updatedAt: null, assignments: [{ id: M.id(), component, signal, direction: 'output', interface: iface, busId, connection: 'unknown', validation: { status: 'not-tested', evidence: [] }, notes: '', evidence: [] }] };
}
test('crear y editar dos proyectos no altera otro proyecto ni el perfil', () => {
  const state = fresh();
  const original = JSON.stringify(state);
  const a = M.createProject(state, template.project, 'Trabajo A');
  const b = M.createProject(state, template.project, 'Trabajo B');
  M.savePin(state, a.id, assigned(25));
  M.savePin(state, b.id, assigned(25, 'Relé'));
  assert.equal(a.pins.find((p) => p.gpio === 25).assignments[0].component, 'LED');
  assert.equal(b.pins.find((p) => p.gpio === 25).assignments[0].component, 'Relé');
  assert.equal(JSON.stringify({ ...state, projects: [state.projects[0]], activeProjectId: seed.activeProjectId }), original);
  assert.throws(() => M.createProject(state, template.project, '  '));
  M.renameProject(state, a.id, 'Nuevo nombre');
  assert.equal(a.name, 'Nuevo nombre');
  assert.equal(state.projects[0].name, seed.projects[0].name);
});
test('duplicar no hereda conexión/validación; borrar no permite eliminar el último', () => {
  const state = fresh();
  const duplicate = M.duplicateProject(state, seed.activeProjectId, 'Copia');
  assert.notEqual(duplicate.id, seed.activeProjectId);
  assert.ok(duplicate.pins.flatMap((p) => p.assignments).every((a) => a.connection === 'unknown' && a.validation.status === 'not-tested' && a.evidence.length === 0));
  duplicate.pins[0].notes = 'independiente';
  assert.notEqual(duplicate.pins[0].notes, state.projects[0].pins[0].notes);
  M.deleteProject(state, duplicate.id);
  assert.equal(state.activeProjectId, seed.activeProjectId);
  assert.throws(() => M.deleteProject(state, seed.activeProjectId), /último/);
});
test('solo entrada y conflictos se rechazan sin mutación parcial', () => {
  const state = fresh();
  const before = JSON.stringify(state);
  assert.throws(() => M.savePin(state, seed.activeProjectId, assigned(34)), /solo entrada/);
  const conflict = assigned(25);
  conflict.assignments.push(...assigned(25, 'Buzzer').assignments);
  assert.throws(() => M.savePin(state, seed.activeProjectId, conflict), /incompatibles/);
  assert.equal(JSON.stringify(state), before);
});
test('bus compartido requiere misma señal, interfaz y bus explícito', () => {
  const state = fresh();
  const pin = assigned(21, 'OLED', 'SDA', 'bus-1', 'I2C');
  pin.assignments[0].direction = 'bidirectional';
  const second = M.clone(pin.assignments[0]);
  second.id = M.id(); second.component = 'RTC';
  pin.assignments.push(second);
  M.savePin(state, seed.activeProjectId, pin);
  pin.assignments[1].busId = 'bus-2';
  assert.throws(() => M.savePin(state, seed.activeProjectId, pin), /incompatibles/);
  pin.assignments[1].busId = 'bus-1'; pin.assignments[1].signal = 'SCL';
  assert.throws(() => M.savePin(state, seed.activeProjectId, pin), /incompatibles/);
});
test('evidencia obligatoria y cambios de identidad invalidan prueba y conexión', () => {
  const state = fresh();
  let pin = assigned(25);
  pin.assignments[0].validation.status = 'passed';
  assert.throws(() => M.savePin(state, seed.activeProjectId, pin), /evidencia/);
  pin.assignments[0].validation.evidence = [evidence];
  pin.assignments[0].connection = 'reported';
  M.savePin(state, seed.activeProjectId, pin);
  pin = M.clone(M.project(state).pins.find((p) => p.gpio === 25));
  pin.notes = 'Solo anotación';
  M.savePin(state, seed.activeProjectId, pin);
  assert.equal(M.project(state).pins.find((p) => p.gpio === 25).assignments[0].validation.status, 'passed');
  pin.assignments[0].component = 'Relé';
  const result = M.savePin(state, seed.activeProjectId, pin);
  assert.ok(result.resetEvidence);
  assert.equal(M.project(state).pins.find((p) => p.gpio === 25).assignments[0].validation.status, 'not-tested');
  assert.equal(M.project(state).pins.find((p) => p.gpio === 25).assignments[0].connection, 'unknown');
});
test('una edición de notas no invalida la conexión DHT por normalizar mayúsculas', () => {
  const state = fresh();
  const pin = M.clone(M.project(state).pins.find((p) => p.gpio === 4));
  pin.assignments[0].interface = 'DIGITAL'; pin.notes = 'Solo una nota';
  assert.equal(M.savePin(state, seed.activeProjectId, pin).resetEvidence, false);
  assert.equal(M.project(state).pins.find((p) => p.gpio === 4).assignments[0].connection, 'reported');
});
test('adaptador generado coincide exactamente con JSON y Markdown canónicos', () => {
  const generated = {};
  require('node:vm').runInNewContext(fs.readFileSync(path.join(root, 'tools/gpio/data.js'), 'utf8'), generated);
  assert.deepEqual(JSON.parse(JSON.stringify(generated.GPIO_SEED.workspace)), seed);
  assert.deepEqual(JSON.parse(JSON.stringify(generated.GPIO_SEED.template)), template.project);
  assert.equal(generated.GPIO_SEED.guide, fs.readFileSync(path.join(root, 'docs/gpio/referencia-tecnica.md'), 'utf8'));
});
test('trasladar una señal es atómico, revisa destino y reinicia evidencia', () => {
  const state = fresh();
  const source = M.project(state).pins.find((p) => p.gpio === 13);
  const id = source.assignments[0].id;
  const before = JSON.stringify(state);
  assert.throws(() => M.moveAssignment(state, seed.activeProjectId, 13, id, 34), /solo entrada/);
  assert.throws(() => M.moveAssignment(state, seed.activeProjectId, 13, id, 1), /reservado/);
  assert.equal(JSON.stringify(state), before);
  M.moveAssignment(state, seed.activeProjectId, 13, id, 25);
  assert.equal(source.allocation, 'free');
  const target = M.project(state).pins.find((p) => p.gpio === 25);
  assert.equal(target.assignments[0].signal, 'CS');
  assert.equal(target.assignments[0].connection, 'unknown');
  assert.equal(target.assignments[0].validation.status, 'not-tested');
});

/*
 * Archivo: fase1.test.cjs
 * Descripción: Verifica datos y contrato inicial del registro GPIO; no prueba la futura UI.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.1 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.1 (2026-10-31): Config.h del repositorio padre.
 * Historial: 0.1.0 (2026-10-31): Comprobaciones de Fase 1.
 * Licencia: ../../docs/gpio/LICENCIAS.md
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../..');
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, 'docs/gpio', name), 'utf8'));
const expected = [1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39];
const unique = (values) => assert.equal(new Set(values).size, values.length);

test('colección versionada con proyecto activo y referencias únicas', () => {
  const data = read('registro.json');
  assert.equal(data.schemaVersion, '1.0.0');
  assert.equal(data.kind, 'gpio-workspace');
  unique(data.projects.map((p) => p.id));
  unique(data.boardProfiles.map((p) => p.id));
  unique(data.sources.map((s) => s.id));
  assert.ok(data.projects.some((p) => p.id === data.activeProjectId));
  for (const project of data.projects) {
    const profile = data.boardProfiles.find((p) => p.id === project.boardProfileId);
    assert.ok(profile);
    assert.ok(project.name.trim());
    assert.deepEqual(project.pins.map((p) => p.gpio).sort((a, b) => a - b), profile.pins.map((p) => p.gpio).sort((a, b) => a - b));
    unique(project.pins.flatMap((p) => p.assignments.map((a) => a.id)));
    for (const pin of project.pins) {
      assert.ok(['free', 'assigned', 'reserved'].includes(pin.allocation));
      assert.equal(typeof pin.notes, 'string');
      if (pin.allocation === 'free') assert.equal(pin.assignments.length, 0);
      if (pin.allocation === 'assigned') assert.ok(pin.assignments.length > 0);
      if (pin.allocation === 'reserved') assert.ok(pin.reservationReason.trim());
      for (const a of pin.assignments) {
        assert.ok(['input', 'output', 'bidirectional'].includes(a.direction));
        assert.ok(['unknown', 'reported', 'disconnected'].includes(a.connection));
        assert.ok(['not-tested', 'passed', 'failed'].includes(a.validation.status));
        if (a.validation.status !== 'not-tested') assert.ok(a.validation.evidence.length > 0);
        for (const e of [...a.evidence, ...a.validation.evidence]) {
          assert.ok(data.sources.some((s) => s.id === e.sourceId));
          assert.ok(e.detail.trim());
          assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/);
        }
      }
    }
  }
});

test('perfil de referencia: 25 GPIO y 5 contactos de control/alimentación, sin posiciones inventadas', () => {
  const profile = read('registro.json').boardProfiles[0];
  assert.deepEqual(profile.pins.map((p) => p.gpio), expected);
  assert.equal(profile.headerContactCount, 30);
  assert.equal(profile.nonGpioContacts.length, 5);
  assert.equal(profile.layoutConfirmation, 'reference-only');
  assert.ok(profile.pins.every((p) => p.headerPosition === null));
  assert.deepEqual(profile.unavailableGpios, [0, 6, 7, 8, 9, 10, 11, 37, 38]);
});

test('restricciones: entradas, pulls, ADC, DAC, Touch y arranque', () => {
  const profile = read('registro.json').boardProfiles[0];
  const pins = profile.pins;
  assert.deepEqual(pins.filter((p) => !p.output).map((p) => p.gpio), [34, 35, 36, 39]);
  for (const p of pins) {
    assert.equal(p.internalPulls, p.output);
    assert.equal(p.pwmOutput, p.output);
    assert.ok(p.sourceIds.every((id) => read('registro.json').sources.some((s) => s.id === id)));
  }
  assert.deepEqual(pins.filter((p) => p.strapping).map((p) => p.gpio), [2, 5, 12, 15]);
  assert.deepEqual(pins.filter((p) => p.adc?.unit === 1).map((p) => p.gpio), [32, 33, 34, 35, 36, 39]);
  assert.deepEqual(pins.filter((p) => p.dacChannel !== null).map((p) => p.gpio), [25, 26]);
  assert.deepEqual(pins.filter((p) => p.touchChannel !== null).map((p) => p.gpio), [2, 4, 12, 13, 14, 15, 27, 32, 33]);
  assert.ok(pins.find((p) => p.gpio === 12).warnings.includes('flash-voltage-strap'));
});

test('MicroSD coincide con Config.h actual; no incluye buzzer en GPIO13', () => {
  const config = fs.readFileSync(path.join(root, '../esp32_Project/Config.h'), 'utf8');
  const project = read('registro.json').projects[0];
  for (const [symbol, signal] of Object.entries({ sdCs: 'CS', sdSck: 'SCK', sdMiso: 'MISO', sdMosi: 'MOSI' })) {
    const match = config.match(new RegExp(`constexpr\\s+uint8_t\\s+${symbol}\\s*=\\s*(\\d+)\\s*;`));
    assert.ok(match, `No se encuentra ${symbol}`);
    const pin = project.pins.find((p) => p.gpio === Number(match[1]));
    assert.equal(pin.allocation, 'assigned');
    assert.ok(pin.assignments.some((a) => a.component === 'MicroSD' && a.signal === signal && a.connection === 'unknown'));
  }
  assert.equal(project.pins.find((p) => p.gpio === 13).assignments.length, 1);
});

test('registro inicial: 7 asignados, 2 reservados, 16 libres; ninguna validación física', () => {
  const project = read('registro.json').projects[0];
  for (const [state, count] of Object.entries({ assigned: 7, reserved: 2, free: 16 })) {
    assert.equal(project.pins.filter((p) => p.allocation === state).length, count);
  }
  assert.deepEqual(project.pins.filter((p) => p.allocation === 'reserved').map((p) => p.gpio), [1, 3]);
  assert.deepEqual(project.pins.filter((p) => p.assignments.some((a) => a.connection === 'reported')).map((p) => p.gpio), [4, 21, 22]);
  assert.ok(project.pins.flatMap((p) => p.assignments).every((a) => a.validation.status === 'not-tested' && a.validation.evidence.length === 0));
});

test('plantilla separada: no hereda componentes ni evidencias de trabajos anteriores', () => {
  const template = read('plantilla-proyecto.json');
  const data = read('registro.json');
  assert.equal(template.kind, 'gpio-project-template');
  assert.equal(template.schemaVersion, data.schemaVersion);
  assert.equal(template.project.boardProfileId, data.boardProfiles[0].id);
  assert.equal(template.project.id, null);
  assert.equal(template.project.name, '');
  assert.equal(template.project.createdAt, null);
  assert.deepEqual(template.project.pins.map((p) => p.gpio), expected);
  for (const p of template.project.pins) {
    assert.equal(p.assignments.length, 0);
    assert.equal(p.notes, '');
    assert.equal(p.allocation, [1, 3].includes(p.gpio) ? 'reserved' : 'free');
  }
  assert.ok(!data.projects.some((p) => p.id === template.project.id));
});

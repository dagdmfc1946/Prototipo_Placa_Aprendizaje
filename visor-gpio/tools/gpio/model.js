/* Archivo: model.js | Reglas de proyectos y asignaciones GPIO.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Fase 2. Licencia: ../../docs/gpio/LICENCIAS.md */
(function (root) {
  'use strict';
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota' }).format(new Date());
  const id = () => globalThis.crypto.randomUUID();
  const fail = (message) => { throw new Error(message); };
  const text = (value, label, max = 4000, required = false) => {
    if (typeof value !== 'string' || value.length > max || (required && !value.trim())) fail(`${label}: texto ${required ? 'obligatorio, ' : ''}máximo ${max} caracteres.`);
    return value.trim();
  };
  function date(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(`${value}T00:00:00Z`)) || new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value) fail('Fecha de evidencia inválida.');
  }
  function project(state, projectId = state.activeProjectId) {
    return state.projects.find((item) => item.id === projectId) || fail('Proyecto no encontrado.');
  }
  function profile(state, item = project(state)) {
    return state.boardProfiles.find((p) => p.id === item.boardProfileId) || fail('Perfil de placa no encontrado.');
  }
  function checkName(state, name) {
    text(name, 'Nombre del proyecto', 200, true);
    if (state.projects.length >= 100) fail('Límite de 100 proyectos. Exporta y organiza tus trabajos.');
  }
  function createProject(state, template, name, description = '') {
    checkName(state, name); text(description, 'Descripción');
    const item = clone(template);
    Object.assign(item, { id: id(), name: name.trim(), description: description.trim(), createdAt: today(), updatedAt: today() });
    state.projects.push(item); state.activeProjectId = item.id;
    return item;
  }
  function renameProject(state, projectId, name, description = project(state, projectId).description) {
    text(name, 'Nombre del proyecto', 200, true); text(description, 'Descripción');
    Object.assign(project(state, projectId), { name: name.trim(), description: description.trim(), updatedAt: today() });
  }
  function resetEvidence(assignment) {
    assignment.connection = 'unknown'; assignment.validation = { status: 'not-tested', evidence: [] }; assignment.evidence = [];
    return assignment;
  }
  function duplicateProject(state, projectId, name) {
    checkName(state, name);
    const item = clone(project(state, projectId));
    Object.assign(item, { id: id(), name: name.trim(), createdAt: today(), updatedAt: today() });
    item.pins.forEach((pin) => {
      pin.updatedAt = today();
      pin.assignments.forEach((a) => { a.id = id(); resetEvidence(a); });
    });
    state.projects.push(item); state.activeProjectId = item.id;
    return item;
  }
  function deleteProject(state, projectId) {
    project(state, projectId);
    if (state.projects.length === 1) fail('No se puede eliminar el último proyecto.');
    state.projects = state.projects.filter((p) => p.id !== projectId);
    if (state.activeProjectId === projectId) state.activeProjectId = state.projects[0].id;
  }
  function checkEvidence(evidence, required = false) {
    if (!Array.isArray(evidence) || evidence.length > 50 || (required && !evidence.length)) fail('La validación requiere evidencia con detalle, fecha y responsable.');
    evidence.forEach((entry) => {
      text(entry.sourceId, 'Fuente', 200, true); text(entry.detail, 'Detalle de evidencia', 4000, true);
      text(entry.reportedBy, 'Responsable de evidencia', 200, true); date(entry.date);
    });
  }
  function sameBus(assignments) {
    const first = assignments[0];
    if (!first.busId || !['I2C', 'SPI'].includes(first.interface)) return false;
    const allowed = first.interface === 'I2C' ? ['SDA', 'SCL'] : ['SCK', 'MOSI', 'MISO'];
    return allowed.includes(first.signal.toUpperCase()) && assignments.every((a) => a.busId === first.busId && a.interface === first.interface && a.signal.toUpperCase() === first.signal.toUpperCase() && a.direction === first.direction);
  }
  function checkPin(pin, technical) {
    if (!technical || pin.gpio !== technical.gpio) fail('GPIO ajeno al perfil.');
    if (!['free', 'assigned', 'reserved'].includes(pin.allocation)) fail('Estado de asignación inválido.');
    text(pin.notes, 'Notas'); text(pin.reservationReason, 'Motivo de reserva', 4000, pin.allocation === 'reserved');
    if (!Array.isArray(pin.assignments) || pin.assignments.length > 20) fail('Máximo 20 asignaciones por GPIO.');
    if (pin.allocation === 'assigned' && !pin.assignments.length) fail('Añade una señal para marcar el GPIO como asignado.');
    if (pin.allocation !== 'assigned' && pin.assignments.length) fail('Un GPIO libre o reservado no puede contener asignaciones activas.');
    const ids = new Set();
    for (const a of pin.assignments) {
      text(a.id, 'ID de señal', 200, true);
      if (ids.has(a.id)) fail('ID de señal duplicado.'); ids.add(a.id);
      text(a.component, 'Componente', 200, true); text(a.signal, 'Señal', 200, true);
      text(a.interface, 'Interfaz', 200, true); text(a.notes, 'Notas de señal');
      if (a.busId !== null) text(a.busId, 'Bus', 200, true);
      if (!['input', 'output', 'bidirectional'].includes(a.direction)) fail('Dirección inválida.');
      if (!technical.output && a.direction !== 'input') fail(`GPIO${pin.gpio} es solo entrada; no admite salida ni señal bidireccional.`);
      if (!['unknown', 'reported', 'disconnected'].includes(a.connection)) fail('Estado de conexión inválido.');
      if (!a.validation || !['not-tested', 'passed', 'failed'].includes(a.validation.status)) fail('Estado de validación inválido.');
      checkEvidence(a.evidence); checkEvidence(a.validation.evidence, a.validation.status !== 'not-tested');
      if (a.validation.status === 'not-tested' && a.validation.evidence.length) fail('Una señal sin probar no contiene resultados de prueba vigentes.');
    }
    if (pin.assignments.length > 1 && !sameBus(pin.assignments)) fail('Asignaciones incompatibles: solo se comparte la misma señal de un bus I2C/SPI explícito.');
  }
  const identity = (a) => JSON.stringify([a.component, a.signal, a.direction, a.interface.toUpperCase(), a.busId]);
  function manualSource(state) {
    if (!state.sources.some((s) => s.id === 'user-session')) state.sources.push({ id: 'user-session', location: 'local:user-session', revision: 'Anotación manual del usuario; no medición automática', accessedAt: today() });
  }
  function savePin(state, projectId, candidate) {
    const item = project(state, projectId);
    const old = item.pins.find((p) => p.gpio === candidate.gpio) || fail('GPIO no encontrado.');
    const pin = clone(candidate);
    let reset = false;
    for (const a of pin.assignments) {
      const previous = old.assignments.find((entry) => entry.id === a.id);
      if (previous && identity(previous) !== identity(a)) { resetEvidence(a); reset = true; }
    }
    checkPin(pin, profile(state, item).pins.find((p) => p.gpio === pin.gpio));
    const otherIds = new Set(item.pins.filter((p) => p.gpio !== pin.gpio).flatMap((p) => p.assignments.map((a) => a.id)));
    if (pin.assignments.some((a) => otherIds.has(a.id))) fail('ID de señal repetido en el proyecto.');
    for (const a of pin.assignments) {
      for (const e of [...a.evidence, ...a.validation.evidence]) {
        if (e.sourceId !== 'user-session' && !state.sources.some((s) => s.id === e.sourceId)) fail('Fuente de evidencia desconocida.');
      }
    }
    if (pin.assignments.some((a) => [...a.evidence, ...a.validation.evidence].some((e) => e.sourceId === 'user-session'))) manualSource(state);
    pin.updatedAt = today(); item.updatedAt = today(); Object.assign(old, pin);
    return { pin: old, resetEvidence: reset };
  }
  function moveAssignment(state, projectId, fromGpio, assignmentId, toGpio) {
    if (fromGpio === toGpio) fail('Selecciona un GPIO de destino diferente.');
    const item = project(state, projectId);
    const source = item.pins.find((p) => p.gpio === fromGpio) || fail('Origen no encontrado.');
    const target = item.pins.find((p) => p.gpio === toGpio) || fail('Destino no encontrado.');
    if (target.allocation === 'reserved') fail('El destino está reservado. Libéralo explícitamente antes de trasladar.');
    const assignment = clone(source.assignments.find((a) => a.id === assignmentId) || fail('Señal no encontrada.'));
    resetEvidence(assignment);
    const nextTarget = clone(target); nextTarget.assignments.push(assignment); nextTarget.allocation = 'assigned';
    checkPin(nextTarget, profile(state, item).pins.find((p) => p.gpio === toGpio));
    // Confirmar destino antes de tocar origen evita traslados parciales.
    Object.assign(target, nextTarget, { updatedAt: today() });
    source.assignments = source.assignments.filter((a) => a.id !== assignmentId);
    if (!source.assignments.length) source.allocation = 'free';
    source.updatedAt = today(); item.updatedAt = today();
  }
  const api = { clone, today, id, text, date, project, profile, createProject, renameProject, duplicateProject, deleteProject, checkEvidence, checkPin, resetEvidence, savePin, moveAssignment };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GpioModel = api;
})(globalThis);

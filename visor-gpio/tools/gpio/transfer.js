/* Archivo: transfer.js | Importación/exportación JSON validada y atómica.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Fase 3. Licencia: ../../docs/gpio/LICENCIAS.md */
(function (root) {
  'use strict';
  const M = typeof module !== 'undefined' && module.exports ? require('./model.js') : root.GpioModel;
  const MAX_BYTES = 2 * 1024 * 1024;
  const fail = (message) => { throw new Error(message); };
  function shape(value, keys) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail('Se esperaba un objeto JSON.');
    const actual = Object.keys(value).sort();
    if (JSON.stringify(actual) !== JSON.stringify(keys.split(' ').sort())) fail('Campos ausentes o inesperados en el JSON.');
  }
  function list(value, min, max) {
    if (!Array.isArray(value) || value.length < min || value.length > max) fail(`Lista fuera de límites (${min}–${max}).`);
  }
  function unique(items, key) {
    const values = items.map((item) => item[key]);
    if (new Set(values).size !== values.length) fail(`Identificador ${key} repetido.`);
  }
  function stable(value) {
    if (Array.isArray(value)) return value.map(stable);
    if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
    return value;
  }
  const same = (a, b) => JSON.stringify(stable(a)) === JSON.stringify(stable(b));
  function checkMetadata(meta) {
    shape(meta, 'author instagram repository version updatedAt license history');
    for (const key of ['author', 'instagram', 'repository', 'version', 'license']) M.text(meta[key], key, 1000, true);
    M.date(meta.updatedAt); list(meta.history, 0, 100); meta.history.forEach((s) => M.text(s, 'Historial'));
  }
  function validateWorkspace(value, trustedProfiles) {
    if (new TextEncoder().encode(JSON.stringify(value, null, 2) + '\n').length > MAX_BYTES) fail('La colección supera 2 MiB. Conserva respaldos y distribuye los trabajos antes de añadir más datos.');
    shape(value, 'schemaVersion kind metadata sources boardProfiles projects activeProjectId');
    if (value.kind !== 'gpio-workspace' || value.schemaVersion !== '1.0.0') fail('Tipo o versión JSON no compatible. Se requiere esquema 1.0.0.');
    checkMetadata(value.metadata);
    list(value.boardProfiles, 1, trustedProfiles.length); unique(value.boardProfiles, 'id');
    for (const p of value.boardProfiles) {
      const known = trustedProfiles.find((item) => item.id === p.id);
      if (!known || !same(known, p)) fail('Perfil técnico desconocido o modificado. No se alteran restricciones mediante importación.');
    }
    list(value.sources, 1, 200); unique(value.sources, 'id');
    for (const s of value.sources) {
      shape(s, 'id location revision accessedAt');
      M.text(s.id, 'ID de fuente', 200, true); M.text(s.location, 'Ubicación de fuente', 2000, true); M.text(s.revision, 'Revisión de fuente', 2000, true); M.date(s.accessedAt);
    }
    list(value.projects, 1, 100); unique(value.projects, 'id');
    M.text(value.activeProjectId, 'Proyecto activo', 200, true);
    if (!value.projects.some((p) => p.id === value.activeProjectId)) fail('El proyecto activo no existe.');
    const sourceIds = new Set(value.sources.map((s) => s.id));
    for (const p of value.projects) {
      shape(p, 'id name description boardProfileId createdAt updatedAt pins');
      M.text(p.id, 'ID de proyecto', 200, true); M.text(p.name, 'Nombre', 200, true); M.text(p.description, 'Descripción');
      M.date(p.createdAt); M.date(p.updatedAt);
      const profile = value.boardProfiles.find((item) => item.id === p.boardProfileId);
      if (!profile) fail('Proyecto con perfil inexistente.');
      list(p.pins, profile.pins.length, profile.pins.length); unique(p.pins, 'gpio');
      const assignmentIds = [];
      for (const pin of p.pins) {
        shape(pin, 'gpio allocation reservationReason assignments notes updatedAt');
        if (!Number.isInteger(pin.gpio)) fail('El GPIO debe ser entero.');
        if (pin.updatedAt !== null) M.date(pin.updatedAt);
        const technical = profile.pins.find((item) => item.gpio === pin.gpio);
        M.checkPin(pin, technical);
        if (pin.allocation !== 'reserved' && pin.reservationReason !== '') fail('Motivo de reserva incompatible con el estado.');
        for (const a of pin.assignments) {
          shape(a, 'id component signal direction interface busId connection validation notes evidence');
          shape(a.validation, 'status evidence'); assignmentIds.push(a.id);
          for (const e of [...a.evidence, ...a.validation.evidence]) {
            shape(e, 'sourceId detail date reportedBy');
            if (!sourceIds.has(e.sourceId)) fail('Fuente de evidencia inexistente.');
          }
        }
      }
      if (new Set(assignmentIds).size !== assignmentIds.length) fail('ID de asignación repetido en un proyecto.');
    }
    return M.clone(value);
  }
  function parseText(text, trustedProfiles) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_BYTES) fail('El JSON supera 2 MiB.');
    let value;
    try { value = JSON.parse(text); } catch { fail('El archivo no contiene JSON válido.'); }
    if (value?.kind === 'gpio-project') {
      shape(value, 'schemaVersion kind metadata sources boardProfiles project');
      const workspace = { schemaVersion: value.schemaVersion, kind: 'gpio-workspace', metadata: value.metadata, sources: value.sources, boardProfiles: value.boardProfiles, projects: [value.project], activeProjectId: value.project?.id };
      return { kind: 'gpio-project', workspace: validateWorkspace(workspace, trustedProfiles) };
    }
    return { kind: 'gpio-workspace', workspace: validateWorkspace(value, trustedProfiles) };
  }
  function exportProject(state, projectId) {
    const item = M.project(state, projectId);
    return M.clone({ schemaVersion: state.schemaVersion, kind: 'gpio-project', metadata: state.metadata, sources: state.sources, boardProfiles: [M.profile(state, item)], project: item });
  }
  function mergeSources(target, source) {
    for (const item of source) {
      const existing = target.find((s) => s.id === item.id);
      if (existing && (existing.location !== item.location || existing.revision !== item.revision)) fail('Colisión de fuentes: mismo ID con procedencia diferente.');
      if (!existing) target.push(M.clone(item));
    }
  }
  function importData(current, parsed, mode) {
    if (!['add', 'restore'].includes(mode)) fail('Modo de importación inválido.');
    const incoming = validateWorkspace(parsed.workspace, current.boardProfiles);
    if (mode === 'restore' && parsed.kind === 'gpio-workspace') return incoming;
    const next = M.clone(current);
    mergeSources(next.sources, incoming.sources);
    for (const item of incoming.projects) {
      if (mode === 'add') {
        const donor = M.clone(item);
        donor.id = M.id(); donor.name = `${donor.name.slice(0, 190)} (importado)`;
        donor.createdAt = M.today(); donor.updatedAt = M.today();
        donor.pins.forEach((p) => { p.updatedAt = M.today(); p.assignments.forEach((a) => { a.id = M.id(); M.resetEvidence(a); }); });
        next.projects.push(donor); next.activeProjectId = donor.id;
      } else {
        const index = next.projects.findIndex((p) => p.id === item.id);
        if (index < 0) next.projects.push(M.clone(item)); else next.projects[index] = M.clone(item);
        next.activeProjectId = item.id;
      }
    }
    return validateWorkspace(next, current.boardProfiles);
  }
  const api = { MAX_BYTES, validateWorkspace, parseText, exportProject, importData };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GpioTransfer = api;
})(globalThis);

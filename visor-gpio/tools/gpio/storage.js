/* Archivo: storage.js | Guardado local con copia anterior y detección de conflictos.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Fase 3. Licencia: ../../docs/gpio/LICENCIAS.md */
(function (root) {
  'use strict';
  const KEY = 'gpio-workbench.v1';
  const BACKUP = 'gpio-workbench.v1.backup';
  function createStore(storage, validate) {
    let expected = null;
    let paused = false;
    const decode = (raw) => raw === null ? null : validate(JSON.parse(raw));
    function load() {
      try {
        if (!storage) throw new Error('El navegador bloquea el almacenamiento local.');
        expected = storage.getItem(KEY);
        return { workspace: decode(expected), error: null };
      } catch (error) { paused = true; return { workspace: null, error: error.message }; }
    }
    function backup() {
      try { return storage ? decode(storage.getItem(BACKUP)) : null; } catch { return null; }
    }
    function save(workspace, force = false) {
      try {
        if (!storage) throw new Error('Almacenamiento local no disponible. Exporta un JSON para conservar tus cambios.');
        if (paused && !force) throw new Error('Guardado pausado: revisa la recuperación o reactiva el guardado explícitamente.');
        const raw = storage.getItem(KEY);
        if (!force && raw !== expected) { paused = true; return { ok: false, conflict: true, error: 'Otra pestaña modificó el registro. Exporta tu sesión antes de decidir qué versión conservar.' }; }
        const next = JSON.stringify(validate(workspace));
        if (raw !== next) {
          let previous = null;
          try { previous = decode(raw); } catch { /* Nunca respaldar JSON corrupto sobre una copia válida. */ }
          if (previous) storage.setItem(BACKUP, JSON.stringify(previous));
          storage.setItem(KEY, next);
        }
        expected = next; paused = false;
        return { ok: true };
      } catch (error) { return { ok: false, error: error.message }; }
    }
    return { load, save, backup, pause: () => { paused = true; } };
  }
  const api = { KEY, BACKUP, createStore };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GpioStorage = api;
})(globalThis);

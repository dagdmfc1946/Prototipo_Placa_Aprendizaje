/* Archivo: app.js | Interfaz local de proyectos, GPIO y documentación.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.2.1 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.2.1 (2026-10-31): Enlaces de fuentes desde carpeta exclusiva. 0.1.0: Fases 2–4. 0.2.0 (2026-10-31): Ventana rápida sobre placa visual. Licencia: ../../docs/gpio/LICENCIAS.md */
(function () {
  'use strict';
  const M = GpioModel, T = GpioTransfer, S = GpioStorage, seed = GPIO_SEED;
  const $ = (id) => document.getElementById(id);
  const labels = { free: 'Libre', assigned: 'Asignado', reserved: 'Reservado', unknown: 'Sin confirmar', reported: 'Informada', disconnected: 'Desconectada', 'not-tested': 'Sin probar', passed: 'Aprobada por usuario', failed: 'Fallida según usuario' };
  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined && text !== null) element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  const on = (id, type, handler) => $(id).addEventListener(type, (event) => {
    try { Promise.resolve(handler(event)).catch((error) => notice(error.message, true)); }
    catch (error) { notice(error.message, true); }
  });
  let storage = null;
  try { storage = window.localStorage; } catch { /* Modo memoria con exportación manual. */ }
  const store = S.createStore(storage, (value) => T.validateWorkspace(value, seed.workspace.boardProfiles));
  const loaded = store.load();
  let state = loaded.workspace || M.clone(seed.workspace);
  let draft, dirty = false, memoryUnsaved = false, savingPaused = Boolean(loaded.error), dialogResolve;
  const views = new Map();
  const current = () => M.project(state);
  function transact(change) {
    const next = M.clone(state); const result = change(next);
    T.validateWorkspace(next, seed.workspace.boardProfiles);
    state = next; return result;
  }
  function view() {
    if (!views.has(state.activeProjectId)) views.set(state.activeProjectId, { selected: 13, search: '', allocation: 'all', capability: 'all', mode: 'map' });
    return views.get(state.activeProjectId);
  }
  function notice(message, error = false) { $('notice').textContent = message; $('notice').classList.toggle('error', error); }
  function saveStatus(result) {
    $('save-state').textContent = result.ok ? 'Guardado local actualizado' : 'Cambios en memoria · guardado pendiente';
    $('save-detail').textContent = result.ok ? 'Respalda en JSON: el guardado depende del navegador y de la ruta de este archivo.' : `${result.error} Exporta un respaldo JSON antes de cerrar.`;
    $('resume-save').hidden = result.ok;
    $('recover-backup').hidden = !store.backup();
  }
  function persist(message, force = false) {
    memoryUnsaved = true;
    const result = savingPaused && !force ? { ok: false, error: 'Autoguardado pausado por conflicto o datos no válidos.' } : store.save(state, force);
    if (result.ok) { savingPaused = false; memoryUnsaved = false; }
    if (result.conflict) savingPaused = true;
    saveStatus(result); notice(message + (result.ok ? '' : ' El cambio está solo en memoria.'), !result.ok);
  }
  function showDirty() { dirty = true; $('draft-state').textContent = 'Edición pendiente de aplicar; todavía no está guardada.'; }
  function showFormError(message) { const box = $('form-error'); box.textContent = message; box.hidden = false; box.tabIndex = -1; box.focus(); }
  function ask({ title, body, fields = false, name = '', description = '', confirm = 'Confirmar', importMode = false, backup = false }) {
    $('dialog-heading').textContent = title; $('dialog-description').textContent = body;
    $('dialog-fields').hidden = !fields; $('dialog-name').value = name; $('dialog-project-description').value = description;
    $('dialog-confirm').textContent = confirm; $('dialog-error').hidden = true;
    $('import-mode-label').hidden = !importMode; $('import-mode').value = 'add'; $('backup-delete').hidden = !backup;
    $('action-dialog').showModal();
    (fields ? $('dialog-name') : $('dialog-cancel')).focus();
    return new Promise((resolve) => { dialogResolve = resolve; });
  }
  function finishDialog(result) { $('action-dialog').close(); const resolve = dialogResolve; dialogResolve = null; if (resolve) resolve(result); }
  on('dialog-cancel', 'click', () => finishDialog(null));
  $('action-dialog').addEventListener('cancel', (event) => { event.preventDefault(); finishDialog(null); });
  on('dialog-form', 'submit', (event) => {
    event.preventDefault();
    if (!$('dialog-fields').hidden) {
      try { M.text($('dialog-name').value, 'Nombre del proyecto', 200, true); }
      catch (error) { $('dialog-error').textContent = error.message; $('dialog-error').hidden = false; $('dialog-name').focus(); return; }
    }
    finishDialog({ name: $('dialog-name').value, description: $('dialog-project-description').value, mode: $('import-mode').value });
  });
  on('backup-delete', 'click', () => finishDialog({ backup: true }));
  async function ensureClean() {
    if (!dirty) return true;
    const answer = await ask({ title: 'Hay una edición pendiente', body: 'Puedes cancelar para aplicar tus cambios, o descartarlos para continuar. Los cambios ya aplicados se conservan.', confirm: 'Descartar edición' });
    if (!answer) return false;
    renderEditor(); return true;
  }
  function option(select, value, label) { const item = node('option', label); item.value = value; select.append(item); }
  function renderProjects() {
    const select = $('project-select'); select.replaceChildren();
    state.projects.forEach((p) => option(select, p.id, `${p.name}${state.projects.filter((other) => other.name === p.name).length > 1 ? ` · ${p.id.slice(-8)}` : ''}`));
    select.value = state.activeProjectId; $('project-description').textContent = current().description || 'Proyecto independiente · asignaciones propias';
    $('delete-project').disabled = state.projects.length === 1;
  }
  function renderSummary() {
    const pins = current().pins;
    const counts = [['free', 'Libres', 'sin asignación'], ['assigned', 'Asignados', 'uso registrado'], ['reserved', 'Reservados', 'uso protegido'], ['reported', 'Conexión informada', 'no implica prueba']];
    $('summary').replaceChildren(...counts.map(([key, label, helper]) => {
      const count = pins.filter((p) => key === 'reported' ? p.assignments.some((a) => a.connection === key) : p.allocation === key).length;
      const item = node('div', null, 'metric'); const description = node('div'); description.append(node('span', label, 'metric-label'), node('span', helper)); item.append(node('strong', String(count)), description); return item;
    }));
  }
  function matches(pin) {
    const v = view(); const tech = M.profile(state).pins.find((p) => p.gpio === pin.gpio);
    const term = `${pin.gpio} GPIO${pin.gpio} ${tech.label} ${pin.notes} ${pin.assignments.map((a) => `${a.component} ${a.signal} ${a.interface}`).join(' ')}`.toLocaleLowerCase('es');
    const capabilities = { all: true, adc1: tech.adc?.unit === 1, adc2: tech.adc?.unit === 2, 'input-only': !tech.output, dac: tech.dacChannel !== null, touch: tech.touchChannel !== null, strapping: tech.strapping };
    return (!v.search || term.includes(v.search.toLocaleLowerCase('es'))) && (v.allocation === 'all' || pin.allocation === v.allocation) && capabilities[v.capability];
  }
  async function selectPin(gpio) {
    if (!await ensureClean()) return;
    view().selected = gpio; renderPins(); renderEditor(); $('pin-editor').showModal(); $('quick-free').focus();
  }
  function contactInfo(title, description) {
    $('contact-heading').textContent = title; $('contact-description').textContent = description; $('contact-dialog').showModal();
  }
  function renderBoard(pins) {
    const visible = new Set(pins.map((p) => p.gpio));
    const columns = [];
    for (const side of ['left', 'right']) {
      const column = node('div', null, `pin-column ${side}`);
      for (const contact of GpioBoard.layout[side]) {
        const slot = node('div', null, 'pin-slot');
        if (contact.gpio === undefined) {
          const button = node('button', null, 'fixed-contact'); button.type = 'button';
          button.append(node('span', '—', 'pin-mark fixed'), node('strong', contact.label), node('small', contact.label === 'EN' ? 'Control' : 'Alimentación'));
          button.setAttribute('aria-label', `${contact.label}: no es un GPIO asignable. Consultar información`); button.setAttribute('aria-haspopup', 'dialog');
          button.addEventListener('click', () => contactInfo(contact.label, contact.description)); slot.append(button);
        } else {
          const pin = current().pins.find((p) => p.gpio === contact.gpio);
          const technical = M.profile(state).pins.find((p) => p.gpio === contact.gpio);
          const indicator = GpioBoard.indicator(technical);
          const title = pin.assignments.map((a) => a.signal === 'Conexión' ? a.component : `${a.component} ${a.signal}`).join(' · ');
          const status = pin.allocation === 'assigned' ? 'En uso' : labels[pin.allocation];
          const button = node('button', null, `pin-button ${pin.allocation}`); button.type = 'button'; button.dataset.gpio = pin.gpio;
          button.disabled = !visible.has(pin.gpio); button.setAttribute('aria-pressed', String(view().selected === pin.gpio)); button.setAttribute('aria-haspopup', 'dialog');
          button.setAttribute('aria-label', `GPIO${pin.gpio} / ${contact.label}: ${title || status}. ${status}. ${indicator.label}. Abrir conexión y características.`);
          button.title = `GPIO${pin.gpio} · ${title || status} · ${indicator.label}`;
          const description = node('span', null, 'pin-description');
          description.append(node('strong', `GPIO${pin.gpio} · ${contact.label}`), node('span', title || status));
          const mark = node('span', indicator.mark, `pin-mark ${indicator.category}`); mark.setAttribute('aria-hidden', 'true');
          const stateLabel = node('span', status, `pin-state ${pin.allocation}`);
          button.append(mark, description, stateLabel);
          button.addEventListener('click', () => selectPin(pin.gpio)); slot.append(button);
        }
        column.append(slot);
      }
      columns.push(column);
    }
    const illustration = node('img', null, 'board-picture'); illustration.src = 'board.svg'; illustration.alt = 'Dibujo original ESP32 de referencia: antena arriba, USB abajo; disposición de la unidad no confirmada.'; illustration.width = 280; illustration.height = 800;
    $('board-map').replaceChildren(columns[0], illustration, columns[1]);
  }
  function renderPins() {
    const pins = current().pins.filter(matches); const v = view();
    $('filter-count').textContent = `${pins.length} de ${current().pins.length} GPIO`;
    $('map-view').setAttribute('aria-pressed', String(v.mode === 'map')); $('table-view').setAttribute('aria-pressed', String(v.mode === 'table'));
    $('map-container').hidden = v.mode !== 'map'; $('table-container').hidden = v.mode !== 'table'; $('empty-filter').hidden = pins.length > 0;
    renderBoard(pins);
    const rows = [];
    for (const pin of pins) {
      const title = pin.assignments.map((a) => `${a.component} ${a.signal}`).join(' · ') || labels[pin.allocation];
      const row = node('tr', null, v.selected === pin.gpio ? 'selected' : '');
      const number = node('th', `GPIO${pin.gpio}`); number.scope = 'row';
      const assignment = node('td'); assignment.append(node('span', labels[pin.allocation], `state ${pin.allocation}`), node('small', title));
      const status = node('td'); status.append(node('span', pin.assignments.map((a) => labels[a.connection]).join(' · ') || '—'), node('small', pin.assignments.map((a) => labels[a.validation.status]).join(' · ') || 'Sin prueba registrada'));
      const action = node('td'), edit = node('button', `Editar GPIO${pin.gpio}`); edit.type = 'button'; edit.addEventListener('click', () => selectPin(pin.gpio)); action.append(edit); row.append(number, assignment, status, action); rows.push(row);
    }
    $('pin-table').replaceChildren(...rows);
  }
  const warnings = {
    'input-only': 'Solo entrada: no conectar una función que necesite salida.', 'no-internal-pulls': 'Sin pull-up/pull-down internos; revisar polarización externa.',
    strapping: 'Configuración de arranque: revisar niveles externos durante reset.', 'flash-voltage-strap': 'GPIO12 interviene en la tensión de flash: revisar módulo y arranque antes de conectar.',
    'uart0-console': 'UART0: programación y consola pueden usar este pin.', 'jtag-shared': 'Comparte funciones con JTAG; revisar si se usa depuración.',
    'adc2-wifi': 'ADC2 comparte recursos con Wi-Fi; revisar la conversión analógica concurrente.', 'irq-sleep-adc-review': 'Revisar erratas de interrupción con ADC/radios y modos de sueño.',
    'verify-module-variant': 'Confirmar variante del módulo y uso de PSRAM antes de reutilizar este GPIO.'
  };
  function sourceLink(source) {
    const trusted = seed.workspace.sources.find((s) => s.id === source.id);
    if (!trusted) return node('span', `${source.id}: ${source.revision}`);
    const link = node('a', `${source.id} · ${trusted.revision}`);
    const localBase = ['config-p17a', 'p17a'].includes(trusted.id) ? '../../../' : '../../';
    link.href = trusted.location.startsWith('https://') ? trusted.location : `${localBase}${trusted.location}`; link.target = '_blank'; link.rel = 'noopener'; return link;
  }
  function renderTechnical() {
    const tech = M.profile(state).pins.find((p) => p.gpio === view().selected);
    const badges = ['Entrada', tech.output ? 'Salida / PWM' : 'Solo entrada', tech.adc ? `ADC${tech.adc.unit} · CH${tech.adc.channel}` : null, tech.dacChannel !== null ? `DAC${tech.dacChannel}` : null, tech.touchChannel !== null ? `Touch ${tech.touchChannel}` : null].filter(Boolean);
    const list = node('div', null, 'capabilities'); list.append(...badges.map((text) => node('span', text, 'tag')));
    $('technical').replaceChildren(list);
    if (tech.warnings.length) $('technical').append(node('p', tech.warnings.map((key) => warnings[key]).join(' '), 'warning'));
    const detail = node('div'); detail.append(node('p', 'Lógica de 3,3 V. No aplicar señales de 5 V directamente. Perfil de referencia; posición física pendiente de confirmar.'));
    tech.sourceIds.forEach((id) => { const p = node('p'); p.append(sourceLink(seed.workspace.sources.find((s) => s.id === id))); detail.append(p); });
    $('technical-detail').replaceChildren(detail);
    const uses = [tech.output ? 'Usos posibles: entrada/salida digital, PWM y señales I2C, SPI o UART según configuración y restricciones.' : 'Usos posibles: entrada digital, lectura analógica o recepción de señales compatibles. No genera salidas, PWM ni un bus I2C completo.', tech.adc ? `Entrada analógica ADC${tech.adc.unit}, canal ${tech.adc.channel}.` : '', tech.dacChannel !== null ? `Salida analógica DAC${tech.dacChannel}.` : '', tech.touchChannel !== null ? `Detección táctil: canal ${tech.touchChannel}.` : ''].filter(Boolean);
    $('pin-uses').textContent = uses.join(' ');
  }
  function field(container, label, key, value, choices, type = 'text', wide = false) {
    const wrapper = node('label', label, wide ? 'wide' : ''); const input = node(choices ? 'select' : type === 'textarea' ? 'textarea' : 'input');
    input.dataset.field = key;
    if (choices) choices.forEach(([val, caption]) => option(input, val, caption));
    else if (type === 'textarea') { input.rows = 2; input.maxLength = 4000; }
    else { input.type = type; if (type !== 'date') input.maxLength = 200; }
    input.value = value ?? ''; wrapper.append(input); container.append(wrapper); return input;
  }
  function renderAssignments() {
    $('assignment-list').replaceChildren();
    for (const [index, a] of draft.assignments.entries()) {
      const group = node('fieldset', null, 'signal-fields'); group.dataset.assignmentId = a.id; group.append(node('legend', `Señal ${index + 1}`));
      const grid = node('div', null, 'signal-grid');
      field(grid, 'Componente', 'component', a.component); field(grid, 'Señal / función', 'signal', a.signal);
      field(grid, 'Interfaz (I2C, SPI, DIGITAL…)', 'interface', a.interface); field(grid, 'Bus compartido (opcional)', 'busId', a.busId);
      field(grid, 'Dirección respecto al ESP32', 'direction', a.direction, [['input', 'Entrada'], ['output', 'Salida'], ['bidirectional', 'Bidireccional']]);
      field(grid, 'Conexión física', 'connection', a.connection, [['unknown', 'Sin confirmar'], ['reported', 'Informada por usuario'], ['disconnected', 'Desconectada']]);
      const validation = field(grid, 'Resultado de prueba', 'validation', a.validation.status, [['not-tested', 'Sin probar'], ['passed', 'Aprobada por usuario'], ['failed', 'Fallida según usuario']], 'text', true);
      group.append(grid);
      const details = node('details'); details.append(node('summary', 'Evidencia y notas de esta señal'));
      const evidenceGrid = node('div', null, 'signal-grid'); const last = a.evidence.at(-1); const lastTest = a.validation.evidence.at(-1);
      field(evidenceGrid, 'Evidencia de asignación / conexión', 'assignmentDetail', last?.detail || '', null, 'textarea', true);
      field(evidenceGrid, 'Informado por', 'assignmentReporter', last?.reportedBy || 'Usuario'); field(evidenceGrid, 'Fecha de información', 'assignmentDate', last?.date || M.today(), null, 'date');
      field(evidenceGrid, 'Evidencia del resultado de prueba', 'testDetail', lastTest?.detail || '', null, 'textarea', true);
      field(evidenceGrid, 'Responsable de la prueba', 'testReporter', lastTest?.reportedBy || ''); field(evidenceGrid, 'Fecha de prueba', 'testDate', lastTest?.date || M.today(), null, 'date');
      field(evidenceGrid, 'Notas de la señal', 'notes', a.notes, null, 'textarea', true);
      details.append(evidenceGrid, node('p', 'Aprobar o fallar requiere evidencia, fecha y responsable. Cambiar la función o trasladarla reinicia conexión y prueba.', 'evidence-hint'));
      details.open = a.validation.status !== 'not-tested'; validation.addEventListener('change', () => { if (validation.value !== 'not-tested') details.open = true; });
      const controls = node('div', null, 'signal-controls'); const remove = node('button', 'Quitar señal', 'danger-quiet'); remove.type = 'button';
      remove.addEventListener('click', () => { draft = readDraft(); draft.assignments.splice(index, 1); renderAssignments(); showDirty(); }); controls.append(remove);
      group.append(details, controls); $('assignment-list').append(group);
    }
    $('assignment-list').hidden = $('pin-allocation').value !== 'assigned'; $('add-assignment').hidden = $('pin-allocation').value !== 'assigned';
    syncQuickFromAdvanced();
  }
  function readDraft() {
    const pin = M.clone(draft); pin.allocation = $('pin-allocation').value; pin.reservationReason = pin.allocation === 'reserved' ? $('reservation-reason').value : ''; pin.notes = $('pin-notes').value;
    pin.assignments = Array.from($('assignment-list').children).map((group) => {
      const previous = draft.assignments.find((a) => a.id === group.dataset.assignmentId);
      const a = M.clone(previous); const get = (key) => group.querySelector(`[data-field="${key}"]`).value;
      for (const key of ['component', 'signal', 'direction', 'interface', 'connection', 'notes']) a[key] = get(key).trim();
      a.interface = a.interface.toUpperCase(); a.busId = get('busId').trim() || null;
      function evidence(prefix, old) {
        const detail = get(prefix + 'Detail').trim(), reportedBy = get(prefix + 'Reporter').trim(), date = get(prefix + 'Date');
        if (!detail) return [];
        const last = old.at(-1);
        return last && last.detail === detail && last.reportedBy === reportedBy && last.date === date ? M.clone(old) : [{ sourceId: 'user-session', detail, reportedBy, date }];
      }
      a.evidence = evidence('assignment', a.evidence); a.validation = { status: get('validation'), evidence: get('validation') === 'not-tested' ? [] : evidence('test', a.validation.evidence) };
      return a;
    });
    return pin;
  }
  function blankAssignment() { return { id: M.id(), component: '', signal: '', direction: 'input', interface: 'DIGITAL', busId: null, connection: 'unknown', validation: { status: 'not-tested', evidence: [] }, notes: '', evidence: [] }; }
  function renderEditor() {
    draft = M.clone(current().pins.find((p) => p.gpio === view().selected)); dirty = false;
    $('editor-heading').textContent = `GPIO${draft.gpio}`; $('editor-allocation').textContent = labels[draft.allocation];
    $('pin-allocation').value = draft.allocation; $('reservation-reason').value = draft.reservationReason; $('reservation-label').hidden = draft.allocation !== 'reserved'; $('pin-notes').value = draft.notes;
    $('form-error').hidden = true; $('draft-state').textContent = 'Sin cambios pendientes.'; renderTechnical(); renderAssignments();
    $('move-signal').replaceChildren(); draft.assignments.forEach((a) => option($('move-signal'), a.id, `${a.component} · ${a.signal}`));
    $('move-target').replaceChildren(); current().pins.filter((p) => p.gpio !== draft.gpio).forEach((p) => option($('move-target'), p.gpio, `GPIO${p.gpio} · ${labels[p.allocation]}`));
    $('move-assignment').disabled = draft.assignments.length === 0; $('advanced-assignment').open = false;
  }
  function renderAll() {
    renderProjects(); renderSummary(); const v = view(); $('pin-search').value = v.search; $('allocation-filter').value = v.allocation; $('capability-filter').value = v.capability; renderPins(); renderEditor();
  }
  // Los eventos mutan el modelo solo después de confirmar una operación completa.
  on('project-select', 'change', async (event) => {
    const id = event.target.value; event.target.value = state.activeProjectId;
    if (!await ensureClean()) return;
    state.activeProjectId = id; renderAll(); persist('Proyecto seleccionado.');
  });
  for (const [button, mode] of [['new-project', 'new'], ['rename-project', 'rename'], ['duplicate-project', 'duplicate']]) on(button, 'click', async () => {
    if (!await ensureClean()) return;
    const existing = current(); const answer = await ask({ title: mode === 'new' ? 'Nuevo proyecto' : mode === 'rename' ? 'Renombrar proyecto' : 'Duplicar proyecto', body: mode === 'duplicate' ? 'La copia conserva asignaciones y notas, pero reinicia conexiones y validaciones físicas.' : 'Cada proyecto mantiene sus propias asignaciones de GPIO.', fields: true, name: mode === 'new' ? '' : mode === 'duplicate' ? `${existing.name.slice(0, 190)} (copia)` : existing.name, description: mode === 'new' ? '' : existing.description, confirm: mode === 'new' ? 'Crear proyecto' : mode === 'duplicate' ? 'Crear copia' : 'Aplicar nombre' });
    if (!answer) return;
    transact((next) => {
      if (mode === 'new') M.createProject(next, seed.template, answer.name, answer.description);
      else if (mode === 'rename') M.renameProject(next, existing.id, answer.name, answer.description);
      else { const copy = M.duplicateProject(next, existing.id, answer.name); copy.description = answer.description.trim(); }
    });
    renderAll(); persist('Proyecto actualizado.');
  });
  function download(value, name) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2) + '\n'], { type: 'application/json' }));
    const link = node('a'); link.href = url; link.download = name; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  const filename = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 80) || 'proyecto';
  function exportOne() { download(T.exportProject(state, state.activeProjectId), `${filename(current().name)}-${M.today()}.json`); }
  on('export-project', 'click', async () => { if (await ensureClean()) { exportOne(); notice('Proyecto exportado; conserva el JSON como respaldo portable.'); } });
  on('export-all', 'click', async () => { if (await ensureClean()) { download(state, `gpio-proyectos-${M.today()}.json`); memoryUnsaved = false; notice('Colección completa exportada. El JSON no incluye documentos PDF.'); } });
  on('delete-project', 'click', async () => {
    if (!await ensureClean()) return;
    const answer = await ask({ title: 'Eliminar proyecto', body: `Se eliminará «${current().name}» de esta colección. No se puede deshacer desde el editor. Puedes descargar un respaldo antes de eliminarlo.`, confirm: 'Eliminar proyecto', backup: true });
    if (!answer) return; if (answer.backup) exportOne();
    transact((next) => M.deleteProject(next, next.activeProjectId)); renderAll(); persist('Proyecto eliminado. Los demás proyectos se conservan.');
  });
  on('reset-project', 'click', async () => {
    if (!await ensureClean()) return;
    const original = seed.workspace.projects.find((p) => p.id === state.activeProjectId);
    const answer = await ask({ title: 'Restablecer este proyecto', body: `Solo «${current().name}» volverá ${original ? 'a las asignaciones del registro inicial' : 'a la plantilla vacía, con UART0 reservada'}. Los demás proyectos no cambian. Puedes cancelar y exportar un respaldo antes.`, confirm: 'Restablecer proyecto' });
    if (!answer) return; transact((next) => { M.project(next).pins = M.clone((original || seed.template).pins); M.project(next).updatedAt = M.today(); }); renderAll(); persist('Proyecto restablecido.');
  });
  for (const [control, key] of [['pin-search', 'search'], ['allocation-filter', 'allocation'], ['capability-filter', 'capability']]) on(control, key === 'search' ? 'input' : 'change', () => { view()[key] = $(control).value; renderPins(); });
  for (const mode of ['map', 'table']) on(mode + '-view', 'click', () => { view().mode = mode; renderPins(); });
  $('pin-form').addEventListener('input', showDirty); $('pin-form').addEventListener('change', showDirty);
  on('pin-allocation', 'change', () => {
    $('reservation-label').hidden = $('pin-allocation').value !== 'reserved';
    if ($('pin-allocation').value === 'assigned' && !$('assignment-list').children.length) { draft.assignments.push(blankAssignment()); renderAssignments(); }
    $('assignment-list').hidden = $('pin-allocation').value !== 'assigned'; $('add-assignment').hidden = $('pin-allocation').value !== 'assigned';
    syncQuickFromAdvanced();
  });
  on('add-assignment', 'click', () => { draft = readDraft(); if (draft.assignments.length >= 20) throw new Error('Máximo 20 señales por pin.'); draft.assignments.push(blankAssignment()); renderAssignments(); showDirty(); });
  on('cancel-edit', 'click', () => { renderEditor(); $('pin-editor').close(); restorePinFocus(); notice('Edición cancelada; se conserva la última asignación aplicada.'); });
  on('pin-form', 'submit', (event) => {
    event.preventDefault();
    try {
      const candidate = readDraft(); if (candidate.allocation !== 'assigned') candidate.assignments = [];
      const result = transact((next) => M.savePin(next, next.activeProjectId, candidate)); renderAll(); $('pin-editor').close(); restorePinFocus();
      persist(result.resetEvidence ? 'Cambió la función: conexión y validación reiniciadas. Registra nuevamente la evidencia cuando corresponda.' : 'Cambios aplicados al proyecto activo.');
    } catch (error) { showFormError(error.message); }
  });
  on('move-assignment', 'click', async () => {
    if (dirty) { showFormError('Aplica o cancela la edición antes de trasladar una señal.'); return; }
    const from = draft.gpio, target = Number($('move-target').value), signal = $('move-signal').value;
    const answer = await ask({ title: 'Trasladar señal', body: `Mover la señal de GPIO${from} a GPIO${target} reiniciará su conexión y validación física. El destino debe ser compatible. No se modificará el firmware.`, confirm: 'Trasladar señal' });
    if (!answer) return;
    transact((next) => M.moveAssignment(next, next.activeProjectId, from, signal, target)); view().selected = target; renderAll(); persist('Señal trasladada; conexión y prueba pendientes.');
  });
  on('import-file', 'change', async () => {
    const file = $('import-file').files[0]; $('import-file').value = '';
    if (!file || !await ensureClean()) return;
    if (file.size > T.MAX_BYTES) throw new Error('El JSON supera 2 MiB.');
    const parsed = T.parseText(await file.text(), seed.workspace.boardProfiles);
    const answer = await ask({ title: 'Revisar importación', body: `${parsed.workspace.projects.length} proyecto(s) válido(s). Añadir genera IDs nuevos y reinicia evidencia física. Restaurar ${parsed.kind === 'gpio-workspace' ? 'REEMPLAZA TODA la colección actual, incluidos sus proyectos' : 'reemplaza explícitamente el proyecto de igual ID, si existe, conservando su evidencia'}. Puedes cancelar y respaldar primero.`, importMode: true, confirm: 'Aplicar importación' });
    if (!answer) return;
    state = T.importData(state, parsed, answer.mode); views.clear(); renderAll(); persist('Importación aplicada después de validar los datos.');
  });
  on('recover-backup', 'click', async () => {
    if (!await ensureClean()) return; const backup = store.backup(); if (!backup) throw new Error('No hay una copia local válida disponible.');
    const answer = await ask({ title: 'Recuperar copia local anterior', body: `La copia contiene ${backup.projects.length} proyecto(s) y reemplazará toda la sesión actual. Exporta antes si necesitas conservar tus cambios actuales.`, confirm: 'Recuperar copia' });
    if (!answer) return;
    state = backup; views.clear(); renderAll(); persist('Copia anterior recuperada.', true);
  });
  on('resume-save', 'click', async () => {
    if (!await ensureClean()) return;
    const answer = await ask({ title: 'Reactivar guardado local', body: 'Se reemplazará el guardado de esta ruta por la colección que ves ahora. Si hay otra pestaña, respalda ambas versiones antes de elegir. No se borrarán respaldos JSON externos.', confirm: 'Guardar esta colección' });
    if (answer) persist('Guardado local reactivado.', true);
  });
  window.addEventListener('storage', (event) => {
    if (event.key === S.KEY) { savingPaused = true; store.pause(); saveStatus({ ok: false, error: 'Otra pestaña cambió el guardado. Exporta tu sesión y recarga o decide qué versión conservar.' }); }
  });
  window.addEventListener('beforeunload', (event) => { if (dirty || memoryUnsaved) { event.preventDefault(); event.returnValue = ''; } });
  function inlineText(container, text) {
    const pattern = /\[([^\]]+)\]\(([^)]+)\)/g; let start = 0;
    for (const match of text.matchAll(pattern)) {
      container.append(document.createTextNode(text.slice(start, match.index)));
      const destination = match[2];
      if (destination.startsWith('https://') || /^[a-z-]+\.md$/.test(destination)) {
        const link = node('a', match[1]); link.href = destination.startsWith('https://') ? destination : `../../docs/gpio/${destination}`; link.target = '_blank'; link.rel = 'noopener'; container.append(link);
      } else container.append(document.createTextNode(match[1]));
      start = match.index + match[0].length;
    }
    container.append(document.createTextNode(text.slice(start)));
  }
  function renderGuide() {
    const body = seed.guide.slice(seed.guide.indexOf('Guía original')).split('\nHistorial:')[0]; let section = null;
    for (const block of body.split(/\r?\n\s*\r?\n/)) {
      if (block.startsWith('## ')) { section = node('details'); section.append(node('summary', block.slice(3).trim())); $('guide-content').append(section); }
      else { const paragraph = node('p'); inlineText(paragraph, block.replace(/\r?\n/g, ' ')); (section || $('guide-content')).append(paragraph); }
    }
    seed.workspace.sources.forEach((s) => { const li = node('li'); li.append(sourceLink(s)); $('source-list').append(li); });
    const extra = node('li'), link = node('a', 'Last Minute Engineers · referencia secundaria (Internet)'); link.href = 'https://lastminuteengineers.com/esp32-pinout-reference/'; link.target = '_blank'; link.rel = 'noopener'; extra.append(link); $('source-list').append(extra);
  }
  let pdfUrl = null, pdfVersion = 0;
  function clearPdf() { $('pdf-viewer').removeAttribute('data'); $('pdf-viewer').hidden = true; $('pdf-actions').hidden = true; $('open-pdf').removeAttribute('href'); if (pdfUrl) URL.revokeObjectURL(pdfUrl); pdfUrl = null; }
  on('pdf-file', 'change', async () => {
    const version = ++pdfVersion; const file = $('pdf-file').files[0]; if (!file) return;
    if (file.size > 30 * 1024 * 1024 || !/\.pdf$/i.test(file.name) || new TextDecoder().decode(await file.slice(0, 5).arrayBuffer()) !== '%PDF-') { $('pdf-status').textContent = 'Selecciona un PDF válido de hasta 30 MiB. El documento anterior se conserva.'; return; }
    if (version !== pdfVersion) return;
    clearPdf(); pdfUrl = URL.createObjectURL(file); $('pdf-viewer').data = pdfUrl; $('pdf-viewer').hidden = false; $('open-pdf').href = pdfUrl; $('pdf-actions').hidden = false;
    $('pdf-status').textContent = `${file.name} · Solo consulta local. Si la vista está vacía, usa «Abrir PDF aparte».`;
  });
  on('close-pdf', 'click', () => { ++pdfVersion; clearPdf(); $('pdf-file').value = ''; $('pdf-status').textContent = 'Documento cerrado; no se ha guardado en el proyecto.'; });
  window.addEventListener('pagehide', clearPdf);
  function syncQuickFromAdvanced() {
    const assigned = $('pin-allocation').value === 'assigned';
    const groups = Array.from($('assignment-list').children);
    $('quick-fields').hidden = !assigned;
    for (const [id, value] of [['quick-free', 'free'], ['quick-assigned', 'assigned'], ['quick-reserved', 'reserved']]) $(id).setAttribute('aria-pressed', String($('pin-allocation').value === value));
    $('quick-name').disabled = groups.length > 1; $('quick-direction').disabled = groups.length > 1;
    const first = groups[0];
    $('quick-name').value = first?.querySelector('[data-field=component]')?.value || '';
    $('quick-direction').value = first?.querySelector('[data-field=direction]')?.value || 'input';
    const technical = M.profile(state).pins.find((p) => p.gpio === view().selected);
    for (const item of $('quick-direction').options) item.disabled = !technical.output && item.value !== 'input';
    $('quick-hint').textContent = groups.length > 1 && assigned ? `${groups.length} conexiones en este pin. Usa las opciones avanzadas para editar cada una sin perder el bus compartido.` : !assigned && groups.length ? 'Al guardar se retirarán las conexiones de este pin en este proyecto.' : 'Un nombre es suficiente. Los datos de señal, bus y pruebas son opcionales y se encuentran en las opciones avanzadas.';
  }
  function syncQuickToAdvanced() {
    const first = $('assignment-list').firstElementChild;
    if (!first || $('assignment-list').children.length > 1) return;
    first.querySelector('[data-field=component]').value = $('quick-name').value;
    first.querySelector('[data-field=direction]').value = $('quick-direction').value;
    const signal = first.querySelector('[data-field=signal]');
    if (!signal.value.trim()) signal.value = 'Conexión';
  }
  function restorePinFocus() {
    const button = view().mode === 'map' ? $('board-map').querySelector(`[data-gpio="${view().selected}"]`) : Array.from($('pin-table').querySelectorAll('button')).find((el) => el.textContent === `Editar GPIO${view().selected}`);
    (button && !button.disabled ? button : $('map-view')).focus({ preventScroll: true });
  }
  async function closeEditor() {
    if (!await ensureClean()) return;
    $('pin-editor').close(); restorePinFocus();
  }
  on('close-editor', 'click', closeEditor);
  $('pin-editor').addEventListener('cancel', (event) => { event.preventDefault(); closeEditor(); });
  on('close-contact', 'click', () => $('contact-dialog').close());
  on('internal-pins', 'click', () => contactInfo('Uso interno del módulo', 'GPIO6–11 se utilizan para la memoria flash del módulo WROOM. No se consideran disponibles para periféricos ni se añaden a los contactos asignables. GPIO0 participa en arranque a nivel de chip, pero no se representa expuesto en esta variante de 30 pines.'));
  for (const [id, value] of [['quick-free', 'free'], ['quick-assigned', 'assigned'], ['quick-reserved', 'reserved']]) on(id, 'click', () => {
    $('pin-allocation').value = value;
    if (value === 'reserved' && !$('reservation-reason').value.trim()) $('reservation-reason').value = 'Reserva manual para el proyecto';
    $('pin-allocation').dispatchEvent(new Event('change', { bubbles: true }));
    if (value === 'assigned') { syncQuickToAdvanced(); $('quick-name').focus(); }
  });
  on('quick-name', 'input', syncQuickToAdvanced); on('quick-direction', 'change', syncQuickToAdvanced);
  $('assignment-list').addEventListener('input', syncQuickFromAdvanced); $('assignment-list').addEventListener('change', syncQuickFromAdvanced);

  renderAll(); renderGuide();
  if (loaded.error) { saveStatus({ ok: false, error: `No se pudo recuperar el guardado: ${loaded.error}` }); notice('Se muestran los datos iniciales. El guardado está pausado para proteger el contenido anterior.', true); }
  else { $('save-state').textContent = loaded.workspace ? 'Proyectos recuperados del guardado local' : 'Registro inicial · listo para trabajar'; $('save-detail').textContent = 'Autoguardado al aplicar cambios. Exporta JSON para conservar una copia portable.'; $('recover-backup').hidden = !store.backup(); }
})();

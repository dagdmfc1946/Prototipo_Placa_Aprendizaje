/* Archivo: flow.browser.cjs | Recorridos reales, offline y adaptabilidad.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.2.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0: Fases 2–4. 0.2.0 (2026-10-31): Mismos recorridos adaptados a ventanas. Licencia: ../../docs/gpio/LICENCIAS.md */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.GPIO_PLAYWRIGHT_MODULE || 'playwright');
const entry = pathToFileURL(path.resolve(__dirname, '../../tools/gpio/index.html')).href;
const qa = process.env.GPIO_QA_DIR || path.join(require('node:os').tmpdir(), 'gpio-browser-qa');
async function setup(t, blockedStorage = false) {
  const browser = await chromium.launch({ channel: process.env.GPIO_BROWSER_CHANNEL || 'chrome', headless: true });
  t.after(() => browser.close());
  const context = await browser.newContext({ offline: true, viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
  if (blockedStorage) await context.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Bloqueado para prueba', 'SecurityError'); } }));
  const page = await context.newPage();
  const errors = [], network = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (['error', 'warning'].includes(message.type())) errors.push(message.text()); });
  page.on('request', (request) => { if (/^https?:/.test(request.url())) network.push(request.url()); });
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto(entry); await page.locator('.pin-button').first().waitFor();
  t.after(() => { assert.deepEqual(errors, [], 'Consola limpia'); assert.deepEqual(network, [], 'Sin solicitudes externas automáticas'); });
  return { page, context };
}
const field = (page, key, nth = 0) => page.locator(`[data-field="${key}"]`).nth(nth);
async function closeEditor(page) {
  if (await page.locator('#pin-editor').isVisible()) {
    await page.locator('#close-editor').click();
    assert.equal(await page.locator('#action-dialog').isVisible(), false, 'No se abandona un borrador sin probar su confirmación');
  }
}
async function switchProject(page, id) { await closeEditor(page); await page.locator('#project-select').selectOption(id); }
async function apply(page) {
  const gpio = Number((await page.locator('#editor-heading').innerText()).replace('GPIO', ''));
  await page.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  if (!await page.locator('#pin-editor').isVisible()) await selectPin(page, gpio);
}
async function selectPin(page, gpio) {
  await closeEditor(page);
  await page.locator('#pin-search').fill('');
  await page.locator('#allocation-filter').selectOption('all'); await page.locator('#capability-filter').selectOption('all');
  await page.locator('#map-view').click(); await page.locator(`.pin-button[data-gpio="${gpio}"]`).click();
  await page.locator('#pin-editor').waitFor({ state: 'visible' });
  await page.locator('#advanced-assignment > summary').click();
}
async function create(page, name) {
  await closeEditor(page); await page.locator('#new-project').click(); await page.locator('#dialog-name').fill(name); await page.locator('#dialog-confirm').click();
  await page.getByRole('option', { name, exact: true }).waitFor({ state: 'attached' });
  return page.locator('#project-select').inputValue();
}
async function note(page, text) { if (!await page.locator('#pin-editor').isVisible()) await selectPin(page, 13); await page.locator('#pin-notes').fill(text); await apply(page); await closeEditor(page); }
function pdfFixture() {
  const stream = 'BT /F1 12 Tf 20 70 Td (Prueba local GPIO) Tj ET';
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 100] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>', '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>', `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let data = '%PDF-1.4\n'; const offsets = [0];
  objects.forEach((body, i) => { offsets.push(Buffer.byteLength(data)); data += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = Buffer.byteLength(data); data += `xref\n0 6\n0000000000 65535 f \n${offsets.slice(1).map((n) => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(data);
}
test('Fases 2/3: proyectos aislados, edición, conflictos, pruebas, respaldo y recarga', { timeout: 90000 }, async (t) => {
  const { page } = await setup(t);
  assert.equal(await page.locator('.pin-button').count(), 25);
  await fs.mkdir(qa, { recursive: true }); await page.screenshot({ path: path.join(qa, 'desktop.png'), fullPage: false });
  const original = await page.locator('#project-select').inputValue();
  const a = await create(page, 'Trabajo A'); await selectPin(page, 25);
  await page.locator('#pin-allocation').selectOption('assigned'); await field(page, 'component').fill('LED'); await field(page, 'signal').fill('OUT'); await field(page, 'direction').selectOption('output');
  await apply(page);
  assert.match(await page.locator('#save-state').innerText(), /Guardado local/);
  const b = await create(page, 'Trabajo B'); await selectPin(page, 25);
  assert.equal(await page.locator('#pin-allocation').inputValue(), 'free');
  await note(page, '<img src=x onerror=alert(1)>');
  assert.equal(await page.locator('img[src=x]').count(), 0);
  await switchProject(page, a); await selectPin(page, 25);
  assert.equal(await field(page, 'component').inputValue(), 'LED'); assert.equal(await page.locator('#pin-notes').inputValue(), '');
  await field(page, 'validation').selectOption('passed'); await apply(page);
  assert.match(await page.locator('#form-error').innerText(), /evidencia/);
  await field(page, 'testDetail').fill('LED observado, prueba manual'); await field(page, 'testReporter').fill('Diego');
  await field(page, 'connection').selectOption('reported'); await apply(page);
  assert.equal(await field(page, 'validation').inputValue(), 'passed');
  await field(page, 'component').fill('Relé'); await apply(page);
  assert.equal(await field(page, 'validation').inputValue(), 'not-tested'); assert.equal(await field(page, 'connection').inputValue(), 'unknown');
  await page.locator('#pin-notes').fill('Descartar esta edición'); await page.locator('#close-editor').click(); await page.locator('#dialog-cancel').click();
  assert.equal(await page.locator('#project-select').inputValue(), a); await page.locator('#cancel-edit').click();
  await selectPin(page, 34); await page.locator('#pin-allocation').selectOption('assigned'); await field(page, 'component').fill('LED'); await field(page, 'signal').fill('OUT'); await field(page, 'direction').selectOption('output');
  await apply(page); assert.match(await page.locator('#form-error').innerText(), /solo entrada/); await page.locator('#cancel-edit').click();
  await switchProject(page, original); await selectPin(page, 21);
  await page.locator('#add-assignment').click(); await field(page, 'component', 1).fill('RTC'); await field(page, 'signal', 1).fill('SDA'); await field(page, 'interface', 1).fill('I2C'); await field(page, 'busId', 1).fill('oled-i2c'); await field(page, 'direction', 1).selectOption('bidirectional');
  await apply(page); assert.equal(await page.locator('.signal-fields').count(), 2);
  await field(page, 'busId', 1).fill('otro-bus'); await apply(page); assert.match(await page.locator('#form-error').innerText(), /incompatibles/); await page.locator('#cancel-edit').click();
  await selectPin(page, 13); await page.locator('.move-panel summary').click(); await page.locator('#move-target').selectOption('25'); await page.locator('#move-assignment').click(); await page.locator('#dialog-confirm').click(); assert.equal(await page.locator('#editor-heading').innerText(), 'GPIO25');
  await closeEditor(page); await page.locator('#rename-project').click(); await page.locator('#dialog-name').fill('Trabajo original renombrado'); await page.locator('#dialog-confirm').click();
  await closeEditor(page); await page.locator('#duplicate-project').click(); await page.locator('#dialog-name').fill('Copia de referencia'); await page.locator('#dialog-confirm').click();
  await selectPin(page, 4); assert.equal(await field(page, 'connection').inputValue(), 'unknown');
  await page.reload(); await page.locator('.pin-button').first().waitFor(); assert.equal(await page.locator('#project-select option:checked').innerText(), 'Copia de referencia');
  await page.locator('#table-view').click(); await page.locator('#capability-filter').selectOption('input-only'); assert.equal(await page.locator('#pin-table tr').count(), 4);
  await page.locator('#capability-filter').selectOption('all'); await page.locator('#pin-search').fill('inexistente'); assert.equal(await page.locator('#empty-filter').isVisible(), true); await page.locator('#pin-search').fill('');
  const downloaded = page.waitForEvent('download'); await closeEditor(page); await page.locator('#export-all').click(); const download = await downloaded; const backupPath = path.join(qa, 'respaldo-prueba.json'); await download.saveAs(backupPath);
  const exported = JSON.parse(await fs.readFile(backupPath, 'utf8')); assert.equal(exported.projects.length, 4);
  const oneReady = page.waitForEvent('download'); await closeEditor(page); await page.locator('#export-project').click(); const one = await oneReady; const onePath = path.join(qa, 'proyecto-prueba.json'); await one.saveAs(onePath);
  assert.equal(JSON.parse(await fs.readFile(onePath, 'utf8')).kind, 'gpio-project');
  await page.locator('#import-file').setInputFiles(onePath); await page.locator('#dialog-confirm').click(); assert.equal(await page.locator('#project-select option').count(), 5);
  await page.locator('#import-file').setInputFiles({ name: 'invalido.json', mimeType: 'application/json', buffer: Buffer.from('{invalid}') }); await page.waitForFunction(() => document.getElementById('notice').textContent.includes('JSON válido')); assert.equal(await page.locator('#project-select option').count(), 5);
  await page.locator('#import-file').setInputFiles(backupPath); await page.locator('#import-mode').selectOption('restore'); await page.locator('#dialog-confirm').click(); assert.equal(await page.locator('#project-select option').count(), 4);
  await closeEditor(page); await page.locator('#delete-project').click(); await page.locator('#dialog-cancel').click(); assert.equal(await page.locator('#project-select option').count(), 4);
  await closeEditor(page); await page.locator('#delete-project').click(); await page.locator('#dialog-confirm').click(); assert.equal(await page.locator('#project-select option').count(), 3);
  await switchProject(page, b); await selectPin(page, 25); assert.equal(await page.locator('#pin-notes').inputValue(), '<img src=x onerror=alert(1)>');
  await closeEditor(page); await page.locator('#reset-project').click(); await page.locator('#dialog-confirm').click(); assert.equal(await page.locator('#pin-notes').inputValue(), ''); assert.equal(await page.locator('#project-select option').count(), 3);
});
test('Fase 4: PDF original local, alternativa, teclado y tamaños 320/768/1024/1440', { timeout: 60000 }, async (t) => {
  const { page } = await setup(t);
  await page.keyboard.press('Tab'); assert.equal(await page.locator('.skip-link').evaluate((el) => el === document.activeElement), true);
  await page.keyboard.press('Enter');
  await page.locator('#pdf-file').setInputFiles({ name: 'prueba-original.pdf', mimeType: 'application/pdf', buffer: pdfFixture() });
  await page.locator('#pdf-actions').waitFor({ state: 'visible' }); assert.match(await page.locator('#pdf-viewer').getAttribute('data'), /^blob:/);
  const popupPromise = page.waitForEvent('popup'); await page.locator('#open-pdf').click(); const popup = await popupPromise; assert.match(popup.url(), /^blob:/); await popup.close();
  await page.locator('#pdf-file').setInputFiles({ name: 'falso.pdf', mimeType: 'application/pdf', buffer: Buffer.from('<html>no pdf</html>') }); await page.waitForFunction(() => document.getElementById('pdf-status').textContent.includes('PDF válido'));
  assert.match(await page.locator('#pdf-viewer').getAttribute('data'), /^blob:/); await page.locator('#close-pdf').click(); assert.equal(await page.locator('#pdf-viewer').getAttribute('data'), null);
  await fs.mkdir(qa, { recursive: true });
  for (const width of [320, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const size = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: innerWidth })); assert.ok(size.scroll <= size.inner, `Sin desbordamiento global a ${width}px`);
    await closeEditor(page); await page.locator('#new-project').click(); await page.keyboard.press('Escape'); assert.equal(await page.locator('#action-dialog').isVisible(), false);
    await page.screenshot({ path: path.join(qa, `viewport-${width}.png`), fullPage: true });
  }
});
test('Fase 3: navegador con almacenamiento bloqueado permite editar y exportar', { timeout: 30000 }, async (t) => {
  const { page } = await setup(t, true);
  assert.match(await page.locator('#save-state').innerText(), /memoria/);
  await note(page, 'Cambios conservados en memoria'); assert.match(await page.locator('#save-state').innerText(), /memoria/);
  const downloaded = page.waitForEvent('download'); await closeEditor(page); await page.locator('#export-all').click(); assert.ok(await downloaded);
});
test('Fases 3/4: recuperación anterior, conflicto entre pestañas y texto seguro', { timeout: 45000 }, async (t) => {
  const { page, context } = await setup(t);
  const projectId = await create(page, 'Trabajo de recuperación');
  await note(page, 'Versión anterior'); await note(page, 'Versión nueva');
  await closeEditor(page); await page.locator('#recover-backup').click(); await page.locator('#dialog-confirm').click();
  assert.equal(await page.locator('#pin-notes').inputValue(), 'Versión anterior');
  await selectPin(page, 25); await page.locator('#pin-allocation').selectOption('assigned');
  const injection = '<img src=x onerror=alert(1)>';
  await field(page, 'component').fill(injection); await field(page, 'signal').fill('OUT');
  await apply(page);
  assert.match(await page.locator('.pin-button[data-gpio="25"]').innerText(), /<img src=x/);
  assert.equal(await page.locator('img:not(.board-picture)').count(), 0);
  const other = await context.newPage(); await other.goto(entry); await other.locator('.pin-button').first().waitFor();
  assert.equal(await other.locator('#project-select').inputValue(), projectId);
  await note(other, 'Cambio desde otra pestaña');
  await page.waitForFunction(() => document.getElementById('save-detail').textContent.includes('Otra pestaña'));
  await note(page, 'Mi versión pendiente'); assert.match(await page.locator('#save-state').innerText(), /memoria/);
  await other.reload(); await other.locator('.pin-button').first().waitFor(); assert.equal(await other.locator('#pin-notes').inputValue(), 'Cambio desde otra pestaña');
  await other.close();
  const labels = await page.evaluate(() => Array.from(document.querySelectorAll('input,textarea,select')).filter((el) => el.type !== 'hidden' && !el.labels?.length && !el.getAttribute('aria-label')).map((el) => el.id || el.outerHTML.slice(0, 80)));
  assert.deepEqual(labels, [], 'Todos los controles tienen etiquetas');
  await closeEditor(page); await page.locator('#new-project').click(); await page.keyboard.press('Tab');
  assert.equal(await page.locator('#action-dialog').evaluate((dialog) => dialog.contains(document.activeElement)), true);
  await page.keyboard.press('Escape');
});

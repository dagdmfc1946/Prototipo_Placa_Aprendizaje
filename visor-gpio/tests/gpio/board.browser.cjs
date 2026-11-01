/* Archivo: board.browser.cjs | Placa visual y edición rápida en ventana.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Revisión visual. Licencia: ../../docs/gpio/LICENCIAS.md */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs/promises');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.GPIO_PLAYWRIGHT_MODULE || 'playwright');
const entry = pathToFileURL(path.resolve(__dirname, '../../tools/gpio/index.html')).href;
test('placa de referencia: 25 GPIO, 5 contactos no asignables y advertencias separadas', { timeout: 30000 }, async (t) => {
  const browser = await chromium.launch({ channel: process.env.GPIO_BROWSER_CHANNEL || 'chrome', headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage({ offline: true, viewport: { width: 1440, height: 1100 } });
  const errors = [], requests = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.text()); });
  page.on('request', (r) => { if (/^https?:/.test(r.url())) requests.push(r.url()); });
  await page.goto(entry); await page.locator('.pin-button').first().waitFor();
  assert.equal(await page.locator('dialog#pin-editor').count(), 1);
  assert.equal(await page.locator('#pin-editor').isVisible(), false);
  assert.equal(await page.locator('.pin-button').count(), 25);
  assert.equal(await page.locator('.fixed-contact').count(), 5);
  assert.match(await page.locator('.pin-button[data-gpio="12"]').getAttribute('aria-label'), /arranque/i);
  assert.match(await page.locator('.pin-button[data-gpio="13"]').innerText(), /En uso/);
  await page.locator('.pin-button[data-gpio="34"]').click();
  assert.equal(await page.locator('#pin-editor').isVisible(), true);
  assert.equal(await page.locator('#advanced-assignment').getAttribute('open'), null);
  assert.match(await page.locator('#pin-uses').innerText(), /entrada|lectura/i);
  assert.equal(await page.locator('#quick-direction option[value=output]').evaluate((option) => option.disabled), true);
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#pin-editor').isVisible(), false);
  await page.locator('.fixed-contact').first().click();
  assert.equal(await page.locator('#contact-dialog').isVisible(), true);
  assert.equal(await page.locator('#contact-dialog #quick-assigned').count(), 0);
  await page.keyboard.press('Escape');
  await page.locator('#internal-pins').click(); assert.match(await page.locator('#contact-description').innerText(), /flash/i); await page.keyboard.press('Escape');
  const qa = process.env.GPIO_QA_DIR;
  if (qa) { await fs.mkdir(qa, { recursive: true }); await page.screenshot({ path: path.join(qa, 'placa.png'), fullPage: true }); }
  assert.deepEqual(errors, []); assert.deepEqual(requests, []);
});
test('nombre y libre/ocupado se guardan sin completar formularios avanzados', { timeout: 45000 }, async (t) => {
  const browser = await chromium.launch({ channel: process.env.GPIO_BROWSER_CHANNEL || 'chrome', headless: true }); t.after(() => browser.close());
  const page = await browser.newPage({ offline: true, viewport: { width: 1280, height: 1000 } });
  await page.goto(entry); await page.locator('.pin-button[data-gpio="25"]').click();
  await page.locator('#quick-assigned').click(); await page.locator('#quick-name').fill('LED de prueba'); await page.locator('#quick-direction').selectOption('output');
  await page.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  assert.equal(await page.locator('#pin-editor').isVisible(), false);
  assert.match(await page.locator('.pin-button[data-gpio="25"]').innerText(), /LED de prueba/);
  await page.reload(); await page.locator('.pin-button[data-gpio="25"]').click();
  assert.equal(await page.locator('#quick-name').inputValue(), 'LED de prueba');
  await page.locator('#quick-name').fill('Borrador'); await page.keyboard.press('Escape'); await page.locator('#dialog-cancel').click();
  assert.equal(await page.locator('#pin-editor').isVisible(), true);
  await page.locator('#cancel-edit').click(); await page.locator('.pin-button[data-gpio="25"]').click();
  assert.equal(await page.locator('#quick-name').inputValue(), 'LED de prueba');
  const qa = process.env.GPIO_QA_DIR;
  if (qa) await page.screenshot({ path: path.join(qa, 'ventana-gpio.png'), fullPage: false });
  await page.locator('#quick-free').click(); await page.getByRole('button', { name: 'Guardar cambios', exact: true }).click();
  assert.match(await page.locator('.pin-button[data-gpio="25"]').innerText(), /Libre/);
  await page.setViewportSize({ width: 320, height: 850 }); await page.locator('.pin-button[data-gpio="25"]').click();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  if (qa) await page.screenshot({ path: path.join(qa, 'ventana-movil.png'), fullPage: false });
  await page.keyboard.press('Tab'); assert.equal(await page.locator('#pin-editor').evaluate((el) => el.contains(document.activeElement)), true);
});

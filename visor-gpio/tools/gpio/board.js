/* Archivo: board.js | Disposición de referencia e indicadores de placa.
 * Autor: Ing. Diego Andrés García Díaz | Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Versión: 0.1.0 | Fecha: 2026-10-31 | SPDX-License-Identifier: MIT
 * Historial: 0.1.0 (2026-10-31): Placa visual; unidad física no confirmada.
 * Licencia: ../../docs/gpio/LICENCIAS.md */
(function (root) {
  const gpio = (number, label) => ({ gpio: number, label: label || `D${number}` });
  const fixed = (id, label, description) => ({ id, label, description });
  const layout = {
    left: [fixed('en', 'EN', 'Habilitación y reinicio del ESP32. Es una señal de control, no un GPIO asignable.'), gpio(36, 'VP'), gpio(39, 'VN'), gpio(34), gpio(35), gpio(32), gpio(33), gpio(25), gpio(26), gpio(27), gpio(14), gpio(12), gpio(13), fixed('gnd-left', 'GND', 'Referencia de tierra del circuito. No es un GPIO ni una salida controlable.'), fixed('vin', 'VIN', 'Contacto de alimentación. Su uso depende del regulador y circuito de la placa concreta; no es un GPIO. No aplicar VIN a señales GPIO.')],
    right: [gpio(23), gpio(22), gpio(1, 'TX0'), gpio(3, 'RX0'), gpio(21), gpio(19), gpio(18), gpio(5), gpio(17, 'TX2'), gpio(16, 'RX2'), gpio(4), gpio(2), gpio(15), fixed('gnd-right', 'GND', 'Referencia de tierra, común al otro contacto GND. No es un GPIO.'), fixed('3v3', '3V3', 'Contacto de alimentación de 3,3 V. No es un GPIO; comprobar la alimentación y capacidad del regulador de la placa.')]
  };
  function indicator(pin) {
    if (pin.strapping) return { label: 'Arranque', category: 'warning', mark: '!' };
    if (!pin.output) return { label: 'Solo entrada', category: 'warning', mark: '!' };
    if (pin.warnings.includes('uart0-console')) return { label: 'Consola', category: 'system', mark: 'R' };
    if (pin.warnings.length) return { label: 'Precaución', category: 'warning', mark: '!' };
    return { label: 'E/S digital', category: 'normal', mark: '·' };
  }
  const api = { layout, indicator };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GpioBoard = api;
})(globalThis);

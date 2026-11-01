# Inventario de fuentes y recursos

Versión: 0.3.0. Fecha de consulta: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Alcance: [LICENCIAS.md](LICENCIAS.md).

## Recursos incluidos y alcance

| Recurso | Autoría/procedencia | Licencia y uso |
|---|---|---|
| `docs/gpio/registro.json` y `plantilla-proyecto.json` | Elaboración para el proyecto; hechos técnicos referenciados y asignaciones informadas | MIT; datos originales estructurados. No contienen PDF ni imágenes de terceros. |
| Documentos Markdown nuevos de `docs/gpio/` | Redacción original para el proyecto | CC BY 4.0; conservar atribución, enlace y aviso de cambios. |
| `tools/gpio/` HTML/CSS/JS/CJS y `tests/gpio/` | Código original del proyecto | MIT; sin dependencias de ejecución. |
| `tools/gpio/data.js` | Adaptador generado de los JSON y la guía propios | MIT para código/datos; CC BY 4.0 para la guía embebida, con aviso y atribución. |
| `tools/gpio/DESIGN.md` y capturas de `docs/gpio/capturas/` | Diseño y capturas de la aplicación original | CC BY 4.0; sin imágenes de sitios ajenos. |
| Fuentes e iconos | Tipografía del sistema y texto/símbolos nativos; sin archivos externos | No se redistribuyen fuentes ni librerías de iconos. |

No hay dependencias de ejecución del visor. Node.js v24.22.1 (MIT) y Playwright 1.62.1 (Apache-2.0, comprobado en su package.json instalado) se utilizan para mantenimiento/pruebas; no se redistribuyen ni se cargan desde el HTML. No se instalaron paquetes. Chrome/Edge son navegadores del entorno, no archivos incluidos en el producto. No se copió código de artículos, skills ni documentación técnica. Los textos MIT se incluyen como términos de licencia, no como contenido técnico de terceros.

## Fuentes de consulta, no redistribuidas

Las referencias identificadas en `registro.json.sources` llevan ubicación, revisión y fecha. Las revisiones fijan lo consultado; una URL puede cambiar después. No se han descargado al repositorio documentos completos ni imágenes externas.

| ID | Autor/titular y fuente | Revisión / sección consultada | Tratamiento |
|---|---|---|---|
| `esp32-series` | Espressif Systems, [ESP32 Series Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf) | v5.3; 2.3.1, capítulo 3, características eléctricas y A.1 | Fuente primaria de hechos. No se acreditó licencia abierta para redistribuir el PDF; solo enlace. |
| `esp32-wroom32` | Espressif Systems, [WROOM-32 Datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf) | v3.8; 2.2, tabla 2/notas y capítulo 3 | Fuente del módulo. Solo enlace; no inferir licencia del PDF desde la del SDK. |
| `idf-gpio` | Espressif Systems, [GPIO & RTC GPIO](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/peripherals/gpio.html) | ESP-IDF v5.5; GPIO Summary y notas | Consulta técnica. Sin copiar artículo ni ejemplos. |
| `idf-adc` | Espressif Systems, [ADC Oneshot](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/peripherals/adc_oneshot.html) | ESP-IDF v5.5; Hardware Limitations | Consulta de ADC2/Wi-Fi. Solo enlace. |
| `config-p17a` | Proyecto, `esp32_Project/Config.h` | v0.1.0, cuatro constantes SD | Lectura del archivo existente; no relicenciado ni modificado. No prueba conexión física. |
| `p17a` | Proyecto, `docs/practicas/P17a-microsd.md` | 2026-10-31, entorno e información recibida | Evidencia documental de parámetros e información del usuario. |
| `handoff` | Proyecto, `docs/plan-chat-registro-gpio.md` | Contexto técnico inicial conservado | Información del usuario; sin atribuir prueba física nueva. |
| `console-policy` | Proyecto, `docs/gpio/modelo-datos.md` | Política inicial de UART0 | Decisión de reserva modificable por proyecto, no medición. |
| Referencia secundaria | Last Minute Engineers / Amrit Prabhu, [ESP32 Pinout Reference](https://lastminuteengineers.com/esp32-pinout-reference/) | Artículo consultado al planificar, actualizado 2026-01-20 | Solo enlace externo; no reproducir texto, diagramas, fotografías ni diseño. No se usa como autoridad sobre restricciones eléctricas. |

El WROOM-32 original y otras revisiones tienen diferencias: contrastar el marcado de la unidad antes de confirmar el perfil. Las referencias de chip/módulo no demuestran la posición de contactos en una DevKit de fabricante desconocido.

## Criterio de incorporación

Software de terceros: licencia aprobada por [OSI](https://opensource.org/licenses), compatible y conservada junto con avisos. Documentación/activos: licencia abierta que permita modificación y redistribución comercial; excluir NC/ND. No aceptar «gratis», «público» o una simple atribución como permiso suficiente.

Registrar antes de añadir: recurso exacto, versión, autor/titular, URL, fecha, licencia/SPDX, evidencia de sus términos, destino y modificaciones. Si no puede verificarse, mantenerlo como enlace de consulta. La licencia de una skill no cubre automáticamente los recursos que enlaza. Las skills de diseño no han aportado archivos al visor en Fase 1.

MIT se aplica solo a los datos/código nuevos expresamente listados. CC BY 4.0 se aplica solo a la documentación propia nueva indicada. Estas decisiones cumplen el requisito de licencias abiertas para este incremento; no cambian licencias del firmware, documentos previos ni obras ajenas. No se publica nada hasta revisión y aprobación del usuario.

Historial: 0.1.0 (2026-10-31): inventario inicial, fuentes consultadas y alcance delimitado.

## Referencias de implementación consultadas en fases 2–4

- [MDN: dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog), [URL.createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) y [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): consulta de APIs, sin copiar ejemplos/textos en la aplicación.
- [Playwright BrowserType](https://playwright.dev/docs/api/class-browsertype): consulta de la API de pruebas; herramientas instaladas externas al visor.
- Skills UI UX Pro Max, frontend, pruebas, seguridad y revisión: orientación de trabajo; sin incorporar código, imágenes, fuentes, plantillas ni otros activos de sus catálogos. Ver el contrato visual original.

0.2.0 (2026-10-31): inventario ampliado a fases 2–4; código, guía embebida, capturas y herramientas de prueba identificados con alcance explícito.

## Revisión de placa visual

`tools/gpio/board.svg`: dibujo original generado como código vectorial, MIT, autor Ing. Diego Andrés García Díaz, versión 0.1.0 de 2026-10-31. Sin imagen fotográfica, logotipos ni marcas de certificación de terceros. `board.js` contiene la disposición de referencia, no una confirmación de la unidad. Las tres imágenes aportadas por el usuario solo se consultan; no se copian al repositorio ni se declara una licencia para ellas. Hay discrepancia de orden GPIO34/35 entre referencias, documentada en la revisión. Capturas nuevas de la propia interfaz bajo CC BY 4.0.

0.3.0 (2026-10-31): procedencia del SVG y tratamiento de las imágenes de referencia; sin dependencias nuevas.

## Empaquetado de publicación

Las rutas internas del visor se mantienen relativas a `visor-gpio/`. Para conservar compatibilidad con JSON anteriores, los identificadores y rutas de referencia de `sources` se mantienen: `config-p17a` y `p17a` se resuelven desde el repositorio padre; `handoff` y `console-policy`, desde esta carpeta. No se copian fuentes de firmware, ejemplos privados ni paquetes de herramientas. Licencias del módulo delimitadas en README y NOTICE.md.

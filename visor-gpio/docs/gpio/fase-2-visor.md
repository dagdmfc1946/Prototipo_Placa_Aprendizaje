# Fase 2 — Visor editable y proyectos

Versión: 0.2.0. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Ver [licencias](LICENCIAS.md).

## Entrega

El visor se abre directamente en [tools/gpio/index.html](../../tools/gpio/index.html), conservando todos sus archivos vecinos. HTML/CSS/JS estándar, sin dependencias de ejecución, CDN, instalación, servidor, cuenta ni hosting.

Permite crear, seleccionar, renombrar, duplicar y eliminar proyectos. Cada trabajo conserva asignaciones, conexión informada, prueba, evidencias y notas independientes. Duplicar conserva funciones y notas, pero genera IDs nuevos y reinicia conexiones y evidencias físicas. El último proyecto no se elimina. Los nombres repetidos se distinguen con un fragmento de su ID.

La vista actual muestra una placa SVG original y botones alrededor de una disposición de referencia de 30 contactos; no confirma la ubicación en la unidad real. Seleccionar abre una ventana de edición rápida; la tabla sigue como alternativa. La tabla alternativa muestra ocupación, señal, conexión y prueba con texto. Hay búsqueda, filtros por ocupación/capacidad, resumen y selección por teclado. Los cinco contactos de control/alimentación no cuentan como GPIO asignables.

Seleccionar un GPIO muestra capacidades, advertencias y fuentes técnicas, separadas de los campos editables. Se pueden asignar/liberar/reservar pines, añadir o quitar señales, editar evidencia/fecha/responsable y trasladar una señal a otro GPIO. Aplicar hace una operación completa; cancelar descarta el borrador. Cambiar de pin/proyecto con una edición pendiente requiere confirmación para descartarla.

El traslado verifica el destino antes de tocar el origen; no admite un destino reservado ni una salida sobre GPIO de solo entrada. Cambiar componente, señal, dirección, interfaz o bus reinicia conexión y validación vigentes. Una simple anotación conserva la evidencia; normalizar mayúsculas de la interfaz tampoco la invalida. Aprobar o fallar una prueba exige evidencia, fecha y responsable del usuario.

Solo se permiten varias asignaciones del mismo pin para una señal compartida explícita I2C (SDA/SCL) o SPI (SCK/MOSI/MISO), con igual interfaz, bus, señal y dirección. CS no se comparte por esta regla. Esto comprueba coherencia del registro; no garantiza compatibilidad eléctrica, direcciones I2C distintas o triestado correcto de periféricos SPI.

## Referencia y PDF

La guía propia se integra desde el Markdown canónico; sus apartados se abren sin Internet. Las fichas enlazan las fuentes originales. Los enlaces externos se abren aparte y requieren conexión. No se incrusta ni copia la web de referencia.

Se puede seleccionar un PDF local de hasta 30 MiB, comprobando extensión y firma `%PDF-`. El documento se visualiza mediante el soporte nativo del navegador, con botón para abrirlo aparte. Cerrar, reemplazar o salir libera su URL temporal. No se sube, guarda en Git, incorpora al JSON ni persiste al recargar. Un archivo no válido conserva el documento anterior. Esta comprobación de formato no constituye un análisis antivirus del PDF.

## Implementación y verificación

| Archivo | Responsabilidad |
|---|---|
| `tools/gpio/index.html`, `styles.css` | Estructura semántica y diseño original adaptable. |
| `tools/gpio/model.js` | Reglas de proyectos, evidencia, conflictos y traslados atómicos. |
| `tools/gpio/app.js` | Formularios, selección, confirmaciones, consulta técnica y PDF; integración posterior con Fase 3. |
| `tools/gpio/generate-data.cjs` | Generar adaptador `data.js` desde JSON y guía canónicos para `file://`. |
| `tests/gpio/model.test.cjs` | Ocho pruebas de aislamiento, duplicación, límites eléctricos, buses, evidencia, traslado y sincronización de fuentes. |

Primero se ejecutaron las pruebas con el módulo ausente (fallo esperado); luego pasaron al implementar las reglas. Los recorridos de navegador ejercitan las operaciones reales, no una simulación de la UI. Resultados y entorno en [Fase 4](fase-4-verificacion.md); instrucciones paso a paso en [uso y verificación](uso-y-verificacion.md).

Los datos iniciales de `registro.json`/plantilla permanecen intactos. Ninguna operación del visor modifica firmware, cables, esquemáticos, Markdown o Git.

Historial: 0.1.0 (2026-10-31): implementación local y documentación de Fase 2.

0.2.0 (2026-10-31): editor persistente sustituido por ventana rápida, ilustración original e indicadores técnicos separados. Ver `revision-placa-visual.md` para uso, fuentes y pruebas nuevas; opciones avanzadas y datos existentes conservados.

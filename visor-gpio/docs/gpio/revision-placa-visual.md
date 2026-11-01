# Revisión — Placa visual y edición rápida

Versión: 0.1.0. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Ver [licencias](LICENCIAS.md).

## Solicitud y resultado

El usuario solicita centrar la herramienta en una imagen reconocible del ESP32, con indicadores alrededor de cada pin y una ventana de edición al seleccionarlo. La tarea habitual debe limitarse a ocupar/liberar y poner nombre; cada GPIO debe explicar sus usos y limitaciones.

Se incorpora una ilustración SVG original de una placa de referencia de 30 contactos, antena arriba y USB abajo. Sus 25 GPIO y 5 contactos de control/alimentación tienen botones a ambos lados. No se incluye ninguna de las fotografías o ilustraciones adjuntas, ni logotipos o certificaciones: se consultaron como referencia visual y se creó código vectorial propio bajo MIT.

Las referencias aportadas no coinciden por completo en el orden de GPIO34/35. Se adopta para el dibujo una disposición de referencia basada en las dos primeras vistas superiores USB-C: EN, VP, VN, D34, D35… a la izquierda. No se confirma que sea la unidad real del usuario. El perfil canónico mantiene `headerPosition: null`, su versión y sus fuentes. Cotejar serigrafía/orientación antes de usar como referencia de conexión. No se agregan GPIO0/6–11 al header ni se deduce una conexión física por pulsar la imagen.

## Interacción

1. Seleccionar un pin abre una ventana con sus características.
2. **Ocupar pin** muestra nombre de conexión y uso previsto (entrada/salida/bidireccional), con entrada como valor inicial prudente. Escribir un nombre basta; se completa una señal genérica «Conexión» si no existía otra.
3. **Dejar libre** retira las asignaciones solo al guardar. **Reservar** crea una reserva del proyecto; el motivo puede detallarse en opciones avanzadas.
4. **Guardar cambios** aplica y guarda con las mismas validaciones de la versión anterior, cierra y devuelve foco al pin. **Cancelar edición** descarta y cierra. Cerrar/Escape con borrador solicita confirmación para descartarlo.
5. **Opciones avanzadas** conserva señales, interfaz, bus compartido, conexión, evidencias, fecha y responsable. Empieza cerrado. Si el pin ya tiene varias asignaciones, la edición rápida de nombre/uso queda deshabilitada y se explica cómo editar cada señal sin borrar el bus.

No se modifica el formato JSON ni el identificador de almacenamiento: proyectos y respaldos existentes siguen siendo válidos. No se escriben firmware, esquemáticos ni datos canónicos al usar la interfaz.

## Indicadores separados

| Capa | Qué significa |
|---|---|
| Libre / En uso / Reservado | Ocupación editable de ese pin en el proyecto activo. |
| `!` | Precaución técnica; al abrir aparecen arranque, solo entrada, ausencia de pulls, ADC2/Wi-Fi u otras condiciones del perfil. No significa automáticamente «prohibido». |
| `R` | UART0/consola del ESP32; la reserva de proyecto es independiente y puede cambiarse conscientemente. |
| `—` | EN, VIN, 3V3 o GND: información de control/alimentación; no admiten asignaciones de GPIO. |
| `×` | GPIO6–11 usados por flash interna; se muestran en un aviso separado, no como contactos disponibles. |

La ficha calcula usos posibles a partir del perfil: entrada digital, salida/PWM cuando corresponde, ADC/canal, DAC o Touch. Conserva fuentes, advertencias y lógica de 3,3 V. En la edición rápida se deshabilitan salida/bidireccional para pines de solo entrada; las opciones avanzadas también quedan protegidas por la validación del modelo.

## Adaptabilidad y accesibilidad

La placa es la vista principal; la tabla sigue como alternativa. Los filtros atenúan/deshabilitan GPIO no coincidentes sin reordenar la placa ni mover contactos. En móvil la placa conserva escala legible dentro de una región desplazable, sin desbordar toda la página. La ventana se adapta al ancho, puede desplazarse y mantiene controles nativos, etiquetas, foco y Escape. No hay acciones que dependan solo de hover ni indicadores basados únicamente en color.

## Verificación reproducible

Desde la raíz:

```powershell
node --test .\tests\gpio\fase1.test.cjs .\tests\gpio\model.test.cjs .\tests\gpio\transfer.test.cjs .\tests\gpio\board.test.cjs
node .\tools\gpio\generate-data.cjs --check
```

Resultado esperado: 24 pruebas aprobadas y adaptador coincidente. La nueva prueba de disposición comprueba 15 contactos por lado, exactamente los GPIO del perfil y la separación de clasificación técnica y ocupación.

Con Playwright y navegador disponibles, usando las variables del [manual](uso-y-verificacion.md):

```powershell
node --test .\tests\gpio\flow.browser.cjs .\tests\gpio\board.browser.cjs
```

Resultado esperado: seis recorridos aprobados por navegador. Se conservan los cuatro recorridos de proyectos, persistencia, PDF, seguridad de texto y tamaños; solo se adaptan sus acciones a la ventana. Se añaden dos para placa/contactos técnicos y edición rápida sin formulario avanzado, recarga, liberar, descartar/cancelar y móvil/teclado. Las pruebas nuevas fallaron primero contra la UI anterior.

Probar manualmente: seleccionar GPIO25, ocuparlo como «LED de prueba», guardar, recargar y volver a seleccionarlo; cancelar un cambio de nombre; dejarlo libre y guardar. Abrir GPIO34 para ver «solo entrada»; abrir VIN/EN y el aviso de flash para verificar que no permiten asignar. En un pin I2C compartido, abrir avanzado y comprobar que ambas señales siguen presentes. No interpretar estos recorridos como pruebas de hardware.

Resultados finales, navegadores y preservación por hashes se registran en la bitácora al guardar el incremento. Capturas actualizadas: [placa](capturas/placa-visual.png), [ventana de GPIO](capturas/ventana-gpio.png) y [ventana móvil](capturas/ventana-movil.png). La verificación técnica no confirma el pinout físico de la unidad.

Historial: 0.1.0 (2026-10-31): rediseño solicitado, comportamiento y pruebas del incremento.

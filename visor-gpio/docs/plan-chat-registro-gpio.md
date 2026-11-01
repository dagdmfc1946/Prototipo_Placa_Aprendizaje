# Plan de desarrollo: registro GPIO y visor técnico ESP32

Fecha: 2026-10-31 (America/Bogota). Versión del plan: 0.5.0.
Estado: fases 1–4 implementadas y verificadas localmente; revisión final del usuario pendiente. Sin commit, push ni despliegue.
Autor del proyecto: Ing. Diego Andrés García Díaz. Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev

## Objetivo y decisiones acordadas

Construir una herramienta local para la ESP32 DevKit ESP-WROOM-32 de 30 pines: visualizar y editar ocupación de GPIO, consultar fichas técnicas por pin y acceder a documentación de referencia desde la interfaz. El usuario podrá modificar sus asignaciones sin editar código y mantener varios proyectos independientes, cada uno con nombre, asignaciones, conexiones, validaciones y notas propias. El perfil técnico se comparte sin compartir ocupación.

- HTML, CSS y JavaScript estándar; sin Django, backend, cuentas, hosting, CDN ni dependencias de ejecución externas.
- Abrir `tools/gpio/index.html` directamente. Evitar módulos ES y cargas `fetch` de archivos locales que obliguen a usar un servidor. Si el JSON canónico requiere un adaptador JavaScript para este modo, generarlo de forma reproducible y comprobar igualdad; nunca mantener dos registros manuales.
- Interfaz en español, adaptable, accesible y propia de una herramienta de banco. Placa seleccionable y tabla alternativa; texto además de color para los estados. UI UX Pro Max puede orientar el diseño tras revisar su licencia y las de sus recursos; no copiar plantillas ni activos sin licencia compatible.
- Consulta técnica local de elaboración propia, con fuentes identificadas. Los enlaces externos requieren Internet y deben indicarlo. No depender de incrustar una web externa.
- Firmware, esquemáticos y conexiones físicas quedan fuera del alcance. Una edición del registro no recablea, modifica `Config.h` ni demuestra funcionamiento físico.
- Preservar cambios locales y `examples/` privado e ignorado. Sin commit, push ni despliegue sin autorización expresa para esos cambios.

## Licencias, autoría y procedencia

El requisito de usar solo open source se aplica al software y sus dependencias; para documentación, imágenes y demás recursos se exigirán licencias abiertas compatibles. Tener acceso público o gratuito a un archivo no acredita permiso para redistribuirlo.

1. Priorizar código, textos explicativos y diagramas originales. No copiar artículos, traducciones, capturas, fotografías, tablas gráficas, logotipos ni dibujos de pinout de terceros sin licencia abierta compatible y verificada. Representar hechos técnicos con redacción y diagramación propias, citando fuentes primarias.
2. Cualquier dependencia de software deberá tener licencia aprobada por OSI y compatible con la licencia del visor. Preferir ninguna dependencia; usar tipografía del sistema e iconos propios. Para otros recursos, aceptar licencias que permitan modificación y redistribución, también comercial; excluir restricciones NC/ND. Conservar textos de licencia y avisos exigidos.
3. Antes de incorporar un recurso de terceros, registrar nombre, autor/titular, URL de origen, versión/revisión, fecha de consulta, licencia e identificador SPDX cuando exista, evidencia de términos, uso previsto y modificaciones. Si la licencia es ausente, ambigua o incompatible, no incluir el recurso.
4. Fase 1: se comprobó la ausencia de LICENSE visible en el repositorio revisado. Se definen MIT para datos/pruebas nuevos y CC BY 4.0 para documentación propia nueva de `docs/gpio/`, con alcance exacto en `docs/gpio/LICENCIAS.md`. El código propio futuro del visor seguirá MIT con su aviso correspondiente. No se relicencia firmware, documentación previa ni material ajeno, y la publicación espera revisión/aprobación del usuario.
5. Las skills de diseño no transfieren automáticamente una licencia a imágenes, fuentes, ejemplos o activos enlazados: revisar cada recurso utilizado. La atribución por sí sola no sustituye el permiso de uso.
6. Los PDF oficiales de Espressif no se consideran abiertos solo por ser descargables. Hasta verificar una licencia abierta compatible, conservar únicamente metadatos y enlaces oficiales: no añadirlos al repositorio ni distribuirlos con el visor. Igual criterio para la web Last Minute Engineers, que se enlaza como referencia secundaria sin copiarla.
7. Permitir seleccionar un PDF local para consulta privada mediante el navegador, sin subirlo, copiarlo al repositorio ni incluirlo en exportaciones JSON. Usar el visor nativo cuando exista y ofrecer abrirlo aparte si no funciona; liberar las URL temporales. No descargar automáticamente documentos externos ni eludir restricciones de acceso.
8. Añadir avisos de autoría, licencias y procedencia en la herramienta y documentación. Las cabeceras de archivos nuevos identificarán archivo, descripción, autor del proyecto, Instagram, repositorio, versión, fecha e historial; conservar además la autoría de terceros cuando corresponda.

La guía original, el registro y la interfaz deben funcionar sin Internet. La consulta de un PDF externo dependerá de conexión o de que el usuario disponga de una copia local legítima. No se promete incluir una biblioteca de PDF de terceros en el repositorio.

## Organización de archivos

Rutas propuestas; crear únicamente los archivos necesarios en cada incremento:

- `docs/plan-chat-registro-gpio.md`: este plan; conserva el nombre para no romper referencias.
- `docs/gpio/registro.json`: fuente canónica versionada de perfiles, fuentes y proyectos iniciales.
- `docs/gpio/plantilla-proyecto.json`: plantilla vacía, sin heredar trabajos existentes.
- `tests/gpio/fase1.test.cjs`: comprobaciones locales de datos con Node, sin paquetes externos.
- `docs/gpio/modelo-datos.md`: contrato de datos y sincronización.
- `docs/gpio/referencia-tecnica.md`: guía original y referencias por capacidad/restricción.
- `docs/gpio/fuentes-y-licencias.md`: inventario de fuentes, recursos y permisos, separando enlaces de archivos redistribuidos.
- `docs/gpio/uso-y-verificacion.md`: instrucciones, límites y resultados de pruebas.
- `tools/gpio/index.html`, `styles.css`, `app.js` y los archivos auxiliares estrictamente necesarios: aplicación local.
- Archivos de licencia/avisos con alcance delimitado al visor y su documentación, una vez resuelta la fase 1.

El JSON exportado representa una configuración del usuario; no sustituye automáticamente al registro canónico del repositorio. La incorporación será explícita y revisada. La tabla documental se derivará del mismo registro para evitar divergencias.

## Proyectos independientes

- Crear, seleccionar, renombrar, duplicar y eliminar trabajos desde la interfaz. Cada proyecto referencia un perfil de placa y conserva sus propios GPIO; no hay ocupación global entre proyectos.
- Crear un trabajo usa una plantilla sin componentes, conexiones ni validaciones heredadas, con UART0 reservada por defecto. Duplicar copia asignaciones/notas pero reinicia conexiones y validaciones físicas.
- Eliminación y restablecimiento requieren alcance explícito por proyecto y confirmación; no eliminar el último trabajo de forma implícita. IDs estables, distintos del nombre.
- Exportación individual y respaldo de colección en Fase 3; detectar colisiones de ID sin sobrescribir silenciosamente. Ver contrato detallado en [modelo de datos](gpio/modelo-datos.md).
- Fase 1 prepara el contrato, un proyecto real inicial y una plantilla; no declara implementadas operaciones de interfaz ni persistencia.

## Desarrollo en cuatro fases

Las fases se ejecutan por incrementos verificables y se documentan separadamente. El usuario autorizó continuar fases 2, 3 y 4 y revisar el conjunto al finalizar (2026-10-31). Esta autorización no incluye publicar. El seguimiento se mantiene en `tasks/todo.md` sin reemplazar tareas de firmware.

### Fase 1. Datos, fuentes y licencias

**Resultado:** registro inicial verificable, contrato multiproyecto, plantilla independiente y licencias delimitadas. Entrega local preparada; revisión del usuario pendiente.

- Contrastar las asignaciones con `esp32_Project/Config.h`, P17a y evidencia nueva del usuario, sin editar firmware.
- Separar perfil técnico de placa/pin, asignaciones editables, conexión informada y validación. Campos mínimos: GPIO, etiqueta, componente/función, dirección/interfaz, estado de asignación, conexión, validación, notas, evidencia y fecha. Añadir versión de esquema y metadatos de placa/fuentes.
- Documentar GPIO expuestos, orientación y grado de confirmación del pinout. No confundir chip, módulo y placa. La posición física seguirá siendo de referencia hasta cotejar la unidad.
- Crear guía técnica original y catálogo de fuentes con revisión, sección/página cuando corresponda y fecha. Definir licencias propias y comprobar las de cualquier recurso antes de incorporarlo.

**Aceptación:** datos iniciales fieles a la evidencia; restricciones separadas de las decisiones del usuario; ningún recurso redistribuido sin licencia abierta compatible y documentada.

**Verificación:** revisar registro frente a configuración/documentación actual, validar estructura JSON y revisar inventario de licencias. No afirmar pruebas físicas.

**Dependencias:** ninguna fase previa; identificación de placa pendiente se registra como incertidumbre.

### Fase 2. Visor editable y consulta técnica

**Resultado:** seleccionar un GPIO, consultar sus características y modificar su asignación desde la misma interfaz.

- Implementar creación, selección, renombrado, duplicación y eliminación de proyectos, con aislamiento de sus asignaciones y reinicio de evidencias al duplicar.
- Dibujar una representación original de placa/pines y una tabla accesible. Añadir filtros por ocupación/capacidad y resumen que excluya alimentación y EN del total de GPIO.
- Editar componente, función, interfaz, asignación, conexión, validación, evidencia y notas; liberar y trasladar asignaciones, con guardar/cancelar. Exigir evidencia para marcar una validación y atribuirla al usuario, sin generarla automáticamente.
- Mostrar ficha técnica no editable desde el formulario de asignación: restricciones, capacidades, advertencias y enlaces a fuentes. Cualquier corrección del perfil técnico requiere un flujo separado y trazabilidad.
- Detectar incompatibilidades y conflictos. Distinguir buses compartidos válidos de usos simultáneos incompatibles del mismo GPIO. No asumir que los pines predeterminados de un ejemplo son las únicas rutas posibles.
- Integrar guía original por GPIO, ADC, DAC, Touch, PWM, I²C, SPI, UART, arranque y alimentación; biblioteca de enlaces y consulta de PDF local seleccionado por el usuario, con apertura alternativa.

**Aceptación:** usuario puede cambiar asignaciones sin editar código; fichas distinguen capacidad técnica y ocupación; documentación accesible desde el visor y etiquetada como local o externa.

**Verificación:** abrir por `file://` sin red; probar selección/edición/cancelación, conflictos, bus compartido, teclado y PDF local/apertura alternativa. Confirmar que el diseño es original y no usa recursos remotos obligatorios.

**Dependencias:** contrato, registro y criterios de licencia de fase 1.

### Fase 3. Persistencia, intercambio y recuperación

**Resultado:** conservar y transferir cambios sin pérdida silenciosa de datos.

- Autoguardado en navegador cuando esté disponible, con indicador de resultado y aviso de fallo. Documentar que `localStorage` en `file://` no ofrece garantías uniformes y puede variar por ruta/navegador; el JSON exportado es el respaldo portable.
- Guardar la colección y proyecto activo; exportar/importar proyecto individual o respaldo completo, con tratamiento explícito de colisiones de ID y perfiles.
- Exportar/importar JSON versionado. Validar esquema, tipos, GPIO del perfil, tamaños y estados antes de aplicar cambios; mostrar resumen y confirmar reemplazo. Una importación inválida conserva intacto el estado actual.
- Tratar todo texto importado como texto, sin ejecución de HTML/JS. Ofrecer restablecimiento explícito con confirmación y posibilidad de exportar antes. El JSON no contiene PDF, datos binarios ni permisos del sistema de archivos.
- Explicar cuándo hay cambios locales pendientes de exportar y cómo incorporar una exportación revisada al registro canónico. Nunca escribir automáticamente firmware, Markdown ni Git.

**Aceptación:** exportar/importar reproduce los campos editables; fallos de almacenamiento e importación no ocultan ni destruyen cambios; recuperación inicial explícita.

**Verificación:** recargar en el mismo contexto compatible, simular almacenamiento bloqueado, probar JSON malformado/incompatible y texto con etiquetas HTML, comparar exportación/importación y probar restablecimiento/cancelación.

**Dependencias:** edición de fase 2 y esquema de fase 1.

### Fase 4. Verificación integral y entrega local

**Resultado:** herramienta documentada, revisada y lista para uso local.

- Comprobar recorridos completos en navegadores reales, escritorio y pantalla estrecha: teclado, foco, contraste, selección, edición, filtros, guardado, recuperación, JSON y documentación/PDF.
- Comprobar apertura sin Internet, ausencia de dependencias y solicitudes externas automáticas, enlaces relativos, integridad del registro y correspondencia con `Config.h` sin modificarlo.
- Auditar licencias/avisos y archivos incluidos: sin artículos, imágenes o PDF de terceros no autorizados; sin material privado de `examples/`. Registrar navegador, fecha, resultados y limitaciones reales; no marcar como superadas pruebas no ejecutadas.
- Completar instrucciones de uso/respaldo, fuentes, versiones e historial. Actualizar README, seguimiento y bitácora; presentar el resultado local para revisión del usuario.

**Aceptación:** recorridos verificados y documentados; recursos incluidos originales o con licencias abiertas compatibles; firmware intacto. Sin commit, push ni despliegue automático.

**Verificación:** lista de comprobaciones reproducible y revisión del diff, inventario de recursos y cambios ajenos preservados. Si falla un criterio, corregirlo y repetir su prueba antes de cerrar la fase.

**Dependencias:** fases 1 a 3 completadas.

## Contexto técnico inicial conservado

### Punto de partida del registro

Esta tabla es contexto inicial, no confirmación de funcionamiento ni pinout definitivo de PCB.

| GPIO | Función | Estado inicial | Evidencia o condición |
|---:|---|---|---|
| 4 | DATA DHT11 | Conectado, sin validación registrada | Usuario confirma D4; fuera del sketch actual |
| 21 | OLED SDA | Conexión informada, parámetros según ejemplo | Usuario informa OLED conectada y remite a su script |
| 22 | OLED SCL | Conexión informada, parámetros según ejemplo | Igual condición que GPIO21 |
| 13 | MicroSD CS | Asignado provisionalmente | `Config.h` de P17a; falta retroalimentación de prueba |
| 18 | MicroSD SCK | Asignado provisionalmente | `Config.h` de P17a |
| 19 | MicroSD MISO | Asignado provisionalmente | `Config.h` de P17a |
| 23 | MicroSD MOSI | Asignado provisionalmente | `Config.h` de P17a |
| 1 | UART0 TX | Reservado | Programación y consola |
| 3 | UART0 RX | Reservado | Programación y consola |

No considerar ocupados los pines de propuestas antiguas sin adopción actual. Ejemplo: GPIO13 estaba propuesto para buzzer y ahora se usa provisionalmente para CS; registrar el conflicto y no asignar ambos como conexiones simultáneas. No reservar por anticipado todos los sensores pendientes.

Pines sin otra asignación actual conocida: **2, 5, 12, 14, 15, 16, 17, 25, 26, 27, 32, 33, 34, 35, 36 y 39**. Verificar el estado del repositorio y cualquier respuesta nueva del usuario antes de usar esta lista. Estar sin asignar no significa poder conectar cualquier circuito.

Restricciones mínimas a representar, contrastadas con documentación primaria:

- GPIO34/35/36/39: solo entrada y sin pull-up/pull-down internos.
- GPIO2/5/12/15: pines de configuración de arranque. GPIO12 requiere especial atención por la tensión de flash.
- GPIO0 también es de configuración de arranque, pero no se debe inventar que esté expuesto en el header de esta variante de 30 pines.
- GPIO1/3: UART0 asociada a programación/consola.
- GPIO6–11: comunicación de flash del WROOM, no recursos libres para periféricos.
- ADC1 expuesto: GPIO32/33/34/35/36/39; distinguir ADC1 de ADC2 al usar Wi-Fi.
- EN, VIN, 3V3 y GND son control/alimentación, no GPIO asignables.
- Lógica del ESP32 de 3,3 V; no aplicar señales de 5 V directamente.

La representación física de la placa debe identificar orientación y diferenciar disposición de referencia de disposición confirmada. No atribuir posiciones físicas a la unidad del usuario sin cotejar su modelo/serigrafía.

## Coordinación y límites

- Antes de implementar: leer `AGENTS.md`, `README.md`, `tasks/plan.md`, `tasks/todo.md`, `docs/bitacora.md`, `docs/firmware-archivos-y-versionado.md`, P17a y `esp32_Project/Config.h`; comprobar Git y preservar cambios ajenos.
- Chat de firmware: aporta GPIO adoptado, componente, conexión, resultado de prueba y revisión del script. Chat del visor: incorpora esa evidencia sin inventar validaciones.
- Leer la última versión antes de editar documentos compartidos y limitar cada cambio al incremento. Por autorización posterior del usuario se completan fases 2–4 con documentación separada y revisión humana del conjunto al finalizar; no se requiere otro permiso entre esas fases.
- No modificar firmware, esquemáticos ni datos privados. No reutilizar autorizaciones de publicaciones anteriores.

## Fuentes y criterios de consulta

- [Datasheet oficial ESP32](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf): fuente técnica primaria; enlace, no licencia de redistribución. Verificar revisión al redactar las fichas.
- [Documentación oficial Espressif](https://www.espressif.com/en/support/documents/technical-documents): localizar documentos del módulo y la placa identificados; no sustituirlos por documentos de otra variante.
- [Referencia de Last Minute Engineers](https://lastminuteengineers.com/esp32-pinout-reference/): referencia secundaria externa para la variante de 30 pines; sin reproducción de su artículo o imágenes.
- [Open Source Definition, OSI](https://opensource.org/osd) y [licencias aprobadas por OSI](https://opensource.org/licenses): criterios para software de terceros.
- [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): propuesta para documentación/diagramas propios, no permiso aplicable a obras ajenas.
- [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage): limitaciones de persistencia con `file://`.

## Entrega local de Fase 1

Registro y plantilla en `docs/gpio/`; contrato en [modelo-datos.md](gpio/modelo-datos.md); guía y fuentes originales; alcance de licencias en [LICENCIAS.md](gpio/LICENCIAS.md). [Instrucciones de pruebas](gpio/uso-y-verificacion.md): `node --test tests/gpio/fase1.test.cjs` desde la raíz, más revisión legible en PowerShell. La entrega original de Fase 1 no incluía HTML; el visor se incorporó en Fase 2 y no requiere hardware para revisarlo. El usuario autorizó después completar Fases 3–4; ver las entregas siguientes.

## Historial

- 0.1.0 — 2026-10-31: propuesta inicial de traspaso y contexto GPIO.
- 0.2.0 — 2026-10-31: plan reestructurado en cuatro fases; HTML/CSS/JS, edición por el usuario, consulta técnica y PDF local, licencias abiertas, atribución y separación entre consulta y redistribución. Se conserva el contexto técnico previo como provisional.

- 0.3.0 — 2026-10-31: proyectos independientes, plantilla sin evidencias heredadas y Fase 1 local con datos, guía original, licencias e instrucciones de prueba; sin publicación.

## Entregas de fases 2–4

- [Fase 2: visor y proyectos](gpio/fase-2-visor.md): mapa lógico/tabla, edición y traslado, gestión de proyectos, referencia integrada y PDF local.
- [Fase 3: persistencia](gpio/fase-3-persistencia.md): autoguardado, exportación individual/completa, importación validada, copia anterior, recuperación y conflictos entre pestañas.
- [Fase 4: verificación](gpio/fase-4-verificacion.md): 22 comprobaciones de datos/reglas/transferencia y cuatro recorridos reales por navegador en Chrome y Edge; capturas y límites documentados.
- [Uso y pruebas paso a paso](gpio/uso-y-verificacion.md). Abrir `tools/gpio/index.html` con todos sus archivos vecinos; sin servidor ni dependencias de ejecución.

0.4.0 — 2026-10-31: autorización para completar fases 2–4, entregas locales separadas por fase, guía de pruebas e informe de verificación. Publicación sigue pendiente de revisión/aprobación del usuario.

## Revisión de interacción solicitada tras las cuatro fases

El usuario solicita una placa reconocible con indicadores por pin y una ventana simple para ocupar/liberar y nombrar conexiones, con usos y límites visibles. Se implementa como refinamiento de Fase 2 y se verifica como extensión de Fase 4. No se añade una quinta fase ni se cambia el esquema de Fase 1 o el almacenamiento de Fase 3. Ver [revisión y pruebas](gpio/revision-placa-visual.md). Las imágenes recibidas se consultan, sin redistribuirlas; se usa SVG original. Disposición física real pendiente de cotejo. Sin publicación automática.

## Publicación autorizada en carpeta exclusiva

El usuario autoriza publicar el visor actual en `dev` dentro de `visor-gpio/`. Esta copia contiene aplicación, datos, documentación y pruebas. Las referencias a rutas del visor son relativas a esta carpeta; firmware y reglas del repositorio padre se consultan sin modificarse. La copia local anterior se conserva para exportar proyectos del navegador; ver el README de `visor-gpio/`. Las restricciones históricas de no publicar corresponden a revisiones anteriores y se levantan solo para este conjunto autorizado.

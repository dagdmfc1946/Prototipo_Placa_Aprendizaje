# Contrato de datos: proyectos y GPIO

Versión: 0.2.0. Esquema: 1.0.0. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Alcance: [LICENCIAS.md](LICENCIAS.md).

## Objetivo y alcance de Fase 1

Preparar datos y reglas para trabajar con proyectos independientes sobre una misma placa de referencia. Fase 1 entregó JSON, documentación y comprobaciones. Fases 2–4 ya implementan visor/proyectos, persistencia e intercambio; ver los informes por fase y la guía de uso.

## Archivos canónicos

- [registro.json](registro.json): colección inicial; única fuente manual de perfiles y asignaciones iniciales del visor.
- [plantilla-proyecto.json](plantilla-proyecto.json): plantilla vacía para nuevos trabajos; no es un proyecto activo ni evidencia de un trabajo real.
- Este documento: contrato estructural y reglas semánticas. No se ha implementado un validador general de importaciones ni un JSON Schema formal en Fase 1.

No mantener otra tabla manual de ocupación en Markdown o JavaScript. Si Fase 2 necesita un adaptador JS para abrir con `file://`, generarlo a partir del JSON y verificar igualdad en pruebas. La plantilla expresa la política de nuevo proyecto; las pruebas verifican que cubra el mismo perfil y no copie trabajos existentes.

## Colección `gpio-workspace`

| Campo | Tipo y regla |
|---|---|
| `schemaVersion` | Texto; versión de contrato `1.0.0`. Rechazar versiones desconocidas antes de cambiar estado. |
| `kind` | Literal `gpio-workspace`. |
| `metadata` | Autor, Instagram, repositorio, versión del archivo, fecha, licencia e historial. |
| `sources` | Catálogo de fuentes con `id`, `location`, `revision`, `accessedAt`. Los identificadores son únicos. |
| `boardProfiles` | Perfiles técnicos únicos por `id`, con versión independiente. |
| `projects` | Lista de uno o más proyectos con identificadores únicos; un nombre no es un identificador. |
| `activeProjectId` | Identificador de un proyecto existente; cambiarlo no modifica sus datos. |

Los perfiles son referencia técnica compartida; las ocupaciones pertenecen a cada proyecto. Ningún GPIO tiene ocupación global. Editar un trabajo no cambia los demás ni el perfil. Un mismo número puede estar asignado a componentes distintos en dos proyectos sin conflicto entre ellos.

## Perfil técnico

`id`, `version`, `name`, `headerContactCount`, `layoutConfirmation`, `orientation`, `logicVoltage`, `direct5vSignalsAllowed`, `pins`, `nonGpioContacts`, `unavailableGpios` y `notes` identifican el modelo y su grado de certeza.

Cada pin tiene `gpio` entero, `label`, `headerPosition`, capacidades booleanas (`input`, `output`, `internalPulls`, `pwmOutput`, `rtc`, `strapping`), `adc` como `{unit, channel}` o `null`, `dacChannel`/`touchChannel` como entero o `null`, `warnings` y `sourceIds`.

Las posiciones físicas son `null` hasta cotejar la serigrafía y orientación reales. `internalPulls` indica capacidad de configuración, no que una resistencia esté activada ni su estado al reset. `pwmOutput` indica capacidad de salida PWM; no promete canales ilimitados. `unavailableGpios` identifica pines relevantes excluidos de este perfil, no una lista exhaustiva de números inválidos del chip.

Esta versión no incluye editor de capacidades técnicas. Corregir el perfil requiere revisar sus archivos canónicos, fuentes, versión e impacto sobre datos existentes, y regenerar el adaptador. La importación rechaza perfiles técnicos diferentes; no los sustituye de forma implícita.

Los cinco contactos de control/alimentación se registran por separado. No cuentan como GPIO ni admiten asignaciones de periféricos. La ficha técnica no se altera desde el formulario de asignación: una corrección del perfil debe ser explícita, con versión y evidencia, y presentar su impacto sobre los proyectos que lo referencian.

## Proyecto y asignaciones

Un proyecto contiene `id`, `name`, `description`, `boardProfileId`, `createdAt`, `updatedAt` y `pins`. Fechas de registro: `YYYY-MM-DD`; no son mediciones ni hora de RTC. Identificador estable, opaco y generado al crear; renombrar no cambia el ID. Propuesta para Fase 2: UUID generado localmente, sin servidor.

Cada GPIO del perfil aparece exactamente una vez en `pins`:

| Campo | Regla |
|---|---|
| `gpio` | Número existente en el perfil seleccionado. |
| `allocation` | `free` (libre), `assigned` (asignado) o `reserved` (reservado). |
| `reservationReason` | Texto obligatorio para reservado; vacío en los demás estados. |
| `assignments` | Lista de señales/componentes; vacía si está libre. Si está asignado, al menos una. |
| `notes` | Texto editable; puede estar vacío. |
| `updatedAt` | Fecha del registro o `null` si no se ha editado. |

Una asignación contiene `id` único dentro del proyecto, `component`, `signal`, `direction` (`input`, `output`, `bidirectional`, respecto del ESP32), `interface`, `busId` (texto o `null`), `connection`, `validation`, `notes` y `evidence`.

- Conexión: `unknown` (sin confirmar), `reported` (informada por el usuario) o `disconnected` (desconexión informada). Asignar un GPIO no confirma un cable.
- Validación: `{status, evidence}`. Estados: `not-tested`, `passed`, `failed`. Tanto aprobado como fallido requieren evidencia con detalle, fecha y responsable; sin evidencia no se declara una prueba.
- Cada evidencia contiene `sourceId`, `detail`, `date`, `reportedBy`. Sus fuentes deben existir en la colección. Separar evidencia de asignación/conexión y evidencia del resultado de prueba.
- Una prueba exitosa previa no se conserva como válida al cambiar GPIO, componente, señal o interfaz: Fase 2 debe restablecer validación y conexión, explicándolo al usuario. Guardar evidencia previa en una nota histórica identificada como obsoleta si se desea conservarla; no como validación vigente.

En el proyecto inicial hay 7 GPIO asignados, 2 reservados y 16 libres. Son estados de ocupación mutuamente excluyentes. Los 3 GPIO de DHT11/OLED tienen conexión informada; no se suman como una cuarta categoría. Ninguna asignación está validada físicamente. GPIO1/3 se reservan por política de consola UART0, con motivo explícito, sin inventar periféricos conectados; la reserva es editable por proyecto.

## Operaciones de proyectos

| Acción | Resultado esperado y criterio de prueba futura |
|---|---|
| Crear | Instanciar plantilla con nuevo ID, nombre no vacío y fechas. Todos los componentes vacíos; solo UART0 reservada por defecto. No copiar conexiones/validaciones del proyecto activo. |
| Cambiar | Mostrar exclusivamente asignaciones, filtros/resumen y notas del seleccionado. Volver al anterior conserva su contenido. |
| Renombrar | Cambiar nombre sin modificar ID, asignaciones ni otros proyectos. Nombres repetidos se distinguen por ID y se advierten en UI. |
| Duplicar | Crear nuevo ID y nombre, copiar asignaciones/notas, pero reiniciar conexiones a `unknown` y validaciones a `not-tested`, sin copiar evidencias físicas como vigentes. La duplicación es explícita. |
| Eliminar | Confirmar con nombre; ofrecer respaldo. No borrar otros proyectos. Impedir eliminar el último: crear otro o restablecer el actual explícitamente. |
| Restablecer | Alcance por proyecto activo, con confirmación; no borrar la colección completa de forma implícita. |
| Importar | Ofrecer proyecto individual o colección; detectar colisiones de ID, no fusionar ni sobrescribir silenciosamente. Importar como nuevo trabajo genera nuevo ID; preservar una prueba importada exige identidad del trabajo y evidencia, no inferencia automática. |
| Exportar | Proyecto individual con versión, perfil referenciado y fuentes necesarias, o copia completa de la colección. Sin PDF, archivos binarios ni permisos de archivos. |

El sobre individual implementado es `{schemaVersion, kind: "gpio-project", metadata, sources, boardProfiles, project}`. Incluye el perfil referenciado y las fuentes, sin PDF. La colección conserva el formato `gpio-workspace`. Un perfil importado no sobrescribirá automáticamente uno conocido. Solo se acepta si su identidad y versión son compatibles; las diferencias se revisan explícitamente. La plantilla, con `id`/fechas `null` y nombre vacío, no puede importarse directamente como proyecto terminado.

## Validación implementada en el límite de importación

Validar antes de aplicar: forma, tipos y campos admitidos; enteros GPIO válidos para el perfil; unicidad de IDs y GPIO; referencias a perfiles/fuentes/proyecto activo; listas completas; coherencia de estados y evidencia. Rechazar campos inesperados en la versión 1 y no hacer mezclas de objetos sin validación. Todo texto se representa con `textContent` o equivalente, nunca como HTML ejecutable.

Límites implementados: 2 MiB por archivo y por colección serializada como respaldo; 100 proyectos, 200 fuentes, 200 caracteres por nombre/responsable/componente/señal/interfaz/bus, 4000 por descripción/nota/detalle, 20 asignaciones por pin y 50 evidencias por lista. Son límites conjuntos, no cuotas prometidas. Las operaciones se aplican sobre una copia y solo se confirman tras validar toda la colección. Un fallo conserva el estado previo y ofrece un mensaje concreto.

Las señales de un bus compartido pueden tener varias asignaciones por pin si interfaz, `busId`, señal y condiciones eléctricas son compatibles. Igual `busId` por sí solo no permite conectar salidas incompatibles; CS de dispositivos SPI siguen siendo independientes. Los conflictos son intraproyecto; el registro no demuestra compatibilidad eléctrica de circuitos.

## Verificación y sincronización

Ejecutar las comprobaciones de [uso-y-verificacion.md](uso-y-verificacion.md). Comprueban datos iniciales y referencias, no simulan una UI inexistente. Las pruebas de creación/aislamiento/duplicación/eliminación y persistencia/exportación ya se ejecutaron contra la aplicación; ver informes de fases 2–4. El contrato se valida con código propio, sin dependencia de JSON Schema.

Los cambios del navegador no escriben JSON, firmware, Markdown o Git automáticamente. Incorporar una exportación al registro canónico requiere revisión explícita y no implica publicar. El usuario revisa y aprueba antes de cualquier commit/push.

Historial: 0.1.0 (2026-10-31): contrato inicial de colección, perfiles, proyectos y evidencias.

0.2.0 (2026-10-31): implementación de operaciones, sobres de exportación, límites y referencias a verificaciones finales; esquema 1.0.0 conservado.

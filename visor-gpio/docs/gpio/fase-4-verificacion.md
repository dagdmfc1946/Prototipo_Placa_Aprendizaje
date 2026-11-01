# Fase 4 — Verificación y entrega local

Versión: 0.2.0. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Ver [licencias](LICENCIAS.md).

## Entorno y resultados

Windows; Node.js v24.22.1; Playwright 1.62.1 como herramienta de prueba externa ya disponible, sin instalar paquetes ni incluirlos en la aplicación. Navegadores aislados: Chrome 156.0.8078.79 y Edge 156.0.4314.50. Se usaron perfiles temporales, no perfiles personales ni sesiones autenticadas.

| Grupo | Resultado | Qué demuestra |
|---|---|---|
| Fase 1, `fase1.test.cjs` | 6/6 | Registro inicial, referencias y restricciones contrastadas con `Config.h`. |
| Fase 2, `model.test.cjs` | 8/8 | Aislamiento, duplicación, buses, evidencia, traslado y adaptador sincronizado. |
| Fase 3, `transfer.test.cjs` | 8/8 | JSON completo/individual, entradas inválidas, persistencia, copia anterior, cuota/bloqueo, corrupción, concurrencia y tamaño reimportable. |
| Navegador, Chrome | 4/4 recorridos | Operaciones reales de interfaz, persistencia, respaldo, PDF, acceso por teclado y tamaños de pantalla. |
| Navegador, Edge | 4/4 recorridos | Mismos recorridos para comprobar `file://`, almacenamiento y PDF. |

Comandos en [uso y verificación](uso-y-verificacion.md). Las evidencias introducidas al probar el formulario de validación son sintéticas, dentro de un navegador temporal: no demuestran pruebas de hardware ni se incorporan al JSON canónico.

## Recorridos del navegador

1. Crear A/B y asignar el mismo GPIO sin mezclar datos; cambiar de proyecto. Renombrar, duplicar con evidencia reiniciada, cancelar/confirmar eliminación y restablecer solo un proyecto. Editar/cancelar borrador; confirmar descarte al abandonar edición.
2. Rechazar salida en GPIO34 y bus incompatible conservando el registro. Compartir SDA del mismo bus explícito. Exigir evidencia al aprobar e invalidarla al cambiar función; trasladar MicroSD CS sin modificar firmware. La protección del último proyecto se comprueba en las reglas y se refleja deshabilitando el botón.
3. Recargar y recuperar colección/proyecto activo. Descargar y leer el JSON completo, rechazar JSON inválido sin perder trabajos y restaurar el respaldo con confirmación. La exportación individual también se verifica mediante ida y vuelta del contrato.
4. Bloquear almacenamiento para comprobar aviso, edición en memoria y descarga. Recuperar copia anterior, provocar conflicto desde otra pestaña y comprobar que una versión pendiente no sobrescribe el guardado ajeno.
5. Introducir texto `<img ...>` en componente/notas: se muestra como texto, sin crear imágenes ni ejecutar código. No hay HTML dinámico, `eval` ni solicitudes de red para guardar.
6. Abrir un PDF mínimo original generado por la prueba, verificar su URL local y la apertura aparte; rechazar un falso PDF conservando el anterior y cerrar liberando el documento.
7. Abrir con red simulada desconectada: cero solicitudes HTTP/HTTPS automáticas y consola sin errores/advertencias en los recorridos. Probar filtros, mapa/tabla y estado vacío.
8. Capturas a 320, 768, 1024 y 1440 px, sin desbordamiento global. Etiquetas de todos los controles, teclado inicial, foco dentro del diálogo y Escape/cancelar. Se revisaron visualmente capturas de escritorio y móvil y se ajustaron legibilidad de pines, bordes y controles.

## Hallazgos resueltos y revisión

- La descarga se cancelaba dentro del sandbox tanto con red simulada como sin ella. En navegador aislado fuera del sandbox, el mismo flujo descargó correctamente. No se debilitó la aplicación para resolverlo.
- Normalizar `digital` a mayúsculas invalidaba la conexión DHT al editar solo notas. Se corrigió la comparación y se añadió una prueba de regresión.
- La prueba de tamaño detectó que solo se limitaba el archivo entrante. Ahora se limita también la colección serializada, para generar respaldos reimportables; la UI opera sobre una copia validada antes de confirmar un cambio.
- Revisión de corrección, claridad, separación modelo/interfaz/transferencia/almacenamiento, tratamiento de entradas y coste de procesamiento. Sin dependencias de ejecución; límites de archivo/listas/textos y adaptador verificado contra sus fuentes.

## Evidencia y límites

- [Escritorio](capturas/escritorio.png) y [móvil de 320 px](capturas/movil.png): capturas originales de esta aplicación, no de sitios ajenos.
- [Contrato visual original](../../tools/gpio/DESIGN.md).

No se afirma compatibilidad probada con Firefox, Safari, otros sistemas o todos los visores PDF. Las comprobaciones de etiquetas/foco/contraste no equivalen a certificación completa de accesibilidad ni a una sesión con lector de pantalla humano. `localStorage` con `file://` depende del navegador: conserva JSON externos. Posición física, conexiones reales y pruebas de hardware siguen sujetas a tu evidencia.

Hashes de firmware, integridad de archivos copiados y `git diff --check` se registran en bitácora al guardar la entrega. No se compila/carga firmware porque este incremento no lo modifica. Sin commit, push ni despliegue; publicación pendiente de revisión y autorización del usuario.

Historial: 0.1.0 (2026-10-31): resultados por fase, evidencia visual y límites de verificación.

## Revisión posterior — placa visual y ventana rápida

Se amplía la suite a 24 comprobaciones Node y seis recorridos por navegador: cuatro de regresión conservados y dos nuevos para disposición/contactos técnicos, formulario rápido, guardado/liberación, borrador/Escape y móvil. Las capturas iniciales de esta fase describen la entrega anterior; las nuevas y los resultados finales se enlazan en [revisión de placa visual](revision-placa-visual.md) y se registran en la bitácora. No se confirma el hardware por este cambio de interfaz.

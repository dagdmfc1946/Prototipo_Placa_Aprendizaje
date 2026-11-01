# Fase 3 — Guardado, intercambio y recuperación

Versión: 0.1.0. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Ver [licencias](LICENCIAS.md).

## Autoguardado

Aplicar una edición o una operación de proyectos guarda la colección y el proyecto activo en `localStorage`, clave `gpio-workbench.v1`. Antes de sustituir un guardado válido se conserva una copia anterior en `gpio-workbench.v1.backup`. Es una sola instantánea anterior, no un historial ilimitado. Cambiar el proyecto activo también puede actualizar esa instantánea.

El indicador informa si se guardó o si los cambios siguen solo en memoria. Si el acceso está bloqueado o se agota la cuota, el trabajo permanece en pantalla y puede exportarse. Se avisa al intentar salir con un borrador pendiente o cambios aplicados sin guardar; el aviso nativo depende del navegador.

El comportamiento con `file://` depende de navegador, configuración y ruta. Cambiar de carpeta, archivo, perfil, navegador o pasar a servidor local puede usar otro almacenamiento. Borrar datos del navegador o cerrar una sesión privada puede eliminarlos. El JSON exportado es el respaldo portable; no depender únicamente del navegador. [MDN: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## Exportación e importación

**Exportar proyecto** descarga un JSON `gpio-project` con versión de esquema, metadatos, fuentes, perfil referenciado y un proyecto. **Respaldar todo** descarga la colección `gpio-workspace`, incluido el proyecto activo. No se incluyen PDF, binarios ni permisos de acceso a archivos.

**Importar JSON** valida el archivo completo antes de mostrar una confirmación. Opciones:

- **Añadir como trabajos nuevos:** genera IDs nuevos de proyecto/señales, conserva funciones/notas y reinicia conexiones y validaciones físicas. No sobrescribe trabajos existentes.
- **Restaurar respaldo:** si es una colección, reemplaza expresamente toda la colección. Si es un proyecto individual, reemplaza el de igual ID o lo incorpora si ese ID no existe; los demás se conservan. Mantiene las evidencias del respaldo porque se está recuperando el mismo trabajo.

El diálogo explica el alcance antes de confirmar; permite cancelar y respaldar primero. Una colisión de fuentes con el mismo ID y distinta procedencia se rechaza al combinar. No hay fusión silenciosa de asignaciones ni reemplazo implícito de perfiles.

Se comprueban tipos/campos permitidos, versión `1.0.0`, IDs únicos, referencias a fuentes/perfiles/proyecto activo, fechas reales, exactamente un registro por GPIO del perfil, coherencia de ocupación, direcciones y evidencia. Se rechazan perfiles desconocidos o alterados: importar notas no puede convertir un pin de solo entrada en salida. Texto con etiquetas HTML se conserva como texto y no se ejecuta.

Límites implementados: 2 MiB por archivo y por colección serializada como respaldo; hasta 100 proyectos, 200 fuentes, 20 señales por GPIO y 50 evidencias por lista. Nombre/componente/señal/interfaz/bus/responsable: 200 caracteres; descripción/notas/detalle: 4000. Los límites de tamaño se comprueban también antes de aplicar una edición para que todo respaldo generado sea reimportable; el cambio inválido no sustituye el estado previo. Los límites se alcanzan conjuntamente; no se promete admitir a la vez todos los máximos.

## Recuperación y conflictos

- **Recuperar copia local:** disponible cuando hay una instantánea anterior válida; confirma el reemplazo de toda la sesión. Puedes exportar antes.
- Si el guardado principal está corrupto o es incompatible, se muestran datos iniciales y se pausa el autoguardado para no sobrescribirlo. Puede recuperarse una copia local válida, importar un JSON y/o exportar la sesión actual.
- **Reactivar guardado:** confirma que la colección visible reemplazará el guardado de esa ruta. Si el navegador mantiene bloqueado el almacenamiento, vuelve a informarse el fallo; no se simula éxito.
- Otra pestaña que cambie el guardado pausa el autoguardado. También se compara el contenido esperado antes de escribir, evitando una sobrescritura silenciosa aunque no llegue el evento entre pestañas. Exporta ambas versiones y decide qué conservar antes de reactivar.
- **Restablecer este proyecto:** confirmación y alcance individual. El proyecto inicial vuelve a sus asignaciones de referencia; uno nuevo vuelve a la plantilla vacía con UART0 reservada, conservando identidad/nombre. Los demás proyectos permanecen intactos.
- Eliminar ofrece **Respaldar y eliminar**; no borra archivos JSON externos. El último proyecto no se puede eliminar.

## Verificación

`transfer.js` valida/copia las entradas y genera importaciones completas antes de sustituir estado. `storage.js` gestiona el guardado y la copia anterior. La interfaz aplica las operaciones sobre una copia y solo confirma si toda la colección resulta válida. No se usan `eval`, HTML dinámico ni solicitudes de red para guardar datos.

Ocho pruebas de `transfer.test.cjs`: ida y vuelta completa/individual, entradas inválidas y perfiles alterados, colisiones/restauración, guardado/copia anterior, cuota/acceso bloqueado, JSON corrupto, concurrencia y tamaño reimportable. Se añadieron primero pruebas que fallaron al faltar la implementación; la prueba de tamaño también detectó una ausencia real de validación antes de corregirla. Ver resultados de navegador en [Fase 4](fase-4-verificacion.md).

Historial: 0.1.0 (2026-10-31): persistencia y transferencia de Fase 3, con límites y recuperación explícitos.

# Publicación del módulo en dev

Fecha: 2026-10-31 (America/Bogota). Versión: 0.1.0.
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev/visor-gpio
SPDX-License-Identifier: CC-BY-4.0.

## Alcance autorizado

El usuario autoriza publicar el visor actual en `dev`, dentro de una carpeta exclusiva. Se prepara `visor-gpio/` con aplicación, datos, pruebas, licencias y documentación por fases. El commit de publicación incluye únicamente esa carpeta. Los cambios locales pendientes de firmware, reglas o documentos globales quedan fuera de este incremento.

La propuesta de una exportación específica para generar sketches de Arduino no forma parte de esta versión. La exportación/importación JSON de proyectos y colecciones ya implementada se conserva.

## Empaquetado

- Se conserva la organización interna `tools/gpio`, `docs/gpio` y `tests/gpio` para reducir cambios de rutas y mantener el generador y sus comprobaciones.
- Los enlaces de las fuentes de P17a y Config.h apuntan al repositorio padre. Las fuentes propias del visor apuntan a esta carpeta. La prueba de Config.h también lee el padre, sin copiar ni modificar firmware.
- Datos JSON, esquema 1.0.0, claves de almacenamiento, modelo, transferencia y almacenamiento se preservan. El adaptador generado mantiene correspondencia exacta con el JSON y la guía.
- La versión local anterior no se elimina ni se modifica: permite exportar los proyectos que el navegador pueda haber guardado bajo aquella ruta. La versión canónica publicada se mantiene en esta carpeta; no se mantienen dos aplicaciones publicadas.
- Transferir trabajos entre rutas requiere exportar/importar JSON explícitamente; instrucciones en [README](../README.md). Nunca se presupone que `localStorage` se comparta entre rutas `file://`.

## Verificación previa a publicación

Desde `visor-gpio/`:

```powershell
node --test tests/gpio/fase1.test.cjs tests/gpio/model.test.cjs tests/gpio/transfer.test.cjs tests/gpio/board.test.cjs
node tools/gpio/generate-data.cjs --check
node --test tests/gpio/flow.browser.cjs tests/gpio/board.browser.cjs
```

Los dos primeros comandos usan solo Node y esperan 24 comprobaciones aprobadas. Los recorridos de navegador requieren Playwright y Chrome/Edge disponibles en el entorno de pruebas, como indica el [manual](gpio/uso-y-verificacion.md), y esperan seis aprobados por navegador. Ejecutar con perfiles temporales y sin solicitudes de red automáticas. La carpeta debe conservar su posición dentro del repositorio para comprobar Config.h y abrir fuentes de firmware.

El cierre de publicación comprueba: enlaces locales, formatos y sintaxis; ausencia de archivos privados, credenciales y dependencias incorporadas; diff del commit limitado a `visor-gpio/`; igualdad por hashes de los archivos originales; push normal a `dev`, sin forzar; coincidencia del commit remoto con el local.

## Historial del alcance

Las menciones anteriores a «sin commit/push» en los informes por fase describen la etapa de revisión local. La autorización de esta publicación se recibió después, para este conjunto concreto. No concede autorización permanente para futuras publicaciones.

Historial: 0.1.0 (2026-10-31): preparación de publicación separada y procedimiento de verificación.

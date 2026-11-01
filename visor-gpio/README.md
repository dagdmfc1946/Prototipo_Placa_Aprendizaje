# Visor GPIO ESP32

Herramienta local para gestionar proyectos, visualizar GPIO sobre una placa de referencia y editar conexiones. Versión de publicación: **0.2.1**, 2026-10-31.

Autor del proyecto: **Ing. Diego Andrés García Díaz** · Instagram: **@dagdmfc**.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev/visor-gpio

## Abrir

Abre [tools/gpio/index.html](tools/gpio/index.html) con Chrome o Edge, conservando toda esta carpeta. No requiere instalación, servidor, cuenta ni Internet. GitHub muestra el código del HTML: para utilizarlo, descarga o clona el repositorio y abre el archivo local.

Selecciona un GPIO en la placa, elige ocupar/liberar, escribe el nombre y guarda. La ventana explica usos y restricciones; buses y evidencia están en opciones avanzadas. Puedes crear trabajos independientes, autoguardar, exportar un proyecto o toda la colección, importar JSON y consultar PDF locales. La placa es una referencia de 30 contactos con USB abajo; la unidad física sigue pendiente de cotejar.

## Transferir proyectos desde la versión local anterior

Mover una página abierta con `file://` puede usar otro almacenamiento del navegador. No se transfieren datos automáticamente ni se inspecciona tu perfil personal.

1. En la copia anterior, `tools/gpio/index.html` de la raíz del repositorio, aplica cualquier borrador y pulsa **Respaldar todo**. Conserva ese JSON fuera de Git.
2. Abre la nueva copia: `visor-gpio/tools/gpio/index.html`.
3. Importa el respaldo y selecciona **Restaurar respaldo** para recuperar los mismos trabajos y evidencias. La confirmación advierte que reemplaza la colección de esta nueva ruta.
4. Comprueba nombres, asignaciones y estado de guardado. Conserva el JSON portable aunque el autoguardado funcione.

La ruta anterior se conserva localmente durante esta transición y no se publica como una segunda aplicación. El formato JSON y las claves de almacenamiento no cambian; las exportaciones anteriores siguen siendo compatibles. **Añadir como trabajos nuevos** crea otras identidades y reinicia evidencias físicas; usa restauración para recuperar los mismos trabajos.

## Contenido y documentación

Todas las rutas siguientes son relativas a `visor-gpio/`, salvo referencias expresas al repositorio padre.

| Ruta | Contenido |
|---|---|
| `tools/gpio/` | HTML, CSS, JS, SVG original y generador del adaptador local. |
| `docs/gpio/` | Datos canónicos, contrato, guía técnica, licencias, informes y capturas. |
| `tests/gpio/` | Pruebas de datos, modelo, transferencia, placa y navegador. |
| `docs/plan-chat-registro-gpio.md` | Plan de cuatro fases e historial de revisiones. |

- [Uso y pruebas paso a paso](docs/gpio/uso-y-verificacion.md).
- [Fase 1: contrato y registro](docs/gpio/modelo-datos.md).
- [Fase 2: visor](docs/gpio/fase-2-visor.md), [Fase 3: persistencia](docs/gpio/fase-3-persistencia.md) y [Fase 4: verificación](docs/gpio/fase-4-verificacion.md).
- [Revisión de placa visual](docs/gpio/revision-placa-visual.md).
- [Preparación para publicación](docs/publicacion.md).

Las fuentes `Config.h` y P17a enlazan al firmware/documentación del repositorio padre. No se incluyen copias de firmware en este módulo. El visor no modifica firmware, esquemáticos, cables ni Git. El registro distingue asignado, conectado y probado; la compilación no demuestra funcionamiento físico.

## Comprobar

Desde esta carpeta, con Node disponible; no hace falta instalar paquetes para estas pruebas:

```powershell
node --test tests/gpio/fase1.test.cjs tests/gpio/model.test.cjs tests/gpio/transfer.test.cjs tests/gpio/board.test.cjs
node tools/gpio/generate-data.cjs --check
```

Esperado: 24 comprobaciones aprobadas y adaptador coincidente. Fase 1 compara los GPIO MicroSD con `../esp32_Project/Config.h`; debe ejecutarse dentro del repositorio completo. Para modificar datos iniciales, edita el JSON/guía canónicos, regenera con `node tools/gpio/generate-data.cjs` y repite las pruebas.

Las pruebas de navegador requieren Playwright disponible como herramienta de desarrollo y Chrome o Edge; instrucciones en el manual. El HTML no carga Playwright ni tiene dependencias de ejecución. Los datos sintéticos usados en pruebas no se convierten en resultados de hardware.

## Licencias y límites

Código, datos originales y SVG: [MIT](LICENSE). Documentación original y capturas: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/); atribución y alcance en [NOTICE.md](NOTICE.md) y [LICENCIAS.md](docs/gpio/LICENCIAS.md). La guía embebida en `data.js` conserva CC BY 4.0.

Se incluye una ilustración propia, sin fotografías ni logotipos ajenos. Los PDF y artículos externos se enlazan, no se redistribuyen. Los PDF elegidos por el usuario se consultan localmente y no se añaden a los JSON. Este módulo se publica como código para uso local; no es un despliegue web.

La propuesta adicional de preparar un paquete específico para generar pruebas de Arduino queda pendiente; la exportación de proyectos JSON existente ya está disponible.

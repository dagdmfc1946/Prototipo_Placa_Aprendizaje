# Prototipo de placa de aprendizaje ESP32

Desarrollo gradual de una plataforma educativa con ESP-WROOM-32 DevKit de 30 pines, Arduino IDE y periféricos. Se validará un componente por vez en protoboard y se actualizará su tabla de conexiones. El diagrama Archify solo se actualizará por indicación expresa del usuario, después de validar una nueva prueba. El esquemático, la baquela y la PCB se abordarán después de validar todos los componentes, con el diseño en un chat exclusivo.

## Estado

Práctica activa: **P17b, CSV y deep sleep**. Cuatro intentos de lectura a intervalos de cinco segundos, almacenamiento en `/dht11.csv`, presentación OLED y sesenta segundos de sueño. Los tres modos compilan con core 3.3.12 y P17b fue validada por el usuario en protoboard: cinco ciclos, veinte registros y ausencia/recuperación de componentes. Consumo y esquemático siguen pendientes. Se conservan MicroSD y DHT/OLED independientes. Conexiones adoptadas para el conjunto validado, sujetas a revisión al incorporar componentes; alimentación conmutada y optimización de consumo se estudiarán después.

## Documentación

- [Prueba P17b: CSV y deep sleep](docs/practicas/P17b-csv-deep-sleep.md): cuatro muestras, CSV, sueño, selección y límites de consumo.
- [Prueba P11/P07: DHT11 y OLED](docs/practicas/P11-P07-dht11-oled.md): selección, conexiones, librerías y casos de prueba validados por el usuario.
- [Prueba P17a: MicroSD](docs/practicas/P17a-microsd.md): cableado, carga, resultados recibidos y verificación de compilación.
- [Conexiones adoptadas](hardware/conexiones-rev-a.md) y [diagrama lógico interactivo Archify](hardware/diagrama-bloques-rev-a.html): conjunto validado, CS MicroSD en GPIO13.
- [Plan de trabajo](tasks/plan.md): alcance, secuencia, pendientes y fuentes.
- [Seguimiento](tasks/todo.md): prácticas y puntos de revisión.
- [Bitácora](docs/bitacora.md): trabajo realizado y plantilla de registro.
- [Revisión de ejemplos y primera prueba](docs/revision-ejemplos-y-primera-prueba.md): hallazgos, organización modular y preparación de DHT11 + OLED + MicroSD.
- [Instrucciones de colaboración](AGENTS.md): uso de Agent Skills y criterios de validación.
- [Archivos de firmware y versionado](docs/firmware-archivos-y-versionado.md): interacción `.ino`/`.h`/`.cpp`, cabecera y versiones por archivo.

Para visualizar el HTML de Archify, abrir la copia local en un navegador o descargar el archivo desde GitHub y abrirlo; la vista de código de GitHub no ejecuta el diagrama. Su [fuente editable JSON](hardware/diagrama-bloques-rev-a.archify.json) y las instrucciones están en [hardware/](hardware/README.md).

## Forma de trabajo

Identificar módulo → revisar ejemplo → preparar script → compilar → probar en protoboard → registrar resultados → actualizar tabla de conexiones → actualizar Archify solo si el usuario lo indica tras validar la prueba → siguiente componente. EasyEDA, esquemático y PCB se harán en un chat exclusivo al terminar la validación de todos los sensores.

Firmware dentro de `esp32_Project/`. Las fichas de prácticas y proyectos EDA se crearán cuando comience la etapa correspondiente. La futura integración de circuitos sin módulos es una revisión posterior.

## Práctica activa

1. Revisar P17b y conectar SD, DHT11 y OLED con los GPIO ya usados; verificar alimentación y GND común.
2. Seleccionar `PRACTICA_REGISTRO_SLEEP` en `Config.h` (valor predeterminado), core Arduino-ESP32 3.3.12 y la placa ESP32 correspondiente. Las librerías externas de DHT/OLED y sus versiones figuran en la ficha.
3. Abrir `esp32_Project/esp32_Project.ino` en Arduino IDE y seleccionar placa/puerto para esta prueba.
4. Verificar/Subir y abrir Monitor Serie a 115200. Observar cuatro intentos, cierre SD y despertar tras 60 s; conservar CSV y log. Para pruebas independientes, seleccionar `PRACTICA_MICROSD` o `PRACTICA_DHT_OLED` antes de compilar.

Compilación comprobada con Arduino CLI 1.5.1 y FQBN `esp32:esp32:esp32`. Las selecciones y verificaciones de cada modo figuran en sus fichas. La validación de hardware la realiza el usuario en protoboard.

## Git

Rama solicitada de trabajo: `dev`. Mantener cambios pequeños y descriptivos. Revisar el diff antes de cada commit. No versionar credenciales, coordenadas personales ni salidas de compilación. Guardar los archivos editables del hardware cuando se aborde esa etapa. Cada publicación requiere autorización expresa; la publicación actual del firmware validado y su documentación fue autorizada el 2026-11-02.

## Registro y visor GPIO por proyectos

- [Plan del registro GPIO y visor técnico local](visor-gpio/docs/plan-chat-registro-gpio.md): cuatro fases con HTML, CSS y JavaScript; edición de asignaciones, fichas técnicas, consulta de PDF locales, respaldo JSON y recursos con licencias abiertas verificadas. Fases 1–4 publicadas en `dev`, dentro de `visor-gpio/` (commit `c4f1bca`).

- [Contrato de proyectos y GPIO](visor-gpio/docs/gpio/modelo-datos.md), [registro inicial](visor-gpio/docs/gpio/registro.json) y [plantilla de nuevo trabajo](visor-gpio/docs/gpio/plantilla-proyecto.json).
- [Referencia técnica original](visor-gpio/docs/gpio/referencia-tecnica.md), [fuentes](visor-gpio/docs/gpio/fuentes-y-licencias.md) y [licencias de archivos nuevos](visor-gpio/docs/gpio/LICENCIAS.md).
- **Abrir el visor:** doble clic en [visor-gpio/tools/gpio/index.html](visor-gpio/tools/gpio/index.html); conservar sus archivos vecinos. No requiere servidor, Internet ni ESP32 conectada.
- [Cómo usar y probar por fases](visor-gpio/docs/gpio/uso-y-verificacion.md): proyectos, edición, autoguardado, respaldos JSON y consulta PDF. Conserva respaldos externos: el guardado local depende del navegador y la ruta.
- Entregas documentadas: [Fase 2](visor-gpio/docs/gpio/fase-2-visor.md), [Fase 3](visor-gpio/docs/gpio/fase-3-persistencia.md) e [informe de Fase 4](visor-gpio/docs/gpio/fase-4-verificacion.md).

Revisión de interfaz: [placa visual y ventana rápida](visor-gpio/docs/gpio/revision-placa-visual.md). Pulsa un GPIO, elige ocupar/liberar, escribe el nombre y guarda; usos y restricciones aparecen en la misma ventana. Las opciones de buses/evidencia siguen disponibles en avanzado.

La copia definitiva local está en `visor-gpio/`. Las copias anteriores se retiraron del repositorio el 2026-11-02; se conserva un respaldo externo para recuperar proyectos pendientes de exportar desde la ruta anterior.

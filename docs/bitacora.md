# Bitácora de desarrollo

Fechas en America/Bogota. Registrar únicamente trabajo realizado; separar propuestas y comprobaciones. Una prueba física la confirma el usuario con su montaje y medidas.

## 2026-10-31 — Inicio y planificación

**Objetivo:** acordar trabajo incremental para una placa de aprendizaje ESP32.

**Trabajo realizado:**

- Revisado el plan de trabajo previo y los datasheets locales ESP32 v4.5 y WROOM-32 v2.9.
- Revisado repositorio: rama inicial `main`, remoto GitHub configurado y carpeta `esp32_Project/` sin seguimiento. El `.ino` es una plantilla vacía.
- Registrada plataforma ESP-WROOM-32 DevKit de 30 pines, Arduino IDE y evolución protoboard → baquela → PCB.
- Incorporados al alcance propuesto Tiny RTC, PmodGPS y RS485, además de los periféricos del plan original.
- Registrado display de cuatro dígitos CLK/DIO; el controlador debe confirmarse.
- Registradas resistencias de precisión disponibles de 27 kΩ y 47 kΩ. Explicada relación del divisor: valores iguales dan la mitad de la entrada, pero no son obligatorios para limitar tensión.
- Consultadas fuentes para expansores. Precisión relevante: MCP23017 GPA7/GPB7 son solo salida según DS20001952D.
- Preparados plan y lista de seguimiento; no se han escrito scripts ni diseñado circuitos en este incremento.

**Decisiones del usuario:** desarrollar un script por componente, probarlo y construir su bloque de esquemático progresivamente. Esperar sus scripts previos antes de integrarlos.

**Pendientes:** modelo exacto y regulador de DevKit; core y librerías; datos del divisor anterior; identificar Tiny RTC; recibir scripts; elegir expansor y transceptor RS485; decidir partición física después de las pruebas.

**Evidencia:** revisión de archivos y documentación; cálculos nominales. Sin compilación de firmware ni validación física realizadas en esta etapa.

**Siguiente paso:** revisión del plan con el usuario y P00; después elegir la primera práctica disponible.

## Plantilla para próximas entradas

### AAAA-MM-DD — Pxx: componente o cambio

- Objetivo y revisión de hardware:
- Archivos y versiones de core/librerías:
- Conexiones y GPIO:
- Compilación: comando o pasos, resultado y registro:
- Prueba física: montaje, procedimiento, medidas y confirmación del usuario:
- Diferencia entre esperado y observado:
- Cambio realizado y motivo:
- Esquemático: bloque/revisión y comprobación de conexiones:
- Estado: pendiente / implementado / compilado / probado físicamente / integrado:
- Pendientes y siguiente paso:

## 2026-10-31 — Preparación de publicación en dev

- Creada rama local `dev` y verificada conservación del sketch original.
- Usuario autoriza publicar en `dev` y excluye expresamente `examples/`: añadida exclusión en `.gitignore` antes del primer commit de trabajo.
- Documentación inicial y plantilla del sketch preparadas para versionar; sin firmware funcional ni pruebas físicas confirmadas.
- Usuario informa protoboard con ESP32, OLED y DHT11 conectados. Solicita revisar referencias y preparar después una prueba con MicroSD.

## 2026-10-31 — Publicación y revisión de referencias

- Publicada la base documental en `origin/dev`, commit `1b9f437`; verificada coincidencia del hash local con el remoto.
- Verificado que `examples/` está ignorada y no contiene archivos versionados. Referencias locales conservadas.
- Revisados ejemplos mínimos y modulares de DHT/OLED, dos variantes de batería y parámetros relevantes del GPS. La carpeta de referencia de SD contiene un diagrama, sin sketch.
- Detectado factor de batería `4.9` en la referencia: requiere contraste con divisor real. Detectados errores DHT convertidos en ceros y dependencias entre sensor/pantalla que conviene separar.
- Preparada propuesta `.h`/`.cpp` por componente y secuencia DHT por consola → OLED → SD sola → CSV integrado. Documento: `docs/revision-ejemplos-y-primera-prueba.md`.
- No se encontró `examples/TemHum_IA_resumen_chat.md`; pendiente revisión de ese resumen específico.
- No hay firmware nuevo, compilación ni pruebas físicas realizadas. Pendientes conexiones actuales, identificación de MicroSD y versión del core para preparar el primer sketch.

## 2026-10-31 — P17a: primer incremento MicroSD

- Usuario confirma DATA DHT11 en GPIO4 y Arduino-ESP32 3.3.12 mediante captura. Revisado su ejemplo OLED: SSD1306, 128×64, dirección 0x3C, SDA21/SCL22.
- Identificado enlace de módulo TARUSD-CN-03. La ficha indexada describe un socket de 18×18 mm; no publica esquema ni regulación. La tabla de conexión se limita al adaptador directo de 3,3 V descrito en el plan original y requiere cotejo con la unidad.
- Preparados `Config.h`, `MicroSd.h` y `MicroSd.cpp`; `.ino` coordina solamente la prueba SD. CS provisional GPIO13, SCK18, MISO19, MOSI23, frecuencia 1 MHz. No conectar buzzer en GPIO13 durante esta práctica.
- Por arranque: añadir 46 bytes en `/prueba_sd.txt`, cerrar, reabrir y comparar los bytes nuevos; informar errores y desmontar. No se borra el archivo ni se solicita formateo automático.
- Compilación inicial bloqueada al iniciar compilador dentro del sandbox (WinAPI #623). Repetida con permisos del entorno: exit code 0, Arduino CLI 1.5.1, core 3.3.12, FQBN `esp32:esp32:esp32`, warnings all. Programa 329446 bytes (25 %); globales 22680 bytes (6 %).
- Verificada identidad de los archivos de firmware compilados con los guardados en el repositorio. No se cargó firmware ni se realizaron pruebas físicas.
- Pendientes: salida de Monitor Serie a 115200, tarjeta/capacidad/formato, persistencia al reinicio y fallo explícito sin tarjeta. P17 global sigue abierta; esquemático y registro DHT11/CSV se harán tras validar este incremento.

## 2026-10-31 — Cabeceras, versiones y autorización de publicación

- Usuario solicita explicación de la interacción `.ino`/`.h`/`.cpp`; incorporada guía al proyecto y enlace desde README.
- Añadida cabecera a los cuatro archivos actuales de firmware: nombre Ing. Diego Andrés García Díaz, Instagram @dagdmfc y URL de rama dev solicitada, descripción, versión 0.1.0, fecha e historial.
- Definida convención de versionado independiente por archivo; regla registrada en AGENTS.md para futuros incrementos.
- Verificado que los cuerpos originales de los cuatro archivos permanecen idénticos: este incremento solo agrega comentarios de identificación. No se repitió compilación ni prueba de hardware por este cambio documental; se conserva el resultado de compilación previo de P17a y su validación física sigue pendiente.
- Nueva regla expresa: publicar solo con autorización del usuario para los cambios correspondientes. Esta actualización permanece local, sin commit ni push.

## 2026-10-31 — Plan para chat exclusivo de registro GPIO

- Usuario confirma secuencia MicroSD primero, luego DHT11/OLED, y realizará carga y pruebas desde Arduino IDE.
- Solicita documentar ocupación de GPIO y considera un visor HTML interactivo. Luego indica separar esa herramienta en un chat exclusivo para no mezclarla con las pruebas de firmware.
- Preparado `visor-gpio/docs/plan-chat-registro-gpio.md`: contexto de traspaso, asignaciones actuales/provisionales, restricciones, trabajo incremental, aceptación y texto para iniciar el nuevo chat.
- No se implementó HTML ni registro canónico de GPIO en este incremento; no se modificó firmware. La prueba física P17a sigue pendiente de retroalimentación del usuario.
- Cambios locales conservados, sin commit ni push. Este chat continúa dedicado a pruebas de firmware y protoboard.

## 2026-10-31 — Reestructuración del plan del visor GPIO

- Usuario acuerda HTML/CSS/JS y solicita cuatro fases, edición de GPIO, consulta técnica desde el visor y registro del plan en el repositorio usando solo recursos abiertos y respetando derechos de autor.
- Actualizado `visor-gpio/docs/plan-chat-registro-gpio.md`: datos/fuentes/licencias; visor editable y consulta; persistencia/intercambio; verificación y entrega local. Conservado el contexto provisional de GPIO del plan anterior.
- Definidas fichas y diagramas originales, separación entre asignaciones y restricciones, inventario de procedencia/licencias y comprobación previa de cualquier recurso incorporado. MIT para código y CC BY 4.0 para documentación propia son propuestas pendientes de resolver en fase 1; no se ha relicenciado material existente.
- Los PDF oficiales y artículos externos se enlazarán mientras no exista licencia abierta compatible verificada. La consulta privada de un PDF seleccionado por el usuario no lo añadirá al repositorio ni al JSON exportado.
- Añadidas referencias en README y plan general, y seguimiento específico en `tasks/todo.md`, conservando las tareas de firmware. Solo planificación/documentación: sin implementación del visor, cambios de firmware ni pruebas físicas nuevas; sin commit ni push.

## 2026-10-31 — Fase 1 del visor GPIO y proyectos independientes

- Usuario solicita varios proyectos y autoriza comenzar Fase 1; conserva revisión/aprobación como condición para publicar. No se interpreta como autorización de commit/push.
- Preparados `visor-gpio/docs/gpio/registro.json` y plantilla separada, contrato multiproyecto, guía técnica original, inventario de fuentes/licencias y pruebas reproducibles. Un proyecto real inicial; la plantilla no inventa un segundo trabajo.
- GPIO iniciales: 7 asignados, 2 reservados, 16 libres; DHT11/OLED con conexión informada; MicroSD provisional contrastada con `Config.h`; ninguna prueba física declarada. Perfil de referencia de 30 contactos, con 25 GPIO; posiciones físicas pendientes de serigrafía/orientación.
- Definidos crear/seleccionar/renombrar/duplicar/eliminar y aislamiento por proyecto para Fase 2; duplicación reinicia conexiones/validaciones. Fase 3 añadirá respaldo individual/de colección y tratamiento explícito de colisiones de ID. No implementadas aún estas operaciones de UI.
- MIT para datos/pruebas nuevos y CC BY 4.0 para documentación nueva de `visor-gpio/docs/gpio/`, con alcance delimitado sin relicenciar archivos previos. No se incluyen PDF, imágenes ni artículos ajenos; fuentes oficiales consultadas como enlaces.
- Pruebas con Node v24.22.1 en preparación: seis fallos iniciales por datos ausentes y seis aprobadas después. Mutación temporal de GPIO34 como salida: detectada por la prueba de restricciones; JSON restaurado byte a byte.
- Instrucciones manuales PowerShell y comando `node --test visor-gpio/tests/gpio/fase1.test.cjs` en `visor-gpio/docs/gpio/uso-y-verificacion.md`. Navegador, persistencia y hardware pendientes de sus fases; no se construyó HTML.
- Verificación final en la raíz real del repositorio: 6/6 pruebas aprobadas con Node v24.22.1, `git diff --check` correcto y hashes SHA-256 de todos los archivos de firmware iguales antes/después. Sin commit, push ni despliegue; pendiente revisión del usuario antes de Fase 2.

## 2026-10-31 — Fase 2 — Visor y proyectos

- Usuario autoriza completar fases 2–4 y revisará el conjunto al finalizar; mantiene autorización de publicación como paso posterior.
- Gestión de proyectos aislados, mapa lógico/tabla, filtros, edición, evidencia, conflictos, traslados, referencia propia y PDF local. Modelo verificado con ocho pruebas; datos iniciales y firmware preservados. Documentado en `visor-gpio/docs/gpio/fase-2-visor.md`.

## 2026-10-31 — Fase 3 — Persistencia y JSON

- Usuario autoriza completar fases 2–4 y revisará el conjunto al finalizar; mantiene autorización de publicación como paso posterior.
- Autoguardado/copia anterior, indicadores de fallo, exportación individual/colección, importación validada, recuperación, restablecimiento individual y concurrencia. Ocho pruebas de transferencia/almacenamiento. Corregidos invalidación por mayúsculas y tamaño global para respaldos reimportables; cambios de UI transaccionales. Documentado en `visor-gpio/docs/gpio/fase-3-persistencia.md`.

## 2026-10-31 — Fase 4 — Verificación y documentación

- Usuario autoriza completar fases 2–4 y revisará el conjunto al finalizar; mantiene autorización de publicación como paso posterior.
- 22 comprobaciones Node aprobadas; cuatro recorridos completos aprobados en Chrome y cuatro en Edge, aislados y con red simulada desconectada. Sin solicitudes externas automáticas ni errores/advertencias de consola en los recorridos; tamaños 320/768/1024/1440, etiquetas/teclado/foco, PDF local original y texto seguro. La cancelación de descargas se aisló al sandbox y se verificó fuera de él. Inventario/licencias y guía de pruebas actualizados. No se realizaron pruebas nuevas de hardware ni se publicaron cambios. Ver `visor-gpio/docs/gpio/fase-4-verificacion.md`.
- Verificación final desde el repositorio real: 22/22 pruebas Node y 4/4 recorridos en cada navegador (Chrome y Edge); adaptador canónico coincidente y sintaxis JS correcta. Capturas finales originales incorporadas. `git diff --check` correcto; firmware, registro inicial y plantilla iguales por SHA-256 antes/después. Sin commit, push ni despliegue. Revisión final del usuario pendiente.

## 2026-10-31 — Placa visual y edición rápida de GPIO

- Usuario solicita una imagen de placa con indicadores por pin, selección que abra una ventana simple, nombre de conexión y consulta de características/limitaciones. Se conservan proyectos, respaldos y PDF.
- Creado SVG original bajo MIT y disposición de referencia de 30 contactos. Las imágenes aportadas solo se consultaron, sin copiar fotos/ilustraciones, logotipos ni certificaciones. Las referencias difieren en GPIO34/35; se adopta referencia de las dos primeras imágenes con USB abajo, sin confirmar la unidad ni cambiar `headerPosition` del perfil.
- Ventana con libre/ocupado/reservado, nombre y uso; buses/evidencias en avanzado cerrado. Pines compartidos conservan sus señales; cambiar nombre/uso utiliza la invalidación de evidencia ya existente. Alimentación/control solo abren información; flash GPIO6–11 se representa como uso interno no disponible, sin contactos inventados.
- Pruebas previas adaptadas al editor modal sin eliminar escenarios; añadidas dos comprobaciones Node y dos recorridos de navegador. Manual, diseño, licencias, fuentes y seguimiento actualizados. Firmware, datos iniciales, esquema y almacenamiento sin modificaciones. Resultados finales se registran tras instalar/verificar el incremento; sin commit ni push.
- Verificación final desde el repositorio: 24/24 comprobaciones Node; 6/6 recorridos de navegador en Chrome 156 y 6/6 en Edge 156, perfiles temporales y red simulada desconectada. Incluye los cuatro recorridos anteriores y dos nuevos de placa/editor rápido. Capturas finales originales guardadas; consola sin errores/advertencias en recorridos que la monitorizan. Adaptador canónico coincidente, SVG/sintaxis correctos y `git diff --check` sin errores. Firmware, AGENTS, JSON inicial/plantilla, modelo, transferencia y almacenamiento iguales por SHA-256. Sin commit, push ni despliegue.

## 2026-11-02 — Consolidación local del visor GPIO

- Publicación previa autorizada: `dev`, carpeta `visor-gpio/`, commit `c4f1bca`.
- Retiradas copias antiguas `tools/gpio/`, `tests/gpio/`, `docs/gpio/` y `docs/plan-chat-registro-gpio.md`; respaldo íntegro externo con manifiesto SHA-256 en `C:\Users\Diego\Documents\ChatGPT\Sistemas Embebidos\respaldos-locales\visor-gpio-anterior-2026-11-02`.
- Actualizados enlaces de README, plan, seguimiento y bitácora a la carpeta definitiva. Conservado contenido del módulo publicado y trabajo pendiente de firmware. Sin commit ni push de esta limpieza.

## 2026-11-02 — Resultado SD y preparación de DHT11/OLED

- Usuario aporta captura de `prueba_sd.txt` con cuatro líneas esperadas y aclara que `ERROR: tarjeta no montada` se obtuvo con la microSD retirada. Se registra como caso negativo correcto; no hay evidencia de fallo con tarjeta insertada en el reporte recibido.
- Conservados MicroSd.h/.cpp sin cambios y preservada la prueba P17a mediante selector en Config.h. Config.h e .ino pasan a 0.2.0; nuevos DhtSensor.h/.cpp y OledDisplay.h/.cpp en 0.1.0, con cabeceras solicitadas.
- DHT11 DATA4; OLED SSD1306 128×64 en dirección 0x3C, SDA21/SCL22. Muestreo cada 5000 ms con millis(); inicialización única, estado de validez y mensaje de error sin ceros ficticios. Si la OLED no responde al arrancar, continúa DHT por consola. Sin detección de desconexión de pantalla en caliente.
- Práctica P11/P07 implementada y compilada con Arduino-ESP32 3.3.12 / ESP32 Dev Module, warnings all: 322472 bytes de programa (24 %) y 23756 bytes globales (7 %). Librerías ya instaladas: DHT 1.4.7, Unified Sensor 1.1.15, SSD1306 2.5.17, GFX 1.13.0 y BusIO 1.17.4. No se instalaron ni actualizaron dependencias.
- Verificación adicional del modo SD correcta con un directorio de librerías de usuario vacío: programa 329446 bytes (25 %) y globales 22680 bytes (6 %), iguales a P17a anterior. Ambos modos terminaron con exit code 0; selección DHT/OLED restaurada al finalizar. Fuentes DHT/OLED guardadas iguales al conjunto compilado, comprobación SHA-256.
- Pendiente cargar/probar DHT11/OLED por el usuario y documentar diez muestras y casos de ausencia. CSV/almacenamiento conjunto y esquemático se harán después. Sin cambios en visor-gpio/, sin commit ni push.

- Revisión final: ocho archivos de firmware con cabeceras/versiones solicitadas, hashes de entrega coincidentes con el conjunto compilado y enlaces relativos válidos. MicroSd.h/.cpp preservados. No se cargó firmware, no se modificó el visor y no se hizo commit ni push.

## 2026-11-02 — Resultado físico DHT11/OLED y siguiente incremento

- Usuario aporta log con OLED inicializada, periodo configurado de 5000 ms, ocho lecturas válidas, un bloque de errores DHT explícitos y tres lecturas válidas posteriores. Confirma visualización correcta en OLED.
- Se verifica lectura y presentación nominales; la consola detecta errores sin inventar ceros y recupera lecturas. Se solicita aclarar si el bloque de errores fue provocado por desconexión o apareció con el sensor conectado. No atribuir causa sin esa confirmación.
- Actualizados estados de P11/P07 y seguimiento sin cerrar casos de ausencia no reportados. Siguiente paso propuesto: integrar registro CSV/MicroSD tras aclarar el origen de los errores.
- Sin cambios de firmware, GPIO o visor; no se repitió compilación por este registro documental. Sin commit ni push.

### Aclaración del usuario — Errores DHT provocados

- Confirma que desconectó y reconectó el sensor. El bloque de errores corresponde a la prueba negativa y la recuperación esperadas; se cierra esa duda sin modificar firmware.
- Lecturas y presentación OLED confirmadas; caso OLED ausente al arrancar todavía no reportado y conservado pendiente.
- Próximo incremento: CSV con DHT11 + OLED + MicroSD, manteniendo asignación provisional actual. No implementado en esta actualización documental, sin commit ni push.

## 2026-11-02 — P17b: CSV y deep sleep básico

- Usuario confirma detección de OLED ausente y espera inicial. Solicita cuatro mediciones cada 5 s durante ventana nominal de 20 s y sueño de 60 s, para medir después consumo real. Se aclara que errores DHT cuentan como intentos y que inicialización/cierre añaden tiempo al periodo total.
- Agregado modo PRACTICA_REGISTRO_SLEEP, conservando los dos anteriores. CSV `/dht11.csv` con cabecera única, ciclo RTC, muestra, tiempo desde arranque, temperatura, humedad y estado. Se verifica cabecera y cada fila, sin truncar ni formatear; DHT inválido guarda campos vacíos, SD ausente no impide lecturas ni sueño.
- Nuevo DeepSleep.h/.cpp: temporizador, causa de despertar, contador retenido en RTC y CS alto retenido durante sueño. MicroSdIniciar libera retención antes de SPI. OLED recibe DISPLAYOFF y se termina I2C. Los módulos siguen alimentados: no se implementa corte físico ni se afirma consumo de chip como consumo total de DevKit.
- Usuario pregunta por IC de encendido: explicado load switch/MOSFET, secuencia de corte y evitar alimentación por señales. Acuerda pulir deep sleep después; se documenta como etapa futura, sin comprar componentes ni asignar GPIO adicionales.
- Revisión ajusta temporización para no comprimir lecturas tras una demora de SD. Se mantienen cuatro intentos; un bloqueo de E/S puede alargar la ventana nominal.
- Versiones: Config/.ino 0.3.0; MicroSd y OledDisplay 0.2.0; DhtSensor.cpp 0.1.1 y su cabecera 0.1.0; DeepSleep 0.1.0. Se conservan nombre, Instagram, URL e historial requeridos.
- Compilaciones finales core 3.3.12, esp32:esp32:esp32, warnings all, exit code 0 en tres selecciones: DHT/OLED 322480 bytes de programa y 23756 globales; MicroSD 330202 y 22680; registro/sueño 372926 y 24248. Diez archivos cotejados con fuentes compiladas por SHA-256; modo final REGISTRO_SLEEP. Sin carga a hardware ni resultados físicos inventados.
- Ficha P17b y explicación de #if agregadas. Pendientes: log/CSV de tres ciclos, despertar por temporizador, ausencia de módulos y medición de consumo. Conservado contenido del visor y cambios locales previos. Sin commit ni push.

## 2026-11-02 — P17b validada en protoboard

- Usuario confirma ejecución correcta de todo el plan físico y cinco ciclos normales sin problemas. Captura Excel muestra una cabecera y veinte filas (ciclos 1–5, muestras 1–4, estado OK); evidencia original copiada en docs/evidencias/2026-11-02-P17b-csv-cinco-ciclos.png.
- Log adicional: ciclo 1 sin OLED/SD/DHT conserva cuatro intentos y sueño; ciclo 2 muestra lecturas DHT sin OLED/SD; ciclo 3 inicializa OLED, aún sin SD; ciclo 4 prepara CSV y verifica cuatro filas. Causas de despertar por temporizador y contador de ciclo observables.
- Validación funcional registrada, sin inventar mediciones de corriente o precisión de reloj. La captura no sustituye una lectura automatizada del CSV ni prueba un total final de filas de dos ensayos combinados. Excel debe importar con delimitador coma; conservar el original para no alterar la cabecera validada.
- Actualizados ficha, seguimiento, README, plan y contexto de agentes. Próximas tareas pendientes: conexiones/esquemático y, después según se acuerde, consumo y alimentación conmutada.
- Sin cambios de firmware, versiones, GPIO ni visor; no se recompila porque solo se registró evidencia. Sin commit ni push.

## 2026-11-02 — Revisión documental y publicación autorizada

- Usuario autoriza verificar documentación y publicar en dev el firmware validado y sus evidencias. Confirma consumo en deep sleep para después.
- Aclara el alcance de hardware: únicamente tabla de conexiones y diagrama lógico por ahora. EasyEDA/esquemático/PCB al terminar todos los sensores, en chat exclusivo. Esta instrucción reemplaza propuestas anteriores de empezar CAD por bloques ahora.
- Confirma CS MicroSD en GPIO13, no GPIO5. Tabla adoptada: DHT DATA4, OLED SDA21/SCL22 y SD CS13/SCK18/MISO19/MOSI23. UART0 1/3 reservada. No se cambió firmware ni el visor.
- Agregados hardware/README.md, conexiones-rev-a.md y diagrama-bloques-rev-a.md; sin fuentes CAD, footprints ni archivos de fabricación. Corregidos resúmenes pendientes obsoletos del plan, manteniendo el historial de la bitácora.
- Cierre de prácticas ajustado por instrucción expresa: firmware/pruebas/tabla/bloques/bitácora, con CAD como fase posterior. P01, P07, P11 y P17 funcionales completadas; identificación de otros módulos, resto de prácticas y consumo siguen abiertos.
- Revisadas fuentes: los diez archivos de firmware coinciden por SHA-256 con el conjunto ya compilado en tres modos y validado por el usuario. No se repite compilación por cambios exclusivamente documentales. Examples permanece ignorada y fuera de los commits.

# P17b — CSV y ciclo de cuatro muestras con deep sleep

Fecha: 2026-11-02. Estado: validación funcional en protoboard confirmada por el usuario: cinco ciclos normales y plan de ausencia/recuperación ejecutado correctamente. Consumo, alimentación conmutada y esquemático pendientes.

## Contrato de la práctica

- Mantener las pruebas independientes MicroSD y DHT11/OLED.
- Añadir un tercer modo: cuatro intentos de lectura, a los 5/10/15/20 segundos desde el inicio de la ventana de muestreo.
- Presentar cada resultado por consola/OLED y agregarlo a `/dht11.csv` si la tarjeta está disponible.
- Un error DHT cuenta como un intento; no se extiende la ventana buscando cuatro muestras válidas.
- Después del cuarto intento, cerrar/desmontar SD, apagar OLED por comando y dormir el ESP32 durante 60 segundos. Repetir automáticamente al despertar.
- La inicialización, lectura y cierre toman tiempo adicional. No se promete un ciclo exacto de 80 segundos ni entrada instantánea a sueño al llegar a 20 segundos.
- Los intervalos se cuentan entre inicios de adquisición. Si SD bloquea demasiado, se retrasa el siguiente intento y se prolonga el tiempo activo; no se comprimen varias lecturas seguidas para recuperar el horario nominal.
- Sin conmutación de alimentación física en esta revisión; esa optimización se deja para después, como indicó el usuario.

## Selección en Config.h y significado de #if

```cpp
#define PRACTICA_MICROSD 1
#define PRACTICA_DHT_OLED 2
#define PRACTICA_REGISTRO_SLEEP 3

// Dentro del bloque #ifndef PRACTICA_ACTIVA existente:
#define PRACTICA_ACTIVA PRACTICA_REGISTRO_SLEEP
```

La selección predeterminada nueva es `PRACTICA_REGISTRO_SLEEP`. Antes era `PRACTICA_DHT_OLED`, por eso la prueba anterior no necesitó modificar ningún `#if`.

`#if PRACTICA_ACTIVA == PRACTICA_MICROSD` compara valores del preprocesador: si la selección vale 1, incluye ese bloque en la compilación; en caso contrario lo excluye. El `#else` representa la alternativa y `#endif` termina la condición. Un `if` normal decide al ejecutar el firmware; `#if` decide al construirlo. Cambiar la selección exige volver a compilar y cargar. No se modifica la comparación `#if` para elegir prácticas.

| Selección | Funcionamiento |
|---|---|
| `PRACTICA_MICROSD` | P17a, agregar/verificar una línea de prueba por arranque |
| `PRACTICA_DHT_OLED` | Lecturas continuas DHT/OLED; sin CSV ni sueño |
| `PRACTICA_REGISTRO_SLEEP` | Cuatro intentos, CSV y deep sleep de 60 s |

## Conexiones provisionales

| Señal | GPIO |
|---|---:|
| DHT11 DATA | 4 |
| OLED SDA / SCL | 21 / 22 |
| SD CS / SCK / MISO / MOSI | 13 / 18 / 19 / 23 |
| UART0 TX / RX, reservados para consola | 1 / 3 |

Alimentación y GND conservan las conexiones de las pruebas anteriores; el adaptador directo microSD es de 3,3 V. GPIO13 no puede usarse simultáneamente para buzzer. No se añaden GPIO de habilitación ni se fija todavía el pinout definitivo. El visor y su registro canónico se mantienen en el otro chat.

## Formato de almacenamiento

```csv
ciclo,muestra,tiempo_ms,temperatura_c,humedad_pct,estado
```

- `ciclo`: contador en memoria RTC, conservado entre despertares por temporizador. Se reinicia a 1 tras encendido/reset que no proceda del temporizador. No es un identificador global persistente frente a pérdida de alimentación.
- `muestra`: intento 1 a 4 del ciclo.
- `tiempo_ms`: instante de inicio de adquisición desde el arranque actual; incluye inicialización y se reinicia al despertar. No es fecha/hora de RTC ni tiempo acumulado entre ciclos.
- `temperatura_c` / `humedad_pct`: valores con un decimal si la lectura es válida; campos vacíos cuando falla.
- `estado`: `OK` o `ERROR_DHT11`.

Se crea la cabecera solo si el archivo está vacío. En ciclos posteriores se verifica la cabecera existente y se agregan filas sin truncar. Cada fila se cierra, se reabre y se compara con sus bytes escritos; no hay archivos de datos abiertos al entrar en sueño. Un error de escritura puede dejar una fila parcial: se informa y se suspenden escrituras durante ese ciclo. No hay borrado, reparación automática ni formateo.

La lectura de comprobación por cada escritura forma parte del consumo activo de esta versión de prueba. La optimización de esa E/S se evaluará después de medir el comportamiento actual.

Si el archivo tiene una cabecera distinta, se rechaza el registro para evitar mezclar formatos. Conservar el archivo como evidencia y revisar fuera de la placa antes de decidir si se renombra o utiliza otro archivo.

## Respuesta a fallos

| Caso | Comportamiento esperado |
|---|---|
| DHT falla | Se cuenta el intento y se escribe estado de error con campos de medición vacíos |
| SD ausente al arrancar | Se informan cuatro resultados en consola/OLED y se duerme igualmente |
| Escritura SD falla | Se informa y se suspenden las escrituras restantes del ciclo; adquisición continúa |
| OLED ausente al arrancar | Continúa consola, CSV y sueño |
| Temporizador no se puede programar | Se informa el error; se cierran periféricos y no se simula una entrada en sueño |

No se implementa detección o reconexión en caliente de la pantalla. Cambiar el montaje con alimentación apagada. No retirar SD mientras se esté escribiendo.

## Qué se apaga y qué permanece alimentado

`DeepSleep.h/.cpp` configura el temporizador y llama a `esp_deep_sleep_start()`. Tras el despertar, el programa comienza otra vez por `setup()`; no continúa después de la llamada de sueño.

Antes del sueño se desmonta SD, se libera SPI y se mantiene CS alto mediante retención GPIO. La inicialización de SD libera esa retención antes de usar el bus de nuevo. CS alto retenido corresponde a la SD permanentemente alimentada de este montaje; deberá revisarse al incorporar un corte de alimentación para no alimentar el periférico por las señales. OLED recibe `DISPLAYOFF` y se termina I²C. No se inicia Wi-Fi ni Bluetooth en esta práctica.

Nada de esto corta la alimentación de DHT, SD, OLED, regulador, USB-UART o LEDs de la DevKit. El consumo medido de la placa puede superar ampliamente el consumo del chip en deep sleep. No se atribuye un valor en µA sin medir el montaje real.

Para cortar alimentación de periféricos en otra revisión se estudiará un load switch o MOSFET, manteniendo alimentado el ESP32 para su temporizador. Habrá que controlar también las señales para evitar alimentación por GPIO, cerrar SD antes del corte y respetar estabilización al encender. [TPS22919](https://www.ti.com/product/TPS22919) es una referencia de esta clase de integrado, no una selección final ni una compra indicada. No se implementa esa etapa ahora.

## Plan de validación física

1. Conectar los tres módulos, usar una tarjeta de prueba y seleccionar `PRACTICA_REGISTRO_SLEEP`.
2. Verificar/subir con core 3.3.12. Monitor Serie a 115200; primer ciclo identificado como encendido/reset.
3. Observar cuatro intentos con ventana cercana a 5000/10000/15000/20000 ms; registrar valores reales y cualquier demora, no asumir precisión de tiempo real con SD.
4. Comprobar cuatro filas verificadas, SD desmontada y OLED apagada al terminar; no debe haber una quinta lectura en el mismo ciclo.
5. Esperar aproximadamente 60 s de sueño. Debe reaparecer el arranque con causa temporizador y número de ciclo incrementado.
6. Dejar tres ciclos normales: esperar una cabecera y doce filas de datos. Apagar antes de retirar SD para comprobarlo en el PC.
7. Probar, por separado y sin tensión al modificar conexiones, un arranque sin SD, sin DHT y sin OLED. Registrar que el número de intentos y el despertar se conservan. Con DHT ausente deben aparecer cuatro filas de error por ciclo si SD está disponible.
8. Conservar log y archivo. La recuperación de alimentación y retención de CS entre ciclos requieren comprobación física, no solamente compilación.

## Medición de consumo posterior

Elegir primero la frontera de medida: en batería se incluyen las pérdidas del TP4056/MT3608 según la ruta; en VIN se mide DevKit y cargas alimentadas desde ese punto; medir solo 3V3 excluye partes de la ruta de alimentación. Registrar tensión, corriente activa y corriente dormida junto con tiempos reales.

El amperímetro se coloca en serie. Evitar rutas de alimentación paralelas por USB durante una medida alimentada por batería; el monitor serie sirve primero para validar el ciclo y la medición debe documentar qué conexiones permanecen. Revisar rango y capacidad para picos de escritura SD antes de interpretar una lectura promedio o un reinicio causado por caída de tensión del instrumento.

Se medirán primero este montaje y este firmware sin prometer autonomía. La conmutación de alimentación y la optimización de deep sleep se compararán después con la misma frontera de medida.

## Versiones y verificación

- Config.h y esp32_Project.ino: 0.3.0.
- MicroSd.h/.cpp y OledDisplay.h/.cpp: 0.2.0.
- DhtSensor.cpp: 0.1.1; DhtSensor.h: 0.1.0.
- DeepSleep.h/.cpp: 0.1.0.
- Core 3.3.12; librerías ya instaladas de las pruebas anteriores. Todos los scripts conservan autor, Instagram, repositorio e historial.
- Compilaciones finales con core 3.3.12, FQBN esp32:esp32:esp32 y warnings all: DHT/OLED 322480 bytes de programa y 23756 globales; MicroSD 330202 y 22680; registro/sueño 372926 y 24248. Los tres modos terminaron con exit code 0. Selección final restaurada a PRACTICA_REGISTRO_SLEEP y diez fuentes cotejadas por SHA-256 con la entrega. CSV y sueño: confirmados por el usuario el 2026-11-02. Consumo y optimización: diferidos. Publicación del firmware validado y documentación autorizada por el usuario el 2026-11-02.

## Fuentes

- [Sleep modes, Espressif](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/system/sleep_modes.html): temporizador, RTC y reinicio tras deep sleep. APIs cotejadas con el SDK instalado del core 3.3.12 y su ejemplo TimerWakeUp.
- [API SD del core 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/SD/src/SD.h): montaje sin formateo. FS.h, gpio.h y ejemplo TimerWakeUp revisados localmente.
- [Preprocesamiento de sketches Arduino](https://docs.arduino.cc/arduino-cli/sketch-build-process/).

## Validación física confirmada — 2026-11-02

El usuario informa que ejecutó todo el plan y que cinco ciclos normales finalizaron sin problemas. La captura aportada muestra una única cabecera y veinte registros, cuatro por cada ciclo 1–5, con estado OK. Se conserva copia de la evidencia original: [CSV de cinco ciclos en Excel](../evidencias/2026-11-02-P17b-csv-cinco-ciclos.png). Es una captura, no un archivo CSV leído automáticamente por nuestras herramientas.

El log adicional documenta el funcionamiento sin componentes y su disponibilidad en ciclos posteriores:

| Ciclo del log de ausencia/recuperación | Evidencia observable |
|---|---|
| 1, encendido/reset | OLED y SD no disponibles, cuatro errores DHT, ventanas 5000/10000/15000/20000 ms, cero filas y entrada a sueño de 60 s |
| 2, temporizador | DHT entrega cuatro lecturas; OLED y SD siguen no disponibles; cero filas y nuevo sueño |
| 3, temporizador | OLED inicializada y DHT con cuatro lecturas; SD no disponible; cero filas y comando OFF de pantalla |
| 4, temporizador | SD/CSV preparados, cuatro registros CSV OK releídos/verificados, cuatro lecturas y nuevo sueño |

El incremento de ciclo y la causa temporizador confirman la secuencia de despertar indicada por el firmware. El usuario informa correcto funcionamiento de todo el plan; los extractos y la captura anteriores son la evidencia directa disponible. No se infiere un único archivo final de veinticuatro filas juntando dos pruebas cuya copia final no fue aportada.

### Cierre funcional

- Cuatro intentos por ciclo y ventanas nominales de 5/10/15/20 s: confirmados en el log.
- Cinco ciclos normales y veinte filas con cabecera única: confirmados por reporte y captura.
- Continuidad sin SD, OLED y DHT y retorno de servicios en ciclos posteriores: confirmados por el log.
- Despertar por temporizador y contador de ciclo: confirmados por el log; los 60 s son el valor configurado y el usuario reporta la prueba completa correcta, sin adjuntar una medida independiente de precisión del reloj.
- Apagado por comando y reaparición de OLED: reportados correctos en el plan; la alimentación física de los módulos no se corta.
- No se midieron corrientes ni se aprobó un esquema o PCB a partir de esta prueba.

### Lectura del CSV en Excel

La captura muestra las filas completas en una sola columna porque no se está aplicando la coma como delimitador. Importar el archivo indicando coma como separador; si hace falta interpretar columnas numéricas, usar una configuración que reconozca el punto decimal. Conservar el CSV original y guardar el análisis en otra copia, preferiblemente un libro `.xlsx`: cambiar cabecera, delimitador, codificación o finales de línea puede hacer que el registrador rechace el archivo en el próximo arranque. No es necesario modificar firmware para visualizar sus columnas.

Conexiones y diagrama lógico consolidados en hardware/. Por instrucción posterior del usuario, EasyEDA/esquemático/PCB se harán en chat exclusivo al finalizar todos los sensores. Consumo y alimentación conmutada siguen diferidos. El reporte inicial no autorizaba publicar; el usuario autorizó después la publicación actual el 2026-11-02.

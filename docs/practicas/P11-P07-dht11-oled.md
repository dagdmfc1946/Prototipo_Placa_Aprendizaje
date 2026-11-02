# P11/P07 — DHT11 y OLED, antes de integrar almacenamiento

Fecha: 2026-11-02. Estado: validación funcional de firmware confirmada por el usuario: lecturas, espera inicial, desconexión/recuperación DHT y detección de OLED ausente. Esquemático pendiente.

## Objetivo y alcance

Leer DHT11 cada cinco segundos y mostrar la misma lectura en consola y OLED SSD1306 de 128×64. Mantener el sensor independiente de la presentación. No escribir mediciones en SD en este incremento. Conservar P17a seleccionable desde `Config.h` para repetirla.

## Resultados que debe demostrar la práctica

| Caso | Resultado esperado | Estado físico |
|---|---|---|
| DHT y OLED conectados | Lectura cada cinco segundos en consola y pantalla | Lecturas confirmadas por log y OLED por usuario, 2026-11-02; periodo configurado en 5000 ms |
| Primer arranque | OLED informa espera; primera lectura después de cinco segundos | Usuario confirma espera inicial en pantalla; periodo configurado en 5000 ms, 2026-11-02 |
| DHT ausente o lectura fallida | Mensaje de error; sin ceros ficticios ni valores anteriores presentados como nuevos | Confirmado por usuario: desconexión intencional del sensor, errores explícitos y recuperación, 2026-11-02 |
| OLED ausente al arrancar | Mensaje de error I²C y DHT continúa por consola | Usuario confirma error en Monitor Serie al quitar OLED, 2026-11-02 |
| DHT reconectado y reinicio | Retorna a mostrar lecturas válidas | Reconexión confirmada por usuario y recuperación observada en el log, 2026-11-02 |
| Selección P17a | Se conserva la prueba SD y sus pines anteriores | Pendiente de repetición si se desea |

Cambiar conexiones con la alimentación apagada y reiniciar para cada caso. Esta práctica detecta ausencia de OLED al arrancar; no implementa detección o reconexión en caliente de la pantalla.

## Selección de práctica

En `esp32_Project/Config.h`:

```cpp
#define PRACTICA_ACTIVA PRACTICA_DHT_OLED
```

Para repetir P17a, cambiar únicamente la selección a `PRACTICA_MICROSD`. Los `.cpp` nuevos quedan protegidos por esa selección, de modo que P17a no requiere las librerías externas de DHT/OLED para compilar. No se deben incluir `.cpp` desde el `.ino`.

La selección afecta al firmware cargado, no conmuta físicamente alimentación ni desconecta sensores. Por ahora no es un modo de funcionamiento simultáneo de SD, DHT y OLED.

## Conexiones provisionales y recursos

| Componente/señal | GPIO o alimentación | Uso en modo DHT/OLED |
|---|---|---|
| DHT11 DATA | GPIO4 (D4) | Activo |
| DHT11 VCC / GND | 3V3 / GND común, para el módulo de práctica compatible | Activo; comprobar pull-up de DATA a 3V3 |
| OLED SDA | GPIO21 | Activo |
| OLED SCL | GPIO22 | Activo |
| OLED VCC / GND | 3V3 / GND común, conforme al ejemplo disponible | Activo |
| MicroSD CS / SCK / MISO / MOSI | 13 / 18 / 19 / 23 | Conservados para P17a; sin transacciones en este modo |
| UART0 TX / RX | 1 / 3 | Reservados para programación/consola |

OLED según referencia del usuario: SSD1306, 128×64, dirección de siete bits `0x3C`, sin RESET externo. Bus a 100 kHz. La inicialización comprueba respuesta en esa dirección antes de preparar la pantalla; un ACK no identifica por sí solo el controlador ni la resolución. Si falla, revisar módulo, dirección y cableado sin modificar automáticamente otros GPIO.

DHT: si falta resistencia en el módulo, utilizar un pull-up externo de 4,7–10 kΩ desde DATA a 3V3. No conectar un pull-up a 5 V directamente al GPIO. Verificar la variante real del DHT antes de cambiar su alimentación.

Es una asignación para protoboard, no el pinout definitivo. La herramienta y el registro general de GPIO se gestionan en el otro chat; aquí se documentan únicamente los recursos de la práctica.

## Archivos y versiones

| Archivo | Versión | Responsabilidad |
|---|---|---|
| `Config.h` | 0.2.0 | Selección, GPIO, pantalla e intervalo |
| `esp32_Project.ino` | 0.2.0 | Coordinar práctica y muestreo con `millis()` |
| `DhtSensor.h` / `.cpp` | 0.1.0 cada uno | Entregar temperatura, humedad y validez; inicializar una vez |
| `OledDisplay.h` / `.cpp` | 0.1.0 cada uno | Inicializar una vez y mostrar lectura o error |
| `MicroSd.h` / `.cpp` | 0.1.0 cada uno | Prueba anterior conservada sin modificaciones |

Cada archivo lleva cabecera de autor, repositorio, versión, fecha e historial conforme a la convención del proyecto.

## Entorno de referencia

- ESP32 Dev Module, FQBN `esp32:esp32:esp32`, core Arduino-ESP32 **3.3.12**.
- DHT sensor library **1.4.7** y Adafruit Unified Sensor **1.1.15**.
- Adafruit SSD1306 **2.5.17**, Adafruit GFX Library **1.13.0**, Adafruit BusIO **1.17.4**.
- Librerías externas ya disponibles en la instalación local; no se instalan ni actualizan en este incremento.

## Procedimiento

1. Revisar alimentación y conexiones. Abrir `esp32_Project/esp32_Project.ino` desde su carpeta completa.
2. Seleccionar `PRACTICA_DHT_OLED` en `Config.h`. Seleccionar placa/puerto y core 3.3.12 en Arduino IDE.
3. Verificar y subir; abrir Monitor Serie a **115200 baudios**. Pulsar EN/RESET si no se vio el mensaje inicial.
4. Esperar al menos cinco segundos. Comparar consola y pantalla durante diez muestras, aproximadamente cincuenta segundos. Registrar salida real y si hubo errores.
5. Con alimentación apagada, preparar los casos de DHT ausente y OLED ausente de la tabla, probarlos por separado y registrar el resultado.
6. Restaurar conexiones con alimentación apagada y reiniciar. Compartir resultados antes de integrar CSV/SD o fijar el pinout definitivo.

Salida esperada para una muestra válida: `T=25.0 C | H=60.0 %` (valores ilustrativos, no resultados medidos). Si falla: `ERROR DHT11: lectura invalida; no se generaron mediciones sustitutas.`

## Verificación de software

Modo DHT/OLED: compilación correcta con core 3.3.12, FQBN esp32:esp32:esp32 y warnings all. Programa 322472 bytes (24 %); globales 23756 bytes (7 %). Modo MicroSD: compilación correcta usando un directorio de librerías de usuario vacío, solo con librerías del core; programa 329446 bytes (25 %) y globales 22680 bytes (6 %). Selección DHT/OLED restaurada al finalizar. Ambas compilaciones terminaron con exit code 0. Verificada identidad SHA-256 del firmware guardado respecto al conjunto compilado y cabeceras de los ocho archivos. No se cargó firmware a la placa desde estas herramientas. No hay una suite de hardware automatizada ni se simulan lecturas como evidencia física. Los casos de la tabla deben ejecutarse en el montaje real.

## Fuentes

- [DHT sensor library 1.4.7](https://github.com/adafruit/DHT-sensor-library/tree/1.4.7): inicialización y lecturas; intervalo mínimo de la implementación de dos segundos.
- [Adafruit SSD1306 2.5.17](https://github.com/adafruit/Adafruit_SSD1306/tree/2.5.17): constructor, `begin` y administración del bus con `periphBegin`.
- [Wire de Arduino-ESP32 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/Wire/src/Wire.h).
- APIs contrastadas también con los headers y metadatos de las versiones instaladas localmente.

Para repetir desde la raíz del repositorio, con la práctica deseada seleccionada en Config.h:

```powershell
& "$env:LOCALAPPDATA\Programs\Arduino IDE\resources\app\lib\backend\resources\arduino-cli.exe" compile --fqbn esp32:esp32:esp32 --warnings all --config-file "$env:USERPROFILE\.arduinoIDE\arduino-cli.yaml" --build-path "$env:TEMP\esp32-practicas-build" .\esp32_Project
```

También se puede usar Verificar en Arduino IDE. Los resultados de compilación no sustituyen las pruebas de la tabla inicial. Sin commit ni publicación en este incremento.

## Retroalimentación recibida el 2026-11-02

El usuario confirma que las lecturas se ven correctamente en la OLED. El Monitor Serie muestra inicialización de OLED en 0x3C, DHT DATA4, SDA21/SCL22 y periodo configurado de 5000 ms. Se recibieron ocho muestras válidas, un bloque de errores explícitos sin mediciones sustitutas y otras tres muestras válidas después del bloque. Rango visible de temperatura: 29,4–30,0 °C; humedad: 60,3–68,5 %.

La lectura y presentación nominales quedan verificadas por el usuario; el log también demuestra recuperación de adquisición tras los errores. El usuario aclara que desconectó y reconectó intencionalmente el sensor: el bloque corresponde a la prueba negativa y la recuperación esperadas. No se identifica un fallo espontáneo que requiera modificar firmware. En la confirmación posterior el usuario indica que retiró OLED y obtuvo el error en Monitor Serie; también confirma el mensaje de espera en el primer arranque.

Siguiente incremento propuesto: CSV con tiempo desde arranque, temperatura, humedad y estado; cabecera única, apertura para agregar, errores sin valores ficticios y continuidad de consola/OLED si falla SD. Se conservarán los modos independientes. Aún no se implementó ese incremento.

## Siguiente incremento autorizado

El usuario solicita CSV junto con deep sleep: cuatro intentos cada cinco segundos durante una ventana nominal de veinte segundos y sesenta segundos de reposo. La optimización del consumo y el corte de alimentación física se dejan para después. Ver ficha P17b cuando se instale el incremento. No se fijan GPIO definitivos ni se publica sin autorización.

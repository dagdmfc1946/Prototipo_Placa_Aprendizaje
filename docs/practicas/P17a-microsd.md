# P17a — MicroSD: agregar y verificar un registro

Fecha: 2026-10-31. Estado: implementada y compilada; escritura y ausencia de tarjeta confirmadas por el usuario el 2026-11-02.

## Objetivo

Comprobar el bloque MicroSD por separado antes de registrar DHT11. En cada arranque, montar tarjeta, agregar una línea a `/prueba_sd.txt`, cerrar, reabrir y comparar exactamente el registro nuevo. No se borra el archivo ni se formatea la tarjeta. Un fallo de escritura puede dejar una línea parcial; se informa como error.

Esta ficha define los resultados esperados antes de ejecutar la prueba. La compilación comprueba compatibilidad de código; el usuario verificará la tarjeta real.

## Entorno e información recibida

- ESP-WROOM-32 DevKit de 30 pines; compilación genérica `esp32:esp32:esp32` (ESP32 Dev Module), pendiente confirmar selección exacta en IDE.
- Arduino-ESP32 **3.3.12**, informado por captura y confirmado en instalación local.
- Arduino CLI **1.5.1**, incluido en la instalación local de Arduino IDE.
- `SD`, `FS` y `SPI`: incluidas en ese core; no instalar otra librería SD para esta práctica.
- DHT11 DATA=GPIO4, confirmado por el usuario.
- OLED según su ejemplo de 30 pines: SSD1306, 128×64, 0x3C, SDA=GPIO21 y SCL=GPIO22, reset=-1. Esta práctica no inicializa ni lee DHT/OLED; se conservan como referencia para el siguiente incremento.
- Módulo indicado: [TARUSD-CN-03, Didácticas Electrónicas](https://www.didacticaselectronicas.com/shop/tarusd-cn-03-modulo-para-tarjeta-microsd-con-pines-sin-soldar-45342). La ficha indexada describe socket microSD de 18×18 mm y pines que requieren soldadura; no publica esquema ni especificación de regulación. El plan original lo describe como adaptador sin regulador/conversor. Verificar coincidencia con la unidad física.

## Conexión para el adaptador directo de 3,3 V

Conectar sin alimentación. Seguir nombres de señal, no el orden físico de las filas del conector.

| Señal del adaptador | ESP32 |
|---|---|
| VCC / 3V3 de la tarjeta | 3V3, nunca VIN/5V para un socket directo |
| GND | GND común |
| SCK / CLK | GPIO18 |
| DO / MISO | GPIO19 |
| DI / MOSI | GPIO23 |
| CS | GPIO13 |

GPIO13 fue el CS provisional probado y queda adoptado para la revisión actual por confirmación del usuario el 2026-11-02; GPIO5 no se usa como CS. No conectar allí el buzzer del pinout anterior. No es todavía el pinout de la PCB. Las señales de alimentación/señal deben comprobarse con la serigrafía o continuidad de la unidad; si incorpora otro circuito, revisar su alimentación antes de aplicar esta tabla.

Usar conexiones cortas y verificar los headers soldados. Se configura SPI a 1 MHz para comenzar en protoboard. Si hay fallos, medir 3,3 V también durante escritura; no atribuirlos automáticamente al software.

## Archivos

- `esp32_Project/Config.h`: pines y configuración de esta práctica.
- `esp32_Project/MicroSd.h`: funciones disponibles.
- `esp32_Project/MicroSd.cpp`: implementación SPI/SD y prueba de escritura/lectura.
- `esp32_Project/esp32_Project.ino`: coordina la prueba, sin lógica de DHT ni OLED.

No se requiere que toda la implementación resida en `.h`: cada componente conserva su cabecera y su implementación `.cpp`, con una sola definición de cada función.

## Procedimiento de prueba física

1. Usar una tarjeta de prueba con sistema de archivos compatible; FAT32 es el punto de partida propuesto. No formatear una tarjeta con información que se quiera conservar. Este firmware no cambia el formato automáticamente.
2. Abrir el `.ino` desde su carpeta completa. En Arduino IDE seleccionar la placa ESP32 correspondiente, core 3.3.12 y puerto.
3. Verificar y subir. Abrir Monitor Serie a **115200 baudios** y pulsar EN/RESET si se perdió el mensaje inicial.
4. Esperado: ruta `/prueba_sd.txt`, tamaño previo, 46 bytes agregados/verificados, texto leído y `OK` con tarjeta desmontada.
5. Pulsar EN/RESET: debe conservarse el contenido anterior y aumentar el tamaño en otros 46 bytes.
6. Después del mensaje de tarjeta desmontada, apagar y revisar el archivo en el PC: debe haber una línea adicional por arranque exitoso.
7. Apagar, retirar la tarjeta y arrancar de nuevo: debe informar que no se pudo montar y no imprimir el resultado `OK`.

Texto de cada registro: `ESP32 microSD: prueba de escritura y lectura.` seguido de LF. Son datos de prueba, no mediciones de temperatura/humedad.

## Criterios de aceptación y registro

| Comprobación | Resultado |
|---|---|
| Compilación con Arduino-ESP32 3.3.12 | Correcta, 2026-10-31; FQBN esp32:esp32:esp32 |
| Montaje con tarjeta insertada | Escritura conseguida según captura y reporte del usuario; log de arranque exitoso no transcrito |
| Registro nuevo coincide byte a byte | Texto esperado visible en captura; comparación interna no transcrita en el log recibido |
| Reinicio conserva y agrega datos | Cuatro registros visibles y pruebas informadas por el usuario; sin secuencia detallada de arranques |
| PC muestra las líneas esperadas | Confirmado: captura con cuatro registros, 2026-11-02 |
| Arranque sin tarjeta informa fallo | Confirmado por usuario: el log de fallo corresponde a tarjeta retirada, 2026-11-02 |

Registrar capacidad/formato de tarjeta, selección de placa, conexión real, salida serie y tensión de alimentación si hay fallos. No marcar P17 completa: faltan la validación física, integración y esquemático.

## Siguiente incremento

Tras validar P17a: comprobar el DHT11 por consola y la OLED con los parámetros del ejemplo; incorporar sus módulos `.h`/`.cpp` y después el CSV. El tiempo desde arranque no se presentará como fecha/hora de RTC.

## Fuentes

- [SD.h de Arduino-ESP32 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/SD/src/SD.h): frecuencia y opción de no formatear.
- [SD_Test oficial, versión 3.3.12](https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/SD/examples/SD_Test/SD_Test.ino): SPI explícito, apertura para añadir y lectura. Nuestra prueba omite sus operaciones de borrado y sobreescritura.

## Verificación de compilación

Compilación real con CLI 1.5.1, core 3.3.12 y `--warnings all`: exit code 0. Resultado: 329446 bytes de programa (25 %) y 22680 bytes de variables globales (6 %). Se compiló una copia de trabajo y se verificó identidad SHA-256 de los cuatro archivos de firmware con los guardados en el repositorio. No se cargó firmware a una placa.

El primer intento dentro del sandbox no pudo iniciar el compilador (WinAPI #623). El mismo sketch final compiló correctamente con permisos del entorno para ejecutar el toolchain instalado. No se cambió el core ni se instalaron librerías.

Para repetir desde la raíz del repositorio en PowerShell:

```powershell
& "$env:LOCALAPPDATA\Programs\Arduino IDE\resources\app\lib\backend\resources\arduino-cli.exe" compile --fqbn esp32:esp32:esp32 --warnings all --config-file "$env:USERPROFILE\.arduinoIDE\arduino-cli.yaml" --build-path "$env:TEMP\esp32-p17a-build" .\esp32_Project
```

Este comando depende de las rutas de la instalación actual. En Arduino IDE se puede usar Verificar con la placa equivalente seleccionada.

## Resultado recibido el 2026-11-02

El usuario informa ejecución de las pruebas y aporta captura de `prueba_sd.txt` con cuatro líneas esperadas. Confirma expresamente que el mensaje `ERROR: tarjeta no montada` se obtuvo después de retirar la microSD, por lo que corresponde al caso negativo previsto, no a un fallo demostrado con tarjeta insertada. La escritura en tarjeta y la detección de ausencia quedan documentadas; no se aportó el log de los arranques exitosos para transcribir los tamaños o la comparación interna byte a byte. No se solicitaron repeticiones innecesarias de las pruebas ya informadas.

La integración de almacenamiento DHT/CSV y el esquemático siguen pendientes. Para repetir P17a con el firmware nuevo, seleccionar `PRACTICA_ACTIVA PRACTICA_MICROSD` en `Config.h` antes de compilar; la selección predeterminada ahora es `PRACTICA_DHT_OLED`.

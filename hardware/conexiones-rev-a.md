# Tabla de conexiones adoptadas — revisión A

Fecha: 2026-11-02. Alcance: conjunto ESP32 DevKit ESP-WROOM-32 de 30 pines + DHT11 + OLED + MicroSD validado en protoboard. Asignación adoptada para este conjunto; se revisará el mapa total conforme se incorporen los demás componentes.

**CS de MicroSD queda en GPIO13.** GPIO5 fue una propuesta histórica sustituida. GPIO13 no se comparte simultáneamente con el buzzer previsto originalmente. GPIO14 no forma parte de este SPI.

| Señal / red lógica | GPIO ESP32 | Destino | Dirección vista desde ESP32 | Estado |
|---|---:|---|---|---|
| `DHT_DATA` | 4 | DATA DHT11 | Bidireccional según protocolo | Validado P11/P07 y P17b |
| `I2C_SDA` | 21 | SDA OLED, dirección 0x3C | Bidireccional, drenador abierto | Validado P11/P07 y P17b |
| `I2C_SCL` | 22 | SCL OLED | Reloj I²C, drenador abierto | Validado P11/P07 y P17b |
| `SD_CS` | 13 | CS MicroSD | Salida, activa en bajo | Validado P17a/P17b y confirmado por usuario |
| `SPI_SCK` | 18 | CLK/SCK MicroSD | Salida | Validado P17a/P17b |
| `SPI_MISO` | 19 | DO/MISO MicroSD | Entrada | Validado P17a/P17b |
| `SPI_MOSI` | 23 | DI/MOSI MicroSD | Salida | Validado P17a/P17b |
| `UART0_TX` | 1 | USB-UART de DevKit | Salida | Reservado para programación/consola |
| `UART0_RX` | 3 | USB-UART de DevKit | Entrada | Reservado para programación/consola |

## Alimentación del montaje

| Conexión lógica | Uso en el conjunto actual |
|---|---|
| `+3V3` | Alimentación de los módulos compatibles usados y lógica ESP32 |
| `GND` | Tierra común de DevKit, DHT11, OLED y adaptador MicroSD |
| `VIN/5V` | Entrada de alimentación de DevKit, según la ruta utilizada en el montaje; no es alimentación directa de GPIO o socket SD |
| `EN` | Reset/habilitación de la propia DevKit; no es GPIO de periférico |

La tabla identifica nombres de señal, no orden físico de pines de un conector ni números de pad. Alimentación, orden de terminales y regulación deben corresponder a la unidad real. La alimentación de periféricos no se corta durante el sueño de esta revisión.

Fuente de configuración: [Config.h](../esp32_Project/Config.h). Un cambio de GPIO se documentará y volverá a validarse antes de adoptarlo. GPIO5 está sin asignación en este conjunto y conserva su restricción de arranque; no se interpreta como GPIO libre de precauciones.

El [visor GPIO](../visor-gpio/tools/gpio/index.html) y su registro se mantienen en su chat propio, sin modificarlos desde aquí. Los demás sensores no reciben pines definitivos en esta tabla hasta su práctica.

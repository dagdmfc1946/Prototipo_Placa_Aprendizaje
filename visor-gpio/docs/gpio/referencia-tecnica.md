# Referencia técnica del perfil ESP32

Versión: 0.2.0. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Alcance: [LICENCIAS.md](LICENCIAS.md).

Guía original para consultar junto al registro. Chip, módulo WROOM y placa DevKit no son equivalentes: la placa concreta determina qué señales llegan a sus headers. Los 25 GPIO del perfil son una referencia; faltan foto/serigrafía y orientación confirmadas de la unidad. No se han asignado posiciones físicas ni se reproduce un dibujo ajeno.

## Entradas, salidas y arranque

GPIO34/35/36/39 solo admiten entrada y no tienen resistencias internas de polarización. GPIO1/3 se reservan inicialmente para consola/programación. GPIO12–15 también comparten funciones JTAG: una asignación debe considerar el uso simultáneo del depurador. [Espressif, GPIO Summary](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/peripherals/gpio.html).

GPIO2/5/12/15 están expuestos en el perfil y participan en configuración de arranque. GPIO0 también interviene a nivel del chip, pero no se supone expuesto en este header. Evitar resumir todos como «deben estar altos/bajos» sin contexto: el efecto depende del modo y parámetro muestreado. GPIO12 merece atención porque interviene en la selección de tensión de flash, con posibles ajustes por eFuse. No modificar eFuses desde esta herramienta. [Datasheet ESP32 v5.3, capítulo 3](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf#page=22).

## Flash, módulo y alimentación

GPIO6–11 sirven a la flash del WROOM y no son recursos libres para periféricos. GPIO16/17 dependen de la variante de módulo: verificar especialmente si hay PSRAM antes de reutilizarlos. No extrapolar un perfil WROOM a WROVER. [Datasheet WROOM-32 v3.8, tabla 2 y notas](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf#page=9).

La lógica prevista es de 3,3 V: no aplicar señales de 5 V directamente. VIN, 3V3, GND y EN no son GPIO. La alimentación por VIN/USB depende del circuito real de la DevKit; esta guía no confirma regulador ni conexiones de alimentación. [Datasheet ESP32, características eléctricas](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf#page=51).

## Conversión y otras capacidades

- ADC1 expuesto: GPIO32/33/34/35/36/39. ADC2 expuesto: GPIO2/4/12/13/14/15/25/26/27. La selección de canal no establece por sí sola el rango de medida ni la calibración.
- Wi-Fi comparte recursos con ADC2; al planificar medidas concurrentes, preferir ADC1 y revisar las limitaciones del controlador. Esto afecta a la conversión analógica, no significa que todo uso digital de esos GPIO quede prohibido. [ESP-IDF 5.5, ADC Hardware Limitations](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/peripherals/adc_oneshot.html#hardware-limitations).
- DAC: GPIO25/26. Touch del perfil: GPIO2/4/12/13/14/15/27/32/33. Los canales concretos están en el JSON; no se confunden con números de posición física. [WROOM-32, tabla 2](https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32_datasheet_en.pdf#page=9).
- PWM requiere una salida habilitada; no está disponible como salida en los GPIO de solo entrada. La cantidad de pines no equivale al número de generadores independientes. Para interrupciones en GPIO36/39 con ADC o radios y modos de sueño, revisar erratas antes de diseñar la aplicación. [GPIO Summary](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/peripherals/gpio.html).

## Interfaces y uso del registro

I²C, SPI y UART pueden enrutar señales mediante la matriz GPIO, sujeto a dirección, controlador y limitaciones. Los GPIO de un ejemplo son una configuración de trabajo, no una lista universal de pines exclusivos para ese bus. [Guía oficial GPIO](https://docs.espressif.com/projects/esp-idf/en/v5.5/esp32/api-reference/peripherals/gpio.html).

En este trabajo, OLED usa SDA21/SCL22 según información recibida. MicroSD tiene CS13/SCK18/MISO19/MOSI23 en `Config.h`. Estos hechos están registrados por proyecto, no como restricciones del chip. La reserva UART0 puede modificarse conscientemente para otro trabajo. «Libre» describe ocupación conocida; no garantiza compatibilidad con cualquier circuito.

## Consulta documental en el visor

Las fichas del visor usan este contenido original y los datos técnicos del JSON. Los documentos completos se enlazan desde su origen; un PDF local seleccionado para consulta privada no se guarda en Git ni en exportaciones. Sin conexión sigue disponible la guía propia; abrir fuentes remotas requiere Internet. Ver [fuentes y licencias](fuentes-y-licencias.md).

Historial: 0.1.0 (2026-10-31): guía original inicial para el perfil de referencia.

0.2.0 (2026-10-31): consulta integrada disponible; se mantienen hechos técnicos y fuentes.

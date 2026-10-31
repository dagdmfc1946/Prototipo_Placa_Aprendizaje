# Revisión de referencias y preparación DHT11 + OLED + MicroSD

Fecha: 2026-10-31. Revisión previa a implementación. Continuación: [P17a MicroSD](practicas/P17a-microsd.md), ya implementada y compilada; pendiente de comprobación física. La integración DHT11/OLED sigue propuesta.

## Referencias locales revisadas

La carpeta `examples/` es material privado de consulta, ignorado por Git. No se copian estos proyectos ni sus configuraciones al firmware publicado.

- `DHT11_Sensor/DHT11_Sensor.ino`: prueba sencilla con DHT11 en GPIO4, inicialización en `setup()` y lectura cada cinco segundos. Es el punto de partida más pequeño para comprobar el sensor.
- `temhum_ESP32/newCode_ESP32_30P/`: variante para ESP32 de 30 pines con DHT11, OLED externa y lectura de batería.
- `final_Code_ENTREGADO/`: utiliza otros pines y control de alimentación `Vext`; no debe trasladarse directamente a la DevKit actual.
- `gpsPmod_OLED/gpsPmod_OLED.ino`: referencia futura de UART GPS y OLED. No se integra en esta primera prueba.
- `Ultimate_Guide_Arduino_Sensors_Modules/23 - SD Card Module/`: contiene un diagrama de referencia; no se encontró un sketch de MicroSD en ese directorio.
- `TemHum_IA_resumen_chat.md`: no se encontró en la ruta indicada ni por nombre de resumen dentro de `examples/` durante esta revisión. Queda pendiente leerlo cuando esté disponible.

## Hallazgos que afectan al nuevo desarrollo

1. **Batería:** la variante de 30 pines configura `VBAT_DIVIDER_FACTOR = 4.9f`. El factor debe derivarse del circuito real: `(R_superior + R_inferior) / R_inferior`. Si ambas resistencias son iguales, es 2. Por ejemplo, 2,1 V medidos en el nodo darían 10,29 V con factor 4,9, frente a 4,2 V con factor 2. Es una discrepancia de configuración potencial, no una explicación física confirmada del fallo reportado.
2. **DHT:** el ejemplo modular llama `dht.begin()` dentro de cada lectura. Para muestreo continuo, inicializar una vez y respetar el intervalo del sensor. El ejemplo oficial Adafruit usa inicialización en `setup()` y un intervalo de dos segundos; podemos conservar cinco segundos como en la prueba local.
3. **Error del DHT:** se asigna cero a temperatura y humedad cuando falla. La nueva práctica debe conservar un estado de error y evitar registrar ceros como datos válidos. El sensor devuelve el resultado; la aplicación decide qué mostrar o guardar.
4. **Acoplamiento:** `lectura_DHT.h` incluye OLED y muestra errores directamente. Separar adquisición, visualización y almacenamiento facilita probar cada componente.
5. **OLED:** el ejemplo para 30 pines usa Adafruit SSD1306, resolución 128×64, dirección 0x3C y GPIO21/22. Son datos del ejemplo, pendientes de confirmar en el montaje actual. Inicializar la pantalla una vez; no terminar el bus I²C compartido desde una función de presentación.
6. **Cabeceras:** algunos `.h` definen objetos y funciones sin protección de inclusión. Usar protección de inclusión en cada cabecera y mantener una sola definición de objetos en su `.cpp` evita duplicados al crecer el proyecto.

## Organización sugerida, todavía no implementada

Dentro de `esp32_Project/`, conservar el `.ino` como coordinador y añadir archivos solamente al empezar su práctica:

| Archivo | Responsabilidad |
|---|---|
| `Config.h` | Pines e intervalo de la práctica, con distinción entre provisional y validado |
| `DhtSensor.h` / `DhtSensor.cpp` | Inicializar DHT11 y devolver temperatura, humedad y validez; sin OLED ni MicroSD |
| `OledDisplay.h` / `OledDisplay.cpp` | Inicializar pantalla y presentar datos/estados recibidos |
| `MicroSd.h` / `MicroSd.cpp` | Inicializar SPI/tarjeta, añadir registro y verificar lectura; comunicar errores |
| `esp32_Project.ino` | Coordinar inicio, muestreo periódico y respuesta a fallos |

Un `.h` por componente no obliga a poner toda su implementación allí. Preferencia: declaraciones en `.h`, implementación y objeto de librería en `.cpp`. No hace falta diseñar clases genéricas ni implementar módulos futuros ahora.

Arduino compila los `.cpp` de la carpeta del sketch aunque su cabecera no se incluya desde el `.ino`. Al incorporar selección de componentes se debe comprobar que un módulo desactivado no obligue a instalar su librería. No se afirma que esa selección ya exista.

## Primera prueba propuesta

Se priorizan P11 (DHT), P07 (OLED) y P17 (MicroSD) por el montaje ya disponible. Sus fichas y estados se cerrarán por separado; estar conectados no equivale a estar probados.

1. **Confirmar montaje y entorno:** GPIO de DHT y OLED, resolución/controlador, modelo de módulo MicroSD, su alimentación y versión del core. Usar los pines del ejemplo únicamente si coinciden con el cableado confirmado.
2. **Comprobar DHT por consola:** cinco segundos entre muestras; registrar valores o fallo explícito. Reutilizar el ejemplo mínimo como referencia.
3. **Comprobar OLED:** presentar los mismos valores recibidos del DHT y un estado visible de error si no son válidos.
4. **Probar MicroSD sola:** identificar tarjeta, abrir un archivo de prueba nuevo, añadir un registro, cerrar y releer para comparar. No formatear ni ejecutar pruebas que borren archivos existentes.
5. **Integrar registro:** guardar CSV, por ejemplo `tiempo_ms,temperatura_c,humedad_pct,estado`. Usar campos vacíos y estado de error cuando el DHT falle, en lugar de mediciones ficticias. Cabecera una sola vez y apertura para añadir, sin truncar datos anteriores. Verificar bytes escritos y contenido releído.
6. **Validar en conjunto:** guardar al menos diez muestras, reiniciar y verificar que los datos anteriores permanecen; iniciar sin tarjeta y comprobar que el fallo se informa mientras DHT/OLED continúan operando. Retirar la tarjeta únicamente cuando no se esté escribiendo y el archivo esté cerrado.
7. **Documentar y dibujar:** registrar resultados reales y añadir al esquemático los bloques comprobados. Mantener pendientes los módulos sin validar.

`tiempo_ms` representa tiempo desde el arranque; se reinicia al reset. Todavía no es fecha/hora del RTC. Al cerrar el archivo se entrega la escritura al sistema de archivos, sin garantizar integridad frente a un corte durante una escritura.

### Conexiones que hay que resolver antes del script

- DHT y OLED: el ejemplo propone GPIO4 y GPIO21/22; confirmar que coincidan con el montaje.
- MicroSD: SCK=18, MISO=19 y MOSI=23 son candidatos para ESP32 clásico. Elegir CS explícitamente tras revisar GPIO libres; no depender del CS predeterminado sin comprobarlo. GPIO5 figura en el plan previo y es un pin de configuración de arranque, por lo que debe revisarse antes de adoptarlo.
- Confirmar si el módulo es un adaptador de 3,3 V sin regulador/conversor, como se describe en el plan original, o uno diferente. No deducir alimentación únicamente por la forma del módulo.
- GND común y señales compatibles con 3,3 V. La alimentación concreta del módulo se fija después de identificarlo.

### Criterios de cierre

- Compilación para placa/core registrados y librerías identificadas.
- Diez registros comparados con la consola y lectura correcta desde la tarjeta.
- DHT ausente o fallando no produce ceros presentados como lecturas válidas.
- Ausencia de SD informa error y permite continuar con adquisición/pantalla.
- Reinicio conserva los registros anteriores; tiempos desde arranque se interpretan correctamente.
- Conexiones reales, resultados y bloque de esquemático documentados antes de pasar al siguiente componente.

## Fuentes primarias

- [Ejemplo oficial SD de Arduino-ESP32](https://github.com/espressif/arduino-esp32/blob/master/libraries/SD/examples/SD_Test/SD_Test.ino): referencia de API SPI/SD, no ejecutar sus operaciones de borrado o sobreescritura como parte de nuestra prueba.
- [Ejemplo oficial DHT de Adafruit](https://github.com/adafruit/DHT-sensor-library/blob/master/examples/DHTtester/DHTtester.ino): inicialización, tiempos y detección de lecturas inválidas.
- [Compilación de sketches Arduino](https://docs.arduino.cc/arduino-cli/sketch-build-process/): separación de `.ino`, `.h` y `.cpp`.

Se elegirán versiones concretas al preparar el sketch; las referencias a `master` no fijan una versión reproducible de dependencias.

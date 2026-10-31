# Plan de trabajo: placa de aprendizaje ESP32

Fecha inicial: 2026-10-31, America/Bogota.
Estado: propuesta para revisión. No es una asignación definitiva de GPIO ni un diseño listo para fabricar.

## Objetivo y alcance actual

Desarrollar una plataforma de aprendizaje, empezando con una DevKit ESP-WROOM-32 de 30 pines y módulos comerciales. Evolución prevista: protoboard, baquela, PCB y después integración de los circuitos actualmente presentes en módulos. Usar Arduino IDE para firmware, EasyEDA inicialmente y KiCad después.

El incremento inicial preparó el plan y la documentación sin implementar firmware. Continuación 2026-10-31: revisadas las referencias locales y preparada P17a, prueba MicroSD independiente, compilada y pendiente de validación física. Ver ficha en `docs/practicas/P17a-microsd.md`. No hay todavía esquemático ni PCB de estos bloques.

## Método: un componente por vez

Para cada componente repetir esta secuencia:

1. Identificar módulo, interfaz, alimentación, niveles y referencia técnica. Revisar el script previo si existe.
2. Definir la práctica, sus conexiones provisionales, GPIO y recursos utilizados. Verificar compatibilidad con los bloques ya validados.
3. Preparar un script mínimo de ese componente con configuración centralizada. Compilar para la placa y versión del core registradas.
4. El usuario conecta y prueba en protoboard. Registrar medidas, salida serie, condiciones y errores reales. La compilación no demuestra funcionamiento físico.
5. Corregir y repetir hasta satisfacer los criterios de aceptación de esa práctica.
6. Incorporar al esquemático solamente el bloque validado, señalando cualquier aspecto eléctrico todavía pendiente. Comprobar conectividad y reglas eléctricas del bloque con el resto del proyecto.
7. Actualizar documentación, pinout provisional y bitácora. Revisar el resultado con el usuario antes de comenzar el siguiente componente.

Cada práctica debe conservar un ejemplo reproducible. La extracción posterior a `.h` y, si corresponde, `.cpp` se hace tras validar el comportamiento; el `.ino` principal seleccionará y coordinará lo que se desee usar. No es necesario implementar todos los componentes antes de dibujar el primer bloque del esquemático.

## Situación conocida

| Elemento | Información disponible | Pendiente |
|---|---|---|
| ESP32 | DevKit ESP-WROOM-32, 30 pines | Fabricante/modelo concreto, regulador, dimensiones, core Arduino-ESP32 y puerto |
| Firmware | P17a implementada y compilada para core 3.3.12; referencias revisadas | Prueba física de SD y posterior integración DHT11/OLED |
| Batería | Una celda 18650; disponibles resistencias de precisión de 27 kΩ y 47 kΩ | Cantidad de cada valor, tolerancia, mediciones y esquema anterior |
| Alimentación de control | Baquela existente: TP4056 + MT3608 ajustado a 5 V para VIN | Protección instalada, consumos, rizado y relación con USB |
| Alimentación de relés | Otra baquela, con salida de 12/24 V | Tensión real por prueba, modelo/consumo de bobinas y drivers |
| Ultrasonido | Módulo VCC, TRIG, ECHO, GND | Referencia exacta, niveles reales y adaptación de ECHO |
| Display | Cuatro dígitos, CLK, DIO, VCC, GND | Confirmar chip; TM1637 es hipótesis, no identificación verificada |
| Tiny RTC | Enlace del usuario en Fuentes | Confirmar chip, esquema, pull-ups y circuito de batería de respaldo |
| GPS | PmodGPS utilizado previamente | Revisión de placa, script, velocidad UART y señales adicionales necesarias |
| RS485 | Se desea aprender | Elegir transceptor compatible con ESP32 y segundo extremo de prueba |
| Expansor | No disponible todavía | Comparar candidatos y compra antes de su práctica |

El plan anterior también incluye MicroSD, OLED, LCD 16×2, DHT11/DHT22, dos relés, LDR, receptor IR, final de carrera, tres pulsadores, buzzer y LEDs. Se mantienen en el alcance propuesto; referencias y cantidades finales se confirmarán por práctica.

## Orden de trabajo propuesto

Los identificadores de práctica se conservan aunque se ajuste su orden. Se puede priorizar batería o GPS después de recibir los ejemplos, sin declarar validados los bloques anteriores.

| Práctica | Resultado verificable | Dependencia |
|---|---|---|
| P00: inventario y entorno | Placa, core y librerías registrados; scripts previos inventariados; esquema de alimentación documentado | Ninguna |
| P01: arranque y consola | Compilación/carga y reinicio reproducibles, salida serie legible | P00 |
| P02: un LED y PWM | Encendido/apagado y variación de brillo sin afectar arranque | P01 |
| P03: pulsadores/final de carrera | Entradas estables y antirrebote; tres pulsadores independientes si se confirma ese requisito | P02 |
| P04: potenciómetro | ADC responde al movimiento; rango y atenuación documentados | P01 |
| P05: tensión de batería | Lectura comparada con multímetro en varios puntos; divisor y error medidos | P04 |
| P06: LDR | Respuesta reproducible a luz/oscuridad; documentar magnitud relativa, sin inventar lux | P04 |
| P07: OLED | Bus y dirección identificados; texto de prueba estable | P01 |
| P08: LCD I²C | Niveles y pull-ups revisados; texto y coexistencia con OLED comprobados | P07 |
| P09: Tiny RTC | Identificación, ajuste y lectura de hora; prueba de respaldo según módulo | P07 |
| P10: display de cuatro dígitos | Dígitos y brillo correctos; niveles de CLK/DIO verificados | P01 |
| P11: DHT | Lectura a intervalos compatibles y error de desconexión reconocible | P01 |
| P12: ultrasonido | ECHO adaptado; distancias comparadas con referencia y ausencia de eco gestionada | P01 |
| P13: receptor IR | Identificar tipo; registrar respuesta o códigos según interfaz | P01 |
| P14: buzzer | Accionamiento controlado con driver si corresponde | P01 |
| P15: un relé y luego el segundo | Driver y estado de reposo comprobados; sin activaciones inesperadas al reset | P01 y alimentación de relés caracterizada |
| P16: expansor I/O | Entradas y salidas verificadas; reset y desconexión del bus gestionados | P07 y compra/identificación |
| P17: MicroSD | Escritura y lectura verificadas, manejo de ausencia de tarjeta | P01 |
| P18: GPS | Tramas válidas; distinguir recepción de datos de posición válida; prueba exterior | P01 y script/modelo disponibles |
| P19: RS485 | Envío/recepción con segundo extremo, control de dirección y reinicio | P01 y transceptor/segundo extremo disponibles |

En cada fila, el cierre incluye también su bloque de esquemático y la bitácora; el orden no obliga a comprar todo ahora. Si falta un componente, se deja pendiente y se acuerda otra práctica disponible.

## Integración y evolución física

1. Integrar por parejas los bloques ya validados: OLED+RTC, ADC+Wi-Fi, GPS+consola y después GPS+RS485. Revisar también MicroSD y relés bajo carga. Registrar conflictos y consumo.
2. Consolidar asignación de GPIO, UART, I²C, SPI y PWM a partir de esas pruebas. Probar arranque en frío y reset en todas las configuraciones de jumpers permitidas.
3. Trasladar el conjunto probado a baquela y repetir las prácticas de aceptación. Registrar diferencias respecto a protoboard.
4. Completar esquemático, footprints, puntos de prueba, alimentación, conectores y reglas. Ejecutar ERC y DRC, revisar mecánica y antena antes de generar archivos de fabricación.
5. Repetir pruebas en PCB y versionar sus revisiones.
6. Planificar por separado la sustitución de módulos por circuitos propios. Distinguir módulo ESP32-WROOM soldado de SoC ESP32 desnudo; este último añade flash según variante, cristal, RF/antena y otras exigencias. El usuario decidirá la variante futura antes de diseñar esa revisión.

## Decisiones por resolver durante las prácticas

- **Jumpers o DIP:** comparar desconexión de señales, selección de funciones y configuración. Un DIP no arbitra dos salidas y cortar VCC no garantiza aislamiento de señales. No fijar aún cantidad ni ubicación.
- **Expansor:** comparar PCF8574/PCF8575, MCP23017 y TCA9535/TCA9555 por entradas, salidas, interrupciones, pull-ups, encapsulado, librería y costo total. Añadir registros de desplazamiento solo si interesa una práctica específica. No son reemplazos de ADC, UART ni captura precisa de pulsos.
- **Precio:** cotizar integrado y módulo/adaptador por separado en el momento de comprar. Referencias consultadas en LCSC: MCP23017-E/SP C647352, USD 3,1766 por unidad; TCA9535RTWR C129354, USD 1,4371 por unidad. El segundo es WQFN y requiere montaje/adaptación; no es una comparación equivalente para protoboard. PCF8574 es candidato de bajo costo; falta cotización local comparable. Precios consultados el 2026-10-31, sin transporte ni impuestos.
- **Restricción MCP23017:** el datasheet DS20001952D indica GPA7 y GPB7 solamente como salidas. No asignar pulsadores a esos terminales. Es una precisión a la recomendación inicial del chat.
- **Una o dos placas:** evaluar control/interfaces separado de potencia/relés para facilitar pruebas. Dos placas no requieren dos microcontroladores: un conector puede llevar alimentación y señales. RS485 entre nodos independientes será otra práctica si se desea; no se impone a la arquitectura final.
- **UART:** reservar consola y estudiar dos UART hardware remapeadas para GPS y RS485. El pinout previo de TM1637 en 16/17 debe reconsiderarse si esos GPIO se reservan para UART.
- **Batería:** comparar el montaje previo con opciones de divisor y revisar ADC antes de atribuir el error a las resistencias. Resistencias iguales producen Vbat/2; no son condición obligatoria para proteger el GPIO.
- **Energía:** caracterizar las baquelas existentes; no asumir que MT3608 carece de filtrado ni que TP4056 incorpora protección o power-path. Revisar corriente, rizado, USB y retorno de alimentación antes de integrar cargas.
- **EasyEDA/KiCad:** elegir edición y guardar exportaciones editables en Git; validar importación en la versión concreta de KiCad instalada. La documentación de desarrollo de KiCad describe importadores de Standard/Pro, con limitaciones. No prometer migración idéntica.

## Protocolo de la práctica de batería

No hay divisor definitivo. Primero revisar esquema y script anterior. Para una celda convencional de 4,2 V máxima, cálculos nominales:

| R superior (batería al nodo) | R inferior (nodo a GND) | Nodo a 4,2 V | Factor para reconstruir Vbat |
|---:|---:|---:|---:|
| 27 kΩ | 27 kΩ | 2,10 V | 2 |
| 47 kΩ | 47 kΩ | 2,10 V | 2 |
| 47 kΩ | 27 kΩ | 1,532 V | 74/27 |

Fórmula: `V_ADC = V_bat × R_inferior / (R_superior + R_inferior)`. Usar valores medidos para calibrar. La protección depende del voltaje resultante, tolerancias y estados de alimentación, no de la igualdad de resistencias. No conectar 12/24 V a esta entrada.

Registrar tensión real de batería y nodo, ADC crudo, lectura calibrada en mV, atenuación, pin, core y presencia de ruido/cargas. Comparar lectura continua, después de estabilización y con filtro si procede. Revisar GND común y alimentación apagada. Definir tolerancia de aceptación según las medidas de la práctica antes de cerrarla; no declarar resuelto el fallo sin evidencia. El condensador y valores se decidirán al revisar el montaje.

## Organización propuesta para firmware y hardware

Existente: `esp32_Project/esp32_Project.ino`.

Al comenzar firmware, proponer configuración de pines y selección de práctica; módulos `.h`/`.cpp` dentro de la carpeta del sketch, más ejemplos independientes fuera de ella para evitar múltiples `setup()`/`loop()`. Los nombres definitivos se acuerdan en la primera práctica. Arduino compila también los `.cpp` de la carpeta: deshabilitar una práctica debe evitar dependencias obligatorias de librerías de módulos no seleccionados.

Cuando empiece el esquemático, crear `hardware/easyeda/` con fuentes nativas y exportaciones para revisión. KiCad tendrá `hardware/kicad/` en su etapa, evitando editar dos versiones maestras divergentes. Registrar herramienta, versión, revisión de hardware y pinout asociado en cada validación.

## Documentación y definición de terminado

- `tasks/plan.md`: fases, método y decisiones pendientes.
- `tasks/todo.md`: seguimiento de prácticas; no duplicar estados en otro gestor.
- `docs/bitacora.md`: trabajo realizado, evidencias, problemas y siguiente paso.
- Para cada práctica, crear su ficha en `docs/practicas/` al comenzar: objetivo, referencia, conexión, GPIO, alimentación, librerías/versiones, pasos y resultados.
- Guardar capturas y registros solo cuando aporten evidencia. No publicar credenciales Wi-Fi ni coordenadas GPS personales.
- Al elegir una arquitectura costosa de cambiar, registrar su motivo y alternativas en `docs/decisions/`.
- Una práctica termina con compilación registrada, prueba física confirmada por el usuario, documentación y bloque de esquemático revisado. Usar estados separados: pendiente, implementado, compilado, probado físicamente, integrado.

## Fuentes

Consultadas el 2026-10-31. Las recomendaciones del plan previo son antecedentes, no órdenes automáticas ni conexiones aprobadas.

- Plan anterior del usuario: `C:/Users/Diego/Downloads/Plan_trabajo_Pinout_ESP32_Prototipo.md`.
- Datasheets locales revisados: `esp32_datasheet_en.pdf` v4.5 y `ESP-WROOM-32.PDF` v2.9. No se copian al repositorio en este incremento.
- [Referencia de pinout aportada](https://lastminuteengineers.com/esp32-pinout-reference/).
- [ADC Arduino-ESP32: lectura cruda, calibrada y atenuación](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html).
- [UART Arduino-ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/serial.html).
- [Proceso de compilación Arduino](https://docs.arduino.cc/arduino-cli/sketch-build-process/).
- [PCF8574 TI](https://www.ti.com/product/PCF8574), [PCF8575 TI](https://www.ti.com/product/PCF8575), [TCA9535 TI](https://www.ti.com/product/TCA9535).
- [MCP23017 datasheet DS20001952D](https://ww1.microchip.com/downloads/aemDocuments/documents/APID/ProductDocuments/DataSheets/MCP23017-Data-Sheet-DS20001952.pdf).
- [MCP23017-E/SP en LCSC](https://www.lcsc.com/product-detail/C647352.html), [TCA9535RTWR en LCSC](https://www.lcsc.com/product-detail/C129354.html).
- [Manual PmodGPS rev. A](https://digilent.com/reference/_media/pmod:pmod:PmodGPS_rm.pdf): referencia hasta confirmar revisión del módulo disponible.
- [Tiny RTC indicado por el usuario](https://www.didacticaselectronicas.com/shop/rtc-i2c-tiny-reloj-de-tiempo-real-3017): acceso web falló por timeout; chip y circuito no confirmados.
- [Importadores EasyEDA en documentación de desarrollo KiCad](https://dev-docs.kicad.org/en/import-formats/easyeda/), [descargas EasyEDA](https://easyeda.com/page/download).
- Descubrimiento de plugins: sin coincidencias dedicadas para EasyEDA/KiCad en esta sesión. Posibles vías de colaboración: archivos exportados y control de interfaz cuando se configure; no hay conexión activa establecida.

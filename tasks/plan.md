# Plan de trabajo: placa de aprendizaje ESP32

Fecha inicial: 2026-10-31, America/Bogota.
Estado actual: P17a, P11/P07 y P17b validadas funcionalmente en protoboard. Conexiones y bloques lógicos consolidados para el conjunto actual; consumo diferido. Esquemático/PCB en chat exclusivo después de validar todos los sensores. No es un diseño listo para fabricar.

## Objetivo y alcance actual

Desarrollar una plataforma de aprendizaje, empezando con una DevKit ESP-WROOM-32 de 30 pines y módulos comerciales. Evolución prevista: protoboard, baquela, PCB y después integración de los circuitos actualmente presentes en módulos. Usar Arduino IDE para firmware, EasyEDA inicialmente y KiCad después.

El firmware P17b está validado en protoboard: cinco ciclos normales, veinte registros y pruebas de ausencia/recuperación correctas. El consumo dormido y la alimentación conmutada se medirán/estudiarán después. Ahora se mantienen únicamente la tabla de conexiones y el diagrama lógico; el esquemático y PCB se harán en otro chat tras validar todos los componentes previstos.

## Método: un componente por vez

Para cada componente repetir esta secuencia:

1. Identificar módulo, interfaz, alimentación, niveles y referencia técnica. Revisar el script previo si existe.
2. Definir la práctica, sus conexiones provisionales, GPIO y recursos utilizados. Verificar compatibilidad con los bloques ya validados.
3. Preparar un script mínimo de ese componente con configuración centralizada. Compilar para la placa y versión del core registradas.
4. El usuario conecta y prueba en protoboard. Registrar medidas, salida serie, condiciones y errores reales. La compilación no demuestra funcionamiento físico.
5. Corregir y repetir hasta satisfacer los criterios de aceptación de esa práctica.
6. Incorporar el bloque validado a la tabla de conexiones, señalando pendientes eléctricos. Actualizar Archify únicamente por indicación expresa del usuario después de validar la nueva prueba. El esquema CAD y PCB se posponen hasta terminar todos los sensores y se desarrollan en un chat exclusivo, según instrucción del usuario del 2026-11-02.
7. Actualizar documentación, pinout provisional y bitácora. Revisar el resultado con el usuario antes de comenzar el siguiente componente.

Cada práctica conserva un ejemplo reproducible. Los componentes se organizan en `.h`/`.cpp` y el `.ino` coordina la práctica seleccionada. La tabla crece con las validaciones; el diagrama Archify solo cambia por indicación expresa del usuario después de validar una nueva prueba; EasyEDA y el esquema se abordarán al terminar todos los sensores previstos en un chat exclusivo.

## Situación conocida

| Elemento | Información disponible | Pendiente |
|---|---|---|
| ESP32 | DevKit ESP-WROOM-32, 30 pines; core 3.3.12 y compilación ESP32 Dev Module | Fabricante/modelo concreto, regulador, dimensiones y correspondencia física de contactos |
| Firmware | P17a/P11/P07/P17b validadas; CSV y deep sleep básico, cinco ciclos normales | Validar los demás sensores; consumo y optimización diferidos |
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

En cada fila, el cierre de práctica incluye firmware, prueba física, tabla y bitácora; el diagrama Archify requiere indicación expresa del usuario tras validar la prueba; CAD es una etapa posterior separada. El orden no obliga a comprar todo ahora. Si falta un componente, se deja pendiente y se acuerda otra práctica disponible.

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

## Plan complementario: registro GPIO y visor técnico local

El desarrollo del visor se detalla en [su plan de cuatro fases](../visor-gpio/docs/plan-chat-registro-gpio.md), separado de las prácticas de firmware. Tecnología acordada: HTML, CSS y JavaScript local; asignaciones editables, referencia técnica original, consulta de PDF locales y respaldo JSON. Solo incorporar software/recursos con licencias abiertas compatibles verificadas; la documentación externa sin ese permiso se enlaza y no se redistribuye. Seguimiento en la sección específica de `todo.md`. Esta planificación no cambia prioridades ni validaciones pendientes del hardware.

Continuación del visor (2026-10-31): el usuario solicita proyectos independientes y autoriza comenzar Fase 1. Preparados contrato, registro inicial/plantilla y documentación/licencias de alcance delimitado; ver [pruebas de revisión](../visor-gpio/docs/gpio/uso-y-verificacion.md). Fase 2 añadirá operaciones de proyectos y edición, Fase 3 persistencia por colección/proyecto. Entrega local pendiente de revisión; no cambia las prácticas de firmware ni autoriza publicación.

## Entrega local del visor GPIO — fases 2–4

Usuario autoriza completar fases 2–4 y revisar al terminar, manteniendo publicación condicionada a aprobación. Implementados proyectos, edición, referencia/PDF, autoguardado y respaldo JSON. Documentación separada: [Fase 2](../visor-gpio/docs/gpio/fase-2-visor.md), [Fase 3](../visor-gpio/docs/gpio/fase-3-persistencia.md), [Fase 4](../visor-gpio/docs/gpio/fase-4-verificacion.md). [Uso y pruebas](../visor-gpio/docs/gpio/uso-y-verificacion.md); abrir `visor-gpio/tools/gpio/index.html` localmente. Este incremento no modifica prácticas, firmware ni resultados de hardware.

Revisión posterior del visor (2026-10-31): placa visual y ventana rápida al seleccionar GPIO, conservando modo avanzado, proyectos y respaldos. Refinamiento de Fases 2/4, documentado en [revisión de placa](../visor-gpio/docs/gpio/revision-placa-visual.md). Sin cambios de firmware ni publicación.

## 2026-11-02 — Consolidación local del visor

Publicado en `dev` como `visor-gpio/` (`c4f1bca`). Por solicitud del usuario se retiran las copias antiguas de la raíz, conservando respaldo externo y actualizando enlaces locales. La carpeta definitiva coincide con la publicada; esta limpieza no publica cambios adicionales.

## Actualización 2026-11-02 — Prueba DHT11/OLED

- P17a: captura con cuatro registros y confirmación de fallo esperado al arrancar con tarjeta retirada. No se interpreta ese log como un fallo con tarjeta insertada.
- Siguiente incremento autorizado: P11/P07 DHT11/OLED, sin guardar todavía mediciones en SD. Selector de práctica en Config.h conserva P17a. Ver `docs/practicas/P11-P07-dht11-oled.md`.
- Conexiones provisionales: DHT DATA4, OLED SDA21/SCL22; se conservan CS13/SCK18/MISO19/MOSI23 para SD. La definición del conjunto definitivo y el esquemático siguen después de la validación física.
- El visor GPIO permanece en su chat/carpeta propios; no se modifica desde este incremento. No hacer commit ni publicar sin autorización.

## Actualización 2026-11-02 — CSV y sueño básico

Usuario confirma ausencia de OLED y espera inicial, completando los casos funcionales informados de P11/P07. Autoriza continuar con cuatro intentos cada 5 s, ventana nominal de 20 s y deep sleep 60 s. Se implementa P17b manteniendo los GPIO provisionales y tres selecciones de práctica; ver `docs/practicas/P17b-csv-deep-sleep.md`.

El usuario acuerda pulir después el sueño/consumo y estudiar corte de alimentación por load switch/MOSFET. No se añaden esos circuitos ni GPIO de habilitación ahora. Compilaciones correctas; CSV real, despertar, temporización y consumo deben probarse en protoboard. Esquemático y pinout definitivo siguen pendientes; no se modifica el visor desde este chat y no se publica sin autorización.

## Validación de P17b — 2026-11-02

Usuario confirma todo el plan físico correcto: cinco ciclos normales y captura con veinte filas y cabecera única. El log demuestra cuatro intentos aun sin módulos, despertar por temporizador y disponibilidad de DHT, OLED y SD en ciclos posteriores. La práctica funcional queda validada; consumo, alimentación conmutada, pinout definitivo, esquemático y PCB siguen pendientes. Evidencia y detalles en la ficha P17b. Este reporte no autoriza commit ni publicación.

## Secuencia acordada para hardware — 2026-11-02

El usuario limita el trabajo actual a [tabla de conexiones](../hardware/conexiones-rev-a.md) y [diagrama lógico](../hardware/diagrama-bloques-rev-a.html). MicroSD CS queda en GPIO13, no GPIO5; SPI restante 18/19/23, DHT DATA4 y OLED SDA21/SCL22. La tabla se amplía conforme se validen los demás componentes; Archify solo se actualiza cuando el usuario lo indica expresamente después de validar la nueva prueba.

EasyEDA, diseño de esquemático y PCB quedan para el final de la verificación/validación de todos los sensores previstos, en un chat exclusivo. Esta instrucción posterior sustituye recomendaciones anteriores de empezar la captura CAD ahora. La medición de consumo y la alimentación conmutada también quedan pendientes; no bloquean la publicación del firmware funcional ya validado, autorizada expresamente por el usuario en este turno.

## Adopción de Archify — 2026-11-02

El diagrama vigente es el HTML de Archify, con su fuente JSON editable. Solo actualizarlo por indicación expresa del usuario y después de validar una nueva prueba; la validación no autoriza por sí sola regenerarlo. Publicar requiere autorización expresa para cada incremento. El HTML reemplaza al diagrama Mermaid anterior, que se retira; conservar el JSON editable. Ver [uso, revisión y regeneración](../hardware/README.md).

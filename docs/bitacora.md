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

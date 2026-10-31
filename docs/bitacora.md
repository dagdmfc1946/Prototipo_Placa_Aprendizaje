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

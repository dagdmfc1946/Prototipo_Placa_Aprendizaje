# Prototipo de placa de aprendizaje ESP32

Desarrollo gradual de una plataforma educativa con ESP-WROOM-32 DevKit de 30 pines, Arduino IDE y periféricos. Se validará un componente por vez en protoboard, se añadirá su bloque al esquemático y después se avanzará a baquela y PCB.

## Estado

Primera práctica implementada y compilada: **P17a, MicroSD independiente**. El sketch agrega y verifica un registro por arranque. Objetivo: Arduino-ESP32 3.3.12, ESP32 Dev Module. Pendiente de prueba física; pinout provisional. DHT11 y OLED se integrarán después de validar esta etapa.

## Documentación

- [Prueba P17a: MicroSD](docs/practicas/P17a-microsd.md): cableado, carga, resultados esperados y verificación de compilación.
- [Plan de trabajo](tasks/plan.md): alcance, secuencia, pendientes y fuentes.
- [Seguimiento](tasks/todo.md): prácticas y puntos de revisión.
- [Bitácora](docs/bitacora.md): trabajo realizado y plantilla de registro.
- [Revisión de ejemplos y primera prueba](docs/revision-ejemplos-y-primera-prueba.md): hallazgos, organización modular y preparación de DHT11 + OLED + MicroSD.
- [Instrucciones de colaboración](AGENTS.md): uso de Agent Skills y criterios de validación.

## Forma de trabajo

Identificar módulo → revisar ejemplo existente → preparar un script → compilar → probar en protoboard → registrar resultados → añadir bloque al esquemático → revisar antes del siguiente componente.

Firmware dentro de `esp32_Project/`. Las fichas de prácticas y proyectos EDA se crearán cuando comience la etapa correspondiente. La futura integración de circuitos sin módulos es una revisión posterior.

## Primera prueba

1. Revisar la ficha P17a y comprobar alimentación y señales de la MicroSD antes de conectar.
2. Seleccionar core Arduino-ESP32 3.3.12 y la placa ESP32 correspondiente; no se requieren librerías adicionales para P17a.
3. Abrir `esp32_Project/esp32_Project.ino` en Arduino IDE y seleccionar placa/puerto para esta prueba.
4. Usar Verificar/Subir y conservar resultado de compilación y prueba en la ficha de práctica.

Compilación comprobada con Arduino CLI 1.5.1 y FQBN `esp32:esp32:esp32`. El comando para repetirla figura en la ficha P17a. La validación de hardware la realiza el usuario en protoboard.

## Git

Rama solicitada de trabajo: `dev`. Mantener cambios pequeños y descriptivos. Revisar el diff antes de cada commit. No versionar credenciales, coordenadas personales ni salidas de compilación. Guardar los archivos editables del hardware, no solo imágenes o Gerbers.

# Prototipo de placa de aprendizaje ESP32

Desarrollo gradual de una plataforma educativa con ESP-WROOM-32 DevKit de 30 pines, Arduino IDE y periféricos. Se validará un componente por vez en protoboard, se añadirá su bloque al esquemático y después se avanzará a baquela y PCB.

## Estado

Planificación inicial. `esp32_Project/esp32_Project.ino` contiene la plantilla original; todavía no hay firmware funcional validado ni pinout definitivo. Los ejemplos previos del usuario se revisarán antes de implementar las prácticas.

## Documentación

- [Plan de trabajo](tasks/plan.md): alcance, secuencia, pendientes y fuentes.
- [Seguimiento](tasks/todo.md): prácticas y puntos de revisión.
- [Bitácora](docs/bitacora.md): trabajo realizado y plantilla de registro.
- [Revisión de ejemplos y primera prueba](docs/revision-ejemplos-y-primera-prueba.md): hallazgos, organización modular y preparación de DHT11 + OLED + MicroSD.
- [Instrucciones de colaboración](AGENTS.md): uso de Agent Skills y criterios de validación.

## Forma de trabajo

Identificar módulo → revisar ejemplo existente → preparar un script → compilar → probar en protoboard → registrar resultados → añadir bloque al esquemático → revisar antes del siguiente componente.

Firmware dentro de `esp32_Project/`. Las fichas de prácticas y proyectos EDA se crearán cuando comience la etapa correspondiente. La futura integración de circuitos sin módulos es una revisión posterior.

## Inicio previsto

1. Revisar el plan y proporcionar los scripts previos.
2. Registrar placa, versión de Arduino IDE, core Arduino-ESP32 y bibliotecas.
3. Abrir `esp32_Project/esp32_Project.ino` en Arduino IDE y seleccionar placa/puerto cuando se inicie P01.
4. Usar Verificar/Subir y conservar resultado de compilación y prueba en la ficha de práctica.

Arduino CLI no está verificado en este entorno; no se publica un comando de compilación como si estuviera probado. Registrar FQBN y comando reproducible cuando se configure la herramienta.

## Git

Rama solicitada de trabajo: `dev`. Mantener cambios pequeños y descriptivos. Revisar el diff antes de cada commit. No versionar credenciales, coordenadas personales ni salidas de compilación. Guardar los archivos editables del hardware, no solo imágenes o Gerbers.

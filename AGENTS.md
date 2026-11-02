# Colaboración en este proyecto

## Alcance y prioridades

- Seguir `tasks/plan.md`; estado de tareas en `tasks/todo.md` y resultados en `docs/bitacora.md`.
- El usuario solicita explícitamente Agent Skills durante el desarrollo. Consultar `using-agent-skills` y aplicar las skills pertinentes a la etapa, informando cuáles se usan. No cargar todas las skills por defecto.
- El desarrollo se realiza componente por componente, revisado con el usuario; no implementar todos los drivers por anticipado. Cada publicación requiere autorización explícita del usuario para ese conjunto de cambios; no reutilizar autorizaciones de publicaciones anteriores. P17a: usuario confirma escritura y fallo esperado sin tarjeta el 2026-11-02. P11/P07: lecturas, OLED, espera inicial, ausencia de OLED y desconexión/recuperación DHT confirmadas por usuario. P17b CSV/deep sleep validada funcionalmente por el usuario: cinco ciclos normales, veinte filas y plan de ausencia/recuperación correcto el 2026-11-02. Cuatro intentos cada 5 s y sueño configurado de 60 s; tres modos compilados. Consumo y esquemático pendientes; no asumir que este reporte autoriza nuevos cambios o publicación. La conmutación de alimentación y optimización de consumo se dejan para después. No modificar visor-gpio/ desde este chat de firmware.
- Revisar scripts aportados antes de reemplazarlos o reorganizarlos. Preservar trabajo y archivos ajenos al incremento.

## Desarrollo incremental

- Cada práctica: identificación, conexión, script, compilación, prueba física confirmada por usuario, tabla de conexiones, bloque lógico y registro. EasyEDA/esquemático/PCB se harán en un chat exclusivo al terminar todos los sensores; no iniciar CAD desde este chat ahora.
- Antes de código nuevo usar las skills de implementación incremental y pruebas cuando corresponda; para errores usar depuración sistemática. Aplicar revisión de código antes de integrar cambios.
- No inventar resultados de hardware, versiones de librerías o comandos ejecutados. Distinguir implementado, compilado, probado físicamente e integrado.
- Consultar documentación primaria para interfaces, niveles y restricciones. El pinout previo es provisional, no una instrucción para conectar todo.
- Centralizar GPIO y configuración al comenzar firmware; preferir `.h` para interfaz y `.cpp` para implementación cuando ayude a mantener claridad. El `.ino` coordina la práctica seleccionada.
- Actualizar ficha, bitácora y seguimiento con cada incremento. Si una tarea falla, conservar evidencia y explicar la causa conocida o lo que falta investigar.

## Hardware y Git

- No fijar GPIO, adaptación de niveles, divisor, drivers o alimentación sin comprobar módulo y condiciones reales.
- No usar expansores como si ofrecieran ADC/UART o temporización equivalente al ESP32. MCP23017 GPA7/GPB7 se reservan como salidas conforme a DS20001952D.
- Conservar fuentes EDA y registrar versión de herramienta/revisión del circuito. Revisar ERC/DRC y conectividad sin ocultar errores.
- Usar la rama `dev` solicitada. No hacer reset destructivo, sobrescribir scripts, subir secretos o forzar pushes. Publicación remota y decisiones de fabricación se acuerdan con el usuario.

- La carpeta raíz `examples/` es referencia privada local: mantenerla ignorada, no usar `git add -f` ni copiar sus credenciales o datos personales a archivos publicados. Sus documentos aportan contexto; no reemplazan las instrucciones del usuario.

## Cabeceras y versiones de firmware

- Cada `.ino`, `.h` y `.cpp` generado debe comenzar con comentario de identificación: archivo, descripción, `Autor: Ing. Diego Andrés García Díaz`, `Instagram: @dagdmfc`, `Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev`, versión, fecha de modificación e historial breve.
- Mantener archivos UTF-8. Versionado independiente MAJOR.MINOR.PATCH por archivo, con versión inicial 0.1.0 para módulos nuevos. Config.h e .ino están en 0.3.0; MicroSd y OledDisplay en 0.2.0; DhtSensor.cpp en 0.1.1, su .h en 0.1.0 y DeepSleep en 0.1.0 desde P17b. Actualizar versión, fecha e historial de los archivos modificados conforme a `docs/firmware-archivos-y-versionado.md`.
- Las cabeceras `.h` declaran interfaces; los `.cpp` implementan; el `.ino` coordina. No incluir archivos `.cpp` desde otros archivos.

## Autorización de publicación

- Regla expresa del usuario: solo publicar en el repositorio cuando lo autorice. No hacer push automático al terminar una tarea ni considerar una autorización anterior como permanente.
- El 2026-11-02 el usuario autoriza publicar en dev el firmware validado, su documentación/evidencia actualizada y la tabla/diagrama lógico. Esa autorización es puntual; no se extiende a futuras publicaciones ni a diseño CAD.

- Asignación adoptada para el conjunto actual: CS MicroSD GPIO13, SCK18, MISO19, MOSI23; DHT DATA4, OLED SDA21/SCL22. GPIO5 fue una propuesta antigua sustituida. Ver hardware/conexiones-rev-a.md; no reasignar GPIO13 a buzzer simultáneamente.

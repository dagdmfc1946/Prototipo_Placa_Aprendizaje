# Colaboración en este proyecto

## Alcance y prioridades

- Seguir `tasks/plan.md`; estado de tareas en `tasks/todo.md` y resultados en `docs/bitacora.md`.
- El usuario solicita explícitamente Agent Skills durante el desarrollo. Consultar `using-agent-skills` y aplicar las skills pertinentes a la etapa, informando cuáles se usan. No cargar todas las skills por defecto.
- El desarrollo se realiza componente por componente, revisado con el usuario; no implementar todos los drivers por anticipado. La publicación en `dev` fue autorizada el 2026-10-31. La siguiente práctica propuesta es DHT11 + OLED + MicroSD, tras revisar ejemplos y conexiones.
- Revisar scripts aportados antes de reemplazarlos o reorganizarlos. Preservar trabajo y archivos ajenos al incremento.

## Desarrollo incremental

- Cada práctica: identificación, conexión provisional, script, compilación, prueba física confirmada por el usuario, bloque de esquemático y registro.
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

# Seguimiento de trabajo

Estado inicial: 2026-10-31. Este archivo es la lista de tareas del proyecto.

## Preparación

- [x] Revisar plan previo y estado inicial del `.ino`.
- [x] Redactar propuesta de trabajo gradual y bitácora.
- [x] Ajustar prioridades con el usuario: SD → DHT/OLED → CSV/sueño; consumo diferido y CAD al final en chat exclusivo.
- [x] Revisar referencias disponibles de DHT, OLED, batería y GPS, conservándolas privadas e intactas.
- [ ] Leer `TemHum_IA_resumen_chat.md` cuando esté disponible; no encontrado en esta revisión.
- [x] Registrar DATA DHT11=GPIO4, OLED según ejemplo y core Arduino-ESP32 3.3.12.
- [x] Preparar y compilar P17a: prueba MicroSD independiente con CS provisional en GPIO13.
- [x] Registrar evidencia física P17a: captura con cuatro líneas y confirmación de error esperado al retirar tarjeta (2026-11-02).
- [x] Implementar DHT11/OLED como práctica seleccionable, con estado de error explícito; compilar ambos modos, incluido SD sin librerías externas (2026-11-02).
- [x] Registrar lecturas DHT por consola y presentación correcta en OLED, confirmadas por usuario (2026-11-02).
- [x] Confirmar desconexión/reconexión intencional del DHT y documentar errores y recuperación (2026-11-02).
- [x] Registrar detección de OLED ausente y espera inicial, confirmadas por usuario (2026-11-02).
- [x] Implementar y compilar P17b: CSV, cuatro intentos y deep sleep 60 s; conservar tres modos.
- [x] Validar P17b físicamente: usuario confirma cinco ciclos, veinte filas, cabecera única, temporizador y plan de ausencia/recuperación completo (2026-11-02).
- [x] Consolidar conexiones verificadas y diagrama lógico; CS MicroSD adoptado en GPIO13.
- [ ] Completar verificación/validación de los demás sensores y actualizar tabla/bloques.
- [ ] Abordar esquemático/PCB en chat exclusivo después de validar todos los sensores; EasyEDA diferido.
- [ ] Medir consumo del montaje; alimentación conmutada y optimización de sueño quedan para después.

## Prácticas

Para cada práctica se crea una ficha en `docs/practicas/` al iniciarla. Ver resultados y dependencias en [plan](plan.md). Tamaño objetivo: componente, script, ficha y actualización de tabla/diagrama lógico. Por instrucción del usuario, esquema/PCB quedan para una etapa posterior en otro chat.

Marcar cada práctica tras identificación → conexión → script → compilación → prueba física → tabla/diagrama lógico → bitácora. El CAD ya no se exige para cerrar cada práctica individual: el usuario lo ha pospuesto expresamente hasta finalizar todos los sensores. No se eliminan las comprobaciones físicas.

- [ ] P00: inventario y entorno.
- [x] P01: arranque y consola, probados con P17a/P11/P07/P17b.
- [ ] P02: LED y PWM.
- [ ] P03: pulsadores y final de carrera; dividir si necesitan validaciones distintas.
- [ ] P04: potenciómetro.
- [ ] P05: batería y divisor; comparar con multímetro y script previo.
- [ ] P06: LDR.
- [x] P07: OLED y bus I²C, validación funcional y ausencia/recuperación documentadas.
- [ ] P08: LCD I²C.
- [ ] P09: Tiny RTC.
- [ ] P10: display de cuatro dígitos.
- [x] P11: DHT, validación funcional y desconexión/recuperación documentadas.
- [ ] P12: ultrasonido.
- [ ] P13: receptor IR.
- [ ] P14: buzzer.
- [ ] P15a: primer relé y alimentación asociada.
- [ ] P15b: segundo relé y coexistencia.
- [ ] P16: expansor I/O, después de comparar y adquirirlo.
- [x] P17: MicroSD, prueba independiente y CSV/sueño con cinco ciclos validados; esquema posterior.
- [ ] P18: PmodGPS.
- [ ] P19: RS485 con segundo extremo.

## Puntos de revisión

- [ ] Completar P00: identificación física exacta de placa/módulos; core, compilación y carga ya comprobados.
- [ ] Tras primeras entradas y ADC: revisar pinout provisional y calidad de medidas.
- [ ] Tras primeras prácticas I²C: comprobar direcciones, niveles y pull-ups al compartir bus.
- [ ] Antes de integrar UART: comprobar recursos para consola, GPS y RS485.
- [ ] Antes de baquela: pruebas conjuntas, GPIO sin conflictos y arranque validado.
- [ ] Antes de PCB: alimentación, mecánica, esquema y footprints revisados; ERC/DRC evaluados y resueltos.
- [ ] Antes de integración sin módulos: definir módulo WROOM soldado frente a SoC desnudo y alcance de la revisión.

Las fases de integración/baquela/PCB se desglosarán cuando haya bloques probados. No se asignan fechas de fabricación ni compras antes de conocer sus resultados.

## Registro GPIO y visor técnico local

Plan y criterios de aceptación: [cuatro fases](../visor-gpio/docs/plan-chat-registro-gpio.md). Estas tareas no sustituyen las prácticas de firmware.

- [x] Acordar HTML/CSS/JS, edición de GPIO, consulta técnica y requisito de recursos abiertos; registrar el plan de cuatro fases.
- [x] Fase 1 (entrega técnica local): registro contrastado, contrato multiproyecto, perfil técnico, plantilla independiente, guía original, inventario/licencias y seis comprobaciones de datos.
- [x] Usuario autoriza avanzar a Fase 2 y completar Fases 3–4; revisará el conjunto al finalizar. Publicación requiere autorización específica.
- [x] Fase 2: proyectos independientes, mapa/tabla editable, fichas/guía técnica, conflictos, traslado y PDF local con apertura alternativa; pruebas y entrega documentadas.
- [x] Fase 3: autoguardado y copia anterior, JSON individual/completo validado, recuperación, límites, colisiones y conflicto entre pestañas; pruebas y entrega documentadas.
- [x] Fase 4 técnica: verificaciones de navegador/teclado/sin conexión, revisión visual a cuatro tamaños, auditoría de recursos/licencias e instrucciones por fase.
- [x] Publicación del visor autorizada y completada en `dev`, carpeta `visor-gpio/`, commit `c4f1bca`. Nuevos incrementos requieren autorización propia.

El usuario autorizó completar las fases con documentación separada y revisará el conjunto al finalizar. No modificar firmware ni declarar pruebas físicas desde el visor. Sin commit/push/despliegue sin autorización específica.

## Refinamiento del visor — placa y ventana de conexión

- [x] Placa SVG original de referencia con 30 contactos e indicadores de uso/precaución separados; sin redistribuir imágenes ajenas.
- [x] Ventana rápida: ocupar/liberar/reservar y nombre de conexión, características por GPIO, avanzado plegado y protección de buses compartidos.
- [x] Extender pruebas de disposición e interacción; conservar recorridos de proyectos, persistencia, JSON y PDF; registrar resultados finales en bitácora.
- [x] Usuario autoriza publicar la revisión de placa junto con el visor; incluida en `c4f1bca`.

- [x] 2026-11-02: consolidar la única copia definitiva en `visor-gpio/`, respaldar copias anteriores fuera del repo y corregir enlaces locales.

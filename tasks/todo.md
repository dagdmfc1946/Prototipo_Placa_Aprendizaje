# Seguimiento de trabajo

Estado inicial: 2026-10-31. Este archivo es la lista de tareas del proyecto.

## Preparación

- [x] Revisar plan previo y estado inicial del `.ino`.
- [x] Redactar propuesta de trabajo gradual y bitácora.
- [ ] Revisar el plan con el usuario y ajustar prioridades.
- [ ] Recibir e inventariar scripts previos sin sobrescribirlos.

## Prácticas

Para cada práctica se crea una ficha en `docs/practicas/` al iniciarla. Ver resultado verificable y dependencias en [plan](plan.md). Tamaño objetivo: un componente, su script, ficha y bloque de esquemático por incremento. Si excede ese alcance, dividir la práctica.

Marcar cada fila solo tras completar su ciclo: identificación → conexión provisional → script → compilación → prueba física → esquemático → bitácora. La ausencia de hardware o resultados deja la práctica pendiente.

- [ ] P00: inventario y entorno.
- [ ] P01: arranque y consola.
- [ ] P02: LED y PWM.
- [ ] P03: pulsadores y final de carrera; dividir si necesitan validaciones distintas.
- [ ] P04: potenciómetro.
- [ ] P05: batería y divisor; comparar con multímetro y script previo.
- [ ] P06: LDR.
- [ ] P07: OLED y bus I²C.
- [ ] P08: LCD I²C.
- [ ] P09: Tiny RTC.
- [ ] P10: display de cuatro dígitos.
- [ ] P11: DHT.
- [ ] P12: ultrasonido.
- [ ] P13: receptor IR.
- [ ] P14: buzzer.
- [ ] P15a: primer relé y alimentación asociada.
- [ ] P15b: segundo relé y coexistencia.
- [ ] P16: expansor I/O, después de comparar y adquirirlo.
- [ ] P17: MicroSD.
- [ ] P18: PmodGPS.
- [ ] P19: RS485 con segundo extremo.

## Puntos de revisión

- [ ] Tras P00/P01: entorno reproducible, placa identificada y carga funcionando.
- [ ] Tras primeras entradas y ADC: revisar pinout provisional y calidad de medidas.
- [ ] Tras primeras prácticas I²C: comprobar direcciones, niveles y pull-ups al compartir bus.
- [ ] Antes de integrar UART: comprobar recursos para consola, GPS y RS485.
- [ ] Antes de baquela: pruebas conjuntas, GPIO sin conflictos y arranque validado.
- [ ] Antes de PCB: alimentación, mecánica, esquema y footprints revisados; ERC/DRC evaluados y resueltos.
- [ ] Antes de integración sin módulos: definir módulo WROOM soldado frente a SoC desnudo y alcance de la revisión.

Las fases de integración/baquela/PCB se desglosarán cuando haya bloques probados. No se asignan fechas de fabricación ni compras antes de conocer sus resultados.

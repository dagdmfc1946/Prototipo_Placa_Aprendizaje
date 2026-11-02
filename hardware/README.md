# Hardware — conexiones y bloques lógicos

Revisión lógica A, 2026-11-02. El conjunto ESP32 DevKit + DHT11 + OLED + MicroSD está validado funcionalmente en protoboard mediante P17b.

- [Tabla de conexiones adoptadas](conexiones-rev-a.md): señales verificadas, reservas y CS de MicroSD en GPIO13.
- [Diagrama lógico de bloques](diagrama-bloques-rev-a.md): relaciones del conjunto validado.
- [Evidencia funcional P17b](../docs/practicas/P17b-csv-deep-sleep.md): cinco ciclos normales y pruebas de ausencia/recuperación.

Este directorio contiene únicamente documentación lógica. Se ampliará conforme se verifique cada sensor o componente; no contiene un esquemático eléctrico nativo, footprints ni PCB.

Por instrucción del usuario, EasyEDA, el diseño de esquemático y la PCB se abordarán al terminar la verificación/validación de todos los sensores previstos, en un chat exclusivo. La medición de consumo y la alimentación conmutada también quedan para después.

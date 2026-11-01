# Verificación del paquete para publicación

Fecha: 2026-10-31 (America/Bogota). Versión: 0.1.0.
Autor: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev/visor-gpio
SPDX-License-Identifier: CC-BY-4.0.

- 24/24 pruebas Node aprobadas desde `visor-gpio/` dentro del repositorio real.
- 6/6 recorridos de navegador aprobados en Chrome 156 y 6/6 en Edge 156, con perfiles temporales y red simulada desconectada.
- Adaptador de JSON/guía coincidente; fuentes y enlaces locales revisados.
- JSON inicial y plantilla intactos; esquema y claves de almacenamiento sin cambios.
- Archivos locales originales, firmware, documentos globales y versión anterior conservados por SHA-256.
- Revisión de procedencia/licencias y búsqueda de patrones de credenciales antes del commit. Sin contenido de `examples/` ni paquetes de dependencias.

La prueba de Config.h consulta el repositorio padre; no se incluye ni modifica firmware. Los proyectos guardados en la ruta anterior se transfieren mediante JSON, siguiendo el README. Estas pruebas no confirman el cableado ni el pinout físico de la unidad.

El usuario autoriza publicar únicamente esta carpeta en `dev`. El commit y su confirmación remota identifican la publicación; no se despliega un sitio web.

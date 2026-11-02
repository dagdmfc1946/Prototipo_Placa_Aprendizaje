# Hardware — conexiones y diagrama lógico

Revisión lógica A. Diagrama versión 0.1.0, 2026-11-02. Conjunto ESP32 DevKit + DHT11 + OLED + microSD validado funcionalmente en protoboard mediante P17b; CS microSD en GPIO13.

- [Tabla de conexiones adoptadas](conexiones-rev-a.md).
- [Diagrama lógico interactivo Archify](diagrama-bloques-rev-a.html): documento visual vigente.
- [Fuente editable Archify](diagrama-bloques-rev-a.archify.json): topología, GPIO, posiciones, notas y referencias.
- [Validación P17b](../docs/practicas/P17b-csv-deep-sleep.md): cinco ciclos normales y pruebas de ausencia/recuperación.

## Abrir el diagrama

Abrir `diagrama-bloques-rev-a.html` en un navegador desde la copia local. Desde GitHub, descargar el archivo HTML y abrirlo: la vista del archivo en GitHub muestra su código y no ejecuta el diagrama. El HTML es autónomo; no necesita servidor ni instalar Archify para consultarlo. Ofrece exploración de conexiones, temas y exportación.

El anterior diagrama Mermaid `.md` fue retirado por solicitud del usuario; su historial permanece en Git. No mantener dos diagramas vigentes en paralelo.

## Regla de actualización

Actualizar el diagrama únicamente cuando el usuario lo indique expresamente y después de verificar/validar una nueva prueba. La validación por sí sola no autoriza regenerarlo. Actualizar la tabla o el firmware tampoco autoriza cambiar automáticamente el diagrama. Publicar cada incremento requiere autorización expresa independiente.

Conservar HTML y JSON juntos en cada revisión. Al autorizar una actualización, contrastar GPIO y relaciones con la tabla y práctica validada; actualizar fuentes, revisión, versión, fecha e historial; regenerar con Archify y pasar sus verificaciones. No editar a mano el HTML generado. .gitattributes lo identifica como generado y permite los espacios finales propios de su plantilla, conservando los bytes verificados. Archify está instalada globalmente para Codex, pero solo se usa cuando el usuario lo indica.

## Regeneración autorizada

Requiere Node.js y Archify. Desde la raíz del repositorio, en PowerShell, reemplazar las rutas de instalación y evidencia por las de la máquina. La carpeta de evidencia debe estar fuera del repositorio; usar una nueva por revisión.

```powershell
node 'C:/Users/Diego/.codex/skills/archify/bin/archify.mjs' finalize architecture `
  hardware/diagrama-bloques-rev-a.archify.json `
  hardware/diagrama-bloques-rev-a.html `
  --repo-root . --quality showcase --out-dir 'C:/ruta-local/evidencia-archify/revision-nueva' --json
```

Las fuentes están fijadas al commit `c46442f619883422caaa5bd3ce2ea6a162f5bbf5`. El origen SSH utiliza referencias de evidencia `local-only`; no se presentan como enlaces web a archivos actuales. Al revisar la topología, fijar las fuentes a un commit que contenga la nueva prueba validada. Los recibos de validación/navegador y capturas de trabajo se conservan localmente, fuera del repositorio. Los metadatos auxiliares de entrega que Archify crea junto al HTML quedan ignorados por Git; se publican el HTML generado y verificado y su JSON editable.

## Alcance y versiones

Diagrama funcional, sin números de contacto, pasivos, footprints ni layout. Los módulos permanecen alimentados durante el sueño; consumo y alimentación conmutada siguen pendientes. EasyEDA, esquemático y PCB se abordarán después de validar todos los sensores/componentes previstos, en un chat exclusivo.

- 0.1.0 — 2026-11-02: adopción de Archify 3.2.0 como único diagrama vigente. Se conservan los seis bloques, conexiones y GPIO de la revisión A; se sustituye su representación Mermaid. Validación automática de esquema, artefacto y navegador aprobada. Sin cambios de firmware ni nuevas afirmaciones de validación física.

Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc · [Repositorio](https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev).

El HTML incluye runtime y plantillas de [Archify](https://github.com/tt-a1i/archify). Se conservan sus [avisos](licencias-archify/NOTICE), [licencia Apache-2.0](licencias-archify/LICENSE) y [licencia MIT histórica](licencias-archify/LICENSE-MIT).

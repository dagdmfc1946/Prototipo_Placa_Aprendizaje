# Diseño del banco GPIO

Versión: 0.2.0. Fecha: 2026-10-31.
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Ver ../../docs/gpio/LICENCIAS.md.

## Trabajo principal

Reconocer el proyecto activo, seleccionar un pin, entender sus restricciones y editar su asignación sin confundir un registro con una medición. Acción principal de la ventana: «Guardar cambios». Proyecto activo y estado de guardado permanecen al comienzo; respaldos explícitos en la misma zona.

## Composición y lenguaje visual

Diseño original: cabecera oscura, superficie clara, verde de circuito para selección/acciones y ocre para precauciones. Tipografía del sistema; monoespaciada del sistema para números de pin. Sin descargas de fuentes, imágenes externas, plantillas, logotipos ajenos ni librerías de iconos.

UI UX Pro Max se consultó para orientación de densidad, jerarquía, foco, contraste y controles. Su catálogo devolvió estilo funcional tipo Swiss y paleta industrial, adecuados como orientación; la propuesta de hero/CTA comercial no correspondía a esta herramienta y se descartó. Se diseñó una composición propia de banco, no se copiaron layouts ni activos del catálogo. No se guardó una salida automática como diseño aprobado.

Placa SVG original en el centro, botones junto a sus 30 contactos y ventana al seleccionar. Vista de referencia superior con USB abajo, sin confirmar la unidad. Estado de ocupación y marcador técnico separados. La tarea rápida muestra libre/ocupado/reservado, nombre y uso; el formulario de buses/evidencia permanece en avanzado. La tabla es alternativa. En móvil la placa mantiene escala y desplazamiento contenido; la ventana se adapta al ancho y conserva foco y teclado. Las imágenes del usuario se consultaron como referencia, sin incorporarlas como activos.

## Estados obligatorios

Libre/asignado/reservado con texto y color. Conexión y prueba separadas. Borrador sin aplicar, cancelación, error de datos, confirmación de descarte, guardado correcto, almacenamiento bloqueado, conflicto entre pestañas, filtro vacío y PDF no válido tienen mensajes propios. Las advertencias técnicas no se editan como notas personales.

Controles nativos con etiquetas visibles, foco destacado, diálogos nativos con Escape/cancelar, región de estado y error anunciado. Altura de controles y desplegables de al menos 44 px; no dependen de hover. Movimiento mínimo y respeto de `prefers-reduced-motion`.

## Verificación visual

Revisar capturas reales y recorridos a 320, 768, 1024 y 1440 px, sin desbordamiento global. Tabla con desplazamiento contenido si es necesario. Mantener legibles nombres largos y controles sin truncar su nombre accesible. Ver informe de Fase 4 en docs/gpio/fase-4-verificacion.md.

Historial: 0.1.0 (2026-10-31): contrato visual e interacción original.

0.2.0 (2026-10-31): placa visual, indicadores independientes, ventana rápida y controles avanzados plegados; SVG propio bajo MIT.

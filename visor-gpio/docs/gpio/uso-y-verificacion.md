# Uso del visor y pruebas por fases

Versión: 0.3.1. Fecha: 2026-10-31 (America/Bogota).
Autor del proyecto: Ing. Diego Andrés García Díaz · Instagram: @dagdmfc.
Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
SPDX-License-Identifier: CC-BY-4.0. Ver [licencias](LICENCIAS.md).

## Abrir y conservar el trabajo

Abre con doble clic `tools/gpio/index.html` dentro del repositorio. Conserva toda la carpeta con sus archivos vecinos: no copies solo el HTML. No necesitas conectar la ESP32, instalar paquetes, iniciar servidor ni tener Internet. Desde PowerShell:

```powershell
# Desde la raíz del repositorio:
Set-Location -LiteralPath '.\visor-gpio'
Start-Process -FilePath '.\tools\gpio\index.html'
```

El selector superior identifica el proyecto activo. **Guardar cambios** confirma el borrador y activa el guardado local; **Cancelar edición** conserva la última versión aplicada. Comprueba el indicador y usa **Respaldar todo** para obtener una copia portable. Si aparece «solo en memoria», exporta antes de cerrar. Cambiar ruta/navegador o borrar sus datos puede dejarte sin el guardado local anterior.

## Fase 1 — Revisar el punto de partida

Proyecto inicial: 16 GPIO libres, 7 asignados y 2 reservados. DHT11 DATA4; OLED SDA21/SCL22; MicroSD CS13/SCK18/MISO19/MOSI23. GPIO1/3 reservados para UART0. DHT/OLED con conexión informada; SD sin confirmar; ninguna prueba física registrada.

El perfil tiene 25 GPIO y cinco contactos de control/alimentación. GPIO34/35/36/39 son solo entrada. El mapa es lógico, no una instrucción de cableado. Consulta JSON y [contrato](modelo-datos.md) sin ejecutar la aplicación. Desde PowerShell en la raíz:

```powershell
$registroGpio = Get-Content -LiteralPath '.\docs\gpio\registro.json' -Raw -Encoding UTF8 | ConvertFrom-Json
$registroGpio.projects[0].pins | Select-Object gpio, allocation, @{Name='Componente'; Expression={ $_.assignments.component -join ', ' }}, @{Name='Senal'; Expression={ $_.assignments.signal -join ', ' }} | Format-Table -AutoSize
node --test .\tests\gpio\fase1.test.cjs
```

Esperado: 6 pruebas aprobadas. El JSON canónico no cambia por editar el visor; incorporar una exportación requerirá revisión. Publicar sigue requiriendo autorización.

## Fase 2 — Probar placa y ventana rápida

1. Crea «Prueba A». Debe empezar con 23 GPIO libres y UART0 reservada.
2. Selecciona GPIO25 en la placa o mediante «Editar GPIO25» en la tabla. Se abre una ventana; el formulario avanzado está cerrado.
3. Pulsa **Ocupar pin**, escribe «LED de prueba» y elige **Salida / control** si esa es la función prevista. **Guardar cambios** debe cerrar la ventana, actualizar el indicador y autoguardar. No necesitas rellenar señal, interfaz ni evidencia para registrar un nombre.
4. Crea «Prueba B» y selecciona GPIO25: debe estar libre. Cambia entre trabajos: las asignaciones se conservan por separado.
5. Vuelve a A, cambia el nombre y pulsa **Cancelar edición**: se descarta y cierra. Si cierras con **Cerrar ×** o Escape y hay borrador, se pide confirmación; cancelar ese diálogo conserva el borrador.
6. Selecciona otra vez GPIO25, pulsa **Dejar libre** y guarda. Debe quedar sin asignaciones. **Reservar** permite una reserva del proyecto; no cambia restricciones técnicas del ESP32.
7. Selecciona GPIO34: muestra solo entrada/sin pulls y deshabilita salida/bidireccional en uso rápido. EN/VIN/3V3/GND abren información sin editor de asignaciones. El aviso de GPIO6–11 explica su uso interno por flash, sin añadirlos al header.
8. Cada ventana muestra usos posibles, ADC/DAC/Touch/PWM cuando corresponden, limitaciones y fuentes. Una precaución no equivale a estar ocupado: observa ambos indicadores y su leyenda.
9. Para señales, buses, conexión, validación y evidencia abre **Opciones avanzadas**. Los pines con varias señales compartidas se editan allí, evitando perder asignaciones. El modelo sigue rechazando conflictos o salidas en pines de solo entrada. Una prueba aprobada/fallida requiere evidencia, fecha y responsable; cambiar función o trasladar reinicia conexión/prueba.
10. Usa duplicar, renombrar, eliminar, búsqueda y filtros. En una pantalla pequeña desplaza la región de placa o usa la tabla. La ilustración es de referencia, USB abajo; coteja etiquetas con tu unidad antes de cablear.

La consulta PDF conserva el funcionamiento anterior: documento local, apertura integrada/aparte y cierre, sin subirlo ni incluirlo en JSON. No declares resultados reales de hardware basándote en estos recorridos. Detalle actualizado: [revisión de placa visual](revision-placa-visual.md); entrega original: [Fase 2](fase-2-visor.md).

## Fase 3 — Probar guardado y respaldos

1. Aplica notas distintas en A/B. Verifica **Guardado local actualizado**, recarga la misma ruta y comprueba trabajos, notas y proyecto activo.
2. Pulsa **Exportar proyecto** y **Respaldar todo**. Conserva ambos JSON: uno contiene el trabajo seleccionado y otro la colección completa.
3. Importa el individual como **Añadir como trabajos nuevos**: genera IDs nuevos y reinicia evidencias físicas. **Restaurar respaldo** reemplaza el mismo ID o añade ese trabajo si no existe; conserva los demás.
4. Exporta el estado actual antes de probar restauración completa. Importa una colección y selecciona **Restaurar respaldo**: debe advertir que reemplaza toda la colección. Cancela una vez; después confirma si deseas verificarlo.
5. Crea un archivo de prueba con `{esto no es JSON}` e impórtalo: error sin perder trabajos. No alteres el respaldo válido.
6. Aplica dos notas consecutivas y pulsa **Recuperar copia local**. Confirma: recupera la instantánea anterior de toda la colección. Respalda antes si necesitas conservar lo actual.
7. Abre la misma ruta en otra pestaña y aplica un cambio allí. La primera debe avisar del conflicto y pausar su guardado. Exporta ambas versiones antes de elegir; **Reactivar guardado** confirma el reemplazo.
8. **Restablecer este proyecto** pide confirmación y afecta solo al seleccionado. No borres los datos del navegador para probar: perderías guardados sin respaldo externo.

Acceso bloqueado, cuota y corrupción se comprueban automáticamente sin manipular tu perfil personal. Detalle: [Fase 3](fase-3-persistencia.md).

## Fase 4 — Repetir verificaciones técnicas

Desde la raíz, sin instalar paquetes:

```powershell
node --test .\tests\gpio\fase1.test.cjs .\tests\gpio\model.test.cjs .\tests\gpio\transfer.test.cjs .\tests\gpio\board.test.cjs
node .\tools\gpio\generate-data.cjs --check
```

Esperado: **24 aprobadas**, ninguna fallida/omitida y adaptador coincidente. Si `node` no está en PATH, en esta instalación puedes reemplazarlo por:

```powershell
& "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" --test .\tests\gpio\fase1.test.cjs .\tests\gpio\model.test.cjs .\tests\gpio\transfer.test.cjs .\tests\gpio\board.test.cjs
```

La ruta depende de esta instalación. Node es para mantenimiento/pruebas, no para usar el visor. Si editas JSON o guía canónicos, ejecuta `node .\tools\gpio\generate-data.cjs` y repite las comprobaciones; no edites `data.js` manualmente.

Las pruebas de navegador requieren Playwright disponible en el entorno de pruebas y Chrome/Edge instalados. No es una dependencia del visor ni obliga a instalar nada para usarlo. En esta máquina:

```powershell
$env:GPIO_PLAYWRIGHT_MODULE = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright"
$env:GPIO_BROWSER_CHANNEL = 'chrome'
node --test .\tests\gpio\flow.browser.cjs .\tests\gpio\board.browser.cjs
# Repetir con Edge:
$env:GPIO_BROWSER_CHANNEL = 'msedge'
node --test .\tests\gpio\flow.browser.cjs .\tests\gpio\board.browser.cjs
```

Esperado: 6 recorridos aprobados por navegador, incluidos los dos de placa y ventana rápida. Usan perfil temporal, red simulada desconectada y un PDF original generado por la prueba. Descargas/capturas van al temporal `gpio-browser-qa`, o a `GPIO_QA_DIR` si se define. La automatización necesita permiso para escribir descargas: el sandbox cancelaba esa operación; fuera de él se verificó correctamente. No usan tu perfil personal ni sobrescriben JSON canónicos.

Revisa también a 320/768/1024/1440 px, Tab/Enter/Escape, legibilidad y consola sin errores. El visor PDF puede requerir apertura aparte según navegador. Resultados, capturas y límites: [Fase 4](fase-4-verificacion.md).

Historial: 0.1.0 (2026-10-31): revisión Fase 1, seis pruebas y mutación GPIO34 detectada. 0.2.0 (2026-10-31): herramienta completa y pruebas separadas por fases 1–4.

0.3.0 (2026-10-31): instrucciones del editor rápido, indicadores, disposición de referencia y nuevas pruebas de placa.

0.3.1 (2026-10-31): comandos desde `visor-gpio/`; ver README de esa carpeta para transferir proyectos desde la ruta anterior mediante JSON.

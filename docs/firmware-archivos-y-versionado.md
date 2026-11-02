# Cómo se relacionan .ino, .h y .cpp

Fecha: 2026-10-31. Ejemplo: práctica P17a de este proyecto.

## Responsabilidad de cada archivo

| Tipo | Qué contiene | Ejemplo actual |
|---|---|---|
| `.ino` | Flujo principal de la práctica, `setup()` y `loop()` | `esp32_Project.ino` inicia consola y coordina la prueba SD |
| `.h` | Declaraciones de funciones, tipos y configuración que otros archivos necesitan conocer | `MicroSd.h` declara funciones; `Config.h` define constantes |
| `.cpp` | Implementación de las funciones y objetos internos del componente | `MicroSd.cpp` configura SPI, usa SD y verifica el registro |

Esta separación es nuestra convención de organización; C++ permite otras distribuciones. Un archivo de constantes como `Config.h` no necesita un `.cpp` propio. Para módulos con lógica, la pareja `.h`/`.cpp` facilita mantener una sola implementación.

## Recorrido de una llamada real

1. El `.ino` contiene `#include "MicroSd.h"`. El preprocesador incorpora las declaraciones de esa cabecera al código que se va a compilar.
2. La declaración `bool microSdIniciar();` informa al compilador del nombre, argumentos y tipo de retorno. Todavía no describe cómo se monta la tarjeta.
3. El `.ino` llama a `microSdIniciar()` y utiliza su resultado.
4. `MicroSd.cpp` también incluye `MicroSd.h` y contiene el cuerpo de esa función. Así, el compilador puede comprobar que la implementación corresponde a su declaración.
5. Arduino compila el código del `.ino` convertido a C++ y los `.cpp` de la carpeta en archivos objeto. Después, el enlazador une las llamadas con las implementaciones y las bibliotecas para generar el firmware que se carga a la ESP32.

No se cargan `.h` o `.cpp` individualmente en la placa: se construye un solo programa a partir del sketch y sus dependencias.

## Qué hace Arduino por nosotros

El sketch es la carpeta, no solamente el archivo `.ino`. El `.ino` principal debe tener el mismo nombre que esa carpeta: aquí, `esp32_Project/esp32_Project.ino`.

Arduino combina los `.ino` de la raíz y realiza un preprocesamiento: incorpora `Arduino.h` si hace falta y genera declaraciones de funciones en muchos casos. Los `.cpp` no reciben ese mismo tratamiento automático. Deben incluir las cabeceras necesarias, por ejemplo `Arduino.h` cuando usan la API Arduino, directamente o a través de una cabecera propia.

Las cabeceras `.h` se incorporan mediante `#include`; no se ejecutan ni se compilan como programas independientes. Los `.cpp` de la raíz del sketch se compilan aunque el `.ino` no incluya su cabecera. La subcarpeta `src/` se compila recursivamente en versiones actuales de Arduino.

## Reglas para nuestros componentes

- Incluir `MicroSd.h`, nunca `MicroSd.cpp`.
- Usar `#pragma once` al comienzo de cada cabecera, después del comentario de identificación, para evitar inclusiones repetidas dentro de una misma unidad de compilación.
- Declarar las funciones públicas en `.h` y definirlas una sola vez en `.cpp`.
- No definir objetos globales de librerías en cabeceras que se incluirán desde varios `.cpp`. Mantenerlos en una implementación y exponer solo lo necesario.
- No colocar `setup()` y `loop()` en cada componente. El `.ino` los conserva y coordina las llamadas.
- El DHT devuelve datos y un estado; no tiene que conocer la OLED o la SD. El `.ino` decide dónde enviar esos datos.
- Si más adelante una práctica se desactiva, comprobar también sus `.cpp` y dependencias. Quitar únicamente el `#include` del `.ino` no impide que Arduino compile el `.cpp`.

Un error de firma o tipo suele aparecer durante compilación. Una función declarada y utilizada pero sin implementación suele provocar un error al enlazar, como `undefined reference`.

## Cabecera obligatoria por archivo de firmware

Todos los `.ino`, `.h` y `.cpp` nuevos o modificados deben comenzar con un comentario equivalente a este, ajustado al archivo real:

```cpp
/*
 * Archivo: MicroSd.h
 * Descripcion: Interfaz del componente MicroSD para la practica P17a.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.1.0
 * Fecha de modificacion: 2026-10-31
 * Historial:
 *   0.1.0 (2026-10-31): Primera version identificada de la practica P17a.
 */
```

Es una identificación solicitada por el usuario; no añade una licencia de distribución. Mantener el nombre con sus acentos y guardar los archivos en UTF-8.

## Versionado por archivo

Se adopta `MAJOR.MINOR.PATCH`. La primera versión identificada de los cuatro archivos de P17a fue **0.1.0**, asignada al comienzo de la validación. El firmware evolucionó después a P17b y ya tiene validación física; el estado vigente se consulta en sus fichas, no se deduce únicamente del número de versión.

- **PATCH:** corrección compatible o actualización de documentación/comentarios del archivo.
- **MINOR:** capacidad nueva compatible con la interfaz existente.
- **MAJOR:** cambio incompatible en la interfaz o comportamiento esperado que requiera adaptar a quien lo utiliza.

Actualizar versión, fecha y una entrada breve en el historial al cambiar un archivo ya versionado. Cambiar solo las versiones de archivos realmente modificados. Si cambia una firma pública, normalmente deben cambiar la cabecera y su implementación; si cambia solamente una implementación compatible, la cabecera puede conservar su versión.

La versión de archivo no sustituye a Git ni demuestra que el hardware funcione. Un commit identifica el conjunto exacto de versiones del proyecto; la ficha de práctica registra si fue compilado y probado físicamente. No renombrar archivos como `MicroSd_v2_final.cpp` para representar versiones.

## Publicación

Trabajar y verificar en local. No hacer commit ni push de este incremento sin autorización del usuario. En adelante, publicar en GitHub solamente cuando exista autorización explícita para el conjunto de cambios correspondiente; una publicación anterior no autoriza automáticamente las siguientes.

## Fuentes

- [Proceso de compilación Arduino](https://docs.arduino.cc/arduino-cli/sketch-build-process/).
- [Estructura de un sketch Arduino](https://docs.arduino.cc/arduino-cli/sketch-specification/).

La distribución de responsabilidades y el versionado por archivo son convenciones de este proyecto. Las fuentes describen el comportamiento de las herramientas Arduino.

## Selección de práctica con el preprocesador

Desde Config.h 0.3.0 se definen tres identificadores: `PRACTICA_MICROSD` vale 1, `PRACTICA_DHT_OLED` vale 2 y `PRACTICA_REGISTRO_SLEEP` vale 3. La única línea que se cambia para elegir es `#define PRACTICA_ACTIVA ...`, dentro del bloque `#ifndef` ya existente. La selección nueva predeterminada es `PRACTICA_REGISTRO_SLEEP`.

`#if PRACTICA_ACTIVA == PRACTICA_MICROSD` no es una orden para que la placa cambie de modo mientras funciona: el preprocesador compara esos números y conserva o excluye el código antes de compilar. `#else` elige la alternativa y `#endif` termina el bloque. No hay que modificar las comparaciones para elegir una práctica; hay que cambiar la selección, verificar y subir de nuevo.

En la prueba anterior Config.h seleccionaba DHT/OLED, por eso esa comparación era falsa y se ejecutó el programa de DHT/OLED sin que el usuario tocara el `#if`. En cambio, `if (sdDisponible)` es una decisión normal en ejecución, basada en el resultado real de montar la tarjeta.

Las protecciones de los `.cpp` de DHT/OLED incluyen los modos 2 y 3; DeepSleep.cpp solo habilita su implementación en el modo 3. Quitar un include del .ino por sí solo no desactiva la compilación de otros .cpp. Ver la selección, CSV y temporización en [P17b](practicas/P17b-csv-deep-sleep.md).

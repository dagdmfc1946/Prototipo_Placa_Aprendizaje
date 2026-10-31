#pragma once

#include <Arduino.h>

// Inicializa SPI y monta la tarjeta sin formatearla. Devuelve false si falla.
bool microSdIniciar();

// Anade un registro, cierra y relee solo los bytes nuevos para compararlos.
// Informa los resultados por salida. Requiere microSdIniciar() exitoso.
bool microSdProbar(Print &salida);

// Desmonta SD y libera SPI al terminar esta prueba independiente.
void microSdFinalizar();

/*
 * Archivo: MicroSd.h
 * Descripcion: Interfaz de prueba SD y registro CSV de muestras con estado.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.2.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.2.0 (2026-11-02): Agrega preparacion de CSV y escritura/verificacion de registros.
 *   0.1.0 (2026-10-31): Primera version identificada de la practica P17a.
 */

#pragma once

#include <Arduino.h>

// Inicializa SPI y monta la tarjeta sin formatearla. Devuelve false si falla.
bool microSdIniciar();

// Anade un registro, cierra y relee solo los bytes nuevos para compararlos.
// Informa los resultados por salida. Requiere microSdIniciar() exitoso.
bool microSdProbar(Print &salida);

// Desmonta SD y libera SPI al terminar esta prueba independiente.
void microSdFinalizar();

struct RegistroCsv {
  uint32_t ciclo;
  uint8_t muestra;
  uint32_t tiempoMs;  // Desde arranque; se reinicia en cada despertar.
  float temperaturaC;
  float humedadPct;
  bool valida;
};

// Crea cabecera si el archivo esta vacio; rechaza cabecera incompatible.
bool microSdPrepararCsv(Print &salida);
// Agrega, cierra y relee una fila; las lecturas invalidas tienen campos vacios.
bool microSdGuardarRegistro(const RegistroCsv &registro, Print &salida);

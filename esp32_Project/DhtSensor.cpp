/*
 * Archivo: DhtSensor.cpp
 * Descripcion: Adquisicion DHT11 independiente, disponible tambien en registro con sueno.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.1.1
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.1.1 (2026-11-02): Habilita adquisicion en el modo de registro con deep sleep.
 *   0.1.0 (2026-11-02): Inicializacion unica y resultado con estado de validez.
 */

#include "Config.h"

#if PRACTICA_ACTIVA == PRACTICA_DHT_OLED || PRACTICA_ACTIVA == PRACTICA_REGISTRO_SLEEP
#include "DhtSensor.h"

#include <DHT.h>
#include <cmath>

namespace {
DHT sensor(Config::dhtPin, DHT11);
}

void dhtIniciar() {
  sensor.begin();
}

LecturaDht dhtLeer() {
  const float temperatura = sensor.readTemperature();
  const float humedad = sensor.readHumidity();
  return {temperatura, humedad, std::isfinite(temperatura) && std::isfinite(humedad)};
}
#endif

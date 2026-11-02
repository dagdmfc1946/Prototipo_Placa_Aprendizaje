/*
 * Archivo: MicroSd.cpp
 * Descripcion: Prueba SD, CSV con cabecera unica y comprobacion de registros escritos.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.2.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.2.0 (2026-11-02): CSV sin truncar, errores DHT sin ceros y liberacion de hold de CS.
 *   0.1.0 (2026-10-31): Primera version identificada de la practica P17a.
 */

#include "MicroSd.h"

#include <SD.h>
#include <SPI.h>
#include <cstring>
#include <cstdio>
#include <cmath>
#include <driver/gpio.h>

#include "Config.h"

bool microSdIniciar() {
  pinMode(Config::sdCs, OUTPUT);
  digitalWrite(Config::sdCs, HIGH);
  // Liberar CS retenido en el ciclo anterior, conservando nivel alto.
  gpio_deep_sleep_hold_dis();
  gpio_hold_dis(static_cast<gpio_num_t>(Config::sdCs));
  if (!SPI.begin(Config::sdSck, Config::sdMiso, Config::sdMosi, Config::sdCs)) {
    return false;
  }
  // API de Arduino-ESP32 3.3.12: ultimo argumento false impide formateo.
  // https://github.com/espressif/arduino-esp32/blob/3.3.12/libraries/SD/src/SD.h
  return SD.begin(Config::sdCs, SPI, Config::sdClockHz, "/sd", 5, false)
         && SD.cardType() != CARD_NONE;
}

bool microSdProbar(Print &salida) {
  constexpr char registro[] = "ESP32 microSD: prueba de escritura y lectura.\n";
  constexpr size_t longitud = sizeof(registro) - 1;

  File archivo = SD.open(Config::sdTestPath, FILE_APPEND);
  if (!archivo || archivo.isDirectory()) {
    salida.println(F("ERROR: no se puede abrir el archivo para agregar datos."));
    archivo.close();
    return false;
  }
  const size_t tamanoAnterior = archivo.size();
  const size_t escritos = archivo.write(reinterpret_cast<const uint8_t *>(registro), longitud);
  archivo.close();
  if (escritos != longitud) {
    salida.println(F("ERROR: escritura incompleta. El archivo puede contener un registro parcial."));
    return false;
  }

  archivo = SD.open(Config::sdTestPath, FILE_READ);
  if (!archivo || archivo.size() != tamanoAnterior + longitud || !archivo.seek(tamanoAnterior)) {
    salida.println(F("ERROR: no se puede verificar el tamano o reabrir el registro."));
    archivo.close();
    return false;
  }
  char leido[sizeof(registro)] = {};
  const size_t recibidos = archivo.readBytes(leido, longitud);
  archivo.close();
  if (recibidos != longitud || std::memcmp(leido, registro, longitud) != 0) {
    salida.println(F("ERROR: los bytes leidos no coinciden con los escritos."));
    return false;
  }

  salida.print(F("Archivo: "));
  salida.println(Config::sdTestPath);
  salida.print(F("Bytes antes: "));
  salida.println(tamanoAnterior);
  salida.print(F("Bytes agregados y verificados: "));
  salida.println(longitud);
  salida.print(F("Registro leido: "));
  salida.print(leido);
  return true;
}

void microSdFinalizar() {
  SD.end();
  SPI.end();
}

bool microSdPrepararCsv(Print &salida) {
  constexpr char cabecera[] = "ciclo,muestra,tiempo_ms,temperatura_c,humedad_pct,estado\n";
  File archivo = SD.open(Config::sdCsvPath, FILE_APPEND);
  if (!archivo || archivo.isDirectory()) {
    salida.println(F("ERROR SD: no se puede abrir el CSV."));
    archivo.close();
    return false;
  }
  if (archivo.size() == 0) {
    const size_t escritos = archivo.print(cabecera);
    archivo.close();
    if (escritos != sizeof(cabecera) - 1) {
      salida.println(F("ERROR SD: cabecera incompleta; revisar archivo en PC."));
      return false;
    }
  } else {
    archivo.close();
  }
  archivo = SD.open(Config::sdCsvPath, FILE_READ);
  char leido[sizeof(cabecera)] = {};
  const size_t recibidos = archivo ? archivo.readBytes(leido, sizeof(cabecera) - 1) : 0;
  archivo.close();
  if (recibidos != sizeof(cabecera) - 1 || std::memcmp(leido, cabecera, recibidos) != 0) {
    salida.println(F("ERROR SD: cabecera incompatible o no verificable; no se agregaran filas."));
    return false;
  }
  return true;
}

bool microSdGuardarRegistro(const RegistroCsv &registro, Print &salida) {
  char linea[128];
  const bool valida = registro.valida && std::isfinite(registro.temperaturaC)
                                      && std::isfinite(registro.humedadPct);
  const int longitud = valida
      ? std::snprintf(linea, sizeof(linea), "%lu,%u,%lu,%.1f,%.1f,OK\n",
                      static_cast<unsigned long>(registro.ciclo), registro.muestra,
                      static_cast<unsigned long>(registro.tiempoMs),
                      registro.temperaturaC, registro.humedadPct)
      : std::snprintf(linea, sizeof(linea), "%lu,%u,%lu,,,ERROR_DHT11\n",
                      static_cast<unsigned long>(registro.ciclo), registro.muestra,
                      static_cast<unsigned long>(registro.tiempoMs));
  if (longitud <= 0 || static_cast<size_t>(longitud) >= sizeof(linea)) {
    salida.println(F("ERROR SD: registro CSV demasiado largo."));
    return false;
  }
  File archivo = SD.open(Config::sdCsvPath, FILE_APPEND);
  if (!archivo || archivo.isDirectory() || archivo.size() == 0) {
    salida.println(F("ERROR SD: CSV no preparado o no disponible."));
    archivo.close();
    return false;
  }
  const size_t inicio = archivo.size();
  const size_t escritos = archivo.print(linea);
  archivo.close();
  if (escritos != static_cast<size_t>(longitud)) {
    salida.println(F("ERROR SD: fila incompleta; se suspende registro en este ciclo."));
    return false;
  }
  archivo = SD.open(Config::sdCsvPath, FILE_READ);
  if (!archivo || archivo.size() != inicio + escritos || !archivo.seek(inicio)) {
    salida.println(F("ERROR SD: no se puede reabrir/verificar la fila."));
    archivo.close();
    return false;
  }
  char leido[sizeof(linea)] = {};
  const size_t recibidos = archivo.readBytes(leido, escritos);
  archivo.close();
  if (recibidos != escritos || std::memcmp(leido, linea, escritos) != 0) {
    salida.println(F("ERROR SD: fila releida distinta del registro escrito."));
    return false;
  }
  salida.print(F("CSV OK: "));
  salida.print(linea);
  return true;
}

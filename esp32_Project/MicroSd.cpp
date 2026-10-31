#include "MicroSd.h"

#include <SD.h>
#include <SPI.h>
#include <cstring>

#include "Config.h"

bool microSdIniciar() {
  pinMode(Config::sdCs, OUTPUT);
  digitalWrite(Config::sdCs, HIGH);
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

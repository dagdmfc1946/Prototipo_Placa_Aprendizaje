#include "Config.h"
#include "MicroSd.h"

void setup() {
  Serial.begin(Config::serialBaud);
  delay(1000);
  Serial.println(F("\nP17a - Prueba independiente MicroSD (sin DHT ni OLED)."));
  Serial.printf("SPI: CS=%u, SCK=%u, MISO=%u, MOSI=%u; %lu Hz.\n",
                Config::sdCs, Config::sdSck, Config::sdMiso, Config::sdMosi,
                static_cast<unsigned long>(Config::sdClockHz));

  if (!microSdIniciar()) {
    Serial.println(F("ERROR: tarjeta no montada. Revisar alimentacion, cableado y formato."));
    microSdFinalizar();
    return;
  }

  const bool verificada = microSdProbar(Serial);
  microSdFinalizar();
  Serial.println(verificada ? F("OK: registro agregado, releido y comparado; tarjeta desmontada.")
                            : F("PRUEBA FALLIDA: revisar el error anterior."));
  Serial.println(F("Para repetir, pulse EN/RESET. Solo se agrega un registro por arranque."));
}

void loop() {
  // Esta practica se ejecuta una sola vez desde setup().
}

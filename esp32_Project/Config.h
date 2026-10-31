#pragma once

#include <Arduino.h>

namespace Config {
constexpr uint32_t serialBaud = 115200;

// Asignacion provisional para probar solamente la MicroSD.
// GPIO13 estaba propuesto para buzzer: no conectar ambos en esta practica.
constexpr uint8_t sdCs = 13;
constexpr uint8_t sdSck = 18;
constexpr uint8_t sdMiso = 19;
constexpr uint8_t sdMosi = 23;
constexpr uint32_t sdClockHz = 1000000;
constexpr char sdTestPath[] = "/prueba_sd.txt";
}  // namespace Config

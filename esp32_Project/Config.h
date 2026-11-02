/*
 * Archivo: Config.h
 * Descripcion: Seleccion de practicas y ciclo CSV de cuatro muestras con deep sleep.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.3.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.3.0 (2026-11-02): Modo registro/sueno: cuatro muestras en 20 s y reposo de 60 s.
 *   0.2.0 (2026-11-02): Seleccion de practica, DHT11 y OLED; conserva pines SD.
 *   0.1.0 (2026-10-31): Primera version identificada de la practica P17a.
 */

#pragma once

#include <Arduino.h>

#define PRACTICA_MICROSD 1
#define PRACTICA_DHT_OLED 2
#define PRACTICA_REGISTRO_SLEEP 3
#ifndef PRACTICA_ACTIVA
#define PRACTICA_ACTIVA PRACTICA_REGISTRO_SLEEP
#endif

#if PRACTICA_ACTIVA != PRACTICA_MICROSD && PRACTICA_ACTIVA != PRACTICA_DHT_OLED && PRACTICA_ACTIVA != PRACTICA_REGISTRO_SLEEP
#error "Seleccione PRACTICA_MICROSD, PRACTICA_DHT_OLED o PRACTICA_REGISTRO_SLEEP."
#endif

namespace Config {
constexpr uint32_t serialBaud = 115200;

// GPIO13 queda para CS, no conectar tambien el buzzer en este GPIO.
constexpr uint8_t sdCs = 13;
constexpr uint8_t sdSck = 18;
constexpr uint8_t sdMiso = 19;
constexpr uint8_t sdMosi = 23;
constexpr uint32_t sdClockHz = 1000000;
constexpr char sdTestPath[] = "/prueba_sd.txt";
constexpr char sdCsvPath[] = "/dht11.csv";

constexpr uint8_t dhtPin = 4;
constexpr uint32_t intervaloLecturaMs = 5000;
static_assert(intervaloLecturaMs >= 2000, "Respetar al menos 2 segundos entre lecturas DHT.");

constexpr uint8_t medicionesPorCiclo = 4;
constexpr uint32_t ventanaMuestreoMs = 20000;
constexpr uint32_t deepSleepSegundos = 60;
#if PRACTICA_ACTIVA == PRACTICA_REGISTRO_SLEEP
static_assert(medicionesPorCiclo > 0, "Configurar al menos una muestra.");
static_assert(medicionesPorCiclo * intervaloLecturaMs == ventanaMuestreoMs,
              "La ventana debe coincidir con muestras por intervalo.");
static_assert(deepSleepSegundos > 0, "El temporizador debe permitir despertar.");
#endif

constexpr uint8_t oledSda = 21;
constexpr uint8_t oledScl = 22;
constexpr uint8_t oledDireccion = 0x3C;
constexpr uint8_t oledAncho = 128;
constexpr uint8_t oledAlto = 64;
constexpr int8_t oledReset = -1;
constexpr uint32_t oledClockHz = 100000;
}  // namespace Config

/*
 * Archivo: DeepSleep.cpp
 * Descripcion: Reposo temporizado con contador RTC y SD deseleccionada.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.1.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.1.0 (2026-11-02): Despertar por temporizador y conservacion del contador.
 */

#include "Config.h"
#if PRACTICA_ACTIVA == PRACTICA_REGISTRO_SLEEP
#include "DeepSleep.h"
#include <esp_sleep.h>
#include <esp_attr.h>
#include <driver/gpio.h>

namespace {
RTC_DATA_ATTR uint32_t ciclo = 0;
}

uint32_t deepSleepIniciarCiclo() {
  const bool temporizador = esp_sleep_get_wakeup_cause() == ESP_SLEEP_WAKEUP_TIMER;
  if (!temporizador) {
    ciclo = 0;
  }
  ++ciclo;
  Serial.printf("Ciclo %lu; inicio por %s.\n", static_cast<unsigned long>(ciclo),
                temporizador ? "temporizador deep sleep" : "encendido/reset");
  return ciclo;
}

bool deepSleepProgramar(uint32_t segundos) {
  return segundos > 0 && esp_sleep_enable_timer_wakeup(segundos * 1000000ULL) == ESP_OK;
}

void deepSleepEntrar() {
  pinMode(Config::sdCs, OUTPUT);
  digitalWrite(Config::sdCs, HIGH);
  if (gpio_hold_en(static_cast<gpio_num_t>(Config::sdCs)) == ESP_OK) {
    gpio_deep_sleep_hold_en();
  } else {
    Serial.println(F("AVISO: no se pudo retener CS alto durante el reposo."));
  }
  Serial.flush();
  esp_deep_sleep_start();
}
#endif

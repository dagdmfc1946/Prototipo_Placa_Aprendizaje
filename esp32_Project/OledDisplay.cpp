/*
 * Archivo: OledDisplay.cpp
 * Descripcion: Presentacion SSD1306 y apagado de pantalla antes del deep sleep.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.2.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.2.0 (2026-11-02): Comparte presentacion con registro y agrega comando DISPLAYOFF.
 *   0.1.0 (2026-11-02): Inicio unico, comprobacion I2C y presentacion sin demoras.
 */

#include "Config.h"

#if PRACTICA_ACTIVA == PRACTICA_DHT_OLED || PRACTICA_ACTIVA == PRACTICA_REGISTRO_SLEEP
#include "OledDisplay.h"

#include <Adafruit_SSD1306.h>
#include <Wire.h>

namespace {
Adafruit_SSD1306 pantalla(Config::oledAncho, Config::oledAlto, &Wire,
                         Config::oledReset, Config::oledClockHz, Config::oledClockHz);
}

bool oledIniciar() {
  if (!Wire.begin(Config::oledSda, Config::oledScl, Config::oledClockHz)) {
    return false;
  }
  Wire.beginTransmission(Config::oledDireccion);
  if (Wire.endTransmission() != 0) {
    return false;
  }
  // Wire ya esta configurado: evitar que begin vuelva a inicializar el bus.
  if (!pantalla.begin(SSD1306_SWITCHCAPVCC, Config::oledDireccion, false, false)) {
    return false;
  }
  pantalla.clearDisplay();
  pantalla.setTextColor(SSD1306_WHITE);
  pantalla.setTextWrap(false);
  pantalla.setTextSize(1);
  pantalla.setCursor(0, 0);
  pantalla.println(F("DHT11 + OLED"));
  pantalla.setCursor(0, 24);
  pantalla.println(F("Esperando lectura..."));
  pantalla.display();
  return true;
}

void oledMostrarLectura(float temperaturaC, float humedadPct, bool valida) {
  pantalla.clearDisplay();
  pantalla.setTextSize(1);
  pantalla.setCursor(0, 0);
  pantalla.print(F("DHT11 / "));
  pantalla.print(Config::intervaloLecturaMs / 1000);
  pantalla.println(F(" s"));
  if (valida) {
    pantalla.setTextSize(2);
    pantalla.setCursor(0, 20);
    pantalla.print(F("T: "));
    pantalla.print(temperaturaC, 1);
    pantalla.print(F(" C"));
    pantalla.setCursor(0, 44);
    pantalla.print(F("H: "));
    pantalla.print(humedadPct, 1);
    pantalla.print(F(" %"));
  } else {
    pantalla.setCursor(0, 22);
    pantalla.println(F("ERROR DHT11"));
    pantalla.setCursor(0, 36);
    pantalla.println(F("Sin lectura valida"));
    pantalla.setCursor(0, 50);
    pantalla.print(F("Revisar DATA/pull-up"));
  }
  pantalla.display();
}

void oledApagar() {
  pantalla.ssd1306_command(SSD1306_DISPLAYOFF);
  Wire.end();
}
#endif

/*
 * Archivo: esp32_Project.ino
 * Descripcion: Practicas independientes y registro de cuatro muestras con deep sleep.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.3.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.3.0 (2026-11-02): CSV, cuatro intentos a 5/10/15/20 s y deep sleep de 60 s.
 *   0.2.0 (2026-11-02): Seleccion de practica y lectura periodica DHT11/OLED.
 *   0.1.0 (2026-10-31): Primera version identificada de la practica P17a.
 */

#include "Config.h"

#if PRACTICA_ACTIVA != PRACTICA_DHT_OLED
#include "MicroSd.h"
#endif
#if PRACTICA_ACTIVA != PRACTICA_MICROSD
#include "DhtSensor.h"
#include "OledDisplay.h"

bool oledDisponible = false;
uint32_t ultimaLecturaMs = 0;

void presentarLectura(const LecturaDht &lectura) {
  if (lectura.valida) {
    Serial.printf("T=%.1f C | H=%.1f %%\n", lectura.temperaturaC, lectura.humedadPct);
  } else {
    Serial.println(F("ERROR DHT11: lectura invalida; no se generaron mediciones sustitutas."));
  }
  if (oledDisponible) {
    oledMostrarLectura(lectura.temperaturaC, lectura.humedadPct, lectura.valida);
  }
}
#endif
#if PRACTICA_ACTIVA == PRACTICA_REGISTRO_SLEEP
#include "DeepSleep.h"
#endif

void setup() {
  Serial.begin(Config::serialBaud);
  delay(1000);

#if PRACTICA_ACTIVA == PRACTICA_MICROSD
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
#else
  Serial.printf("\nDHT11 DATA=%u; OLED SDA=%u SCL=%u direccion=0x%02X.\n",
                Config::dhtPin, Config::oledSda, Config::oledScl, Config::oledDireccion);
  dhtIniciar();
  oledDisponible = oledIniciar();
  Serial.println(oledDisponible ? F("OLED inicializada.")
                                : F("ERROR OLED: continua DHT por consola."));

#if PRACTICA_ACTIVA == PRACTICA_DHT_OLED
  Serial.println(F("P11/P07 - DHT11 + OLED; sin escritura en SD ni deep sleep."));
  Serial.printf("Primera lectura y periodo: %lu ms.\n",
                static_cast<unsigned long>(Config::intervaloLecturaMs));
  ultimaLecturaMs = millis();
#else
  Serial.println(F("P17b - DHT11 + OLED + CSV + deep sleep."));
  const uint32_t ciclo = deepSleepIniciarCiclo();
  bool sdDisponible = microSdIniciar();
  if (sdDisponible) {
    sdDisponible = microSdPrepararCsv(Serial);
  }
  if (sdDisponible) {
    Serial.print(F("CSV preparado: "));
    Serial.println(Config::sdCsvPath);
  } else {
    Serial.println(F("ERROR SD: este ciclo continua sin guardar datos."));
  }
  uint8_t guardadas = 0;
  const uint32_t inicio = millis();
  uint32_t ultimaAdquisicion = inicio;
  Serial.println(F("Inicio de ventana de muestreo."));
  for (uint32_t numero = 1; numero <= Config::medicionesPorCiclo; ++numero) {
    // No comprimir lecturas si una operacion SD ha retrasado el ciclo.
    while (static_cast<uint32_t>(millis() - ultimaAdquisicion) < Config::intervaloLecturaMs) {
      delay(1);
    }
    const uint32_t instante = millis();
    ultimaAdquisicion = instante;
    Serial.printf("Muestra %lu/%u; ventana=%lu ms.\n", static_cast<unsigned long>(numero),
                  Config::medicionesPorCiclo, static_cast<unsigned long>(instante - inicio));
    const LecturaDht lectura = dhtLeer();
    presentarLectura(lectura);
    if (sdDisponible) {
      const RegistroCsv registro{ciclo, static_cast<uint8_t>(numero), instante,
                                 lectura.temperaturaC, lectura.humedadPct, lectura.valida};
      sdDisponible = microSdGuardarRegistro(registro, Serial);
      if (sdDisponible) {
        ++guardadas;
      }
    }
  }
  const bool temporizadorListo = deepSleepProgramar(Config::deepSleepSegundos);
  microSdFinalizar();
  if (oledDisponible) {
    oledApagar();
  }
  Serial.printf("Ciclo terminado: %u intentos, %u filas verificadas.\n",
                Config::medicionesPorCiclo, guardadas);
  if (!temporizadorListo) {
    Serial.println(F("ERROR: no se pudo programar el despertar; la placa permanece despierta."));
    return;
  }
  Serial.printf("Deep sleep durante %lu s; SD desmontada; OLED: %s.\n",
                static_cast<unsigned long>(Config::deepSleepSegundos),
                oledDisponible ? "OFF solicitado" : "no disponible");
  deepSleepEntrar();
#endif
#endif
}

void loop() {
#if PRACTICA_ACTIVA == PRACTICA_DHT_OLED
  const uint32_t ahora = millis();
  if (ahora - ultimaLecturaMs >= Config::intervaloLecturaMs) {
    ultimaLecturaMs = ahora;
    presentarLectura(dhtLeer());
  }
#endif
  delay(1);
}

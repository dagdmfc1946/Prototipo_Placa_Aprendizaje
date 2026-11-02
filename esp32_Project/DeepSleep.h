/*
 * Archivo: DeepSleep.h
 * Descripcion: Contador de ciclo RTC y deep sleep por temporizador.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.1.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.1.0 (2026-11-02): Temporizador, causa de despertar y retencion de CS.
 */

#pragma once
#include <Arduino.h>

uint32_t deepSleepIniciarCiclo();
bool deepSleepProgramar(uint32_t segundos);
// Llamar despues de cerrar/desmontar SD y apagar OLED. No retorna normalmente.
void deepSleepEntrar();

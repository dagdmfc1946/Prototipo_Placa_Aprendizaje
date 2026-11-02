/*
 * Archivo: DhtSensor.h
 * Descripcion: Interfaz de lectura DHT11, independiente de pantalla y almacenamiento.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.1.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.1.0 (2026-11-02): Lectura de temperatura, humedad y validez.
 */

#pragma once

struct LecturaDht {
  float temperaturaC;
  float humedadPct;
  bool valida;
};

void dhtIniciar();
// Llamar tras iniciar y respetando Config::intervaloLecturaMs.
LecturaDht dhtLeer();

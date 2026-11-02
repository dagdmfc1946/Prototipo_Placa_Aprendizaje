/*
 * Archivo: OledDisplay.h
 * Descripcion: Interfaz de presentacion OLED y apagado previo al deep sleep.
 * Autor: Ing. Diego Andrés García Díaz
 * Instagram: @dagdmfc
 * Repositorio: https://github.com/dagdmfc1946/Prototipo_Placa_Aprendizaje/tree/dev
 * Version: 0.2.0
 * Fecha de modificacion: 2026-11-02
 * Historial:
 *   0.2.0 (2026-11-02): Agrega oledApagar sin cambiar la interfaz de lecturas.
 *   0.1.0 (2026-11-02): Inicializacion y presentacion independientes del sensor.
 */

#pragma once

// Comprueba ACK en la direccion configurada e inicializa la pantalla una vez.
bool oledIniciar();
// Requiere oledIniciar() exitoso. Con valida=false muestra error, no los numeros.
void oledMostrarLectura(float temperaturaC, float humedadPct, bool valida);

// Apaga pixeles/control por comando; no corta fisicamente la alimentacion.
void oledApagar();

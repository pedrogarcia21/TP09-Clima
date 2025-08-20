import React, { createContext, useContext, useState } from "react";

const ClimaContexto = createContext();

export function useClima() {
  return useContext(ClimaContexto);
}

export function ClimaProvider({ children }) {
  // Unidad global
  const [unidad, setUnidad] = useState("metric"); // 'metric' para °C, 'imperial' para °F
  // Tema global
  const [tema, setTema] = useState("oscuro"); // 'oscuro' o 'claro'
  // Último clima consultado (por ciudad)
  const [cacheClima, setCacheClima] = useState({});

  // Cambiar unidad
  const toggleUnidad = () => {
    setUnidad((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  // Cambiar tema
  const toggleTema = () => {
    setTema((prev) => (prev === "oscuro" ? "claro" : "oscuro"));
  };

  // Guardar clima en cache
  const guardarClima = (ciudad, datos) => {
    setCacheClima((prev) => ({ ...prev, [ciudad]: datos }));
  };

  return (
    <ClimaContexto.Provider
      value={{ unidad, toggleUnidad, tema, toggleTema, cacheClima, guardarClima }}
    >
      {children}
    </ClimaContexto.Provider>
  );
}

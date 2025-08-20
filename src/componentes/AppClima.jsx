import React, { useState, useEffect } from "react";
import ClimaActual from "./ClimaActual";
import PronosticoHorario from "./PronosticoHorario";
import PronosticoDiario from "./PronosticoDiario";
import ClimaCiudades from "./ClimaCiudades";
import { useClima } from "./ClimaContexto";

const API_KEY = "d91f144493dad17f520d990d1a5007e2";
const CIUDADES_GRANDES = [
  { nombre: "New York", pais: "US" },
  { nombre: "Copenhagen", pais: "DK" },
  { nombre: "Ho Chi Minh City", pais: "VN" },
];

function AppClima() {
  const { unidad, toggleUnidad, tema, toggleTema, cacheClima, guardarClima } = useClima();

  // Cambiar la clase del body según el tema
  React.useEffect(() => {
    document.body.classList.remove('tema-oscuro', 'tema-claro');
    document.body.classList.add(`tema-${tema}`);
    return () => {
      document.body.classList.remove('tema-oscuro', 'tema-claro');
    };
  }, [tema]);
  const [ciudad, setCiudad] = useState("Buenos Aires");
  const [busqueda, setBusqueda] = useState("");
  const [climaActual, setClimaActual] = useState(null);
  const [pronosticoHorario, setPronosticoHorario] = useState([]);
  const [pronosticoDiario, setPronosticoDiario] = useState([]);
  const [climaCiudades, setClimaCiudades] = useState([]);
  const [error, setError] = useState("");

  // Fetch clima actual y pronóstico para la ciudad principal
  useEffect(() => {
    async function fetchClima() {
      setError("");
      // Si está en cache, usarlo
      if (cacheClima[ciudad + unidad]) {
        const datos = cacheClima[ciudad + unidad];
        setClimaActual(datos.climaActual);
        setPronosticoHorario(datos.pronosticoHorario);
        setPronosticoDiario(datos.pronosticoDiario);
        return;
      }
      try {
        // Clima actual
        const resActual = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=${unidad}&lang=es`
        );
        if (!resActual.ok) throw new Error("Ciudad no encontrada");
        const dataActual = await resActual.json();
        if (!dataActual || !dataActual.weather || !dataActual.main) throw new Error("Datos de clima no disponibles");
        setClimaActual(dataActual);

        // Pronóstico horario (24h, cada 3h)
        const resHorario = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ciudad)}&appid=${API_KEY}&units=${unidad}&lang=es`
        );
        if (!resHorario.ok) throw new Error("Pronóstico no disponible");
        const dataHorario = await resHorario.json();
        if (!dataHorario.list || !Array.isArray(dataHorario.list)) throw new Error("Pronóstico horario no disponible");
        setPronosticoHorario(dataHorario.list.slice(0, 8)); // 8 x 3h = 24h

        // Pronóstico diario (5 días)
        const dias = {};
        dataHorario.list.forEach((item) => {
          if (!item.dt_txt) return;
          const fecha = item.dt_txt.split(" ")[0];
          if (!dias[fecha]) dias[fecha] = [];
          dias[fecha].push(item);
        });
        const pronostico5dias = Object.values(dias)
          .slice(0, 5)
          .map((items) => {
            const min = Math.min(...items.map((i) => i.main.temp_min));
            const max = Math.max(...items.map((i) => i.main.temp_max));
            const weather = items.map((i) => i.weather[0].main);
            const icon = items[0].weather[0].icon;
            return {
              fecha: items[0].dt_txt.split(" ")[0],
              min,
              max,
              weather: weather[0],
              icon,
            };
          });
        setPronosticoDiario(pronostico5dias);
        // Guardar en cache
        guardarClima(ciudad + unidad, {
          climaActual: dataActual,
          pronosticoHorario: dataHorario.list.slice(0, 8),
          pronosticoDiario: pronostico5dias,
        });
      } catch (e) {
        setError(e.message);
        setClimaActual(null);
        setPronosticoHorario([]);
        setPronosticoDiario([]);
      }
    }
    fetchClima();
  }, [ciudad, unidad, cacheClima, guardarClima]);

  // Fetch clima de ciudades grandes
  useEffect(() => {
    async function fetchCiudades() {
      try {
        const resultados = await Promise.all(
          CIUDADES_GRANDES.map(async (c) => {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(c.nombre)}&appid=${API_KEY}&units=${unidad}&lang=es`
            );
            if (!res.ok) return { ...c, error: true };
            const data = await res.json();
            return { ...c, ...data };
          })
        );
        setClimaCiudades(resultados);
      } catch {
        setClimaCiudades([]);
      }
    }
    fetchCiudades();
  }, [unidad]);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      setCiudad(busqueda.trim());
      setBusqueda("");
    }
  };

  return (
    <div className={`app-clima tema-${tema}`}>
      <form onSubmit={handleBuscar} className="buscador-ciudad">
        <input
          type="text"
          placeholder="Buscar ciudad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <button type="submit">Buscar</button>
        <button type="button" onClick={toggleUnidad}>
          {unidad === "metric" ? "°C" : "°F"}
        </button>
        <button type="button" onClick={toggleTema}>
          {tema === "oscuro" ? "🌙" : "☀️"}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <ClimaActual datosClima={climaActual} />
      <PronosticoHorario datosPronostico={pronosticoHorario} />
      <PronosticoDiario datosPronostico={pronosticoDiario} />
      <ClimaCiudades ciudades={climaCiudades} />
    </div>
  );
}

export default AppClima;

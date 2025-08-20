import React from "react";
import { useClima } from "./ClimaContexto";

function ClimaCiudades({ ciudades }) {
  const { unidad } = useClima();
  if (!ciudades || ciudades.length === 0) return null;
  return (
    <section className="clima-ciudades">
      <h3>Otras ciudades</h3>
      <div className="ciudades-grid">
        {ciudades.map((c, idx) => (
          <div className="ciudad-tarjeta" key={idx}>
            <div className="ciudad-nombre">{c.nombre || c.name}, {c.pais || (c.sys && c.sys.country)}</div>
            <div className="ciudad-desc">{c.weather && c.weather[0] && c.weather[0].description}</div>
            <div className="ciudad-temp">{c.main && Math.round(c.main.temp)}°{unidad === 'metric' ? 'C' : 'F'}</div>
            {c.weather && c.weather[0] && (
              <img src={`https://openweathermap.org/img/wn/${c.weather[0].icon}.png`} alt={c.weather[0].description} className="icono-ciudad" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default ClimaCiudades;

import React from "react";
import { useClima } from "./ClimaContexto";

function ClimaActual({ datosClima }) {
  const { unidad } = useClima();
  if (!datosClima) return null;
  const temp = Math.round(datosClima.main.temp);
  const tempMin = Math.round(datosClima.main.temp_min);
  const tempMax = Math.round(datosClima.main.temp_max);
  const feels = Math.round(datosClima.main.feels_like);
  const icon = datosClima.weather[0].icon;
  const desc = datosClima.weather[0].description;
  const ciudad = datosClima.name;
  const pais = datosClima.sys.country;
  const viento = datosClima.wind.speed;
  const hora = new Date(datosClima.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="clima-actual tarjeta">
      <div className="clima-actual-temp">
        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt={desc} className="icono-clima" />
        <span className="temp-principal">{temp}°{unidad === 'metric' ? 'C' : 'F'}</span>
      </div>
      <div className="clima-actual-info">
        <h2>{ciudad}, {pais}</h2>
        <div className="desc">{desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
        <div className="detalles">
          <span>Viento: {viento} m/s</span>
          <span>Sensación: {feels}°</span>
          <span>Min: {tempMin}° / Max: {tempMax}°</span>
        </div>
        <div className="hora">{hora}</div>
      </div>
    </section>
  );
}

export default ClimaActual;

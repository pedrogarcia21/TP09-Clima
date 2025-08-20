import React from "react";
import { useClima } from "./ClimaContexto";

function PronosticoHorario({ datosPronostico }) {
  const { unidad } = useClima();
  if (!datosPronostico || datosPronostico.length === 0) return null;
  return (
    <section className="pronostico-horario">
      <h3>Próximas 24 horas</h3>
      <div className="horas-grid">
        {datosPronostico.map((item, idx) => {
          const hora = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const temp = Math.round(item.main.temp);
          const icon = item.weather[0].icon;
          return (
            <div className="hora-tarjeta" key={idx}>
              <div className="hora">{hora}</div>
              <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt={item.weather[0].description} className="icono-hora" />
              <div className="temp">{temp}°{unidad === 'metric' ? 'C' : 'F'}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PronosticoHorario;

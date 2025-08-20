import React from "react";
import { useClima } from "./ClimaContexto";

function PronosticoDiario({ datosPronostico }) {
  const { unidad } = useClima();
  if (!datosPronostico || datosPronostico.length === 0) return null;
  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return (
    <section className="pronostico-diario">
      <h3>Pronóstico 5 días</h3>
      <div className="dias-grid">
        {datosPronostico.map((item, idx) => {
          const fecha = new Date(item.fecha);
          const dia = idx === 0 ? 'Hoy' : diasSemana[fecha.getDay()];
          return (
            <div className="dia-tarjeta" key={idx}>
              <div className="dia">{dia}</div>
              <img src={`https://openweathermap.org/img/wn/${item.icon}.png`} alt={item.weather} className="icono-dia" />
              <div className="desc-dia">{item.weather}</div>
              <div className="temp-dia">
                <span className="min">{Math.round(item.min)}°</span>
                <span className="max">{Math.round(item.max)}°</span>
                <span>{unidad === 'metric' ? 'C' : 'F'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PronosticoDiario;

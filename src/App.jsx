import './App.css';
import AppClima from './componentes/AppClima';
import { ClimaProvider } from './componentes/ClimaContexto';

export default function App() {
  return (
    <ClimaProvider>
      <AppClima />
    </ClimaProvider>
  );
}

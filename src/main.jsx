import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css';
import './index.css'
import { RevealedStationsProvider } from './revealedStations';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RevealedStationsProvider>
      <App />
    </RevealedStationsProvider>
  </StrictMode>,
)

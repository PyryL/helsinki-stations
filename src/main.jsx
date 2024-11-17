import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import { RevealedStationsProvider } from './revealedStations';
import Game from './Game.jsx'
import Menu from './Menu.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />,
  },
  {
    path: '/junat',
    element: <Game gameMode='train' />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RevealedStationsProvider>
      <RouterProvider router={router} />
    </RevealedStationsProvider>
  </StrictMode>,
)

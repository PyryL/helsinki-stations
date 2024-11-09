import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import { lines } from './data/lines'
import { stations } from './data/stations'

const App = () => {
  const mapOptions = {
    center: [60.1986580, 24.9334287],
    zoom: 12,
    maxZoom: 15,
    minZoom: 10,
  }

  const markerIcon = L.icon({
    iconUrl: 'unknown.png',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  })

  const pathOptions = {
    color: '#ff0000',
  }

  return (
    <MapContainer {...mapOptions} style={{ height: '500px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        opacity={0.4}
      />

      {stations.map((stationCoords, index) =>
        <Marker position={stationCoords} icon={markerIcon} key={index} />
      )}

      {lines.map((linePoints, index) =>
        <Polyline pathOptions={pathOptions} positions={linePoints} key={index} />
      )}
    </MapContainer>
  )
}

export default App

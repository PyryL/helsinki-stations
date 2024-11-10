import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { lines } from './data/lines'
import { stations } from './data/stations'

const Map = ({ revealedStations }) => {
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
    color: '#8c4799',
    weight: 2,
  }

  return (
    <MapContainer {...mapOptions} style={{ width: '100%', height: '100%', backgroundColor: '#ededed' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        opacity={0.7}
      />

      {stations.map((station, index) =>
        <Marker position={[station.lat, station.lon]} icon={markerIcon} key={index}>
          {revealedStations.includes(station.name) && <Tooltip permanent direction='bottom'>{station.name}</Tooltip>}
        </Marker>
      )}

      {lines.map((linePoints, index) =>
        <Polyline pathOptions={pathOptions} positions={linePoints} key={index} />
      )}
    </MapContainer>
  )
}

export default Map

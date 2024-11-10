import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { lines } from './data/lines'
import { stations } from './data/stations'
import { useRevealedStations } from './revealedStations'

const Map = () => {
  const { revealedStations } = useRevealedStations()

  const mapOptions = {
    center: [60.1986580, 24.9334287],
    zoom: 12,
    maxZoom: 15,
    minZoom: 10,
  }

  const markerIcon = stationType => L.icon({
    iconUrl: stationType === 'train' ? 'train-station.png' : 'metro-station.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

  const pathOptions = {
    color: '#e3e4ea',
    weight: 2,
  }

  const showMap = stations.every(station => revealedStations.some(revealed => station.name === revealed))

  const osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <MapContainer {...mapOptions} style={{ width: '100%', height: '100%', backgroundColor: '#2c2c2d' }}>
      {showMap && <TileLayer
        attribution={osmAttribution}
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        opacity={0.7}
      />}

      {stations.map((station, index) =>
        <Marker position={[station.lat, station.lon]} icon={markerIcon(station.type)} attribution={osmAttribution} key={index}>
          {revealedStations.includes(station.name) && <Tooltip permanent direction='bottom' className='map-tooltip'>{station.name}</Tooltip>}
        </Marker>
      )}

      {lines.map((linePoints, index) =>
        <Polyline pathOptions={pathOptions} positions={linePoints} attribution={osmAttribution} key={index} />
      )}
    </MapContainer>
  )
}

export default Map

import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useRevealedStations } from './revealedStations'

const findBounds = stations => {
  const minLat = Math.min(...stations.map(station => station.lat))
  const maxLat = Math.max(...stations.map(station => station.lat))
  const minLon = Math.min(...stations.map(station => station.lon))
  const maxLon = Math.max(...stations.map(station => station.lon))

  const latPadding = (maxLat - minLat) / 2
  const lonPadding = (maxLon - minLon) / 2

  return [
    [minLat-latPadding, minLon-lonPadding],
    [maxLat+latPadding, maxLon+lonPadding],
  ]
}

const Map = ({ lines, stations }) => {
  const { revealedStations } = useRevealedStations()

  const mapOptions = {
    center: [60.1986580, 24.9334287],
    zoom: 12,
    maxZoom: 15,
    minZoom: 10,
    maxBounds: findBounds(stations),
    zoomControl: false,
  }

  const markerIcon = iconType => L.icon({
    iconUrl: `${iconType}-station.png`,
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
        <Marker position={[station.lat, station.lon]} icon={markerIcon(station.icon)} attribution={osmAttribution} key={index}>
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

import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import { useRevealedStations } from './revealedStations'

const findBounds = stations => {
  const latitudes = stations.flatMap(station => station.locations.map(coords => coords[0]))
  const longitudes = stations.flatMap(station => station.locations.map(coords => coords[1]))

  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLon = Math.min(...longitudes)
  const maxLon = Math.max(...longitudes)

  const latPadding = (maxLat - minLat) / 2
  const lonPadding = (maxLon - minLon) / 2

  return [
    [minLat-latPadding, minLon-lonPadding],
    [maxLat+latPadding, maxLon+lonPadding],
  ]
}

const findCenter = stations => {
  const [[minLat, minLon], [maxLat, maxLon]] = findBounds(stations)
  return [(minLat+maxLat)/2, (minLon+maxLon)/2]
}

const Map = ({ lines, stations, gameMode, allRevealed }) => {
  const { revealedStations: getRevealedStations } = useRevealedStations()
  const revealedStations = getRevealedStations(gameMode)

  const mapOptions = {
    center: findCenter(stations),
    zoom: gameMode === 'train' ? 11 : 13,
    maxZoom: gameMode === 'train' ? 14 : 15,
    minZoom: gameMode === 'train' ? 11 : 13,
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

  const allStationsFound = stations.every(station => revealedStations.some(revealed => station.name === revealed))

  const osmAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <MapContainer {...mapOptions} style={{ width: '100%', height: '100%', backgroundColor: '#2c2c2d' }}>
      {(allStationsFound || allRevealed) && <TileLayer
        attribution={osmAttribution}
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        opacity={0.7}
      />}

      {(gameMode === 'tram' && !allStationsFound && !allRevealed) &&
        <TileLayer attribution={osmAttribution} url='/tiles/{z}/{x}/{y}.png' />
      }

      {stations.flatMap((station, index1) =>
        station.locations.map((coords, index2) =>
          <Marker position={coords} icon={markerIcon(station.icon)} attribution={osmAttribution} key={`${index1}-${index2}`}>
            {(revealedStations.includes(station.name) || allRevealed) &&
              <Tooltip permanent direction='bottom' className='map-tooltip'>{station.name}</Tooltip>
            }
          </Marker>
        )
      )}

      {lines.map((linePoints, index) =>
        <Polyline pathOptions={pathOptions} positions={linePoints} attribution={osmAttribution} key={index} />
      )}
    </MapContainer>
  )
}

export default Map

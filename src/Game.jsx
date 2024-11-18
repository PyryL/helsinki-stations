import { useEffect, useState } from 'react'
import Map from './Map'
import MapOverlay from './MapOverlay'
const dataFiles = import.meta.glob('./data/*.js')

const Game = ({ gameMode }) => {
  const [lines, setLines] = useState(null)
  const [stations, setStations] = useState(null)

  const loadData = (filePath, varName, setterFunction) => {
    (async () => {
      try {
        const data = await dataFiles[filePath]()
        setterFunction(data[varName])
      } catch (error) {
        console.error(error)
      }
    })()
  }

  useEffect(() => {
    if (gameMode === 'train') {
      loadData('./data/lines.js', 'lines', setLines)
      loadData('./data/stations.js', 'stations', setStations)
    } else {
      loadData('./data/tram-lines.js', 'lines', setLines)
      loadData('./data/tram-stops.js', 'stations', setStations)
    }
  }, [gameMode])

  if (lines === null || stations === null) {
    return <p>Ladataan...</p>
  }

  return (
    <div className='map-wrapper'>
      <Map lines={lines} stations={stations} gameMode={gameMode} />
      <MapOverlay stations={stations} gameMode={gameMode} />
    </div>
  )
}

export default Game

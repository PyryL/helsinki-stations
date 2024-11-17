import { useEffect, useState } from 'react'
import Map from './Map'
import MapOverlay from './MapOverlay'

const Game = ({ gameMode }) => {
  const [lines, setLines] = useState(null)
  const [stations, setStations] = useState(null)

  const loadData = (filePath, varName, setterFunction) => {
    (async () => {
      try {
        const data = await import(filePath)
        setterFunction(data[varName])
      } catch (error) {
        console.error(error)
      }
    })()
  }

  useEffect(() => {
    if (gameMode === 'train') {
      loadData('./data/lines', 'lines', setLines)
      loadData('./data/stations', 'stations', setStations)
    } else {
      loadData('./data/tram-lines', 'lines', setLines)
      loadData('./data/tram-stops', 'stations', setStations)
    }
  }, [gameMode])

  if (lines === null || stations === null) {
    return <p>Ladataan...</p>
  }

  return (
    <div className='map-wrapper'>
      <Map lines={lines} stations={stations} />
      <MapOverlay stations={stations} />
    </div>
  )
}

export default Game

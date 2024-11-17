import { useEffect, useState } from 'react'
import Map from './Map'
import MapOverlay from './MapOverlay'

const Game = ({ gameMode }) => {
  const [lines, setLines] = useState(null)
  const [stations, setStations] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const { lines: loadedLines } = await import('./data/lines')
        setLines(loadedLines)
      } catch (error) {
        console.error(error)
      }
    })();
    (async () => {
      try {
        const { stations: loadedStations } = await import('./data/stations')
        setStations(loadedStations)
      } catch (error) {
        console.error(error)
      }
    })()
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

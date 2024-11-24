import { useEffect, useState } from 'react'
import Map from './Map'
import Sidebar from './Sidebar'
const dataFiles = import.meta.glob('./data/*.js')

const Game = ({ gameMode }) => {
  const [lines, setLines] = useState(null)
  const [stations, setStations] = useState(null)
  const [allRevealed, setAllRevealed] = useState(false)

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
    <div className='game-container'>
      <Sidebar stations={stations} gameMode={gameMode} allRevealed={allRevealed} setAllRevealed={setAllRevealed} />

      <div className='map-wrapper'>
        <Map lines={lines} stations={stations} gameMode={gameMode} allRevealed={allRevealed} />
      </div>
    </div>
  )
}

export default Game

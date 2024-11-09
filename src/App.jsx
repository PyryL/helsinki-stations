import { useState } from 'react'
import Map from './Map'
import { stations } from './data/stations'

const App = () => {
  const [revealedStations, setRevealedStations] = useState([])
  const [inputText, setInputText] = useState('')

  const keyPressed = event => {
    if (event.key !== 'Enter') {
      return
    }

    const correctStation = stations.find(station => station.name.toLowerCase() === inputText.trim().toLowerCase())

    if (correctStation !== undefined) {
      setRevealedStations(oldValue => oldValue.concat(correctStation.name))
      setInputText('')
    }
  }

  return (
    <div>
      <input
        type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off'
        value={inputText} onChange={e => setInputText(e.target.value)}
        onKeyUp={keyPressed}
        style={{ marginBottom: 10 }}
      />
      <Map revealedStations={revealedStations} />
    </div>
  )
}

export default App

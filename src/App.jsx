import { useEffect, useState } from 'react'
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

  useEffect(() => {
    document.querySelector('.guess-input').focus()
  }, [])

  return (
    <div className='map-wrapper'>
      <Map revealedStations={revealedStations} />
      <input
        className='guess-input'
        type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' maxLength={30}
        value={inputText} onChange={e => setInputText(e.target.value)}
        onKeyUp={keyPressed}
        placeholder='Kirjoita aseman nimi...'
      />
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import Map from './Map'
import { stations } from './data/stations'
import { useRevealedStations } from './revealedStations'

const App = () => {
  const { revealedStations, revealStation } = useRevealedStations()
  const [inputText, setInputText] = useState('')

  const keyPressed = event => {
    if (event.key !== 'Enter') {
      return
    }

    const correctStation = stations.find(station => station.name.toLowerCase() === inputText.trim().toLowerCase())

    if (correctStation !== undefined) {
      revealStation(correctStation.name)
      setInputText('')
    } else {
      if (!document.querySelector('.guess-input').classList.contains('incorrect')) {
        document.querySelector('.guess-input').classList.add('incorrect')
        setTimeout(() => document.querySelector('.guess-input').classList.remove('incorrect'), 200)
      }
    }
  }

  useEffect(() => {
    document.querySelector('.guess-input').focus()
  }, [])

  return (
    <div className='map-wrapper'>
      <Map />
      <input
        className='guess-input'
        type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' maxLength={30}
        value={inputText} onChange={e => setInputText(e.target.value)}
        onKeyUp={keyPressed}
        placeholder='Kirjoita aseman nimi...'
      />
      <div className='progress-pane'>
        {revealedStations.length}/{stations.length}
      </div>
    </div>
  )
}

export default App

import { useEffect, useState } from 'react'
import { stations } from './data/stations'
import { useRevealedStations } from './revealedStations'
import { useNavigate } from 'react-router-dom'

const correctSound = new Audio('correct.mp3')

const MapOverlay = () => {
  const { revealedStations, revealStation, reset: resetRevealedStations } = useRevealedStations()
  const [inputText, setInputText] = useState('')
  const navigate = useNavigate()

  const keyPressed = event => {
    if (event.key !== 'Enter') {
      return
    }

    const correctStation = stations.find(station => station.name.toLowerCase() === inputText.trim().toLowerCase())

    if (correctStation !== undefined) {
      revealStation(correctStation.name)
      setInputText('')
      correctSound.play()
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
    <div className='map-overlay'>
      <div className='map-overlay-pane' style={{ marginLeft: 0, marginRight: 'auto' }}>
        <button onClick={() => navigate('/')}>Etusivu</button>
      </div>
      <input
        className='guess-input'
        type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' maxLength={30}
        value={inputText} onChange={e => setInputText(e.target.value)}
        onKeyUp={keyPressed}
        placeholder='Kirjoita aseman nimi...'
      />
      <div className='map-overlay-pane'>
        <button onClick={resetRevealedStations}>Tyhjennä</button>
        <span className='score-label'>{revealedStations.length}/{stations.length}</span>
      </div>
    </div>
  )
}

export default MapOverlay

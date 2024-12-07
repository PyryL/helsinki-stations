import { useEffect, useState } from 'react'
import { useRevealedStations } from './revealedStations'
import { Link } from 'react-router-dom'
import compareStationNames from './compareStationNames'

const correctSound = new Audio('correct.mp3')

const MapOverlay = ({ stations, gameMode, allRevealed, setAllRevealed }) => {
  const { revealedStations, revealStation, reset: resetRevealedStations } = useRevealedStations()
  const [inputText, setInputText] = useState('')

  const keyPressed = event => {
    if (event.key !== 'Enter') {
      return
    }

    const correctStation = stations.find(station => station.names.some(name => compareStationNames(name, inputText)))

    if (correctStation !== undefined) {
      revealStation(correctStation.names[0], gameMode)
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

  const scorePercent = revealedStations(gameMode).length / stations.length
  const scoreStation = gameMode === 'train' ? 'asemaa' : 'pysäkkiä'
  const scoreLabel = `${revealedStations(gameMode).length} / ${stations.length} ${scoreStation} (${(100*scorePercent).toFixed(0)}%)`

  return (
    <div className='game-sidebar'>
      <Link to='/' className='frontpage-link'>&larr; Etusivu</Link>
      <input
        className='guess-input'
        type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' maxLength={30}
        value={inputText} onChange={e => setInputText(e.target.value)}
        onKeyUp={keyPressed}
        placeholder='Kirjoita aseman nimi...'
      />
      <div className='score-button-container'>
        <button onClick={() => resetRevealedStations(gameMode)} className='score-button'>Nollaa</button>
        <button onClick={() => setAllRevealed(x => !x)} className='score-button'>
          {allRevealed ? 'Piilota' : 'Näytä kaikki'}
        </button>
      </div>
      <span className='score-label'>{scoreLabel}</span>
      <ul className='station-list'>
        {revealedStations(gameMode).map(stationName =>
          <li key={stationName}>{stationName}</li>
        )}
      </ul>
      <span className='sidebar-copyright'>
        &copy; 2024 Pyry Lahtinen.
        Katso <a href='https://github.com/PyryL/helsinki-stations#readme'>lisenssit</a>.
      </span>
    </div>
  )
}

export default MapOverlay

import { createContext, useContext, useState, useEffect } from 'react'

const RevealedStationsContext = createContext()

const loadStationsFromStorage = () => {
  const savedData = localStorage.getItem('revealedStations')

  if (savedData === null) {
    return null
  }

  let parsedData = JSON.parse(savedData)

  // backward compability
  if (Array.isArray(parsedData)) {
    parsedData = { train: parsedData, tram: [] }
  }

  return parsedData
}

export const RevealedStationsProvider = ({ children }) => {
  const [stations, setStations] = useState(() => {
    return loadStationsFromStorage() ?? { train: [], tram: [] }
  })

  const revealStation = (stationName, gameMode) => {
    setStations(oldValue => {
      if (oldValue[gameMode].includes(stationName)) {
        return oldValue
      }
      return {
        ...oldValue,
        [gameMode]: [...oldValue[gameMode], stationName],
      }
    })
  }

  const reset = gameMode => {
    setStations(oldValue => {
      return {
        ...oldValue,
        [gameMode]: [],
      }
    })
  }

  useEffect(() => {
    localStorage.setItem('revealedStations', JSON.stringify(stations))
  }, [stations])

  const providedMethods = {
    revealedStations: gameMode => stations[gameMode],
    revealStation,
    reset,
  }

  return (
    <RevealedStationsContext.Provider value={providedMethods}>
      {children}
    </RevealedStationsContext.Provider>
  )
}

export const useRevealedStations = () => {
  return useContext(RevealedStationsContext)
}

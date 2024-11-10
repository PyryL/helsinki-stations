import { createContext, useContext, useState, useEffect } from 'react'

const RevealedStationsContext = createContext()

export const RevealedStationsProvider = ({ children }) => {
  const [stations, setStations] = useState([])
  
  const revealStation = stationName => {
    setStations(oldValue => {
      if (oldValue.includes(stationName)) {
        return oldValue
      }
      return oldValue.concat(stationName)
    })
  }

  const reset = () => {
    setStations([])
  }

  useEffect(() => {
    const savedData = localStorage.getItem('revealedStations')
    if (savedData !== null) {
      setStations(JSON.parse(savedData))
    }
  }, [])

  useEffect(() => {
    if (stations.length === 0) {
      localStorage.removeItem('revealedStations')
    } else {
      localStorage.setItem('revealedStations', JSON.stringify(stations))
    }
  }, [stations])

  const providedMethods = {
    revealedStations: stations,
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

import { fetchData, saveData } from './utils.js'

const lineQuery = `
[out:json];

area["name"="Helsinki"]->.helsinki;
area["name"="Espoo"]->.espoo;
area["name"="Vantaa"]->.vantaa;
area["name"="Kauniainen"]->.kauniainen;

(.helsinki; .espoo; .vantaa; .kauniainen;)->.searchArea;

way["railway"="tram"]["service"!="yard"](area.searchArea);

(._; node(w)(area.searchArea););

out;
`

const handleLineData = data => {
  let nodes = {}
  let ways = []

  for (const elem of data.elements) {
    if (elem.type === 'node') {
      nodes[elem.id] = [elem.lat, elem.lon]
    } else if (elem.type === 'way') {
      ways.push(elem.nodes)
    }
  }

  let polylines = ways.map(nodesOfWay => {
    const coordinateList = nodesOfWay.map(nodeId => nodes[nodeId])
    return coordinateList
  })

  // filter out ways that are in Kruunuvuorenranta
  polylines = polylines.filter(coordinateList => {
    return !coordinateList.some(([lat, lon]) => lat > 60.157 && lat < 60.187 && lon > 24.997 && lon < 25.075)
  })

  saveData(polylines, 'lines', 'tram-lines')
}

const stopQuery = `
[out:json];

area["name"="Helsinki"]->.helsinki;
area["name"="Espoo"]->.espoo;
area["name"="Vantaa"]->.vantaa;
area["name"="Kauniainen"]->.kauniainen;

(.helsinki; .espoo; .vantaa; .kauniainen;)->.searchArea;

node["railway"="tram_stop"]["zone:HSL"](area.searchArea);

out;
`

const handleStopsData = data => {

  let stops = {}

  const filteredStops = [
    'H0612', 'H0621',           // two unnecessary stops in Pasila
    'H0271', 'H0272',           // two stops at Velodromi
    'H0337',                    // Kumpulan kampus
    'H0329',                    // Paavalinkirkko
    'H0133', 'H0114', 'H0113',  // Töölöntulli
    'H0409',                    // Tove Janssonin puisto
  ]

  for (const element of data.elements) {
    // filter out temporarily moved stop locations
    if (element.tags.note && element.tags.note.toLowerCase().includes('temporal')) {
      continue
    }
    // filter out manually chosen unnecessary stops
    if (filteredStops.includes(element.tags.ref)) {
      continue
    }
    let elementName = element.tags.name ?? element.tags['was:name']

    if (!Object.keys(stops).includes(elementName)) {
      stops[elementName] = []
    }
    stops[elementName].push([element.lat, element.lon])
  }

  let result = []

  for (let [stopName, locations] of Object.entries(stops)) {
    // TODO: add multiple markers for Velodromi, Fleminginkatu, Eläintarha, Ylioppilastalo

    let latAvg = 0, lonAvg = 0
    for (const location of locations) {
      latAvg += location[0]
      lonAvg += location[1]
    }
    latAvg /= locations.length
    lonAvg /= locations.length

    // remove metro station indicator from the name
    if (stopName.endsWith(' (M)')) {
      stopName = stopName.substring(0, stopName.length - 4)
    }

    result.push({
      locations: [[latAvg, lonAvg]],
      name: stopName,
      icon: 'tram',
    })
  }

  // combine certain stops to only count as one
  const stopClusters = [
    {
      members: ['Linnanmäki (pohj.)', 'Linnanmäki (etelä)'],
      name: 'Linnanmäki',
    },
    {
      members: ['Länsiterminaali T1', 'Länsiterminaali T2'],
      name: 'Länsiterminaali',
    },
  ]
  for (const cluster of stopClusters) {
    const locations = cluster.members.flatMap(member => result.find(resultItem => resultItem.name === member).locations)
    result = result.filter(resultItem => !cluster.members.includes(resultItem.name))
    result.push({
      locations,
      name: cluster.name,
      icon: 'tram',
    })
  }

  saveData(result, 'stations', 'tram-stops')
}

fetchData(lineQuery).then(data => handleLineData(data))
fetchData(stopQuery).then(data => handleStopsData(data))

import { fetchData, saveData } from './utils.js'

const lineQuery = `
[out:json];

area["name"="Helsinki"]->.helsinki;
area["name"="Espoo"]->.espoo;
area["name"="Vantaa"]->.vantaa;
area["name"="Kauniainen"]->.kauniainen;

(.helsinki; .espoo; .vantaa; .kauniainen;)->.searchArea;

(
  relation["route"="train"]["network"="HSL"](area.searchArea);
  relation["route"="subway"]["network"="HSL"](area.searchArea);
)->.relations;

(
  way(r.relations)["railway"="rail"];
  way(r.relations)["railway"="subway"];
)->.ways;

(.relations; .ways; node(w.ways)(area.searchArea););

out;
`

const handleLineData = data => {
  
  let nodes = {}
  let ways = {}
  let relations = []

  for (const elem of data.elements) {
    if (elem.type === 'node') {
      nodes[elem.id] = [elem.lat, elem.lon]
    } else if (elem.type === 'way') {
      ways[elem.id] = elem.nodes
    } else if (elem.type === 'relation') {
      relations.push(elem.members.filter(member => member.type === 'way').map(member => member.ref))
    }
  }

  const polylines = relations.flatMap(relation => {

    const waysOfRelation = relation.map(wayId => {
      if (!(wayId in ways)) {
        return []
      }

      const nodeIdsOfWay = ways[wayId]
      const coordsList = nodeIdsOfWay.map(nodeId => nodes[nodeId])

      if (coordsList.includes(undefined)) {
        return []
      }

      return coordsList
    })

    return waysOfRelation.filter(way => way.length > 0)
  })

  saveData(polylines, 'lines', 'lines')
}

const stationQuery = `
[out:json];

area["name"="Helsinki"]->.helsinki;
area["name"="Espoo"]->.espoo;
area["name"="Vantaa"]->.vantaa;
area["name"="Kauniainen"]->.kauniainen;

(.helsinki; .espoo; .vantaa; .kauniainen;)->.searchArea;

node["railway"="station"]["station"!="light_rail"](area.searchArea);

out;
`

const handleStationData = data => {

  const result = data.elements.flatMap(node => {
    if (node.tags.name.toLowerCase().includes('autojuna')) {
      return []
    }
    return [{
      locations: [[node.lat, node.lon]],
      name: node.tags.name,
      icon: node.tags.station === 'subway' ? 'metro' : 'train',
    }]
  })

  saveData(result, 'stations', 'stations')
}

fetchData(lineQuery).then(data => handleLineData(data))
fetchData(stationQuery).then(data => handleStationData(data))

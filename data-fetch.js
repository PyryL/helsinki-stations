import { writeFileSync, mkdirSync } from 'node:fs'

// This script is used to download and parse the data
// stored in src/data directory.
// Since the OSM data may change at any time,
// manual checking of the output files is needed.

const dataFileCopyrightComment = `/**
 * Data copyright (c) OpenStreetMap contributors
 * Open Database License
 * https://www.openstreetmap.org/copyright
 * 
 * Downloaded on ${new Date().toISOString()}
 */

`

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

const fetchData = async query => {
  const result = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
  })

  return await result.json()
}

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

  const dataFile = dataFileCopyrightComment + 'export const lines = ' + JSON.stringify(polylines) + '\n'

  writeFileSync('src/data/lines.js', dataFile, { encoding: 'utf-8' })
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
      lat: node.lat,
      lon: node.lon,
      name: node.tags.name,
      type: node.tags.station === 'subway' ? 'metro' : 'train',
    }]
  })

  const dataFile = dataFileCopyrightComment + 'export const stations = ' + JSON.stringify(result) + '\n'
  writeFileSync('src/data/stations.js', dataFile, { encoding: 'utf-8' })
}

mkdirSync('src/data', { recursive: true })
fetchData(lineQuery).then(data => handleLineData(data))
fetchData(stationQuery).then(data => handleStationData(data))

import { fetchData } from './utils.js'
import { createCanvas } from 'canvas'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

const query = `
[out:json];

area["name"="Helsinki"]->.helsinki;

(
  relation["name"="Mustikkamaa"](area.helsinki);
  relation["name"="Korkeasaari"](area.helsinki);
  relation["name"="Kulosaari"](area.helsinki);
  relation["name"="Kuusisaari"](area.helsinki);
)->.excludedRelations;

way(r.excludedRelations)->.excludedWays;

(
  way["natural"="coastline"]["place"!="islet"]["place"!="island"](area.helsinki);
  - .excludedWays;
)->.ways;

(.ways; node(w.ways)(area.helsinki););

out;
`

const tileToLatLon = (x, y, z) => {
  const n = Math.pow(2, z)
  const lonDeg = (x / n) * 360 - 180
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n)))
  const latDeg = (latRad * 180) / Math.PI

  return [latDeg, lonDeg]
}

const handleData = data => {
  console.log('preparing data...')

  let nodes = {}
  let ways = []

  for (let elem of data.elements) {
    if (elem.type === 'node') {
      nodes[elem.id] = [elem.lat, elem.lon]
    } else if (elem.type === 'way') {
      ways.push(elem.nodes)
    }
  }

  const isOutOfBounds = (lat, lon) => {
    if (lon > 25.003758 || lon < 24.866027 || lat < 60.143782) return true

    // Lammassaari
    if (lat > 60.200132 && lon > 24.984302) return true

    // Kivinokka
    if (lat > 60.193020 && lon > 24.997391) return true

    // Lauttasaari
    if (lon < 24.8959591 && lat < 60.1739293) return true

    // Korkeasaarenluoto
    if (lat < 60.1745489 && lat > 60.1738739 && lon > 24.9775587 && lon < 24.978561) return true

    return false
  }

  let completeWays = []

  for (let nodeIds of ways) {
    let coords = nodeIds.map(nodeId => nodes[nodeId])
    if (coords.includes(undefined)) continue

    // split by the nodes out of bounds
    let buffer = []
    for (let i=0; i<coords.length; i++) {
      if (isOutOfBounds(coords[i][0], coords[i][1])) {
        completeWays.push(buffer)
        buffer = []
      } else {
        buffer.push(coords[i])
      }
    }
    completeWays.push(buffer)
  }
  
  completeWays = completeWays.filter(way => way.length > 0)

  createTiles(completeWays)
}

const createTiles = ways => {
  console.log('drawing tiles...')

  let minX = 4660, maxX = 4667, minY = 2368, maxY = 2375

  for (let z=13; z<16; z++) {
    console.log(`drawing tile level z=${z}...`)

    for (let x=minX; x<=maxX; x++) {
      for (let y=minY; y<=maxY; y++) {
        drawTile(x, y, z, ways)
      }
    }

    minX *= 2
    maxX = maxX * 2 + 1
    minY *= 2
    maxY = maxY * 2 + 1
  }
}

const drawTile = (x, y, z, ways) => {
  const tileSize = 256
  const [leftLat, topLon] = tileToLatLon(x, y, z)         // top left
  const [rightLat, bottomLon] = tileToLatLon(x+1, y+1, z) // bottom right

  const latLonToPixel = (lat, lon) => {
    const mercatorY = lat => {
      const rad = (lat * Math.PI) / 180
      return Math.log(Math.tan(Math.PI / 4 + rad / 2))
    }

    const x = (lon - topLon) / (bottomLon - topLon)
    const y = (mercatorY(leftLat) - mercatorY(lat)) / (mercatorY(leftLat) - mercatorY(rightLat))

    return [
      Math.round(x * tileSize),
      Math.round(y * tileSize)
    ]
  }

  const canvas = createCanvas(tileSize, tileSize)
  const ctx = canvas.getContext('2d')

  for (let coordList of ways) {
    ctx.beginPath()

    const startPoint = latLonToPixel(coordList[0][0], coordList[0][1])
    ctx.moveTo(startPoint[0], startPoint[1])

    for (let i=1; i<coordList.length; i++) {
      const point = latLonToPixel(coordList[i][0], coordList[i][1])

      ctx.lineTo(point[0], point[1])
    }

    ctx.strokeStyle = '#9ba9b2cc'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  const pngData = canvas.toBuffer()

  const path = `public/tiles/${z}/${x}/${y}.png`

  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, pngData)
}

console.log('downloading data...')
fetchData(query).then(data => handleData(data))

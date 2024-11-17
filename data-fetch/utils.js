import { writeFileSync, mkdirSync } from 'node:fs'

const dataFileCopyrightComment = `/**
 * Data copyright (c) OpenStreetMap contributors
 * Open Database License
 * https://www.openstreetmap.org/copyright
 * 
 * Downloaded on ${new Date().toISOString()}
 */

`

export const fetchData = async query => {
  const result = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
  })

  return await result.json()
}

/**
 * Save the given data so that it can be used in the app.
 * @param {any} data Data to save.
 * @param {string} varName Name of the variable that can be imported in the app.
 * @param {string} fileName Name of the file where the data is saved. No containing directories or file extension allowed.
 */
export const saveData = (data, varName, fileName) => {
  const fileContent = dataFileCopyrightComment + `export const ${varName} = ` + JSON.stringify(data) + '\n'
  mkdirSync('src/data', { recursive: true })
  writeFileSync(`src/data/${fileName}.js`, fileContent, { encoding: 'utf-8' })
}

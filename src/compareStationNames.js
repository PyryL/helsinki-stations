
/**
 * Checks whether the names are close enough to be considered the same.
 * @param {string} name1 
 * @param {string} name2 
 * @returns {boolean}
 */
const compareStationNames = (name1, name2) => {
  /**
   * Cleans the given name by removing all hard-to-write amd non-relevant characters
   * and making it lowercase.
   * @param {string} name
   */
  const cleanName = name => {
    // Here we want to replace ä and ö with non-umlauts
    // in case someone does not have them on their keybord.
    // Also remove all that do not belong to (a-z, ä, ö) to
    // make the system allow easier writing for those hard names.
    // Examples:
    //    Castréninkatu
    //    Tarkk'ampujankatu
    //    Aalto-yliopisto
    return name.toLowerCase().replaceAll('ä', 'a').replaceAll('ö', 'o').replaceAll(/[^a-z]/g, '')
  }

  const s1 = cleanName(name1), s2 = cleanName(name2)

  if (s1 === s2) return true

  if (Math.abs(s1.length - s2.length) > 1) return false

  // check if flipping any two chars would make a match
  for (let i=1; i<s1.length; i++) {
    const newS1 = s1.substring(0, i-1) + s1.charAt(i) + s1.charAt(i-1) + s1.substring(i+1)
    if (newS1 === s2) return true
  }

  // check if removing a char would make a match
  if (s1.length !== s2.length) {
    const longerS = s1.length > s2.length ? s1 : s2
    const shorterS = s1.length > s2.length ? s2 : s1

    for (let i=0; i<longerS.length; i++) {
      const newLongerS = longerS.substring(0, i) + longerS.substring(i+1)
      if (newLongerS === shorterS) return true
    }
  }

  return false
}

export default compareStationNames

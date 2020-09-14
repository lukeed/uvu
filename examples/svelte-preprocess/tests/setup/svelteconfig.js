const fs = require('fs')
const path = require('path')

const configFilename = 'svelte.config.js'

exports.getSvelteConfig = (rootMode, filename) => {
  const configDir = rootMode === 'upward'
    ? getConfigDir(path.dirname(filename))
    : process.cwd()
  const configFile = path.resolve(configDir, configFilename)

  if (!fs.existsSync(configFile)) {
    throw Error(`Could not find ${configFilename}`)
  }

  return configFile
}

const getConfigDir = (searchDir) => {
  if (fs.existsSync(path.join(searchDir, configFilename))) {
    return searchDir
  }

  const parentDir = path.resolve(searchDir, '..')
  return parentDir !== searchDir
    ? getConfigDir(parentDir)
    : searchDir // Stop walking at filesystem root
}

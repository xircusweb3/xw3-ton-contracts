const { existsSync, readFileSync } = require('fs')

const getPackage = (path) => JSON.parse(readFileSync(`${path}/package.json`, 'utf8'))

const isBlueprint = (path) => existsSync(`${path}/blueprint.config.ts`)

const hasBlueprint = (path) => {
  const pson = getPackage(path)
  return !!pson.dependencies?.['@ton/blueprint'] || !!pson.devDependencies?.['@ton/blueprint']
}

module.exports = { 
  isBlueprint,
  getPackage,
  hasBlueprint
}
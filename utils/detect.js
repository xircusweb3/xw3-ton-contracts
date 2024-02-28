const { existsSync, readFileSync } = require('fs')

const isBlueprint = (path) => existsSync(`${path}/blueprint.config.ts`)

module.exports = { isBlueprint }
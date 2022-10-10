require('dotenv').config()
const fs = require('fs')
const ark_survival_evolved = require('./servers/ark_survival_evolved')
const conan_exiles = require('./servers/conan_exiles')
const minecraft = require('./servers/minecraft')
const seven_days_to_die = require('./servers/seven_days_to_die')
const valheim = require('./servers/valheim')
const space_engineers = require('./servers/space_engineers')
const json = JSON.parse(fs.readFileSync('servers.json'))

if (typeof json !== 'undefined') {
  ark_survival_evolved.login(process.env.ARK_SURVIVAL_EVOLVED_METRICS, json)
  conan_exiles.login(process.env.CONAN_EXILES_METRICS, json)
  minecraft.login(process.env.MINECRAFT_METRICS, json)
  seven_days_to_die.login(process.env.SEVEN_DAYS_TO_DIE_METRICS, json)
  space_engineers.login(process.env.SPACE_ENGINEERS_METRICS, json)
  valheim.login(process.env.VALHEIM_METRICS, json)
} else {
  console.log("Discord bot failed to find it's required configuration file.")
}

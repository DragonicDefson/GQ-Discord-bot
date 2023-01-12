const ark_survival_evolved = require('./servers/ark_survival_evolved')
const conan_exiles = require('./servers/conan_exiles')
const minecraft = require('./servers/minecraft')
const seven_days_to_die = require('./servers/seven_days_to_die')
const valheim = require('./servers/valheim')
const space_engineers = require('./servers/space_engineers')
const config = require('./config')
const express = require('express')
const application = express()
const logger = require('./logging')
const server_config = config.load('server-definitions')
const api_configuration = config.load('sub-modules')
const application_name = config.load('name')
require('./api')(application)

if (server_config !== undefined) {
  if (api_configuration['api']['enabled']) {
    application.listen(api_configuration['api']['port'], api_configuration['api']['host_interface'], () => {
      logger.log('info', `${application_name} API Submodule enabled.`)
    })
  }
  ark_survival_evolved.login(server_config['ark-survival-evolved']['discord-key'])
  conan_exiles.login(server_config['conan-exiles']['discord-key'])
  minecraft.login(server_config['minecraft']['discord-key'])
  seven_days_to_die.login(server_config['seven-days-to-die']['discord-key'])
  space_engineers.login(server_config['space-engineers']['discord-key'])
  valheim.login(server_config['valheim']['discord-key'])
}
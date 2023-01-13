const config = require('./config')
const express = require('express')
const application = express()
const logger = require('./logging')
const core_functionality = config.load('core-functionality')
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

  for (let increment = 0; increment < core_functionality['server-names'].length; increment++) {
    callFuncOnString(`${core_functionality['server-names'][increment].replaceAll('-', '_')}_login`, server_config[core_functionality['server-names'][increment]]['discord-key'])
  }

  function callFuncOnString (input, data) {
    var function_name = input.toString().trim()
    if (typeof global[function_name] === "function") {
      return global[function_name](data)
    }
  }
}
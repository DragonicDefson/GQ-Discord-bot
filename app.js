const express = require('express')
const application = express()
const logger = require('./logging')
const config = require("./config")
require("./config").push()
const core_config = config.core()
const server_config = config.definitions()
const api_config = config.api()
require('./api')(application)

if (api_config['enabled']) {
  application.listen(api_config['port'], api_config['host_interface'], () => { logger.log('info', `[api]: sub-module enabled.`) })
  if (server_config !== undefined) {
    let server_names = core_config["server-names"]
    for (let increment = 0; increment < server_names.length; increment++) {
      call(`${server_names[increment].replaceAll('-', '_')}_login`, server_config[server_names[increment]]['discord-key'])
    }
  }
}

function call(input, data) {
  var function_name = input.toString().trim()
  if (typeof global[function_name] === "function") { return global[function_name](data) }
}
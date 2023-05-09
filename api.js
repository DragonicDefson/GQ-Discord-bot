const logger = require('./logging')
const ark_survival_evolved = require('./servers/ark_survival_evolved')
const conan_exiles = require('./servers/conan_exiles')
const minecraft = require('./servers/minecraft')
const seven_days_to_die = require('./servers/seven_days_to_die')
const valheim = require('./servers/valheim')
const space_engineers = require('./servers/space_engineers')
const config = require('./config')
const security = require('./security')
const version = config.version()
const path = require('path')
const express = require('express')
const cors = require('cors')
const encryption_options = config.load()["sub-modules"]["security"]["encryption"]

module.exports = (application) => {

  application.use(cors())
  application.use(express.urlencoded({ extended: true }))
  application.use(express.static(path.join(__dirname, 'contents'), { index: 'index.html' }))

  application.post(`/api/v${version}/games`, (request, response) => {
    let data = security.decrypt(request.body.data)
    data = data_parse(data)
    switch (data) {
      case undefined:
        let message =  'Resource not found'
        let status = security.encrypt(JSON.stringify({
          status: 404,
          message: message
        }))
        response.send(status); logger.log('error', `${message}: ${data}`); break
      default:
        switch (encryption_options["enabled"]) {
          case true: let response_data = security.encrypt(data); response.send(response_data); break;
          default: response.send(data); break;
        }
      break
    }

  })

  function data_parse (type) {
    let all_data = {
      minecraft: minecraft.gatherData(),
      valheim: valheim.gatherData(),
      ark_survival_evolved: ark_survival_evolved.gatherData(),
      space_engineers: space_engineers.gatherData(),
      conan_exiles: conan_exiles.gatherData(),
      seven_days_to_die: seven_days_to_die.gatherData()
    }
    if (type === 'bulk') { return JSON.stringify(all_data) } else { return JSON.stringify(all_data[type.replace('-', '_')]) }
  }
}

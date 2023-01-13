const logger = require('./logging')
const ark_survival_evolved = require('./servers/ark_survival_evolved')
const conan_exiles = require('./servers/conan_exiles')
const minecraft = require('./servers/minecraft')
const seven_days_to_die = require('./servers/seven_days_to_die')
const valheim = require('./servers/valheim')
const space_engineers = require('./servers/space_engineers')
const config = require('./config')

module.exports = (application) => {
  application.get('/api/v1/games/:game_type', (request, response) => {
    let game_type = request.params.game_type
    let api_data = game_handlers(game_type)
    if (api_data === undefined) {
      logger.log('exception', `[404] Resource not found: ${game_type}.`)
      response.json({ status: '404', data: `Resource: ${game_type} not found.` })
    } else {
      response.json({
        status: '200',
        network_name: config.load('core-functionality')['network-name'],
        data: api_data
      })
    }
  })

  function game_handlers(value) {
    switch (value) {
      case 'retrieve-bulk-data':
        return {
          minecraft: {
            name: minecraft.gatherData().name,
            data: minecraft.gatherData().data,
            type: minecraft.gatherData().type
          },
          valheim: {
            name: valheim.gatherData().name,
            data: valheim.gatherData().data,
            type: valheim.gatherData().type
          },
          ark_survival_evolved: {
            name: ark_survival_evolved.gatherData().name,
            data: ark_survival_evolved.gatherData().data,
            type: ark_survival_evolved.gatherData().type
          },
          space_engineers: {
            name: space_engineers.gatherData().name,
            data: space_engineers.gatherData().data,
            type: space_engineers.gatherData().type
          },
          conan_exiles: {
            name: conan_exiles.gatherData().name,
            data: conan_exiles.gatherData().data,
            type: conan_exiles.gatherData().type
          },
          seven_days_to_die: {
            name: seven_days_to_die.gatherData().name,
            data: seven_days_to_die.gatherData().data,
            type: seven_days_to_die.gatherData().type
          }
        }
      case 'minecraft':
        return {
          name: minecraft.gatherData().name,
          data: minecraft.gatherData().data,
          type: minecraft.gatherData().type
        }
      case 'valheim':
        return {
          name: valheim.gatherData().name,
          data: valheim.gatherData().data,
          type: valheim.gatherData().type
        }
      case 'ark-survival-evolved':
        return {
          name: ark_survival_evolved.gatherData().name,
          data: ark_survival_evolved.gatherData().data,
          type: ark_survival_evolved.gatherData().type
        }
      case 'space-engineers':
        return {
          name: space_engineers.gatherData().name,
          data: space_engineers.gatherData().data,
          type: space_engineers.gatherData().type
        }
      case 'conan-exiles':
        return {
          name: conan_exiles.gatherData().name,
          data: conan_exiles.gatherData().data,
          type: conan_exiles.gatherData().type
        }
      case 'seven-days-to-die':
        return {
          name: seven_days_to_die.gatherData().name,
          data: seven_days_to_die.gatherData().data,
          type: seven_days_to_die.gatherData().type
        }
      default:
        return undefined
    }
  }
}
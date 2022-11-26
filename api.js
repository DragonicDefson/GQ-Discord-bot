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
            name: minecraft.gather_data().name,
            data: minecraft.gather_data().data,
            type: minecraft.gather_data().type
          },
          valheim: {
            name: valheim.gather_data().name,
            data: valheim.gather_data().data,
            type: valheim.gather_data().type
          },
          ark_survival_evolved: {
            name: ark_survival_evolved.gather_data().name,
            data: ark_survival_evolved.gather_data().data,
            type: ark_survival_evolved.gather_data().type
          },
          space_engineers: {
            name: space_engineers.gather_data().name,
            data: space_engineers.gather_data().data,
            type: space_engineers.gather_data().type
          },
          conan_exiles: {
            name: conan_exiles.gather_data().name,
            data: conan_exiles.gather_data().data,
            type: conan_exiles.gather_data().type
          },
          seven_days_to_die: {
            name: seven_days_to_die.gather_data().name,
            data: seven_days_to_die.gather_data().data,
            type: seven_days_to_die.gather_data().type
          }
        }
      case 'minecraft':
        return {
          name: minecraft.gather_data().name,
          data: minecraft.gather_data().data,
          type: minecraft.gather_data().type
        }
      case 'valheim':
        return {
          name: valheim.gather_data().name,
          data: valheim.gather_data().data,
          type: valheim.gather_data().type
        }
      case 'ark-survival-evolved':
        return {
          name: ark_survival_evolved.gather_data().name,
          data: ark_survival_evolved.gather_data().data,
          type: ark_survival_evolved.gather_data().type
        }
      case 'space-engineers':
        return {
          name: space_engineers.gather_data().name,
          data: space_engineers.gather_data().data,
          type: space_engineers.gather_data().type
        }
      case 'conan-exiles':
        return {
          name: conan_exiles.gather_data().name,
          data: conan_exiles.gather_data().data,
          type: conan_exiles.gather_data().type
        }
      case 'seven-days-to-die':
        return {
          name: seven_days_to_die.gather_data().name,
          data: seven_days_to_die.gather_data().data,
          type: seven_days_to_die.gather_data().type
        }
      default:
        return undefined
    }
  }
}
const GameDig = require('gamedig')
const { Client, IntentsBitField } = require('discord.js')
const logger = require('../logging')
const config = require('../config')
const core_functionality = config.load('core-functionality')
const server_config = config.load('server-definitions')
const game_name = 'ark-survival-evolved'
const application_name = config.load('name')
const network_name = core_functionality['network-name']
let client, discord_data, api_data, type, offline_log_limit = undefined

function login (auth_token) {
  offline_log_limit = core_functionality['offline-log-limit']
  if (server_config[game_name]['enabled']) {
    client = new Client({intents: [IntentsBitField.Flags.Guilds]})
    client.login(auth_token)
    client.on('ready', async () => {
      logger.log('info', `${application_name} has succeeded Discord authorization process and is running.`)
      asyncTimer(core_functionality['query_timeout'])
    })
  }
}

function updateStats (timeout) {
  client.user.setActivity(Buffer.from(`${network_name} ${server_config[game_name]['stats-prefix']} ${discord_data}`, 'utf-8').toString(), [{
    status: 'online',
    type: server_config[game_name]['stats-type']
  }])
  asyncTimer(timeout)
}

function queryData () {
  let query_timeout = core_functionality['query-timeout']
  GameDig.query({
    port: server_config[game_name]['port'],
    socketTimeout: server_config[game_name]['socketTimeout'],
    attemptTimeout: server_config[game_name]['attemptTimeout'],
    maxAttempts: server_config[game_name]['maxAttempts'],
    givenPortOnly: server_config[game_name]['givenPortOnly'],
    type: server_config[game_name]['type'],
    host: server_config[game_name]['host'],
    debug: server_config[game_name]['debug'],
    requestRules: server_config[game_name]['request-rules']
  }).then((state) => {
    if (state.ping > server_config[game_name]['PingCheckThreshold']) {
      type = 'ping'
      api_data = `${state.ping}`
      discord_data = `${server_config[game_name]['degraded']}${state.ping} ping`
      updateStats(query_timeout)
    } else {
      type = 'data'
      api_data = `${state.players.length}\/${state.maxplayers}`
      discord_data = `${server_config[game_name]['online']}${state.players.length}\/${state.maxplayers}`
      updateStats(query_timeout)
    }
  }).catch((exception) => {
    type = 'status'
    api_data = 'Server: offline'
    discord_data = server_config[game_name]['offline']
    for (let offlinebase = 0; offlinebase < offline_log_limit; offlinebase++) {
      logger.log('error', exception)
    }
    updateStats(core_functionality['maintenance-timeout'])
  })
}

function asyncTimer (timeout) {
  setTimeout(async () => {
    queryData()
  }, parseInt(timeout || 5000, 10))
}

function gather_data() {
  let return_data = {
    name:game_name,
    data:api_data,
    type:type
  }
  return return_data
}

module.exports = { login, gather_data }

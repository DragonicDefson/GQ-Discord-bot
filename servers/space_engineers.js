const game_name = "space-engineers"
let client, discord_data, api_data, type, offline_log_limit, ping, client_state, handler_state = undefined

const GameDig = require("gamedig").query
const { Client, IntentsBitField } = require("discord.js")
const config = require("../config").load()
const logger = require("../logging")

const core = config["core-functionality"]
const network_name = core["network-name"]
const query_timeout = core["query-timeout"]

const server_config = config["server-definitions"][game_name]
let max_attempts = server_config["max-attempts"]

if (typeof max_attempts == null) { max_attempts = 0 }

const game_settings = {
  port: server_config['port'],
  socketTimeout: server_config['socket-timeout'],
  attemptTimeout: server_config['attempt-timeout'],
  maxAttempts: max_attempts,
  givenPortOnly: server_config['given-port-only'],
  type: server_config['type'],
  host: server_config['host'],
  debug: server_config['debug'],
  requestRules: server_config['request-rules']
}

global.space_engineers_login = function login (auth_token) {
  offline_log_limit = core['offline-log-limit']
  if (server_config['enabled']) {
    client = new Client({intents: [IntentsBitField.Flags.Guilds]})
    client.login(auth_token).catch(() => { client_state = false; logger.log('info', `[${game_name}]: Failed Discord authorization process.`)})
    client.on('ready', () => { client_state = true; logger.log('info', `[${game_name}]: Succeeded Discord authorization process and is running.`) })
    asyncTimer()
  }
}

function updateStats () {
  if (client_state) {
    client.user.setActivity(Buffer.from(`${network_name} ${server_config[game_name]['stats-prefix']} ${discord_data}`, 'utf-8').toString(), [{
      status: 'online',
      type: server_config[game_name]['stats-type']
    }])
  }
  asyncTimer()
}

function queryData () {
  GameDig(game_settings).then((state) => {
    ping = state.ping
    if (state.ping > server_config['ping-check-threshold']) {
      type = 'ping'
      api_data = `${state.ping}`
      discord_data = `${server_config['degraded']}${state.ping} ping`
      updateStats(); handler_state = true
    } else {
      type = 'data'
      api_data = `${state.players.length}\/${state.maxplayers}`
      discord_data = `${server_config['online']}${state.players.length}\/${state.maxplayers}`
      updateStats(); handler_state = true
    }
  }).catch((exception) => {
    type = 'status'
    for (let offlinebase = 0; offlinebase < offline_log_limit; offlinebase++) {
      logger.log('error', exception)
    }
    if (!server_config["multi-node"]) {
      discord_data = server_config['offline']
      api_data = 'Server is offline'
      updateStats(); handler_state = false
    } else {
      discord_data = server_config['offline']
      api_data = 'Servers are offline'
      updateStats(); handler_state = false
    }
  })
}

function time() {
  const time = new Date().getTime() - ping
  return time.toLocaleString().toString()
}

function asyncTimer () {
  setTimeout(() => {
    queryData()
  }, query_timeout)
}

function gatherData () {
  return {
    ping: ping,
    name: game_name,
    data: api_data,
    type: type,
    state: handler_state,
    timestamp: time()
  }
}

module.exports = { gatherData }
require('dotenv').config()
const GameDig = require('gamedig')
const  { Client, IntentsBitField } = require('discord.js')
const logger = require('../logging')
let config = undefined
let client = undefined
let data = undefined
let offlineloglimit = undefined

function login (authToken, json) {
  config = json
  offlineloglimit = process.env.OFFLINELOGLIMIT
  if (config['config']['conan_exiles']['enabled']) {
    client = new Client({intents: [IntentsBitField.Flags.Guilds]})
    client.login(authToken)
    
    if (client.login) {
      client.on('ready', async () => {
        console.log('Discord bot has succeeded Discord authorization process and is running.')
        logger.log('info', 'Discord bot has succeeded Discord authorization process and is running.')
        asyncTimer(process.env.QUERY_TIMEOUT)
      })
    } else {
      console.log('Discord bot has failed to authorize with the Discord auhorization system.')
      logger.log('info', 'Discord bot has failed to authorize with the Discord auhorization system.')
    }
  }
}

function updateStats (timeout) {
  client.user.setActivity(`${process.env.NETWORK_NAME} ${data}`, [{ status: 'online', type: 'watching' }])
  asyncTimer(timeout)
}

function queryData () {
  GameDig.query({
    port: config['config']['conan_exiles']['port'],
    socketTimeout: config['config']['conan_exiles']['socketTimeout'],
    attemptTimeout: config['config']['conan_exiles']['attemptTimeout'],
    maxAttempts: config['config']['conan_exiles']['maxAttempts'],
    givenPortOnly: config['config']['conan_exiles']['givenPortOnly'],
    type: config['config']['conan_exiles']['type'],
    host: config['config']['conan_exiles']['host'],
    debug: config['config']['conan_exiles']['debug'],
    requestRules: config['config']['conan_exiles']['request-rules']
  }).then((state) => {
    if (state.ping > config['config']['conan_exiles']['PingCheckThreshold']) {
      data = config['config']['conan_exiles']['degraded'] + state.ping + " ping"
      updateStats(process.env.QUERY_TIMEOUT)
    } else {
      data = config['config']['conan_exiles']['online'] + state.players.length + "\/" + state.maxplayers
      updateStats(process.env.QUERY_TIMEOUT)
    }
  }).catch((exception) => {
    data = config['config']['conan_exiles']['offline']
    for (let offlinebase = 0; offlinebase < offlineloglimit; offlinebase++) {
      logger.log('error', `Discord bot thrown a exception: ${ exception }`)
      console.log(`Discord bot thrown a exception: ${ exception }`)
    }
    updateStats(process.env.MAINTENANCE_TIMEOUT)
  })
}

function asyncTimer (timeout) {
  setTimeout(async () => {
    queryData()
  }, parseInt(timeout || "", 10))
}

exports.login = login
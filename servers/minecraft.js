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
  if (config['config']['minecraft']['enabled']) {
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
    port: config['config']['minecraft']['port'],
    socketTimeout: config['config']['minecraft']['socketTimeout'],
    attemptTimeout: config['config']['minecraft']['attemptTimeout'],
    maxAttempts: config['config']['minecraft']['maxAttempts'],
    givenPortOnly: config['config']['minecraft']['givenPortOnly'],
    type: config['config']['minecraft']['type'],
    host: config['config']['minecraft']['host'],
    debug: config['config']['minecraft']['debug'],
    requestRules: config['config']['minecraft']['request-rules']
  }).then((state) => {
    if (state.ping > config['config']['minecraft']['PingCheckThreshold']) {
      data = config['config']['minecraft']['degraded'] + state.ping + " ping"
      updateStats(process.env.QUERY_TIMEOUT)
    } else {
      data = config['config']['minecraft']['online'] + state.players.length + "\/" + state.maxplayers
      updateStats(process.env.QUERY_TIMEOUT)
    }
  }).catch((exception) => {
    data = config['config']['minecraft']['offline']
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
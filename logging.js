const winston = require('winston')
const format = winston.format
const { File, Console } = require('winston/lib/winston/transports')
const os = require('os')
const config = require('./config')
const transports = config.load('sub-modules')['logging']['transports']
const application_name = config.load('name')

function path_check(path) {
  switch (os.platform()) {
    case 'win32':
      if (!path.endsWith('/')) {
        path = transport_path.replace(`${transport_path}`, `${transport_path}/`)
      }
    break
    default:
      path = transport_path.replace(`${transport_path}`, `${transport_path}\\`)
    break
  }
  return path
}

function logger_options_builder(level, message) {
  let transport_return = {
    level: level,
    message: return_unique_level_based_msg(level, message),
    exitOnError: false,
    defaultMeta: { service: `${application_name.toLowerCase()}-service` },
    transports: []
  }
  let transport_values = Object.values(transports)
  for (let increment = 0; increment < transport_values.length; increment++) {
    if (transport_values[increment]['enabled']) {
      if (transport_values[increment]['type'] === 'console') {
        transport_return.transports.push(new Console({ format: format.combine(format.printf(level => `[${level.level}]: ${level.message}`), format.cli(), format.colorize({ all: false }))}))
      } else {
        transport_return.transports.push(new File({ format: format.combine(format.json(), format.prettyPrint()),
            filename: `${path_check(transport_values[increment]['path'])}${application_name.toLowerCase()}.${level}.log`, level: level
        }))
      }
    }
  }
  return transport_return
}

function log(level, message) {
  let logger_options = logger_options_builder(level, message)
  let winston_logger = winston.createLogger(logger_options)
  switch (logger_options.transports[0]) {
    case undefined:
      if (!transports['console']['enabled']) {
        let log_object = {
          messages: {
            exception: {
              message: return_unique_level_based_msg('exception', `throwed an exception, Winston Options: ${logger_options.transports[0]}`)
            },
            info: {
              message: return_unique_level_based_msg('info', 'It is suggested to enable console logging in the configuration as the logger function has failed')
            }
          }
        }
        console.log(log_object.messages)
      } else { return }
    break
    default:
      winston_logger.log(level, return_unique_level_based_msg(level, message))
    break
  }
}

function create_log_date_zero_addition() {
  const date = new Date()
  let log_message = ""
  let date_array = [
    date.getFullYear(),
    date.getMonth(),
    date.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  ]
  const array_itterator = date_array.values()
  for (let incr = 0; incr < date_array.length; incr++) {
    let value = array_itterator.next().value
    if (value > 0 && value < 10) {
      log_message += `:0${value}`
    } else { log_message += `:${value}` }
  }
  return log_message.replace(':', '')
}

function return_unique_level_based_msg(level, message) {
  return `[${level.toUpperCase()}]:[${application_name}]:[${create_log_date_zero_addition()}]: ${message}`
}

module.exports = { log }

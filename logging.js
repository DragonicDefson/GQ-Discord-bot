const winston = require('winston')
const config = require("./config").load()
const application_name = config["name"]
const transports = config["sub-modules"]["logging"]["transports"]
const chalk = require('chalk')
const path = require('path')

const date_settings = {
  path: true, log: false
}

function options(level, message) {
  let transport, file_path = undefined
  let format = winston.format
  let data = {
    defaultMeta: { service: `${application_name}` },
    exitOnError: false,
    transports: []
  }
  let values = Object.values(transports);
  for (let increment = 0; increment < values.length; increment++) {
    if (values[increment]['enabled']) {
      let transport_type = values[increment]['type']
      switch(transport_type) {
        case "console":
          transport = new winston.transports.Console({
            format: format.combine(
              format.colorize(),
              format.printf(() => msg(application_name, level, message))
            )
          })
        break
        case "file":
          let date = date_handler(date_settings.path)
          switch (values[increment]['rotation']) {
            case true: file_path = `${__dirname}\\${values[increment]['path']}\\${application_name}${date}.${level}.log`; break
            default: file_path = `${__dirname}\\${values[increment]['path']}\\${application_name}.${level}.log`; break
          }
          transport = new winston.transports.File({
            format: format.combine(
              format.json(), format.prettyPrint()
            ),
            filename: path.resolve(file_path)
          })
        break
      }
      data.transports.push(transport)
    }
  }
  return data
}

function log(level, message) {
  let logger_options = options(level, message)
  let winston_logger = winston.createLogger(logger_options)
  let transports = logger_options.transports[0]
  switch (transports) {
    case undefined:
      switch (transports['console']['enabled']) {
        case false:
          let object = {
            messages: {
              exception: { message: msg('exception', `throwed an exception, Winston Options: ${transports}`) },
              info: { message: msg('info', "It's suggested to enable console logging in the configuration as the logger function has failed") }
            }
          }
          console.log(object.messages)
        break
        default: return
      }
    break
    default: winston_logger.log(level, message); break
  }
}

function date_handler(settings) {
  let date = new Date(); let data = undefined; let message = ""
  switch (settings) {
    case true: data = [ date.getFullYear(), date.getMonth(), date.getDay() ]; break
    default:
      data = [
        date.getFullYear(),
        date.getMonth(),
        date.getDay(),
        date.getHours(),
        date.getMinutes()
      ]
    break
  }
  let itterator = data.values()
  for (let increment = 0; increment < data.length; increment++) {
    let value = itterator.next().value
    if (value > 0 && value < 10) { message += `.0${value}` } else { message += `.${value}` }
  }
  return message.replace(':', '')
}

function msg(service_name, level, message) {
  date = date_handler(date_settings.log)
  switch(level) {
    case "info": return `[${chalk.green(date)}] [${chalk.green(level)}] [${chalk.green(service_name)}] ${chalk.green(message)}`;
    case "warning": return `[${chalk.yellow(date)}] [${chalk.yellow(level)}] [${chalk.yellow(service_name)}] ${chalk.yellow(message)}`;
    case "error": return `[${chalk.red(date)}] [${chalk.red(level)}] [${chalk.red(service_name)}] ${chalk.red(message)}`;
  }
}

module.exports = { log }

const winston = require('winston')
const os = require('os')
const path = require('path')
const config = require('./config')
const logging_config = config.load('sub-modules')['logging']['winston']
const file_name = path.basename(`${__dirname}/${__filename}`)
const application_name = config.load('name')
let log_date = undefined

function log(level, message) {
  log_date = create_log_date_zero_addition()
  let log_path = logging_config['log-path']
  if (os.platform() === 'win32' || !log_path.endsWith('/') || !log_path.endsWith('\\')) {
    log_path.replace(`${log_path}`, `${log_path}/`)
  }
  let winston_logger = winston.createLogger({
    exitOnError: false,
    level: level,
    format: winston.format.json(),
    defaultMeta: { service: 'infrastructure-dependent-service' },
    transports: [
      new winston.transports.File({ filename: `${log_path}${level}.log`, level: level }),
    ]
  })
  switch (typeof winston_logger) {
    case undefined:
      console.log(`[exception]:[${log_date}] ${application_name} throwed an exception in: ${file_name}, winston: ${winston_logger}`)
      if (!logging_config['console']['console']) {
        console.log(`[info]:[${log_date}] It is suggested to enable console logging in the configuration as the logger function has failed.`)
      } else { return }
    break;
    default:
      let unique_message = return_unique_level_based_msg(level, message, log_path)
      config_based_console_logging(level, unique_message, winston_logger, log_date)
    break;
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

function return_unique_level_based_msg(level, message, log_path) {
  let new_message = undefined
  if (level == 'info') {
    new_message = `[${level}]:[${log_date}] ${application_name} message logged in ${log_path}${level}.log: ${message}`
  } else {
    new_message = `[${level}]:[${log_date}] ${application_name} throwed an ${level} in: ${log_path}${level}.log: ${message}`
  }
  return new_message
}

function config_based_console_logging(level, message, logger) {
  if (logging_config['enabled']) {
    logger.log(level, message)
    console.log(message)
  } else if (logging_config['enabled']) {
    console.log(return_unique_level_based_msg())
  }
}

module.exports = { log }
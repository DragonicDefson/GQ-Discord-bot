const winst = require('winston')

const logger = winst.createLogger({
  exitOnError: false,
  level: 'info',
  format: winst.format.json(),
  defaultMeta: { service: 'infrastructure-dependent-service' },
  transports: [
    new winst.transports.File({ filename: './logs/emergency.log', level: 'emerg' }),
    new winst.transports.File({ filename: './logs/alerts.log', level: 'alert' }),
    new winst.transports.File({ filename: './logs/critical.log', level: 'crit' }),
    new winst.transports.File({ filename: './logs/errors.log', level: 'error' }),
    new winst.transports.File({ filename: './logs/warnings.log', level: 'warning' }),
    new winst.transports.File({ filename: './logs/notices.log', level: 'notice' }),
    new winst.transports.File({ filename: './logs/info.log', level: 'info' }),
    new winst.transports.File({ filename: './logs/debug.log', level: 'debug' }),
  ]
})

module.exports = logger
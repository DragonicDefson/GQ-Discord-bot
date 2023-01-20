const fs = require('fs')
const config = JSON.parse(fs.readFileSync('./config/configuration.json'))
const os = require('os')

function load(key) {
  if (typeof key === undefined) {
    return config['application']
  } else { return config['application'][key] }
}

function fix_path(key_path, extension_type) {
  let file_mode = undefined
  let api_configuration = config.load('sub-modules')['api']
  if (os.platform() == 'win32' && !key_path.endsWith('\\') || !key_path.endsWith('/')) {
    key_path = `${api_configuration[`${file_mode}-${extension_type}`]}/`
  } else if (!key_path.endsWith('\\') || !key_path.endsWith('/')) { key_path = `${api_configuration[`${file_mode}-${extension_type}`]}/` }
}

module.exports = { load, fix_path }

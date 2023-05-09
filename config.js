const filesystem = require('fs')
const app_config = require("./config/config.json")
const package_config = require("./package.json")
const logger = require('./logging')
const encryption_options = load()["sub-modules"]["security"]["encryption"]
let configuration = undefined

function load() {
    return JSON.parse(JSON.stringify(app_config))["application"]
}

function api() {
    return JSON.parse(JSON.stringify(configuration))["sub-modules"]["api"]
}

function package () {
    return JSON.parse(JSON.stringify(package_config))
}

function version () {
    return package_config["version"]
}

function core() {
    return JSON.parse(JSON.stringify(app_config))["application"]["core-functionality"]
}

function name() {
    return JSON.parse(JSON.stringify(app_config))["application"]["name"]
}

function definitions() {
    return JSON.parse(JSON.stringify(app_config))["application"]["server-definitions"]
}

function push() {
    let package_config = package()
    configuration = {
        "name": package_config["name"],
        "author": package_config["author"],
        "license": package_config["license"],
        "version": version(),
        "sub-modules": {
            "api": {
                "enabled": true,
                "ip": "0.0.0.0",
                "port": "8484",
                "web-root": "/api/config/global",
                "encryption": encryption_options["enabled"]
            }
        }
    }
    const json_data = JSON.stringify(configuration)
    const file_path = `.${configuration["sub-modules"]["api"]["web-root"]}/config.json`
    filesystem.writeFileSync(file_path, json_data, (error) => {
        let success = "Global configuration file pushed to web root directory."
        if (error) {
            switch (error) {
                case "EEXIST": filesystem.unlinkSync(file_path, json_data, (error) => {
                    if (error) { logger.log("error", "Can't reliably remove global configuration file.") } else {
                        filesystem.writeFileSync("", configuration, (error) => {
                            if (error) { logger.log("error", "Failed to write to global configuration file.") } else {
                                logger.log("info", success)
                            }
                        })
                    }
                })
            }
        } else { logger.log("info", success) }
    })
}

module.exports = { load, version, api, push, core, name, definitions }

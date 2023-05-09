const config = require('./config')
const crypto = require('crypto')
const security_options = config.load()["sub-modules"]["security"]
const logging = require('./logging')
const trng_options = security_options["encryption"]["trng"]
const RandomOrg = require('random-org')

let vectorgen_state = true

if (process.versions.openssl <= '1.0.1f') { logging.log("info", "OpenSSL version too old, consider upgrading to avoid heartbleed attacks.") }

const settings = {
    type: security_options["encryption"]["type"],
    private_key: security_options["encryption"]["private-key"],
    iv_length: security_options["encryption"]["iv-length"],
    padding: security_options ["encryption"]["padding"],
    api_key: trng_options["api-key"],
    signature: trng_options["api-signature"],
    number: trng_options["number"],
    length: trng_options["length"],
    characters: trng_options["characters"],
    replacement: trng_options["replacement"]
}

function encrypt(data) {
    let iv = vectorgen()
    console.log(iv)
    let cipher = crypto.createCipheriv(settings.type, settings.private_key, iv)
    let encrypted = cipher.update(data.toString())
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

function decrypt(data) {
    let parts = data.split(':')
    let converted_iv = Buffer.from(parts[0], 'hex')
    let converted_data = Buffer.from(parts[1], 'hex')
    let cipher = crypto.createDecipheriv(settings.type, settings.private_key, converted_iv)
    let decrypted = cipher.update(converted_data)
    decrypted = Buffer.concat([decrypted, cipher.final()])
    return decrypted.toString()
}

function vectorgen() {
    let random_bytes = hmacgen(crypto.randomBytes(settings.iv_length))
    if (!trng_options["enabled"]) { return random_bytes }
    switch (vectorgen_state) {
        case true:
            let request = new RandomOrg({ apiKey: settings.api_key })
            console.log(psuedo_random)
            request.generateSignedStrings({
                n: settings.number,
                length: settings.length,
                characters: settings.characters,
                replacement: settings.replacement
            }).then((result) => {
                    let verify = random.verifySignature(result.random, result.random.signature)
                    switch (verify) {
                        case false:
                            logging.log('warning', `Tampering detection: Signature: [${result.random}] does not verify successfully to [${result.random.signature}] with Random.org's verifySignature method.`)
                            return random_bytes
                        default: return result.random
                    }
                }
            ).catch((error) => {
                logging.log('error', `Failed TRNG request - falling back to psuedo random number generator. ${error.message}`)
                vectorgen_state = false; return random_bytes
            })
        break
        default: return random_bytes
            
    }
}

function hmacgen(data) { return crypto.createHmac('sha256', settings.private_key).update(data).digest('hex').substring(0, 16) }

module.exports = { encrypt, decrypt, vectorgen }

let env = process.env
let _ = require('lodash')
let crypto = require('crypto')
let secretLen = env['SECRET_LENGTH'] || 32

const DEFAULT_CONFIG = {
  floodServerHost: '0.0.0.0',
  dbPath: '/config/',
  secret: require('crypto')
            .randomBytes(secretLen / 2)
            .toString('hex'),
  scgi: {
    host: 'rtorrent',
    socket: false,
    socketPath: null
  },
  sslKey: null,
  sslCert: null
}

// Organise user input into an object, undefined values are ignored
let userConfig = {
  floodServerHost:  env['FLOOD_HOST'],
  floodServerPort:  env['FLOOD_PORT'],
  pollInterval:     env['POLL_INTERVAL'],
  dbCleanInterval:  env['DB_CLEAN_INTERVAL'],
  baseURI: env['BASE_URI'],
  secret:  env['SECRET'],
  scgi: {
    host:  env['RTORRENT_HOST'],
    port:  env['RTORRENT_PORT'],
    socket: env.hasOwnProperty('SOCK_FILE'),
    socketPath: env['SOCK_FILE']
  },
  ssl: env.hasOwnProperty('SSL_KEY') &&
       env.hasOwnProperty('SSL_CERT'),
  sslKey:  env['SSL_KEY'],
  sslCert: env['SSL_CERT']
}

// Deep merge configuration with defaults & template
module.exports = _.defaultsDeep(
  userConfig, 
  DEFAULT_CONFIG, 
  require('./config.template')
)

import net from 'net'
import vorpal from 'vorpal'

const cli = vorpal()

import vorpalLogger from 'vorpal-log'
const chalk = require('chalk')

const LONG_NAME = 'ftd-chat'
const DEFAULT_DELIMITER = 'ftd-chat~$'
var ADDRESS = {}

// cli config
cli.use(vorpalLogger)
  .delimiter(DEFAULT_DELIMITER)

const Log = cli.logger

// connect mode
let server

cli
  .mode('connect <port> [host]')
  .delimiter('connected:')
  .init(function (args, callback) {
    server = net.createConnection(args, () => {
      ADDRESS = server.address()
      Log.log(`connected to server ${ADDRESS.address}:${ADDRESS.port}`)
      callback()
    })

    server.on('data', (data) => {
      if (data.toString().match(/^\*{4}/)) {
        let out = data.toString().replace(/\*{4}/,"")

        Log.info(chalk.underline.bgBlue(out))
        if (data.toString().match(/Username set to:/)) {
          var arr = /Username set to: (.*)$/.exec(data.toString())
          cli.delimiter(arr[1] + '@' + ADDRESS.address)
        }
      } else {
        Log.log(data.toString())
      }
    })

    server.on('end', () => {
      Log.log('server disconnected')
    })
  })
  .action(function (command, callback) {
    server.write(command + '\n')
    callback()
  })

const exit = cli.find('exit')
if (exit) {
  Log.log('bingo')
  exit.description('Exits ' + LONG_NAME)
  exit._after = function () {
    // TODO - make this actually happen. _after is not triggering
    server.end()
    cli.delimiter(DEFAULT_DELIMITER)
  }
}

export default cli

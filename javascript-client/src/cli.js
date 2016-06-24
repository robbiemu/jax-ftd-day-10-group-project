import net from 'net'
import vorpal from 'vorpal'

const Palette = require('./palette')

const cli = vorpal()

import vorpalLogger from 'vorpal-log'

const LONG_NAME = 'ftd-chat'
const DEFAULT_DELIMITER = 'ftd-chat~$'
var ADDRESS = {}
var Vars = {}

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
    cli._baseExitMode = cli._exitMode
    cli._exitMode = function (args) {
      cli.delimiter(DEFAULT_DELIMITER)
      return cli._baseExitMode(args)
    }

    server = net.createConnection(args, () => {
      ADDRESS = server.address()
      Log.log(`connected to server ${ADDRESS.address}:${ADDRESS.port}`)
      callback()
    })

    server.on('data', (data) => {
      if (data.toString().match(/^\*(?:.*)\*(?:.*)\*(?:.*)$/)) {
        let arr = /^\*(.*)\*(.*)\*(.*)$/.exec(data.toString())
        let colorname = arr[1]
        let messagetype = arr[2]
        let message = arr[3]

        let output = Palette.getColor(colorname)(message)

        if (messagetype.length > 0) {
          Log.log(output)
        } else {
          Log.info(output)
        }

        switch (messagetype) {
          case 'username':
            let arr = /Username set to: (.*)$/.exec(data.toString())
            Vars.username = arr[1]
            cli.delimiter(arr[1] + '@' + ADDRESS.address)
            break
          case 'disconnect':
            cli.execSync('exit')
            break
        }
      } else {
        Log.log(data.toString())
      }
    })

    server.on('end', () => {
      Log.log('server disconnected')
    })

    server.on('error', args => {
      let err = args.err
      Log.error(err)
    })
  })
  .action(function (command, callback) {
    server.write(command + '\n')
    callback()
  })

const exit = cli.find('exit')
if (exit) {
  exit.description('Exits ' + LONG_NAME)
}

export default cli

'use strict'

const chalk = require('chalk')

const Palette = {
  getColor: function (colorname) {
    switch (colorname) {
      case 'bold':
        return chalk.bold
      case 'dim':
        return chalk.dim
      case 'italic':
        return chalk.italic
      case 'underline':
        return chalk.underline
      case 'inverse':
        return chalk.inverse
      case 'strikethrough':
        return chalk.strikethrough
      case 'black':
        return chalk.black
      case 'red':
        return chalk.red
      case 'green':
        return chalk.green
      case 'yellow':
        return chalk.yellow
      case 'blue':
        return chalk.blue
      case 'magenta':
        return chalk.magenta
      case 'cyan':
        return chalk.cyan
      case 'white':
        return chalk.white
      case 'gray':
        return chalk.gray
      case 'bgBlack':
        return chalk.bgBlack
      case 'bgRed':
        return chalk.bgRed
      case 'bgGreen':
        return chalk.bgGreen
      case 'bgYellow':
        return chalk.bgYellow
      case 'bgBlue':
        return chalk.bgBlue
      case 'bgMagenta':
        return chalk.bgMagenta
      case 'bgCyan':
        return chalk.bgCyan
      case 'bgWhite':
        return chalk.bgWhite
      case 'bgGray':
        return bgGray
    }
  }
}

module.exports = Palette

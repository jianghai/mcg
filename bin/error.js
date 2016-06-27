var chalk = require('chalk')

var doc = {
  '--source': 'Source file',
  '--dist': 'Distination file',
  '--no-contents': 'Should not generate contents file',
  '--start': '`1` for h1, `2` for h2..., default is start with h2'
}

var log = `
Usage:

  ${chalk.cyan('mcg')} ${chalk.yellow('--source')} file [<options>]

Options:

`
for (var k in doc) {
  log += '  ' + chalk.yellow(k) + '\t\t' + doc[k] + '\n'
}

module.exports = function(msg) {
  msg = '\n' + chalk.red('Error: ' + msg) + '\n'
  console.log(msg + log)
}
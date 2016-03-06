#!/usr/bin/env node

var option = process.argv.slice(2)
var Generator = require('../index')

var distination
if (option[1] && option[1] === '-d') {
  distination = option[2]
}

new Generator(option[0], distination)
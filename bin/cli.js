#!/usr/bin/env node

var option = process.argv.slice(2)
var generate = require('../index')

var dist
if (option[1] && option[1] === '-d') {
  dist = option[2]
}

generate(option[0], dist)
#!/usr/bin/env node

var generate = require('../index')

var args = process.argv.slice(2)
var options = {}
var lastArg

args.forEach(function(item) {
  if (item.indexOf('--') === 0) {
    item = item.slice(2)
    options[item] = true
    lastArg = item
  } else {
    options[lastArg] = item
  }
})

generate(options)
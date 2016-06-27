/**
 * mcg v0.0.5 - markdown catalogues generator
 * Copyright (c) 2016, Hai Jiang. (MIT Licensed)
 * https://github.com/jianghai/mcg
 */

'use strict'

var fs = require('fs')
var chalk = require('chalk')
var error = require('./bin/error')

function getCataloguesStr(catalogues) {
  var result = ''
  function recurse(list, indent) {
    list.forEach(function(item) {
      var title = item.orders.join('.') + ' ' + item.title
      var href = item.orders.join('') + '-' + item.title
      href = href.toLowerCase()
      href = href.replace(/\s/g, '-')
      result += Array(indent + 1).join(' ') + '* [' + title + '](#' + href + ')\r\n'
      item.children && recurse(item.children, indent + 2)
    })
  }
  recurse(catalogues, 0)
  return result
}

function parse(options, fileContent) {
  var orders = []
  var start = Number(options.start) || 2 
  var reg = new RegExp('(#{' + start + ',})\\s*[\\d\\.\\s]*(.*)', 'g')
  var catalogues = !options['no-contents'] ? [] : null

  fileContent = fileContent.replace(reg, function(match, level, title) {
    var _start = level.length - start
    if (orders.length !== _start + 1) {
      orders.length = _start + 1
      orders[_start] || (orders[_start] = 0)
    }
    orders[_start]++
    
    if (catalogues) {
      var temp = catalogues
      orders.slice(1).forEach(function(order, i) {
        temp = temp[orders[i] - 1]
        temp.children || (temp.children = [])
        temp = temp.children
      })
      temp.push({
        orders: orders.concat(),
        title: title
      })
    }
    
    return level + ' ' + orders.join('.') + ' ' + title
  })
  return [fileContent, catalogues]
}

function readFile(source) {
  return new Promise(function(resolve, reject) {
    fs.readFile(source, 'utf8', function(err, data) {
      if (err) reject(err)
      resolve(data)
    })
  })
}

function writeFile(options, result) {
  var dist = options.dist || options.source
  var promises = []

  var p1 = new Promise(function(resolve, reject) {
    fs.writeFile(dist, result[0], function(err) {
      if (err) reject(err)
      console.log(chalk.cyan('Build `' + dist + '` successed.'))
    })
  })
  promises.push(p1)

  if (!options['no-contents']) {
    var contentsFile = dist.replace(/(\.md)$/, '-contents$1')
    var p2 = new Promise(function(resolve, reject) {
      fs.writeFile(contentsFile, getCataloguesStr(result[1]), function(err) {
        if (err) reject(err)
        console.log(chalk.cyan('Build `' + contentsFile + '` successed.'))
      })
    })
    promises.push(p2)
  }

  return Promise.all(promises)
}

/**
 * Entry
 */
function generate(options) {
  
  if (typeof options.source !== 'string') {
    error('No source file found.')
    return
  }

  if (options.dist && typeof options.dist !== 'string') {
    error('No dist file found.')
    return
  }

  readFile(options.source)
    .then(parse.bind(null, options))
    .then(writeFile.bind(null, options))
    .catch(function(reason) { console.log(reason) })
}

module.exports = generate